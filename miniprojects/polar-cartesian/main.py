import math


def polar_to_cart(r, theta):
    x = r * math.cos(theta)
    y = r * math.sin(theta)
    return (x, y)


def cart_to_polar(x, y):
    r = math.sqrt(x ** 2 + y ** 2)
    theta = math.atan2(y, x)
    return (r, theta)


try:
    mode = str(input("Conver to: (polar or cart)\n"))
    print("")
    if mode == "cart":
        num_1 = eval(input("Enter r: "))
        num_2 = eval(input("Enter theta: "))
        result = polar_to_cart(num_1, num_2)
    elif mode == "polar":
        num_1 = eval(input("Enter x: "))
        num_2 = eval(input("Enter y: "))
        result = cart_to_polar(num_1, num_2)
    else:
        raise TypeError

    print("\nResult: "+str(result))
except KeyboardInterrupt:
    print("\nExiting")
except TypeError:
    print("Invalid Input: Type Error")
except NameError:
    print("Invalid Input: Name Error")
except:
    print("Error")