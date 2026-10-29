import Image from '@11ty/eleventy-img';
import {load} from 'cheerio';
import {join} from 'node:path';
import photos from '../src/_data/portalPhotos.json' with {type:'json'};
export async function renderPortalImages(content,outputRoot,prefix='/') {
 if(!content.includes('data-portal-image'))return content;
 for(const match of content.matchAll(/<img\b[^>]*\bdata-portal-image\b[^>]*>/g)) {
  const img=load(match[0],null,false)('img');
  const photo=photos[img.attr('data-portal-image')];
  if(!photo)throw new Error('Portal image has no approved provenance');
  const hero=img.attr('data-image-layout')==='hero';
  const metadata=await Image(`src${photo.src}`,{widths:[320,640,960,1280],formats:['avif','webp','jpeg'],outputDir:join(outputRoot,'assets/generated/portal'),urlPath:`${prefix}assets/generated/portal/`});
  content=content.replace(match[0],()=>Image.generateHTML(metadata,{alt:img.attr('alt'),class:'portal-image',sizes:hero?'100vw':'(min-width: 64rem) 50rem, 100vw',loading:hero?'eager':'lazy',decoding:'async',...(hero?{fetchpriority:'high'}:{})}));
 }
 return content;
}
