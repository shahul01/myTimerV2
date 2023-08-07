


// eslint-disable-next-line import/prefer-default-export
export function stringify(data:App.IObject<string>|any) {
  return JSON.stringify(data, null, 2)
};
