// https://chat.openai.com/share/11cff69c-8f48-450f-8a24-d2fc3bce1a13
// chat.openai.com/c/516be87e-0adb-4875-acb3-40e3bdd6eab2


import { FC, useEffect, useRef, useState } from 'react';
import { ITask } from 'renderer/types';
import styles from './timer.module.css';

interface ITimerProps extends ITask {
  // title: string;
  // timerInput: number | string;
  // isSelected: boolean;
  displayType: 'hero' | 'list';
  triggerTimer: number;
};

const Timer: FC<ITimerProps> = (
  {title, timerInput, isSelected, displayType, triggerTimer}
  ) => {
  type TTimerState = 'paused' | 'resumed' | 'stopped';

  const firstLoad = useRef(true);
  const [ outputTime, setOutputTime ] = useState('');
  const [ timerState, setTimerState ] = useState<TTimerState>('paused');
  const countdown = useRef<NodeJS.Timeout>();

  const getTimeInSeconds = (time: string): number => {
    const [ hours, minutes, seconds ] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const totalDeciSeconds = useRef<number>(
    getTimeInSeconds(timerInput) * 10
  );

  const getTimeComponents = (totalSeconds: number): number[] => (
    [
      Math.floor(totalSeconds / 3600),
      Math.floor((totalSeconds % 3600) / 60),
      totalSeconds % 60
    ]
  );

  const formatTime = (component: number): string => (
    component.toString().padStart(2, '0')
  );

  function getFormattedFullTime() {
    const totalSeconds = Math.floor(totalDeciSeconds.current / 10);
    const [ h, min, sec ] = getTimeComponents(totalSeconds);
    const deciSec = Math.floor(totalDeciSeconds.current % 10);

    setOutputTime(
      `${formatTime(h)}:${formatTime(min)}:${formatTime(sec)}.${deciSec}`
    );

    // return outputTime;
  }

  const pauseCountdown = (): void => {
    // Question: right way?
    if (!countdown.current) return;
    clearInterval(countdown.current);
    setTimerState('paused');
  };

  const stopCountdown = (): void => {
    // Question: right way?
    if (!countdown.current) return;
    clearInterval(countdown.current);
    setTimerState('stopped');
  };

  function updateCountdown() {

    getFormattedFullTime();
    // console.log('mainFn', timerState);

    // the update..
    totalDeciSeconds.current -= 1;
    if (totalDeciSeconds.current < 0) {
      console.log(title, 'done');
      stopCountdown();
    };

  };

  function resumeCountdown():void {
    countdown.current = setInterval(updateCountdown, 100);
    setTimerState('resumed');
  };

  function handleToggleTimerState() {
    if (timerState === 'paused') resumeCountdown();
    else pauseCountdown();
    // console.log(`timerState: ${title}`, timerState);
  };



  useEffect(() => {
    console.log(`timerInput: `, timerInput);
    if (timerInput) {
      getFormattedFullTime()
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(`firstLoad.current: `, firstLoad.current);
    if (firstLoad.current) {
      firstLoad.current = false;
    } else {
      console.log('timer', triggerTimer)
      if (isSelected) {
        handleToggleTimerState();
      };

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerTimer])

  useEffect(() => {

    if (!isSelected) pauseCountdown();
  }, [isSelected]);


  return (
    <div
      className={
        `${styles.timer}
        isSelected ? styles.timer.selected : ''
        `
      }
      >
        {
          displayType === 'hero'
          ? (
            <div className={styles.hero} >
              <div className={styles['title-bar']} >
                {title}
              </div>
              <div className={styles.body} >
                {outputTime}
              </div>
            </div>

          ) : (
            <div className={styles.list}>
              <span title='Select timer' >
                {isSelected ? '⦿' : '⦾'}
              </span>
              <span>{title}: {outputTime}</span>
            </div>
          )
        }

      {/* <button
        onClick={handleToggleTimerState}
        >
        {timerState === 'paused' ? 'Start' : 'Pause'}
      </button> */}

    </div>
  )
};

export default Timer;
