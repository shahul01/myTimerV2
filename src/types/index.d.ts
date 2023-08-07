declare global {
  namespace App {

    interface IObject<Type> {
      [key: string]: Type;
    }

    type TTaskType = 'clock' | 'stopwatch' | 'timer';

    interface ITask {
      id: number;
      title: string;
      // number | DateTime(?)
      timerInput: string;
      currentTimer: string;

      type?: TTaskType;
      isSelected?: boolean;
      switchedCount?: number;
      timeSpent?: number;
      description?: string;
    }

    interface IConfig {
      version: string;
      dateTime: string;
      tasks: Record<TTaskType, ITask[]>
      settings: {
        // user: { }
      }
    }


  }
}

export {
  // App
};
