import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  createTheme,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    flex: 1,
    color: 'gold',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  link: {
    color: 'gold',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
}));

const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#fff',
    },
    type: 'dark',
  },
});

const Header = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color='transparent' position='static'>
        <Container>
          <Toolbar>
            <Typography
              onClick={() => history.push(`/`)}
              variant='h6'
              className={classes.title}
            >
              Top Crypto
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}

export default Header;