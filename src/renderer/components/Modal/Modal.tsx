import { FC, useEffect, useState } from 'react';
import styles from './modal.module.css';

interface IModalProps {
  isShowModal: boolean;
  onClose: (x:boolean) => void;
  title: string;
  children: React.ReactNode;
};

const Modal: FC<IModalProps> = (props) => {
  const {
    isShowModal,
    onClose,
    title,
    children
  } = props;

  return (
    <div className={styles.modal} >
      {isShowModal ?
        (
          <div className={styles["show-modal"]} >
            <div className={styles.heading} >
              <h3>{title}</h3>
              <button
                  type='button'
                  title='Close Modal'
                  onClick={() => onClose(false)}
                >
                X
              </button>
            </div>
            <div className={styles.body} >
              {children}
            </div>
          </div>
        ) : (
          <div className={styles["hide-modal" ]} />
        )

      }


    </div>
  )
};

export default Modal;
