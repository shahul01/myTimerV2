import { FC, useEffect, useState } from 'react';
import { api } from 'renderer/utils/trpc';
import { generateRandomWords, tempId } from 'renderer/utils/misc';
// import { App.ITask } from 'types';
import styles from './addTimer.module.css';

interface IAddTimerProps {
  timerArrayLength: number;
  onAddTimer: (newTimerData: any) => void;
};

const initTimer = {
  id: tempId(),
  title: '',
  timerInput: '01:00:00',
  currentTimer: '01:00:00'
};

const AddTimer: FC<IAddTimerProps> = (props) => {
  const { timerArrayLength, onAddTimer  } = props;
  const [ addForm, setAddForm ] = useState<App.ITask>(initTimer);
  const trpcContext = api.useContext();
  const { mutate: dbAddTask } = api.task.addTask.useMutation({
    onSuccess: () => {
      trpcContext.task.getAllTasks.invalidate();
      // resetForm(setAddForm);
      setAddForm(initTimer);
    }
  })

  function handleUpdateForm(e:React.ChangeEvent<HTMLInputElement>) {
    setAddForm({
      ...addForm,
      [e.target.name]: e.target.value,
    });
  };

  function isTimerValid():boolean {
    const timerRegex = /^[0-9][0-9]:[0-5][0-9]:[0-5][0-9]$/;
    return timerRegex.test(addForm.timerInput);
  };

  function handleSubmit() {
    const isValid = isTimerValid();
    if (!isValid) return;

    const randomWords = generateRandomWords({wordsNumber:2});
    const newForm:App.ITask = {
      ...addForm,
      id: randomWords,
      currentTimer: addForm.timerInput
    };

    // onAddTimer(newForm);
    dbAddTask(newForm);

  };

  return (
    <div className={styles['add-timer']}>
      <input
        placeholder='Title'
        name='title'
        value={addForm.title}
        onChange={handleUpdateForm}
      />
      <input
        placeholder='01:00:00'
        name='timerInput'
        value={addForm.timerInput}
        onChange={handleUpdateForm}
      />
      <button type="button" onClick={handleSubmit}>
        Add
      </button>
    </div>
  )
};

export default AddTimer;
