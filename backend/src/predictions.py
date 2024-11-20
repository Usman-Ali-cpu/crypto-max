import numpy as np
import pandas_datareader as web
from datetime import datetime, timedelta
from tensorflow import keras
from sklearn.preprocessing import MinMaxScaler
from data.coins import coins
from utils.utils import timestamp_to_string_date


def get_min_max(prediction):
    min_index = 0
    max_index = 0
    temp_min_index = 0

    for i in range(1, len(prediction)):
        if float(prediction[i]) < float(prediction[temp_min_index]):
            temp_min_index = i
        elif float(prediction[i]) - float(prediction[temp_min_index]) > float(prediction[max_index]) - float(prediction[min_index]):
            min_index = temp_min_index
            max_index = i

    return min_index, max_index


def coin_prediction(symbol, close, prediction_days):
    scaler = MinMaxScaler(feature_range=(0, 1))
    model_inputs = np.array(close)
    model_inputs = model_inputs.reshape(-1, 1)
    model_inputs = scaler.fit_transform(model_inputs)

    x_test = []

    for x in range(prediction_days, len(model_inputs)):
        x_test.append(model_inputs[x-prediction_days:x, 0])

    x_test = np.array(x_test)
    x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))

    model = keras.models.load_model(f'./src/models/{symbol[:-4]}')
    prediction_prices = model.predict(x_test)
    prediction_prices = scaler.inverse_transform(prediction_prices)
    prediction = list(prediction_prices.flatten())
    for i in range(len(prediction)):
        prediction[i] = str(prediction[i])
    return prediction


def coin_investment(symbol, close, times, prediction_days):
    prediction = coin_prediction(symbol, close, prediction_days)
    start, end = get_min_max(prediction)
    return {
        'start': float(prediction[start]),
        'end': float(prediction[end]),
        'start_date': timestamp_to_string_date(start + 1),
        'end_date': timestamp_to_string_date(end + 1),
        'profit_per_one': float(prediction[end]) - float(prediction[start]),
        'prediction': [[x, y] for x, y in zip(times, prediction)]
    }


def update_coins_predictions():
    prediction_days = 90
    future_days = 7
    currency = 'USD'
    data_source = 'yahoo'
    end = datetime.now()
    start = end - timedelta(prediction_days + future_days)
    times = [timestamp_to_string_date(day) for day in range(future_days)]
    cryptocurrencies = [f'{symbol}-{currency}' for symbol in coins.keys()]
    coins_last_days = web.DataReader(cryptocurrencies, data_source, start, end)
    for col in coins_last_days.columns:
        if col[0] == 'Close':
            coins[col[1][:-4]].update(coin_investment(col[1],
                                      coins_last_days[col].values, times, prediction_days))


import yfinance as yf
from datetime import datetime, timedelta
from data.coins import coins
from utils.utils import timestamp_to_string_date


def get_coins_predictions():
    prediction_days = 90
    future_days = 7
    currency = 'USD'
    end = datetime.now()
    start = end - timedelta(days=prediction_days + future_days)
    times = [timestamp_to_string_date(day) for day in range(future_days)]

    all_coins_data = {}

    for symbol in coins.keys():
        try:
            # Fetch historical data for each cryptocurrency
            coin_data = yf.download(f'{symbol}-USD', start=start, end=end)
            all_coins_data[symbol] = coin_data
        except Exception as e:
            print(f"Error fetching data for {symbol}: {e}")