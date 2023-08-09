import { FC, useEffect, useState } from 'react';
// import { ITask } from 'renderer/types';
import Timer from '../Timer/Timer';
import styles from './timers.module.css';

interface ITimersProps {
  timerArray: App.ITask[];
  handleSetSelTimer: (i:number) => void;
  selTimerId: number;
  triggerTimer: number;
};

const Timers: FC<ITimersProps> = (props) => {
  const {
    timerArray,
    handleSetSelTimer,
    selTimerId,
    triggerTimer
  } = props;

  return (
    <div className={styles.timers}>
      {/* <div className='timer'> */}
        {
          timerArray.map((currTimer, i) => (
            <div
              key={currTimer.title}
              className={styles['timer-wrapper']}
              onClick={()=>handleSetSelTimer(currTimer.id)}

              role="button"
              tabIndex={0}
              onKeyDown={()=>{}}
              >
              {/* Rather than sending text send it as an object */}


              <div className={styles.timer} >
                <span className={styles['button-title']}>
                  <span
                      className={styles.button}
                      title='Select timer'
                    >
                      {currTimer.id===selTimerId ? '⦿' : '⦾'}
                  </span>
                  <span
                      className={styles.title}
                      title={currTimer.title}
                    >
                    {currTimer.title}
                  </span>
                </span>
                <span
                    className={styles.timerText}
                    title={currTimer.timerInput}
                  >
                    {currTimer.currentTimer}
                </span>
              </div>
            </div>
          ))
        }
      {/* </div> */}

    </div>
  )
};

export default Timers;
