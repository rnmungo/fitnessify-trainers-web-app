export const getInitialLetters = (...words: Array<string | undefined>): string =>
  words
    .map(word => (word && word.length > 0 ? word[0] : ''))
    .join('')
    .toUpperCase();
