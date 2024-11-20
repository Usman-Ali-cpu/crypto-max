import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Homepage from '../Pages/HomePage';
import CoinPage from '../Pages/CoinPage';
import Header from './Header';

const useStyles = makeStyles(() => ({
  MyRouter: {
    backgroundColor: '#14161a',
    minHeight: '100vh',
    color: 'white'
  }
}));

const MyRouter = () => {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.MyRouter}>
        <Header />
        <Route path='/' component={Homepage} exact />
        <Route path='/coins/:id' component={CoinPage} exact />
      </div>
    </BrowserRouter>
  );
}
export default MyRouter;