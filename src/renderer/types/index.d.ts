export interface IObject<Type> {
  [key: string]: Type;
}

export interface ITask {
  id: number;
  title: string;
  // number |
  timerInput: string;
  currentTimer: string;

  isSelected?: boolean;
  switchedCount?: number;
  timeSpent?: number;
  description?: string;
}
