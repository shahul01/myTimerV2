import { z } from 'zod';
import { FC, useEffect, useRef, useState } from 'react';
import { stringify } from '../../utils/misc';
import { calcTimeSpent, getTimeAsNumber } from '../../utils/time';
import { api } from '../../utils/trpc';
import ExportData from './ExportData/ExportData';
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

  const { mutate: dbAddTask } = api.task.addTask.useMutation({
    onSuccess: () => {
      console.log('Added a task');
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

  const { mutate: dbDeleteTasks } = api.task.deleteTasks.useMutation({
    onSuccess: () => {
      trpcContext.task.getAllTasks.invalidate();
      console.log('Deleted many tasks');
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
  // TODO: has to be pressed twice to get latest log
  async function handleSync() {
    // step 1 get logByData Db Data
    await refetch();

    // step 2 send data to logByData Db
    sendToDb();

    // step 3
    updateSyncData();
  };

  // function handleExport() {
  //   // console.log(`export: `, export);
  // };

  async function handleImport() {
    let importsParsed = {} as App.Config;
    // if (imported.configs.rendererConfig.taskType === 'timer') importTimer();
    // TODO: ask user to backup data before import and create such function if necessary

    async function importTimer():Promise<App.Config|{}> {
      let importedData = {};
      window.electron.ipcRenderer.handleImport({});
      // eslint-disable-next-line compat/compat
      importedData = await new Promise((resolve, reject) => {
        window.electron.ipcRenderer.once('handle-import', (arg: Record<string, App.Config>) => {
          resolve(arg.importedData);
        });
      });

      return importedData;
    };

    async function syncImportedTimer(importsParsedArg:App.Config) {
      // bulk delete db timers that match
      // NOTE: for now import tasks and don't care about stopwatch etc
      const importedTimer = importsParsedArg.configs.rendererConfig.tasks.timer;
      const currTimersTitles = dbTimerArrayRef.current.map(currTimer => currTimer.title);
      const matchedTitles = importedTimer
        .filter(timer => currTimersTitles.includes(timer.title))
        .map(timer => timer.title);

      console.log(`deleting timer with titles: `, matchedTitles);
      if (matchedTitles.length) dbDeleteTasks({ titleList: matchedTitles });

      // bulk insert new timers on loop
      importedTimer.forEach((currTimer, idx) => {
        dbAddTask(currTimer);
        if (idx === importedTimer.length - 1) {
          console.log('All Timers imported successfully');
          trpcContext.task.getAllTasks.invalidate();
        };
      });

    };

    importsParsed = await importTimer() as App.Config;
    if (Object.keys(importsParsed).length) syncImportedTimer(importsParsed);

  };

  return (
    <div className={styles.sync}>

      {/* // TODO: use Accordion to change be reset, sync and export */}

      <h3>Sync: </h3>
      <button
        type='button'
        title='Sync Tasks with Database'
        onClick={handleSync}
        className={styles["sync-button"]}
      >
        🔄 Sync
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

      <div className="hr-fade" />

      <div className="export">
        <div className="export-body">
          <ExportData
            selectedExport='config'
          />
          <button
            className="temp"
            type='button'
            onClick={handleImport}
          >
            Import config
          </button>
        </div>

      </div>

    </div>
  )
};

export default Sync;
