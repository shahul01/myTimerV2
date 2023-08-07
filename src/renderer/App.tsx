import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import Timer from './components/Timer/Timer';
import TimerButton from './components/TimerButton/TimerButton';
import Timers from './components/Timers/Timers';
import AddTimer from './components/AddTimer/AddTimer';
// import icon from '../../assets/icon.svg';
// import global from '../types/global';
import { api } from './utils/trpc';
import './App.css';
import Modal from './components/Modal/Modal';
import Sync from './components/Sync/Sync';


const Main = () => {

  // const greeting = api.example.greeting.useQuery({name: 'Yo2'});
  // console.log(`greeting.data: `, greeting.data);
  // const id = api.example.idGetAll.useQuery();
  // console.log(`id?.data: `, stringify(id?.data));
  const { data: dbTimerArray } = api.task.getAllTasks.useQuery();

  const { mutate:updateCurrentTimer, isLoading: isUpdatingTimer } = api.task.UpdateCurrentTimer.useMutation({
    onSuccess: () => {
      // void ctx.task.getAllTasks.invalidate();
    }
  });

  // const user = async () => await trpc.userById.query('a')
  // const [selectedTask, setSelectedTask] = useState<number>(0);
  // const tasks: ITask[] = [
  //   { title: 'React', timeLeft: '08:59:59' },
  // ];

  const initId = 0;
  const initTimerArray = [{
    id: initId, title: '.',
    timerInput: '00:00:00', currentTimer: '00:00:00'
  }];
  // dbTimerArray
  // initTimerArray
  const [ timerArray, setTimerArray ] = useState<App.ITask[]>(initTimerArray);
  // changed this to id(starts with 1) instead of idx
  const [ selTimerId, setSelTimerId ] = useState(initId);
  const [ isShowModal, setIsShowModal ] = useState(false);
  const [ triggerTimer, setTriggerTimer ] = useState(0);
  const [ isShowTimers, setIsShowTimers ] = useState(false);
  const [ isShowAddTimer, setIsShowAddTimer ] = useState(false);

  function updateTimerArray() {
    console.log(`dbTimerArray: `, dbTimerArray);
    if (!!dbTimerArray?.length) {
      // update the selected Id when db provides timer data
      setSelTimerId(dbTimerArray[0].id);
      setTimerArray(dbTimerArray)
    };
  };

  function handleSetSelTimer(i:number) {
    setSelTimerId(i);
  };

  const handleTriggerTimer = useCallback(() => {
    setTriggerTimer(p => p + 1);
  }, []);

  const handleAddTimer = useCallback((newTimerData:App.ITask) => {
    setTimerArray( prev => [...prev, newTimerData] );
  }, []);

  function handleToggleMoreOptions() {
    setIsShowModal(true);
  };

  const handleUpdatedTimer = useCallback((newUpdatedTimer:string) => {

    // NOTE: currentTimer gets updated here
    const selTimer:App.ITask|undefined = timerArray.find(currTimer => {
      return currTimer.id === selTimerId;
    });

    if (selTimer) {
      selTimer.currentTimer = newUpdatedTimer;
    };

    console.log(`newUpdatedTimer: `, newUpdatedTimer);

    // TODO: use TRPC useMutation to update time on db.
    const res = updateCurrentTimer({
      id: selTimerId,
      currentTimer: newUpdatedTimer
    });

    // console.log(`dbTimerArray: `, dbTimerArray);
    // console.log(`res: `, res);

  }, [selTimerId, timerArray, updateCurrentTimer]);

  useEffect(() => {
    // updateTimerArray when dbTimerArray is available
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
            <Sync />
          </div>
      </Modal>

      <Timer
        key={timerArray.find(cT => cT.id === selTimerId)?.id}
        timerData={timerArray.find(cT => cT.id === selTimerId)}

        onUpdatedTimer={handleUpdatedTimer}
        setIsShowTimers={setIsShowTimers}
        // eslint-disable-next-line react/jsx-boolean-value
        triggerTimer={triggerTimer}
      />

      {
        isShowTimers && (
          <>
            <div className='buttons-container'>
              <TimerButton
                handleToggleTimerState={handleTriggerTimer}
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
              handleSetSelTimer={(x) => handleSetSelTimer(x)}
              selTimerId={selTimerId}
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
