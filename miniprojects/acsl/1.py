def parse(line):
    current = ""
    output = []
    for char in line:
        if char == ",":
            output.append(current)
            current = ""
        elif char == " ":
            pass
        elif char == "T":
            current += "10"
        elif char == "J":
            current += "11"
        elif char == "Q":
            current += "12"
        elif char == "K":
            current += "13"
        elif char == "A":
            current += "14"
        else:
            current += char
    output.append(current)
    return output

def play_card(points):
    global player_deck
    global input_line_list
    global player_turn
    print("\nDeck: ",input_line_list)
    if player_turn:
        print("Player Deck:",player_deck)
        play = player_deck.pop(player_deck.index(max(player_deck)))
        print("Player Plays: "+str(play))
        player_deck.append(input_line_list.pop(0))
    else:
        play = input_line_list.pop(0)
        print("Dealer Plays: "+str(play))
    if play == 14 and points + play > 99:
        points += 1
    elif play == 10:
        points -= 10
    elif play == 9:
        pass
    else:
        points += play
    print("Points:",points)
    player_turn = not player_turn
    if points > 99:
        print("\n----------\n")
        if player_turn:
            return str(points)+", player"
        else:
            return str(points)+", dealer"
    else:
        return play_card(points)

while True:
    try:
        print("\n**********\nNew Game!")
        print("Press Control C to exit\n")
        input_line_raw = input("Enter Input:") # Get Input
        input_line_list = parse(input_line_raw)
        print("Input:",input_line_list)

        points =  int(input_line_list.pop(0)) # Setup
        player_deck = []
        player_turn = True
        for i in range(0,3):
            player_deck.append(input_line_list.pop(0))
        player_deck = list(map(int, player_deck)) # Change value type from str to int
        input_line_list = list(map(int, input_line_list)) # Change value type from str to int

        print(play_card(points)) # Print Result
        print("\n----------")
    except KeyboardInterrupt:
        print("\n\nProgram Exiting")
        break
    except ValueError:
        print("\nValue Error")
    except IndexError:
        print("\nIndex Error")
    except:
        print("\nAn Error has Occured")