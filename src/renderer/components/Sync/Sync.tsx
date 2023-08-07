import { z } from 'zod';
import { FC, useEffect, useState } from 'react';
import { api } from 'renderer/utils/trpc';
import { stringify } from 'renderer/utils/misc';
import styles from './sync.module.css';

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

  console.log(`dateRange: `, dateRange);

  const {data: dbGetByDate} = api.logByDate.getByDate.useQuery(dateRange);
  console.log(`dbGetByDate: `, dbGetByDate);
  const { data: dbLogAll } = api.logByDate.getAllLogs.useQuery();
  console.log('dbLogAll', dbLogAll);


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
    // updateSyncData();
    console.log('invalidating');
    trpcContext.logByDate.getByDate.invalidate();
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
            date: {stringify({dbGetByDate})}
            <hr />
            all: {stringify({dbLogAll})}
          </pre>

        </div>
      </div>
    </div>
  )
};

export default Sync;
