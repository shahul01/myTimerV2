import { FC, useEffect, useState } from 'react';
import { IObject, ITask } from 'renderer/types';
import styles from './addTimer.module.css';

interface IAddTimerProps {
  onAddTimer: (newTimerData: any) => void;
}

const AddTimer: FC<IAddTimerProps> = (props) => {
  const { onAddTimer } = props;
  const [ addForm, setAddForm ] = useState<ITask>({
    title: '',
    timerInput: '',
  });

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

  function handleAdd() {
    // console.log('child', addForm);
    onAddTimer(addForm)
    return resetForm(setAddForm);
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
        placeholder='07:59:59'
        name='timerInput'
        value={addForm.timerInput}
        onChange={e=>handleUpdateForm(e)}
      />
      <button type="button" onClick={handleAdd}>
        Add
      </button>
    </div>
  )
};

export default AddTimer;
