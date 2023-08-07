// https://codesandbox.io/s/4-sh-coundown-timers-add-yy9r48


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useCallback, useRef, useState } from 'react';
import Timer from './components/Timer/Timer';
import TimerButton from './components/TimerButton/TimerButton';
import Timers from './components/Timers/Timers';
import AddTimer from './components/AddTimer/AddTimer';
// import icon from '../../assets/icon.svg';
// import global from '../types/global';
import { api } from './utils/trpc'
import './App.css';

const Main = () => {


  const greeting = api.example.greeting.useQuery({name: 'Yo2'});
  console.log(`greeting.data: `, greeting.data);
  const id = api.example.idGetAll.useQuery();
  console.log(`id?.data: `, id?.data);

  // const user = async () => await trpc.userById.query('a')

  // const [selectedTask, setSelectedTask] = useState<number>(0);

  // const tasks: ITask[] = [
  //   {
  //     title: 'React',
  //     timeLeft: '08:59:59',
  //   },
  // ];

  const [ timerArray, setTimerArray ] = useState<App.ITask[]>([
    {
      id: 1,
      title: 'myTimer1',
      timerInput: '00:51:01',
      currentTimer: '00:51:01'
    },
    {
      id: 2,
      title: 'Timer 2',
      timerInput: '00:00:03',
      currentTimer: '00:00:03'
    },
  ]);
  const [ selTimer, setSelTimer ] = useState(0);
  const [ triggerTimer, setTriggerTimer ] = useState(0);
  const [ isShowTimers, setIsShowTimers ] = useState(false);
  const [ isShowAddTimer, setIsShowAddTimer ] = useState(false);

  function handleSetSelTimer(i:number) {
    setSelTimer(i);
  };

  const handleTriggerTimer = useCallback(() => {
    setTriggerTimer(p => p + 1);
  }, []);

  const handleAddTimer = useCallback((newTimerData:App.ITask) => {
    setTimerArray( prev => [...prev, newTimerData] );
  }, []);

  const handleUpdatedTimer = useCallback((currUpdatedTimer) => {
    // console.log(`e: `, currUpdatedTimer);
    timerArray[selTimer].currentTimer = currUpdatedTimer;
    // console.log(`timerArray: `, timerArray);
  }, [selTimer, timerArray]);


  return (
    <div
      className='main'
      >
      {/* <div className='timer-app'>
        <div className='titlebar'>
          <h1 className='title'>{tasks[selectedTask].title}</h1>
          <p className='task-count'>{tasks.length}</p>
        </div>
        <div className='timer-area'> {tasks[selectedTask].timeLeft} </div>
      </div> */}

      {/* <h3>Timers: </h3> */}
      {/* <pre>
        {JSON.stringify(
          timerArray, null, 2
        )}
      </pre> */}

      {/* // TODO: Make key have Unique Id */}
      <Timer
        key={timerArray[selTimer].id}
        /* make timerArray props as one prop  */
        id={timerArray[selTimer].id}
        title={timerArray[selTimer].title}
        timerInput={timerArray[selTimer].timerInput}
        currentTimer={timerArray[selTimer].currentTimer}

        displayType='hero'
        onUpdatedTimer={handleUpdatedTimer}
        setIsShowTimers={setIsShowTimers}
        // eslint-disable-next-line react/jsx-boolean-value
        isSelected={true}
        triggerTimer={triggerTimer}
      />

      {
        !!isShowTimers && (
          <>
            <div className='buttons-container'>
              <TimerButton
                handleToggleTimerState={handleTriggerTimer}
              />
              <button
                type='button'
                onClick={() => setIsShowAddTimer(!isShowAddTimer)}
                className='toggle-add-timer'
                title='Show or hide add timer form'
                >
                ➕
              </button>
            </div>
            <br />
            <Timers
              timerArray={timerArray}
              handleSetSelTimer={(x) => handleSetSelTimer(x)}
              selTimer={selTimer}
              triggerTimer={triggerTimer}
            />
            {
              isShowAddTimer
                ? <>
                  <div className='hr-fade' />
                  <div className='add-timer-wrapper'>
                    <AddTimer
                      timerArrayLength={timerArray.length}
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
          url: 'http://localhost:9000'
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
