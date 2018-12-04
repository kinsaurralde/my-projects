import math


def to_base_10(number, base):
    i = 0
    output = 0
    for digit in reversed(number):
        if not digit.isdigit():
            digit = ord(digit.lower())-87
        output += math.pow(base, i) * int(digit)
        i += 1
    return int(output)


number = input("Enter Number:\n")
base = int(input("Enter Base:\n"))

print("Answer:")
print(to_base_10(number, base))

#Last Update: 10/25/2018