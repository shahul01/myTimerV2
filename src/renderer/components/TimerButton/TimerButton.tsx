import { FC, MouseEventHandler, useEffect, useState } from 'react';
import styles from './timerButton.module.css';

interface ITimerButtonProps {
  handleToggleTimerState: MouseEventHandler<HTMLButtonElement> | undefined;
};

const TimerButton: FC<ITimerButtonProps> = (props) => {
  const { handleToggleTimerState } = props;

  return (
    <div className={styles['timer-button']}>

      <button type='button' onClick={handleToggleTimerState}>
        Toggle
      </button>
    </div>
  )
};

export default TimerButton;
