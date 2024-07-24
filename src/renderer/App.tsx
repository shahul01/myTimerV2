import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import Timer from './components/Timer/Timer';
import TimerButton from './components/TimerButton/TimerButton';
import Timers from './components/Timers/Timers';
import AddTimer from './components/AddTimer/AddTimer';
import Modal from './components/Modal/Modal';
import Sync from './components/Sync/Sync';
import { api } from './utils/trpc';
import { calcTimeSpent } from './utils/time';
import { tempId } from './utils/misc';
import './App.css';

const Main = () => {
  const trpcContext = api.useContext();
  const { data: dbTimerArray, isLoading: isLoadingTimerArray } = api.task.getAllTasks.useQuery();
  const { data: dbLogAll } = api.logByDate.getAllLogs.useQuery();

  // const { data: exampleGreeting } = api.example.greeting.useQuery();

  const { mutate:updateCurrentTimer, isLoading: isUpdatingTimer } = api.task.updateCurrentTimer.useMutation({
    onSuccess: () => {
      trpcContext.task.getAllTasks.invalidate();
      console.log(`dbTimerArray 1: `, dbTimerArray?.[0]?.currentTimer);
    }
  });

  const { mutate:deleteCurrentTimer, isLoading: isDeletingTimer } = api.task.deleteTask.useMutation({
    onSuccess: () => {
      trpcContext.task.getAllTasks.invalidate();
      console.log('Deleted timer')
    }
  });

  const { mutate: deleteTimerLog } = api.logByDate.deleteLog.useMutation({
    onSuccess: () => {
      console.log("Deleted timer's log")
    }
  })

  const { mutate:dbPatchToLog } = api.logByDate.patchLog.useMutation({
    onSuccess: () => {
      trpcContext.logByDate.getAllLogs.invalidate();
      trpcContext.task.getAllTasks.invalidate();

      // eslint-disable-next-line no-use-before-define
      handleUpdateTimer('');
    },
    onError: (error) => {
      console.error('error - reset timer - patch mutation', error)
    }
  });

  const firstLoad = useRef(true);
  const initTimerArray = [{
    id: tempId(), title: '.',
    timerInput: '00:00:00', currentTimer: '00:00:00'
  }];
  // TODO: Reduce use states
  const [ timerArray, setTimerArray ] = useState<App.ITask[]>(initTimerArray);
  // TODO: merge this as one state
  const [ currTimer, setCurrTimer ] = useState<App.ITask>(initTimerArray[0]);
  const currTimerRef = useRef<App.ITask>(initTimerArray[0]);

  const [ triggerTimer, setTriggerTimer ] = useState(0);
  const [ isShowModal, setIsShowModal ] = useState(false);
  // TODO: merge this as one state
  const [ isShowTimers, setIsShowTimers ] = useState(false);
  const [ isShowAddTimer, setIsShowAddTimer ] = useState(false);

  function updateTimerArray() {
    if (dbTimerArray?.length) {
      console.log(`dbTimerArray: `, dbTimerArray);
      // set the timerArray & currTimer
      // when db provides timer data, on play/pause, on reset
      setTimerArray(dbTimerArray);
      if (currTimerRef.current.title === '.') {
        setCurrTimer(dbTimerArray[0]);
        [ currTimerRef.current ] = dbTimerArray;
      } else {
        const newTimer = dbTimerArray.find(dbTA => dbTA.id === currTimerRef.current.id);
        if (!newTimer) return;
        setCurrTimer(newTimer);
        currTimerRef.current = newTimer;
      }
    };
  };

  function handleSetSelTimer(selId:string) {
    const newCurrTimer = timerArray.find(el => el.id === selId);
    console.log(`newCurrTimer: `, newCurrTimer);
    if (!newCurrTimer) return;
    setCurrTimer(newCurrTimer);
    currTimerRef.current = newCurrTimer;
  };

  // pause or play
  const handleTriggerTimer = useCallback(() => {
    setTriggerTimer(p => p + 1);
  }, []);

  const handleAddTimer = useCallback((newTimerData:App.ITask) => {
    setTimerArray( prev => [...prev, newTimerData] );
  }, []);

  function handleToggleMoreOptions() {
    setIsShowModal(true);
  };

  const handleUpdateTimer = useCallback((newUpdatedTimer:string) => {
    const updatedTimer = updateCurrentTimer({
      id: currTimerRef.current.id,
      currentTimer: newUpdatedTimer || currTimerRef.current.timerInput
    });
    console.log(`updatedTimer: `, updatedTimer);

  // }, [currTimer, currTimerRef.current.id, currTimerRef.current.timerInput, updateCurrentTimer]);
  }, [updateCurrentTimer]);

  function handleResetTimer() {
    const selTimerLogIdx = dbLogAll?.findIndex(cL => {
      return cL.id === currTimerRef.current.id;
    });


    if (!dbLogAll || !selTimerLogIdx || selTimerLogIdx === -1) return;

    dbPatchToLog({
      // should be currLog.id...
      id: dbLogAll[selTimerLogIdx].id,
      date: new Date().toISOString(),
      taskName: currTimerRef.current.title,
      timeSpent: calcTimeSpent(currTimerRef.current),
    });

    handleUpdateTimer('');

    // on success, it resets timer automatically by invalidating

  };

  function handleEditTimer() {

  };

  // TODO: delete any timer not just current timer and by id
  // TODO: ask prompt if log should be deleted too
  function handleDeleteTimer(isDeleteLogToo:boolean) {
    //
    const matchedLogsId = dbLogAll
      ?.map(log => (log.taskName === currTimerRef.current.title) ? log.id : '')
      ?.filter(log => !!log);

    console.log(`matchedLogsId: `, matchedLogsId);

    if (isDeleteLogToo && matchedLogsId?.length) {
      deleteTimerLog({
        idList: matchedLogsId,
      })
    };
    deleteCurrentTimer({ id: currTimerRef.current.id });

    // TODO: close modal
    // TODO: set 1st task as selected

    // const resGreeting = exampleGreeting;
    // console.log(`resGreeting: `, resGreeting);
  };

  useEffect(() => {
    if (firstLoad.current) {
      console.log(
        '%c#App Loaded',
        "background: yellow; color: red; font-size: 25px"
      );
      firstLoad.current = false;
    }
  }, []);

  useEffect(() => {
    // updateTimerArray when dbTimerArray is available and when invalidated
    updateTimerArray();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbTimerArray]);


  return (
    <div
      className='main'
      >
      <Modal
          isShowModal={isShowModal}
          title='More options'
          onClose={() => setIsShowModal(false)}
        >
          <div className="modal-body">
            <h2>Timer {timerArray.find(cT => cT.id === currTimerRef.current.id)?.title || ''}</h2>
            <div className="reset-timer">
              <div className="body">
                <button
                  type='button'
                  onClick={handleResetTimer}
                >
                  Reset timer
                </button>
              </div>
              <br />
              <div className="reset-timer">
                <div className="body">
                  <button
                    type="button"
                    onClick={() => handleDeleteTimer(true)}
                    >
                      Delete timer
                    </button>
                </div>
              </div>
            </div>
            <div className="hr-fade" />
              <Sync />
          </div>
      </Modal>
      <Timer
        key={`${currTimerRef.current?.id}-${currTimerRef.current?.currentTimer}`}
        timerData={currTimerRef.current}
        onUpdatedTimer={handleUpdateTimer}
        setIsShowTimers={setIsShowTimers}
        triggerTimer={triggerTimer}
      />

      {
        isShowTimers && (
          <>
            <div className='buttons-container'>
              <TimerButton
                handleTriggerTimer={handleTriggerTimer}
              />
              <button
                type='button'
                title='Show or hide add timer form'
                className='toggle-add-timer'
                onClick={() => setIsShowAddTimer(!isShowAddTimer)}
                >
                ➕
              </button>
              <button
                type='button'
                title='Show More options modal'
                className='toggle-more-options'
                onClick={handleToggleMoreOptions}
                >
                ▫▫▫
              </button>
            </div>
            <Timers
              timerArray={timerArray}
              handleSetSelTimer={(id) => handleSetSelTimer(id)}
              selTimerId={currTimerRef.current.id}
              triggerTimer={triggerTimer}
            />
            {
              isShowAddTimer
                ? <>
                  <div className='hr-fade' />
                  <div className='add-timer-wrapper'>
                    <AddTimer
                      timerArrayLength={(dbTimerArray?.length||0)}
                      onAddTimer={handleAddTimer}
                    />
                  </div>
                </>
                : (<></>)

            }
          </>
        )
      }

    </div>
  );
};

const MainTRPCWrapped = () => {
  const [ queryClient ] = useState(() => new QueryClient());
  const [ trpcClient ] = useState(() => (
    api.createClient({
      links: [
        httpBatchLink({
          // TODO: remove hard code
          url: 'http://localhost:9000/api/v1',
        })
      ]
    })
  ))

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Main />
      </QueryClientProvider>
    </api.Provider>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainTRPCWrapped />} />
      </Routes>
    </Router>
  );
}
