import Image from '@11ty/eleventy-img';
import {load} from 'cheerio';
import {join,resolve} from 'node:path';
import {copyFile,mkdir} from 'node:fs/promises';
import photos from '../src/_data/portalPhotos.json' with {type:'json'};

// Keep clean/prefix builds cheap without ever copying the source JPEGs.
// Image hashes include source bytes and encoder options, so edits invalidate cache.
Image.concurrency=2;
const cacheRoot=resolve(process.env.PORTAL_IMAGE_CACHE_DIR || '.cache/portal-images');
export async function renderPortalImages(content,outputRoot,prefix='/') {
 if(!content.includes('data-portal-image'))return content;
 for(const match of content.matchAll(/<img\b[^>]*\bdata-portal-image\b[^>]*>/g)) {
  const img=load(match[0],null,false)('img');
  const photo=photos[img.attr('data-portal-image')];
  if(!photo)throw new Error('Portal image has no approved provenance');
  const layout=img.attr('data-image-layout');
  const hero=layout==='hero' || layout==='banner';
  const metadata=await Image(`src${photo.src}`,{
   widths:[320,640,960,1280,1920,2560],formats:['avif','webp','jpeg'],
   outputDir:cacheRoot,urlPath:`${prefix}assets/generated/portal/`,hashLength:20,
   sharpAvifOptions:{quality:45,effort:4},sharpWebpOptions:{quality:75},sharpJpegOptions:{quality:78,progressive:true},
  });
  const destination=join(outputRoot,'assets/generated/portal');
  await mkdir(destination,{recursive:true});
  await Promise.all(Object.values(metadata).flat().map(variant=>copyFile(variant.outputPath,join(destination,variant.filename))));
  content=content.replace(match[0],()=>Image.generateHTML(metadata,{
   alt:img.attr('alt'),class:'portal-image',
   sizes:layout==='hero'?'100vw':'(min-width: 75rem) 71rem, (min-width: 48rem) calc(100vw - 4rem), calc(100vw - 2rem)',
   loading:hero?'eager':'lazy',decoding:'async',...(hero?{fetchpriority:'high'}:{}),
  }));
 }
 return content;
}
