import { FC, useEffect, useState } from 'react';
import { api } from 'renderer/utils/trpc';
import styles from './sync.module.css';

interface ISyncProps {
};

const Sync: FC<ISyncProps> = (props) => {

  const [ syncData, setSyncData ] = useState({});
  const currYear = new Date().getFullYear();
  // TODO: use input type=calendar to make this range dynamic
  const dateRange = {
    startDate: `01-01-${currYear}`,
    endDate: `31-12-${currYear}`
  };
  // const {data: dbSyncData} = api.logs.getByDate().useQuery(dateRange);

  function getData() {

  };

  function calcTimePerTask() {
    const tasks = getData();
    return {};
  };

  function updateSyncData() {
    setSyncData(calcTimePerTask());
  };

  function handleSync() {
    updateSyncData();
  };

  return (
    <div className={styles.sync}>
      <h3>Sync: </h3>
      <button
        type='button'
        title='Sync Tasks with Database'
        onClick={handleSync}
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
