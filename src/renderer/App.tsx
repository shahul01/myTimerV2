// https://codesandbox.io/s/4-sh-coundown-timers-add-yy9r48


import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useCallback, useRef, useState } from 'react';
import Timer from './components/Timer/Timer';
import TimerButton from './components/TimerButton/TimerButton';
import AddTimer from './components/AddTimer/AddTimer';
// import icon from '../../assets/icon.svg';
import './App.css';
import { ITask } from './types';
import Timers from './components/Timers/Timers';

const Main = () => {

  // const [selectedTask, setSelectedTask] = useState<number>(0);

  // const tasks: ITask[] = [
  //   {
  //     title: 'React',
  //     timeLeft: '08:59:59',
  //   },
  // ];

  const [ timerArray, setTimerArray ] = useState<ITask[]>([
    {
      title: 'Timer 1',
      timerInput: '00:02:00',
    },
    {
      title: 'Timer 2',
      timerInput: '00:00:03',
    },
  ]);
  const [ selTimer, setSelTimer ] = useState(0);
  const [ triggerTimer, setTriggerTimer ] = useState(0);
  const [ isShowAddTimer, setIsShowAddTimer ] = useState(false);

  function handleSetSelTimer(i:number) {
    setSelTimer(i);
  };

  const handleTriggerTimer = useCallback(() => {
    setTriggerTimer(p => p + 1);
    console.log('app', triggerTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddTimer = useCallback((newTimerData:ITask) => {
    setTimerArray( prev => [...prev, newTimerData] );
    console.log(`timerArray: `, JSON.stringify(timerArray));
    console.log('parent', JSON.stringify(newTimerData))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className='main'>
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
      <Timers
        timerArray={timerArray}
        handleSetSelTimer={(x) => handleSetSelTimer(x)}
        selTimer={selTimer}
        triggerTimer={triggerTimer}
      />

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
      {
        isShowAddTimer
          ? <>
            <div className='hr-fade' />
            <div className='add-timer-wrapper'>
              <AddTimer
                onAddTimer={handleAddTimer}
              />
            </div>
          </>
          : (<></>)

      }

    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
