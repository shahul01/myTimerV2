

export function getTime() {
};

interface IGetTimeAsNumberProps {
  time: string;
  preferredUnit: 'minutes' | 'seconds';
};

export function getTimeAsNumber(props:IGetTimeAsNumberProps):number|{} {
  const { time, preferredUnit }= props;
  let timeAsNumber:number = 0;

  if (typeof(time) !== 'string') return ({
    error: true, message: 'Time is not string type'
  });

  const [ hour, min, secWDecaSec ] = time.split(':');
  const sec = secWDecaSec?.split('.')?.[0];
  console.log(hour, min, sec);

  if (preferredUnit === 'minutes') {
    timeAsNumber = Number(hour) * 60 + Number(min);
  } else if (preferredUnit === 'seconds') {
    timeAsNumber = (Number(hour) * 3600) + (Number(min) * 60) + Number(sec);
  }

  return timeAsNumber;

};
