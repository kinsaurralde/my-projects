import math


def solveFunction(equation, x):
    answer = eval(equation)
    print("f("+str(x)+") = "+str(answer))
    return answer

def simpsons_rule(equation, lower, upper, num_intervals):
    interval_size = (upper - lower) / num_intervals
    print("Interval Size:"+ str(interval_size))
    step = lower
    values = solveFunction(equation, lower)
    step += interval_size
    i = 1
    while step < upper:
        current = solveFunction(equation, step)
        if i % 2 == 0:
            current *= 2
        else:
            current *= 4
        values += current
        step += interval_size
        i += 1
    values += solveFunction(equation, upper)
    values *= (1 / 3 * interval_size)
    return values


equation = str(input("Enter Equation:\n"))
lower = int(input("Enter Lower Bound:\n"))
upper = int(input("Enter Upper Bound:\n"))
interval = int(input("Enter Number of Subintervals:\n"))

print("")

try:
    print("\nAnswer:"+ str(simpsons_rule(equation, lower, upper, interval)) + "\n")
except:
    print("Invalid Input")