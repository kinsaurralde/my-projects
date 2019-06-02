import random

num_trials = 10
max_people = 100
iterations = 10000

def PrintResults(results):
    f = open("data.csv","w+")
    for row in results:
        cur_row = ""
        for trial in row:
            cur_row += str("%.2f" % trial)
            cur_row += ","
        cur_row = cur_row[:-1]
        cur_row += "\n"
        f.write(cur_row)
    f.close() 

def BirthdayParadox(num_people = 23, iterations = 1):
    print("Birthday paradox with %d people and %d iterations" % (num_people, iterations))
    total_count = 0.0
    for i in range(iterations):
        birthdays = [0] * 365
        matches = []
        for j in range(num_people):
            cur_birthday = random.randint(0,364)
            birthdays[cur_birthday] += 1
        for j in range(365):
            if birthdays[j] > 1:
                matches.append(j)
        if len(matches) > 0:
            total_count += 1 
    return (total_count/iterations) * 100

print("Writing results to data.csv")
results = []
results.append([0.0] * num_trials)
for i in range(1,max_people):
    cur_num_people = []
    for j in range(num_trials):
        cur_num_people.append(BirthdayParadox(i, iterations))
    results.append(cur_num_people)

PrintResults(results)
print("Results in file")
