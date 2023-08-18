declare global {

  // TODO: move this to a folder common to main and renderer so both can get type
  interface ITimerEnd {
    e: Electron.IpcMainEvent;
    arg: {
      taskTitle: string;
      timeSpent?: string;
    };
  }

  namespace App {

    interface IObject<Type> {
      [key: string]: Type;
    }

    type TTaskType = 'clock' | 'stopwatch' | 'timer';

    // TODO: make TTime
    //   check if time = '12:60:60' or time = '13:70:61'
    //   which shouldnt be

    interface IMyTimer {
      // last selected timer or count down's id
      lastSelected: string;
    }

    interface ITask {
      id: number;
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

    interface IConfig {
      version: string;
      dateTime: string;
      tasks: Record<TTaskType, ITask[]>
      settings: {
        // [k in IMyTimer]: IMyTimer;

        // preferred settings: eg. selected App dimension: {sticky: 80*42} etc
        // user: { }
      }
    }

    interface ILogByDate {
      id: string;
      // TODO: make date string type as in Db
      date: Date;
      taskName: string;
      timeSpent: string;
    }


  }
}

export {
  // App
};
