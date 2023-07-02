export interface IObject<Type> {
  [key: string]: Type;
}

export interface ITask {
  title: string;
  // number |
  timerInput: string;

  isSelected?: boolean;
  switchedCount?: number;
  timeSpent?: number;
  description?: string;
}
