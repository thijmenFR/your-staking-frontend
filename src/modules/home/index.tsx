import React, { useEffect } from 'react';
import s from './Home.module.scss';

const HomePage = () => {
  useEffect(() => {
    document.title = `ARA Rewards`;
  }, []);

  return (
    <div className={s.home}>
      <div className="container">
        <h1>tet</h1>
      </div>
    </div>
  );
};

export default HomePage;
