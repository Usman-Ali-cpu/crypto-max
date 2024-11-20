import requests
from datetime import datetime, timedelta


def api_get_response(url):
    response = requests.get(url)
    return response.json()


def timestamp_to_string_date(day):
    return (datetime.today() + timedelta(day)).strftime('%m/%d/%Y')
