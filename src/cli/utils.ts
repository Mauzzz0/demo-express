export const generateRandomValue = (min: number, max: number) => {
  return Number((Math.random() * (max - min) + min).toFixed(0));
};

export const upperFirst = (word: string): string => {
  word = word.toLowerCase();
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export function getRandomItems<T>(items: T[], maxLen: number): T[] {
  const words: T[] = [];
  for (let i = 0; i < maxLen; i++) {
    words.push(getRandomItem(items));
  }

  return words;
}

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomValue(0, items.length - 1)];
}
