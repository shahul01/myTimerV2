import { FC, MouseEventHandler, useEffect, useState } from 'react';
import styles from './timerButton.module.css';

interface ITimerButtonProps {
  handleTriggerTimer: MouseEventHandler<HTMLButtonElement> | undefined;
};

const TimerButton: FC<ITimerButtonProps> = (props) => {
  const { handleTriggerTimer } = props;

  return (
    <div className={styles['timer-button']}>

      <button
        type='button'
        title='Pause or resume timer'
        onClick={handleTriggerTimer}
        >
      ⏯
      </button>
    </div>
  )
};

export default TimerButton;
