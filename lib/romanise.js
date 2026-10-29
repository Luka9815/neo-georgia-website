// Georgian national romanisation: ejectives have apostrophes here. The URL
// slug subsequently drops apostrophes because the site accepts a-z, 0-9, '-'.
const alphabet = {
  ა: 'a',
  ბ: 'b',
  გ: 'g',
  დ: 'd',
  ე: 'e',
  ვ: 'v',
  ზ: 'z',
  თ: 't',
  ი: 'i',
  კ: "k'",
  ლ: 'l',
  მ: 'm',
  ნ: 'n',
  ო: 'o',
  პ: "p'",
  ჟ: 'zh',
  რ: 'r',
  ს: 's',
  ტ: "t'",
  უ: 'u',
  ფ: 'p',
  ქ: 'k',
  ღ: 'gh',
  ყ: "q'",
  შ: 'sh',
  ჩ: 'ch',
  ც: 'ts',
  ძ: 'dz',
  წ: "ts'",
  ჭ: "ch'",
  ხ: 'kh',
  ჯ: 'j',
  ჰ: 'h',
};

export function romanise(title) {
  return [...title.normalize('NFKC').toLowerCase()]
    .map((letter) => alphabet[letter] ?? letter)
    .join('');
}
