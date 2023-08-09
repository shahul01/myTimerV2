


export function stringify(data:App.IObject<string>|any = {}) {
  return JSON.stringify(data, null, 2)
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
