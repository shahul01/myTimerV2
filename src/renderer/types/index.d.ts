export interface IObject<Type> {
  [key: string]: Type;
}

export interface ITask {
  title: string;
  timeLeft: number | string;

  switchedCount?: number;
  timeSpent?: number;
  description?: string;
}
