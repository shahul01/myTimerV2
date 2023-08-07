import { FC, useEffect, useState } from 'react';
import styles from './sync.module.css';

interface ISyncProps {
};

const Sync: FC<ISyncProps> = (props) => {

  return (
    <div className={styles.sync}>
      <button
        type='button'
        title='Sync Tasks with Database'
        onClick={() => {return false}}
        className={styles["sync-button"]}
      >
        🔄
      </button>
      <div className={styles.body}>
        <p>Logs: </p>
        <div className={styles["data-wrapper"]}>
          <pre>
            syncData
          </pre>

        </div>
      </div>
    </div>
  )
};

export default Sync;
