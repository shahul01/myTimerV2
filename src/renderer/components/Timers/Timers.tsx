import { FC, useEffect, useState } from 'react';
import { ITask } from 'renderer/types';
import Timer from '../Timer/Timer';
import styles from './timers.module.css';

interface ITimersProps {
  timerArray: ITask[];
  handleSetSelTimer: (i:number) => void;
  selTimer: number;
  triggerTimer: number;
};

const Timers: FC<ITimersProps> = (props) => {
  const {
    timerArray,
    handleSetSelTimer,
    selTimer,
    triggerTimer
  } = props;

  return (
    <div className={styles.timers}>
      {/* <div className='timer'> */}
        {
          timerArray.map((el, i) => (
            <div
              key={el.title}
              className={styles['timer-wrapper']}
              onClick={()=>handleSetSelTimer(i)}

              role="button"
              tabIndex={0}
              onKeyDown={()=>{}}
              >
              {/* <Timer
                title={el.title}
                timerInput={el.timerInput}
                displayType='list'
                setIsShowTimers={{}}
                isSelected={i===selTimer}
                triggerTimer={triggerTimer}
              /> */}

              {/* Rather than sending text send it as an object */}

              <div
                  className={styles['curr-timer']}
                >
                <span className={styles.btn} title='Select timer' >
                  {i===selTimer ? '⦿' : '⦾'}
                </span>
                <span>{el.title}</span>
                <span title={el.timerInput}>{el.currentTimer}</span>
              </div>
              <br />

            </div>
          ))
        }
      {/* </div> */}

    </div>
  )
};

export default Timers;
