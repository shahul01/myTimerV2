import { parseIfObject } from "./misc";

function loadEnv():App.Env {
  const rawEnv = window.electron.ipcRenderer.envVar;

  const emptyEnv:App.Env = {
    IS_DEVELOPMENT_USER: false,
    URL: {},
    USER: {},
    SERVE_MODE: "browser"
  };
  if (!rawEnv || !Object.keys(rawEnv)?.length) return emptyEnv;

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
