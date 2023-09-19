import { render } from 'react-dom';
// import { IObject } from 'types/index.d';
import App from './App';

// TODO: modularize this
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        once: (handle:string, cb:(arg0:string) => void) => void;
        envVar: App.IObject<string>;
        handleStickyHover:(arg0:boolean) => void;
        handleTimerEnd:(arg0:App.IObject<string>) => void;
        handleExport:(arg0:App.IObject<string|App.IObject<string>>) => void;
      }
    }
  }
};

// TODO: use react strict mode
render(<App />, document.getElementById('root'));
