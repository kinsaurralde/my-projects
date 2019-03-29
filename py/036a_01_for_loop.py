""" Desugared for loop

This program is a desugared version of the code listed in the next line:

for i in Range(n):
    print(i)

"""

n = int(input("Enter number\n"))

class Range:
    def __init__(self, n):
        self.i = 0
        self.n = n

    def __iter__(self):
        return self

    def __next__(self):
        self.i += 1
        if self.i <= self.n:
            return self.i-1
        else:
            raise StopIteration

obj = Range(n).__iter__()
while True:
    try:
        i = obj.__next__()
        print("Current number is: "+str(i))
    except StopIteration:
        break