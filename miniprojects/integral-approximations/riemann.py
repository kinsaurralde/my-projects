import math


def solveFunction(equation, x):
    answer = eval(equation)
    print("f("+str(x)+") = "+str(answer))
    return answer


def riemann(equation, lower, upper, num_intervals, sum_type):
    interval_size = (upper - lower) / num_intervals
    step = lower
    values = []
    while step <= upper:
        values.append(solveFunction(equation, step))
        step += interval_size
    answer = 0
    if sum_type == "left":
        values.pop()
        for value in values:
            answer += value
    elif sum_type == "right":
        values.pop(0)
        for value in values:
            answer += value
    elif sum_type == "lower":
        for i in range(0, len(values) - 1):
            if values[i] < values[i+1]:
                answer += values[i]
            else:
                answer += values[i+1]
    elif sum_type == "upper":
        for i in range(0, len(values) - 1):
            if values[i] > values[i+1]:
                answer += values[i]
            else:
                answer += values[i+1]
    else:
        raise ValueError()
    answer *= interval_size
    return answer


try:
    print("")
    equation = str(input("Enter Equation:\n"))
    lower = int(input("Enter Lower Bound:\n"))
    upper = int(input("Enter Upper Bound:\n"))
    if lower >= upper:
        raise ValueError
    interval = int(input("Enter Number of Subintervals:\n"))
    if interval <= 0:
        raise ValueError
    sum_type = input("Enter Type: (upper, lower, left, right)\n")
    print("")
    print("\nAnswer:" + str(riemann(equation, lower, upper, interval, sum_type)) + "\n")
except ValueError:
    print("\nInvalid Value")
except NameError:
    print("\nUndefined Value")
except KeyboardInterrupt:
    print("\nProgram Ended by User")
except:
    print("\nAn Error has Occured")
