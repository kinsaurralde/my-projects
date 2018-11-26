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


def to_base_n(number, base):
    output = ""
    current = int(number)
    while current > 0:
        output_add = current % base
        if (output_add > 9):
            output_add = chr(output_add+55)
        current = math.floor(current / base)
        output += str(output_add)
    outList = list(output)
    outList.reverse()
    output = ""
    for digits in outList:
        output += digits
    return output


number = input("Enter Number:\n")
base_initial = int(input("Enter Initial Base:\n"))
base_final = int(input("Enter Final Base:\n"))

print(to_base_n(to_base_10(number, base_initial), base_final))

#Last Update: 11/26/2018