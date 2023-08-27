declare global {

  namespace App {

    // from and to Config
    type Version = string;

    // browser incl PWA
    type ServeMode = 'electron' | 'browser' | 'mobile';

    type TTaskType = 'clock' | 'stopwatch' | 'timer';

    interface IObject<Type> {
      [key: string]: Type;
    }

    // TODO: make TTime
    //   check if time = '12:60:60' or time = '13:70:61'
    //   which shouldnt be

    interface ITask {
      id: string;
      title: string;
      // number | DateTime(?)
      timerInput: string;
      currentTimer: string;

      // type?: TTaskType;
      // isSelected?: boolean;
      // switchedCount?: number;
      // timeSpent?: number;
      // description?: string;
    }

    interface ILogByDate {
      id: string;
      // TODO: make date string type as in Db
      date: Date;
      taskName: string;
      timeSpent: string;
    }

    type TaskConfig = {
      // last selected timer or count down's id
      lastSelectedTask: TTaskType; // countdown or stopwatch
      lastSelectedId: string; // selected task's id
    }

    type ElectronConfig = {
      // preferred settings: eg. selected App dimension: {sticky: 80*42} etc
      // user: { }
    }

    type RendererConfig = {
      taskType: TTaskType;
      taskConfig: TaskConfig;
      tasks: Record<TTaskType, ITask[]>
    }

    type Config = {
      version: Version;
      dateTime: string;
      serveMode: 'electron';
      configs: {
        rendererConfig: RendererConfig;
        electronConfig: ElectronConfig;
      }
    } | {
      version: Version;
      dateTime: string;
      serveMode: 'browser';
      configs: {
        rendererConfig: RendererConfig;
      }
    } | {
      version: Version;
      dateTime: string;
      serveMode: 'mobile';
      configs: {
        rendererConfig: RendererConfig;
        mobileConfig: Record<any,any>;
      }

    };

    interface ITimerEnd {
      e: Electron.IpcMainEvent;
      arg: {
        taskTitle: string;
        timeSpent?: string;
      };
    }


  }

}

export {};
