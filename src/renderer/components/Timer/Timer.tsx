// https://chat.openai.com/share/11cff69c-8f48-450f-8a24-d2fc3bce1a13
// chat.openai.com/c/516be87e-0adb-4875-acb3-40e3bdd6eab2


import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { ITask } from 'renderer/types';
import styles from './timer.module.css';

interface ITimerProps extends ITask {
  // title: string;
  // timerInput: number | string;
  // isSelected: boolean;
  onUpdatedTimer: any;
  displayType: 'hero' | 'list';
  setIsShowTimers: React.Dispatch<React.SetStateAction<boolean>>;
  triggerTimer: number;
};

const Timer: FC<ITimerProps> = (
  {title, timerInput, currentTimer, onUpdatedTimer, isSelected, displayType, setIsShowTimers, triggerTimer}
  ) => {
  type TTimerState = 'paused' | 'resumed' | 'stopped';

  const firstLoad = useRef(true);
  const [ outputTime, setOutputTime ] = useState('');
  const [ timerState, setTimerState ] = useState<TTimerState>('paused');
  // const [ isClickedTimer, setIsClickedTimer ] = useState('false');
  const [ triggerClickedTimer, setTriggerClickedTimer ] = useState(0);
  const countdown = useRef<NodeJS.Timeout>();

  const getTimeInSeconds = (time: string): number => {
    const [ hours, minutes, seconds ] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const totalDeciSeconds = useRef<number>(
    getTimeInSeconds(currentTimer) * 10
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

  const pauseCountdown = useCallback(():void => {
    // Question: right way?
    if (!countdown.current) return;

    clearInterval(countdown.current);
    console.log(`pause: `, outputTime);
    onUpdatedTimer(outputTime);

    setTimerState('paused');

  }, [onUpdatedTimer, outputTime]);

  const stopCountdown = (): void => {
    // Question: right way?
    if (!countdown.current) return;
    clearInterval(countdown.current);
    setTimerState('stopped');
  };

  function resumeCountdown():void {

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

    countdown.current = setInterval(updateCountdown, 100);
    setTimerState('resumed');
  };

  function handleToggleTimerState() {
    if (timerState === 'paused') resumeCountdown();
    else pauseCountdown();
  };


  function handleShowHideAllTimers() {

    // TODO: modularize all electron functions?
    function handleStickyHoverElectron(arg:boolean) {
      return window.electron?.ipcRenderer?.handleStickyHover(arg)
    };

    const display = triggerClickedTimer % 2 === 0 ? 'show' : 'hide';
    setTriggerClickedTimer(p=>p+1);
    if (display === 'show') {
      handleStickyHoverElectron(true);
      return setIsShowTimers(true);
    };

    handleStickyHoverElectron(false);
    return setIsShowTimers(false);
  };

  useEffect(() => {
    if (currentTimer) {
      getFormattedFullTime()
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
    } else {
      if (isSelected) {
        handleToggleTimerState();
      };

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerTimer])

  useEffect(() => {

    if (!isSelected) pauseCountdown();
  }, [isSelected, pauseCountdown]);


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
            // TODO: Make this a component
            <div
              className={styles.hero}
            >
              <div className={styles['title-bar']} >
                {title}
              </div>
              <div
                  className={styles.body}
                  onClick={handleShowHideAllTimers}

                  onKeyUp={handleShowHideAllTimers}
                  role="button"
                  tabIndex={0}
                >
                {outputTime}
              </div>
            </div>

          ) : (
            // TODO: Make this a component
            <div className={styles.list}>
              <span className={styles.btn} title='Select timer' >
                {isSelected ? '⦿' : '⦾'}
              </span>
              <span>{title}: </span>
              <span>{outputTime}</span>

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
