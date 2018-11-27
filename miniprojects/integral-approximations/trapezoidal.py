import math


def solveFunction(equation, x):
    answer = eval(equation)
    print("f("+str(x)+") = "+str(answer))
    return answer


def trapezoid_rule(equation, lower, upper, num_intervals):
    interval_size = (upper - lower) / num_intervals
    print("Interval Size:"+ str(interval_size))
    step = lower
    values = 0
    while step <= upper:
        current = solveFunction(equation, step)
        if step != lower and step != upper:
            current *= 2
        values += current
        step += interval_size
    values *= (.5 * interval_size)
    return values


equation = str(input("Enter Equation:\n"))
lower = int(input("Enter Lower Bound:\n"))
upper = int(input("Enter Upper Bound:\n"))
interval = int(input("Enter Number of Subintervals:\n"))

print("")

try:
    print("\nAnswer:"+ str(trapezoid_rule(equation, lower, upper, interval)) + "\n")
except:
    print("Invalid Input")

#Last Update 11/26/2018