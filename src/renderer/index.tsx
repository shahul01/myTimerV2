import { render } from 'react-dom';
import App from './App';
import { IObject } from './types';

// TODO: modularize this
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        handleStickyHover:(arg0:boolean) => void;
        handleTimerEnd:(arg0:IObject<string>) => void;
      }
    }
  }
};

// TODO: use react strict mode
render(<App />, document.getElementById('root'));
