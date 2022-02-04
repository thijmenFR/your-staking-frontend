import React, { useEffect, useState } from 'react';
import { Switch, useLocation } from 'react-router-dom';

// @ts-ignore
const CustomSwitch = ({ children }) => {
  const [prevLoc, setPrevLoc] = useState('');
  const location = useLocation();

  useEffect(() => {
    setPrevLoc(location.pathname);
    if (location.pathname === prevLoc) {
      setPrevLoc('');
    }
  }, [location]);

  return (
    <>
      <Switch>{children}</Switch>
    </>
  );
};

export default CustomSwitch;
