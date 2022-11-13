import file_reader


"""https://adventofcode.com/2021/day/21"""


def play_game(player_1_start: int, player_2_start: int):
    p1_score = 0
    p1_position = player_1_start
    p2_score = 0
    p2_position = player_2_start
    turn = 0
    die = 1

    def roll():
        nonlocal die
        roll = (die * 3) + 3
        die += 3
        return roll

    while p1_score < 1000 and p2_score < 1000:
        turn += 1

        if turn % 2 == 0:
            p2_position = (p2_position + roll()) % 10
            p2_score += p2_position if p2_position != 0 else 10
        else:
            p1_position = (p1_position + roll()) % 10
            p1_score += p1_position if p1_position != 0 else 10
    
    print((die - 1) * min(p1_score, p2_score))


def play_dirac(player_1_start: int, player_2_start: int):
    # figure out how many possible combinations there are for each player,
    # compare which would win when those combinations are put against each other
    # each combination from one player needs to be compared to every combination from the other player
    # the problem will be how to count high enough
    # the key is how many turns it takes to win
    # so for every combo, save how many turns it takes to get >= 21
    # ternary numbers in reverse to get all possible combinations for each player
    # I think in order to do this in a reasonable time we need to sort (by turns) and use some algorithm
    # that way we can rule out a ton of combinations from the get-go
    pass

# play_game(6, 2)
play_dirac(4, 8)