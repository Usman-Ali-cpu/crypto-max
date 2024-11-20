import axios from 'axios';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  CircularProgress,
  createTheme,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core';

const CoinInfo = ({ coin }) => {
  const [flag, setFlag] = useState(false);
  const [historicData, setHistoricData] = useState();
  const [prediction, setPrediction] = useState();

  const useStyles = makeStyles((theme) => ({
    container: {
      width: '75%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 25,
      padding: 40,
      [theme.breakpoints.down('md')]: {
        width: '100%',
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
      },
    },
  }));

  const classes = useStyles();

  const fetchCoinChart = () => {
    axios.get('/coin_chart', { params: { coin_id: coin.id, symbol: coin.symbol.toUpperCase() } })
      .then(response => {
        setFlag(true);
        setHistoricData(response.data.historical);
        let last_historical = response.data.historical[response.data.historical.length - 1]
        last_historical[0] = new Date(last_historical[0]).toDateString()
        response.data.prediction.unshift(response.data.historical[response.data.historical.length - 1]);
        setPrediction(response.data.prediction);
      })
  };

  useEffect(fetchCoinChart, [coin]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: '#fff',
      },
      type: 'dark',
    },
  });

  const getLabels = () => {
    const labels = [];
    historicData.map(coin => labels.push(new Date(coin[0]).toLocaleDateString()));
    prediction.map(coin => labels.push(coin[0]));
    return labels;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {!prediction || !historicData | flag === false ? (
          <CircularProgress
            style={{ color: 'gold' }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: getLabels(),
                datasets: [
                  {
                    data: historicData.map(coin => ({ x: new Date(coin[0]).toLocaleDateString(), y: coin[1] })),
                    label: 'Historical Price ( Last 90 Days ) in USD',
                    borderColor: '#EEBC1D'
                  },
                  {
                    data: prediction.map(coin => ({ x: coin[0], y: coin[1] })),
                    label: 'Predictions Price ( Next 7 Days ) in USD',
                    borderColor: '#4F8DBA'
                  }
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1
                  },
                },
              }}
            />
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;