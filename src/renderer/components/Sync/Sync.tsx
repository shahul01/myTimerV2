import { z } from 'zod';
import { FC, useEffect, useState } from 'react';
import { api } from 'renderer/utils/trpc';
import { getTimeAsNumber } from 'renderer/utils/time';
import { stringify } from 'renderer/utils/misc';
import styles from './sync.module.css';

interface ILogByDate {
  id: string;
  date: string;
  taskName: string;
  timeSpent: string;
};

interface ISyncProps {
};

const dateRangeSchema = z.object({
  startDate: z.string(),
  endDate: z.string()
});
type TDateRange = z.infer<typeof dateRangeSchema>;

const Sync: FC<ISyncProps> = (props) => {

  const trpcContext = api.useContext();
  const [ syncData, setSyncData ] = useState({});
  const currYear = new Date().getFullYear();
  // TODO: use input type=calendar to make this range dynamic
  const dateRange:TDateRange = {
    startDate: `01-01-${currYear}`,
    endDate: `12-31-${currYear}`,
  };

  // const {data: dbGetByDate} = api.logByDate.getByDate.useQuery(dateRange);
  // console.log(`dbGetByDate: `, dbGetByDate);
  const { data: dbLogAll } = api.logByDate.getAllLogs.useQuery();
  // console.log('dbLogAll', dbLogAll);

  function calcTimePerTask() {
    const logs = {
      metaData: {lastUpdateAt: '<When tasks are saved as logs>' },
      data: {} as App.IObject<{[totalTime:string]: string}>
    };

    // TODO: reduce loop count
    dbLogAll?.forEach((currTask:ILogByDate) => {
      // 120 minutes
      const prevTime = logs.data[currTask.taskName]?.totalTime;
      const currTime = getTimeAsNumber(
        {time: currTask.timeSpent, preferredUnit: 'minutes'}
      );

      // 120
      const prevTimeInMin = prevTime ? Number( prevTime?.split(' ')?.[0] ) : 0;
      let totalTime = 0;
      if (typeof(currTime) === 'number') {
        totalTime = prevTimeInMin + currTime;
      }

      logs.data = {
        ...logs.data,
        [currTask.taskName]: { totalTime: `${totalTime} minutes`}
      }

    })

    return logs;

  };

  function updateSyncData() {
    setSyncData(calcTimePerTask());
  };

  function handleSync() {
    updateSyncData();
    console.log('invalidating');
    // trpcContext.logByDate.getByDate.invalidate();
    trpcContext.logByDate.getAllLogs.invalidate();
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
            syncData: {stringify(syncData)} <hr />
            {/* date: {stringify({dbGetByDate})} <hr /> */}
            {/* all: {stringify({dbLogAll})} */}
          </pre>

        </div>
      </div>
    </div>
  )
};

export default Sync;
