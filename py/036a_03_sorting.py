from random import randint


def get_start():
    user_input = input("\nEnter numbers to be sorted seperated by a space or 'random [number]' for a random list\n")
    inputs = user_input.split()
    try:
        if inputs[0] == "random":
            number = int(inputs[1])
            inputs = []
            for i in range(number):
                inputs.append(randint(0, 100))
    except:
        print("Invalid Input")
    print("\nStarting List:", inputs)
    return inputs


def insertion_sort(a):
    for j in range(len(a)):
        key = a[j]
        i = j - 1
        while i >= 0 and a[i] > key:
            a[i + 1] = a[i]
            i -= 1
        a[i + 1] = key
    return a


a = get_start()

output = insertion_sort(a)
print("Using Insertion Sort")

print("Output:",output,"\n")
