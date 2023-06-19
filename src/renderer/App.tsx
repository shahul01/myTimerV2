import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
// import icon from '../../assets/icon.svg';
import './App.css';
import { ITask } from './types';

const Main = () => {
  const [selectedTask, setSelectedTask] = useState<number>(0);

  const tasks: ITask[] = [
    {
      title: 'React',
      timeLeft: '08:59:59',
    },
  ];

  return (
    <div className="main">
      <div className="timer-app">
        <div className="titlebar">
          <h1 className="title">{tasks[selectedTask].title}</h1>
          <p className="task-count">{tasks.length}</p>
        </div>
        <div className="timer-area"> {tasks[selectedTask].timeLeft} </div>
      </div>
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
