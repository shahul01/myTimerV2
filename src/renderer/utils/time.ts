

interface IGetNumberAsTimeProps {
  number: number;
  selectedUnit: 'minutes' | 'seconds';
};

export function getNumberAsTime(props:IGetNumberAsTimeProps):string {
  const { number, selectedUnit } = props;
  let numberAsTime:string = '00:00:00';

  const twoDigits = (time:number) => time > 9 ? `${time}` : `0${time}`;

  const fullHours = number;
  const fullMinutes = number % 3600;

  const seconds = number % 60;
  const minutes = (fullMinutes - seconds) / 60;
  const hours = Math.floor( (fullHours - minutes) / 3600 );

  numberAsTime = `${twoDigits(hours)}:${twoDigits(minutes)}:${twoDigits(seconds)}`;
  return numberAsTime;
};

interface IGetTimeAsNumberProps {
  time: string;
  preferredUnit: 'minutes' | 'seconds';
};

export function getTimeAsNumber(props:IGetTimeAsNumberProps):number {
  const { time='00:00:00', preferredUnit } = props;
  let timeAsNumber:number = 0;

  // if (typeof(time) !== 'string') return ({
  //   error: true, message: 'Time is not string type'
  // });

  const [ hour, min, secWDecaSec ] = time.split(':');
  const sec = secWDecaSec?.split('.')?.[0];
  // console.log(hour, min, sec);

  if (preferredUnit === 'minutes') {
    timeAsNumber = Number(hour) * 60 + Number(min);
  } else if (preferredUnit === 'seconds') {
    timeAsNumber = (Number(hour) * 3600) + (Number(min) * 60) + Number(sec);
  }

  return timeAsNumber;

};

export function calcTimeSpent(currTask:App.ITask):string {
  // console.log(`dbTimerArray: `, dbTimerArray);

  const timerInputInSec:number = getTimeAsNumber({
    time: currTask.timerInput, preferredUnit: 'seconds'
  });

  const currentTimerInSec:number = getTimeAsNumber({
    time: currTask.currentTimer, preferredUnit: 'seconds'
  });

  const diffInSec = timerInputInSec - currentTimerInSec;

  const diffFormatted = getNumberAsTime(
    {number: diffInSec, selectedUnit: 'seconds'}
  );

  return diffFormatted;

};
