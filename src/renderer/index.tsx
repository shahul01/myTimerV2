import { render } from 'react-dom';
import { IObject } from 'types';
import App from './App';

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
