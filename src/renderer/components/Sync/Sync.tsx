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

type TDataToSend = App.IObject<ILogByDate[]>;

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
  // to get latest immediately
  const dbTimerArrayRef = useRef<App.ITask[]>([]);
  const dbLogAllRef = useRef<ILogByDate[]>([]);
  const currYear = new Date().getFullYear();
  // TODO: use input type=calendar to make this range dynamic
  const dateRange:TDateRange = {
    startDate: `01-01-${currYear}`,
    endDate: `12-31-${currYear}`,
  };

  const { data: dbTimerArray } = api.task.getAllTasks.useQuery(undefined, {
    onSuccess: (newTimerArray) => {
      dbTimerArrayRef.current = newTimerArray;
      // console.log(`dbTimerArrayRef: `, dbTimerArrayRef.current);
    }
  });

  // const {data: dbGetByDate} = api.logByDate.getByDate.useQuery(dateRange);
  // console.log(`dbGetByDate: `, dbGetByDate);
  const { data: dbLogAll } = api.logByDate.getAllLogs.useQuery(undefined, {
    onSuccess: (newDbLogAll) => {
      dbLogAllRef.current = newDbLogAll;
      // console.log('dbLogAllRef', dbLogAllRef.current);
    }
  });

  async function refetch() {
    await trpcContext.logByDate.getAllLogs.invalidate();
  };

  const { mutate: dbPostToLog } = api.logByDate.postLog.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error(`error - dbPostToLog`, error);
    }
  });

  const { mutate: dbPatchToLog } = api.logByDate.patchLog.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error(`error - dbPatchToLog`, error);
    }
  });

  // NOTE: send to logByDate Db

  function accumulateDataToSend():TDataToSend {
    console.log('dbLog length', dbLogAll?.length, dbLogAllRef.current.length);

    // infer <typeof dbPostToLog>[]
    // dbPostToLog type preferred over
    const toPostData:ILogByDate[] = [];
    const toPatchData:ILogByDate[]  = [];

    // if (old data with same date and same taskName) {
    //   update only date and timeSpent
    // } else {
    //   add entire data of ILogByDate to LogByDate Db
    // }

    function sendToPostDataVar(currTimer:App.ITask, from:number) {
      // console.log('from', from);
      toPostData.push({
        id: currTimer.id,
        date: new Date().toISOString(),
        taskName: currTimer.title,
        timeSpent: calcTimeSpent(currTimer)
      })
    };

    // TODO: Reduce loop count
    dbTimerArrayRef.current?.forEach((currTimer:App.ITask) => {
    if ( !dbLogAll?.length ) {
      sendToPostDataVar(currTimer, 1);

    };
      // type TDBLogAll = typeof App.ILogByDate;
      dbLogAllRef.current?.forEach((currLog:ILogByDate) => {
        console.log(`currLog: `, currLog);

        const availableInPostData = () =>  {
          return toPostData.find((currPost:ILogByDate) => {
            return currPost.id === currTimer.id;
          });
        };

        const availableInPatchData = () => (
          toPatchData.find((currPatch:ILogByDate) => {
            return currPatch.id === currTimer?.id;
          })
        );

        if ( availableInPostData() || availableInPatchData() ) return;

        const availableInLogData = () => {
          // currTimer not avail in entire log and currLog not avail in entire log
          const currTimerNotInEntireLog = dbLogAllRef.current?.find(currLog2 => {
            return currTimer.id === currLog2.id;
          });

          const currLogNotInEntireLog = dbLogAllRef.current?.find(currLog2 => {
            return currLog.id === currLog2.id;
          });

          return currTimerNotInEntireLog && currLogNotInEntireLog;
        };

        const logTimeAsNumber = getTimeAsNumber(
          {time: currLog.timeSpent, preferredUnit: 'seconds'}
        );
        const currDbTimeAsNumber = getTimeAsNumber(
          {time: currTimer.currentTimer, preferredUnit: 'seconds'}
        );

        if (
          currLog.id === currTimer.id
          // availableInLogData()
        ) {
          // if ( logTimeAsNumber > currDbTimeAsNumber ) return;
          toPatchData.push({
            id: currLog.id,
            date: new Date().toISOString(),
            taskName: currLog.taskName,
            timeSpent: calcTimeSpent(currTimer)
          });

        } else if ( !availableInLogData() ) {
          sendToPostDataVar(currTimer, 2);
        }

      });
    });

    // console.log(`toPatchData: `, toPatchData);
    // console.log(`toPostData: `, toPostData);

    const toReturn = {
      toPatchData,
      toPostData
    };

    return toReturn;
  };

  async function sendToDb() {
    if (!dbTimerArray) throw new Error('data unavailable.');

    const { toPatchData, toPostData } = accumulateDataToSend() as TDataToSend;

    toPatchData.forEach(async currPatchData => {
      dbPatchToLog({
        id: currPatchData.id,
        date: currPatchData.date,
        taskName: currPatchData.taskName,
        timeSpent: currPatchData.timeSpent
      })

    });

    toPostData.forEach(async currPostData => {
      dbPostToLog({
        id: currPostData.id,
        date: currPostData.date,
        taskName: currPostData.taskName,
        timeSpent: currPostData.timeSpent
      })

    });

  };

  // NOTE: get from logByDate Db
  function calcTimePerTask() {
    const logs = {
      metaData: {lastUpdateAt: '<When tasks are saved as logs>' },
      data: {} as App.IObject<{[totalTime:string]: string}>
    };
    const preferredUnit = 'minutes';

    // TODO: reduce loop count
    dbLogAllRef.current?.forEach((currTask:ILogByDate) => {
      // 120 minutes
      const prevTime = logs.data[currTask.taskName]?.totalTime;
      const currTime = getTimeAsNumber(
        {time: currTask.timeSpent, preferredUnit}
      );

      // 120
      const prevTimeInMin = prevTime ? Number( prevTime?.split(' ')?.[0] ) : 0;
      let totalTime = 0;
      if (typeof(currTime) === 'number') {
        totalTime = prevTimeInMin + currTime;
      }

      logs.data = {
        ...logs.data,
        [currTask.taskName]: { totalTime: `${totalTime} ${preferredUnit}`}
      }

    })

    return logs;

  };

  function updateSyncData() {
    setSyncData(calcTimePerTask());
  };

  async function handleSync() {
    // step 1 get logByData Db Data
    await refetch();

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
