


// eslint-disable-next-line import/prefer-default-export
export function getTimeInMin(time:string):number|{} {
  if (typeof(time) !== 'string') return {
    error: true, message: 'Time is not string type'
  };

  const [ hour, min, secWDecaSec ] = time.split(':');
  const sec = secWDecaSec?.split('.')?.[0];
  console.log(hour, min, sec);

  const timeInMin = Number(hour) * 60 + Number(min);

  return timeInMin;

};
