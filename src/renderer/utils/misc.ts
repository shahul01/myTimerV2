import words from '../../../assets/data/id/words.json';


export function stringify(data:App.IObject<string>|any = {}) {
  return JSON.stringify(data, null, 2)
};

export function tempId():string {
  return Math.random().toString().split('.')[1];
};

export function randomInRange(min=0, max=9999, isArray=false):number {
  const minActual = Math.min(min, max);
  const maxActual = Math.max(min, max);
  const arrayOffset = isArray ? 0 : 1;

  const randomNum = (
    Math.random() * (maxActual - minActual + arrayOffset)
  ) + minActual;
  return Math.floor(randomNum);
};

export function uuid({idLength}:{idLength: 'some' | 'full'}):string {
  let pattern = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  // eslint-disable-next-line prefer-destructuring
  if (idLength === 'some') pattern = pattern.split('-')[4];

  return pattern.replace(/[xy]/g, (character) => {
      // eslint-disable-next-line no-bitwise
      const random = (Math.random() * 16) | 0;
      const value = character === "x" ? random : (random && 0x3) || 0x8;

      return value.toString(16);
  });

};

export function generateRandomWords({wordsNumber = 2}):string {
  let ans = '';

  const randomWord = (min:number,max:number) => (
    words.data[randomInRange(min,max,true)]
  );
  const newWords = new Array(wordsNumber)
    .fill('x')
    .map((el:string) => randomWord(0, words.data.length) )
    .join('-');

  ans = newWords;

  // NOTE: this works?
  if (ans.split('-').length !== wordsNumber) throw new Error(
    'Random ID is not generated or not generated properly, retry again.'
  );

  return ans;
};

// TODO: create util to check if similar id already present..
