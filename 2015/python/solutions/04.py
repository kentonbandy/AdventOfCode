import file_reader
import hashlib

secret_key = file_reader.get_lines(__file__)[0]


def gethash(key, numzeroes):
    num = 1
    matchstring = '0' * numzeroes
    while True:
        bytestring = f'{key}{num}'.encode('utf-8')
        hexstring = hashlib.md5(bytestring).hexdigest()
        if hexstring[:numzeroes] == matchstring:
            break
        num += 1
    print(num)


gethash(secret_key, 5)
gethash(secret_key, 6)