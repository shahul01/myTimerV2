// https://chat.openai.com/share/11cff69c-8f48-450f-8a24-d2fc3bce1a13
// chat.openai.com/c/516be87e-0adb-4875-acb3-40e3bdd6eab2


import { FC, useCallback, useEffect, useRef, useState } from 'react';
// import { ITask } from 'renderer/types';
import styles from './timer.module.css';
import simpleBeep from '../../../../assets/audio/ringtones/beep-simple.mp3';
// 4000mHz-2400mSec

interface ITimerProps extends App.ITask {
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
  // state for synchronous / immediate update
  const [ outputTime, setOutputTime ] = useState(`${currentTimer}`);
  // ref for remembering data when unmounting
  const outputTimeRef = useRef(`${currentTimer}`);
  const timerState = useRef<TTimerState>('paused');
  // const [ isClickedTimer, setIsClickedTimer ] = useState('false');
  const [ triggerClickedTimer, setTriggerClickedTimer ] = useState(0);
  const countdown = useRef<NodeJS.Timeout>();
  const endAudio = new Audio(simpleBeep);

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

  function getFormattedFullTime():string {
    if (timerState.current === 'paused') return '';
    const totalSeconds = Math.floor(totalDeciSeconds.current / 10);
    const [ h, min, sec ] = getTimeComponents(totalSeconds);
    const deciSec = Math.floor(totalDeciSeconds.current % 10);

    const formattedTime = `${formatTime(h)}:${formatTime(min)}:${formatTime(sec)}.${deciSec}`;
    // console.log(`formattedTime: `, formattedTime);

    return formattedTime;
  };

  const pauseCountdown = useCallback(():void => {
    // Question: right way?
    if (!countdown?.current) return;

    // send updatedTimer to parent
    onUpdatedTimer(outputTimeRef.current);

    clearInterval(countdown.current);
    // console.log(`pause ${title}: `, outputTimeRef.current);

    timerState.current = 'paused';

  }, [onUpdatedTimer]);

  const stopCountdown = (): void => {
    // Question: right way?
    if (!countdown.current) return;
    clearInterval(countdown.current);
    timerState.current = 'stopped';
  };

  function resumeCountdown():void {

    function handleTimerEndElectron(arg:any) {
      return window.electron?.ipcRenderer?.handleTimerEnd(arg);
    };

    function updateCountdown() {
      // console.log('mainFn', timerState);

      timerState.current = 'resumed';
      const formattedTime = getFormattedFullTime();

      // NOTE: Core timer code start --

      // update state to current value
      outputTimeRef.current = formattedTime;
      setOutputTime(formattedTime);

      // IMPORTANT: run timer..
      totalDeciSeconds.current -= 1;

      // NOTE: -- Core timer code end

      if (totalDeciSeconds.current <= 0) {
        console.log(title, 'done');
        handleTimerEndElectron({taskTitle: title});
        endAudio.play();
        stopCountdown();
      };

    };

    countdown.current = setInterval(updateCountdown, 100);
  };

  function handleToggleTimerState() {
    if (timerState.current === 'paused') resumeCountdown();
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
    if (firstLoad.current) {
      firstLoad.current = false;
    } else {
      if (isSelected) {
        handleToggleTimerState();
      };
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerTimer]);

  useEffect(() => {
    if (currentTimer) {
      getFormattedFullTime();
    };

    // return () => {
    //   pauseCountdown();
    // };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {

    return () => {
      pauseCountdown();
    };

  }, [pauseCountdown]);


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
              {/* <span className={styles.btn} title='Select timer' >
                {isSelected ? '⦿' : '⦾'}
              </span>
              <span>{title}: </span>
              <span>{outputTime}</span> */}

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
