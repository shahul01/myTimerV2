export interface IObject<Type> {
  [key: string]: Type;
};

type TTaskType = 'clock' | 'stopwatch' | 'timer';

export interface ITask {
  id: number;
  title: string;
  // number |
  timerInput: string;
  currentTimer: string;

  type?: TTaskType;
  isSelected?: boolean;
  switchedCount?: number;
  timeSpent?: number;
  description?: string;
};

export interface IConfig {
	version: string;
	dateTime: string;
	tasks: Record<TTaskType, ITask[]>
	settings: {
		// user: { }
	};
};



