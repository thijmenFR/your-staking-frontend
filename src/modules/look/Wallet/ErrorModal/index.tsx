import waitingBigEllipse from '@assets/images/waiting-big-ellipse.png';
import waitingSmallEllipse from '@assets/images/waiting-small-ellipse.png';
import cn from 'classnames';
import styles from '../WaitingModal/WaitingModal.module.scss';

interface IWaiting {
  setIsModalVisible: (prevState: boolean) => void;
  errorMessage?: string;
}

const ErrorModal = ({
  setIsModalVisible,
  errorMessage = 'Oops something went wrong',
}: IWaiting) => {
  return (
    <div className={cn(styles.waiting, 'bg-pattern-1')}>
      <img src={waitingBigEllipse} width="96" height="96" alt="" />
      <img src={waitingSmallEllipse} width="66" height="66" alt="" />
      <h5>{errorMessage}</h5>
      <button
        onClick={() => setIsModalVisible(false)}
        className={` ${styles.waiting__btn} btn primary`}
      >
        Close
      </button>
    </div>
  );
};

export default ErrorModal;
