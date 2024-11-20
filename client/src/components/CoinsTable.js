import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import {
  Container,
  createTheme,
  TableCell,
  ThemeProvider,
  InputAdornment,
  Button,
  TextField,
  TableBody,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  Paper,
  LinearProgress,
} from '@material-ui/core';

export const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const CoinsTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [investment, setInvestment] = useState(1);
  const [totalProfit, setTotalProfit] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const useStyles = makeStyles({
    row: {
      backgroundColor: '#16171a',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#131111',
      },
      fontFamily: 'Montserrat',
    },
    pagination: {
      '& .MuiPaginationItem-root': {
        color: 'gold',
      },
    },
  });

  const classes = useStyles();
  const history = useHistory();

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: '#fff',
      },
      type: 'dark',
    },
  });

  const predict = async () => {
    setLoading(true);
    const { data } = await axios.post('/invest', { investment });
    setTotalProfit(data.profit);
    setAccuracy(data.accuracy);
    setCoins(data.coins);
    setLoading(false);
  }

  useEffect(() => {
    predict();
  }, []);

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: 'center' }}>
        {loading ? (
          <LinearProgress style={{ marginTop: 20, backgroundColor: 'gold' }} />
        ) : (
          <>
            <TextField
              variant='outlined'
              label='Investment'
              value={investment}
              onChange={e => setInvestment(Number(e.target.value))}
              InputProps={{
                startAdornment: <InputAdornment position='start'>$</InputAdornment>
              }}
              style={{ marginTop: 20, marginBottom: 10, paddingRight: 10, width: '90%' }}
            />
            <Button
              onClick={predict}
              variant='outlined'
              style={{ marginTop: 20, marginBottom: 10, width: '10%', height: 55 }}
            >
              Invest
            </Button>
            <TextField
              disabled
              label='Total Profit'
              value={totalProfit}
              variant='outlined'
              InputProps={{
                startAdornment: <InputAdornment position='start'>$</InputAdornment>
              }}
              style={{ margin: '10px 0 20px 0', paddingRight: 10, width: '50%' }}
            />
            <TextField
              disabled
              label='Accuracy'
              value={accuracy.toFixed(2)}
              variant='outlined'
              InputProps={{
                endAdornment: <InputAdornment position='end'>%</InputAdornment>
              }}
              style={{ margin: '10px 0 20px 0', width: '50%' }}
            />
            <TextField
              label='Search For a Crypto Currency..'
              variant='outlined'
              style={{ marginBottom: 20, width: '100%' }}
              onChange={(e) => setSearch(e.target.value)}
            />
            <TableContainer component={Paper}>
              <Table aria-label='simple table'>
                <TableHead style={{ backgroundColor: '#EEBC1D' }}>
                  <TableRow>
                    {['Coin', 'Price', '24h Change', 'Market Cap', 'Start', 'End', 'Invest', 'Profit', 'Accuracy'].map((head) => (
                      <TableCell
                        style={{
                          color: 'black',
                          fontWeight: '700',
                          fontFamily: 'Montserrat',
                        }}
                        key={head}
                        align={head === 'Coin' ? 'left' : 'right'}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {handleSearch()
                    .slice((page - 1) * 10, (page - 1) * 10 + 10)
                    .map((row) => {
                      const profit = row.price_change_percentage_24h > 0;
                      return (
                        <TableRow
                          onClick={() => history.push(`/coins/${row.id}`)}
                          className={classes.row}
                          key={row.name}
                        >
                          <TableCell
                            component='th'
                            scope='row'
                            style={{
                              display: 'flex',
                              gap: 15,
                            }}
                          >
                            <img
                              src={row?.image}
                              alt={row.name}
                              height='50'
                              style={{ marginBottom: 10 }}
                            />
                            <div
                              style={{ display: 'flex', flexDirection: 'column' }}
                            >
                              <span
                                style={{
                                  textTransform: 'uppercase',
                                  fontSize: 22,
                                }}
                              >
                                {row.symbol}
                              </span>
                              <span style={{ color: 'darkgrey' }}>
                                {row.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell align='right'>
                            $ {numberWithCommas(row.current_price.toFixed(2))}
                          </TableCell>
                          <TableCell
                            align='right'
                            style={{
                              color: profit > 0 ? 'rgb(14, 203, 129)' : 'red',
                              fontWeight: 500,
                            }}
                          >
                            {profit && '+'}
                            {row.price_change_percentage_24h.toFixed(2)}%
                          </TableCell>
                          <TableCell align='right'>
                            $ {numberWithCommas(
                              row.market_cap.toString().slice(0, -6)
                            )}
                            M
                          </TableCell>
                          <TableCell align='right'>
                            {row.start_date}
                          </TableCell>
                          <TableCell align='right'>
                            {row.end_date}
                          </TableCell>
                          <TableCell align='right'>
                            $ {row.invest.toFixed(4)}
                          </TableCell>
                          <TableCell align='right'>
                            $ {row.profit.toFixed(4)}
                          </TableCell>
                          <TableCell align='right'>
                            {row.accuracy.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination
              count={Number((handleSearch()?.length / 10).toFixed(0))}
              style={{
                padding: 20,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
              classes={{ ul: classes.pagination }}
              onChange={(_, value) => {
                setPage(value);
                window.scroll(0, 450);
              }}
            />
          </>
        )}
      </Container>
    </ThemeProvider >
  );
}

export default CoinsTable;