import json
from data.coins import coins


def profit_and_accuracy(subset):
    profit_sum = 0
    accuracy_sum = 0

    for symbol in subset:
        profit_sum += coins[symbol]['profit_per_one']
        accuracy_sum += coins[symbol]['accuracy']

    accuracy_average = accuracy_sum / len(subset)
    return profit_sum, accuracy_average


def find_best_subset():
    f = open('./data/subsets.json', 'r')
    subsets = json.loads(f.read())

    max_profit_subset_index = 0
    max_profit_sum, max_accuracy_average = profit_and_accuracy(subsets[0])

    for i in range(1, len(subsets)):
        profit_sum, accuracy_average = profit_and_accuracy(subsets[i])
        if profit_sum * accuracy_average > max_profit_sum * max_accuracy_average:
            max_profit_subset_index = i
            max_profit_sum = profit_sum
            max_accuracy_average = accuracy_average

    return subsets[max_profit_subset_index], max_profit_sum, max_accuracy_average


def split_invest_in_subset(subset, investment, profit):
    subset_coins = {}
    total_profit = 0
    if profit == 0:
        profit = 1

    for symbol in subset:
        subset_coins[symbol] = coins[symbol]
        subset_coins[symbol]['invest'] = (
            subset_coins[symbol]['profit_per_one'] / profit) * investment
        subset_coins[symbol]['profit'] = (
            subset_coins[symbol]['invest'] / subset_coins[symbol]['start']) * subset_coins[symbol]['end']
        total_profit += coins[symbol]['profit']

    return subset_coins, total_profit
