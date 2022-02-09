import s from './logo.module.scss';
import yourLogo from '@assets/images/logo-color.svg';

const AppLogo = () => {
  return (
    <div className={s.appLogo}>
      <img src={yourLogo} alt="YOUR Logo" />
    </div>
  );
};

export default AppLogo;
