import { parseIfObject, snakeToCamelCase } from "./misc";

function loadEnv():App.Env {
  const rawEnv = window.electron.ipcRenderer.envVar;
  console.log(`rawEnv: `, rawEnv);
  const readableEnvArr = Object
    .entries(rawEnv)
    .map((el:string[]) => (
      // snakeToCamelCase(el[0])
      [el[0], parseIfObject(el[1])]
    )
  );
  const readableEnv = Object.fromEntries(readableEnvArr);
  return readableEnv;
};

// eslint-disable-next-line import/prefer-default-export
export const env = loadEnv();
