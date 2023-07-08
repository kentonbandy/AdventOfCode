import file_reader

sequence = file_reader.get_lines(__file__)[0]

def look_and_say(sequence):
    new_sequence = ""
    count = 1
    for i in range(len(sequence)):
        if len(sequence) > 1 and i < len(sequence) - 1 and sequence[i+1] == sequence[i]:
            count += 1
        else:
            new_sequence += f'{count}{sequence[i]}'
            count = 1
    return new_sequence

def play(sequence, rounds = 40):
    for _ in range(rounds):
        sequence = look_and_say(sequence)
    print(len(sequence))

play(sequence)
play(sequence, 50)