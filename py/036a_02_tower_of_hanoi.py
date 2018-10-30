def move_tower(n, src, dst, tmp):
    if n > 0:
        move_tower(n-1, src, tmp, dst)
        move(src, dst)
        move_tower(n-1, tmp, dst, src)

def move(src, dst):
    print("Moving Disk From",src,"To",dst)

n = int(input("Enter number\n"))

move_tower(n, "A", "B", "C")