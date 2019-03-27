import math


def solveFunction(x):
    answer = 4 / (3 + x)
    return answer


def trapezoid_rule(lower, upper, num_intervals):
    interval_size = (upper - lower) / num_intervals
    step = lower
    values = 0
    while step <= upper:
        current = solveFunction(step)
        if step != lower and step != upper:
            current *= 2
        values += current
        step += interval_size
    values *= (.5 * interval_size)

    return values


def find_error(lower, upper, num_intervals, m):
    error_num = math.pow(upper - lower, 3) / \
        (12 * math.pow(num_intervals, 2)) * m
    return error_num


lower = int(input("Enter Lower Bound:\n"))
upper = int(input("Enter Upper Bound:\n"))
error_amount = float(input("Enter Error:\n"))

print("")

error = 1
n = 0
while error > error_amount:
    n += 1
    error = find_error(lower, upper, n, (8 / math.pow(9, 3))) # Last argument is 2nd derivative of function


print("n:", n)

print("\nAnswer:", trapezoid_rule(lower, upper, n), "\n")
