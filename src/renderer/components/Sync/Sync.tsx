import { z } from 'zod';
import { FC, useEffect, useRef, useState } from 'react';
import { api } from 'renderer/utils/trpc';
import { calcTimeSpent, getNumberAsTime, getTimeAsNumber } from 'renderer/utils/time';
import { stringify, uuid } from 'renderer/utils/misc';
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

  const { data: dbTimerArray } = api.task.getAllTasks.useQuery();

  // const {data: dbGetByDate} = api.logByDate.getByDate.useQuery(dateRange);
  // console.log(`dbGetByDate: `, dbGetByDate);
  const { data: dbLogAll } = api.logByDate.getAllLogs.useQuery();
  console.log('dbLogAll', dbLogAll);

  function refetch() {
    console.log('invalidating');
    // trpcContext.logByDate.getByDate.invalidate();
    trpcContext.logByDate.getAllLogs.invalidate();
  };

  const { mutate: dbPostLog } = api.logByDate.postLog.useMutation({
    onSuccess: () => {
      console.log(`success - dbPostLog`);
      refetch();
    }
  });

  const { mutate: dbPatchLog } = api.logByDate.patchLog.useMutation({
    onSuccess: () => {
      console.log(`success - dbPatchLog`)
      refetch();
    }
  });

  // NOTE: send to logByDate Db

  function sendToDb() {
    if (!dbTimerArray || !dbLogAll) throw new Error('data unavailable.');

    // infer <typeof dbPostLog>[]
    // dpPostLog type preferred over
    type TPostData = any;
    const toPostData:TPostData = [];
    const toPatchData:any  = [];

    // if (old data with same date and same taskName) {
    //   update only date and timeSpent
    // } else {
    //   add entire data of ILogByDate to LogByDate Db
    // }

    // // add new data
    // console.log('dbLogAll 2', dbLogAll);

    dbTimerArray?.forEach((currTimer:App.ITask) => {
      dbLogAll?.forEach((currLog: App.ILogByDate) => {

        const availableInPostData = () =>  (
          toPostData.find((currPost:ILogByDate) => {
            return currPost.taskName === currTimer.title;
          })
        );

        const availableInPatchData = () => (
          toPatchData.find((currPatch:ILogByDate) => {
            return currPatch.taskName === currTimer?.title;
          })
        );

        if ( availableInPostData()|| availableInPatchData() ) return;

        const logTimeAsNumber = getTimeAsNumber(
          {time: currLog.timeSpent, preferredUnit: 'seconds'}
        );
        const currDbTimeAsNumber = getTimeAsNumber(
          {time: currTimer.currentTimer, preferredUnit: 'seconds'}
        );

        if (
          currLog.taskName === currTimer.title
          && logTimeAsNumber < currDbTimeAsNumber
        ) {
          toPatchData.push({
            id: currLog.id,
            date: new Date().toISOString(),
            taskName: currLog.taskName,
            timeSpent: calcTimeSpent(currTimer)
          });

        } else {
          toPostData.push({
            id: uuid({idLength: 'some'}),
            date: new Date().toISOString(),
            taskName: currTimer.title,
            timeSpent: calcTimeSpent(currTimer)
          })

        };

      });
    });

    // each postdata → post to db
    console.log(`toPostData: `, toPostData);
    // each patchdata → patch to db
    console.log(`toPatchData: `, toPatchData);

  };

  // NOTE: get from logByDate Db
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
    // step 1 get logByData Db Data
    refetch();

    // step 2 send data to logByData Db
    sendToDb();

    // step 3
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
