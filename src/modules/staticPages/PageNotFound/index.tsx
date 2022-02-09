import React from 'react';
import s from './PageNotFound.module.scss';

const PageNotFound = () => {
  return (
    <div className={s.pageNotFound}>
      <div className="container">
        <h1>404 Page not found</h1>
      </div>
    </div>
  );
};

export default PageNotFound;
