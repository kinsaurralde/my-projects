import random

def BirthdayParadox(num_people = 23, iterations = 1, verbose = False):
    total_count = 0.0
    for i in range(iterations):
        birthdays = [0] * 365
        matches = []
        for j in range(num_people):
            cur_birthday = random.randint(0,364)
            birthdays[cur_birthday] += 1
        for j in range(365):
            if verbose:
                print("[ %03d ] [ %03d ] %03d" % (i, j, birthdays[j]))
            if birthdays[j] > 1:
                matches.append(j)
        if len(matches) > 0:
            total_count += 1 
        print("[ %03d ] There were %d shared birthdays in a group of %d people" % (i, len(matches), num_people))
    print("In %d iterations, %d (%.2f) had at least one shared birthday" % (iterations, total_count, (total_count / iterations) * 100))

num_people = 23
iterations = 10
verbose = False

try:
    num_people = int(input("Enter the number of people: "))
    iterations = int(input("Enter the number of iterations: "))
    verbose = bool(int(input("Print verbose output? (0 or 1): ")))
except (ValueError, NameError, SyntaxError):
    print("Error: Inputs must be integers")
    print("Using defaults instead")
except (KeyboardInterrupt, EOFError):
    print("\nKeyboard Interrupt")
    exit(1)

try:
    BirthdayParadox(num_people, iterations, verbose)
except (KeyboardInterrupt, EOFError):
    print("\nKeyboard Interrupt")
    exit(1)
