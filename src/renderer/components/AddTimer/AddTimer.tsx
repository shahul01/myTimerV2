import { FC, useEffect, useState } from 'react';
import { IObject, ITask } from 'renderer/types';
import styles from './addTimer.module.css';

interface IAddTimerProps {
  timerArrayLength: number;
  onAddTimer: (newTimerData: any) => void;
};

const initTimer = {
  id: 0,
  title: '',
  timerInput: '01:00:00',
  currentTimer: '01:00:00'
};

const AddTimer: FC<IAddTimerProps> = (props) => {
  const { timerArrayLength, onAddTimer  } = props;
  const [ addForm, setAddForm ] = useState<ITask>(initTimer);

  function handleUpdateForm(e:React.ChangeEvent<HTMLInputElement>) {
    setAddForm({
      ...addForm,
      [e.target.name]: e.target.value,
    });
  };

  function resetForm(form: any) {
    const emptyByType = (el: any) => (
      typeof(el.length) === 'undefined' ? 0 : ''
    );
    const objArr = Object.entries(addForm).map(([k,v]) => (
      [k, emptyByType(v)]
    ));
    return form(Object.fromEntries(objArr));
  };

  function handleSubmit() {
    const newForm:ITask = {
      ...addForm,
      id: timerArrayLength + 1,
      currentTimer: addForm.timerInput
    };

    onAddTimer(newForm);
    // return resetForm(setAddForm);
    return setAddForm(initTimer);
  };

  return (
    <div className={styles['add-timer']}>
      <input
        placeholder='Title'
        name='title'
        value={addForm.title}
        onChange={e=>handleUpdateForm(e)}
      />
      <input
        placeholder='01:00:00'
        name='timerInput'
        value={addForm.timerInput}
        onChange={e=>handleUpdateForm(e)}
      />
      <button type="button" onClick={handleSubmit}>
        Add
      </button>
    </div>
  )
};

export default AddTimer;
