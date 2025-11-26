import sys
import time
import os
import random


def clear_console():
    """Очижуулна консоль"""
    os.system('cls' if os.name == 'nt' else 'clear')


def print_tree(lights):
    """Гэрэлтэй гацуур мод харуулах"""
    tree = [
"      *      ",
"     ***     ",
"    *****    ",
"   *******   ",
"  *********  ",
" *********** ",
"*************",
"     ***     ",
"     ***     "
    ]
    colors = {
        "*": "\033[31m",  # Улаан
        "o": "\033[32m",  # Ногоон
        "+": "\033[33m",  # Шар
        "@": "\033[34m",  # Цэнхэр
        "#": "\033[35m",  # Нил ягаан
        "&": "\033[36m"   # Хөх
    }

    for line in tree:
        for char in line:
            if char == '*':
                color = random.choice(list(colors.values()))
                print(color + char, end="")
            else:
                print(" ", end="")
        print("\033[0m")


def main():
    while True:
        clear_console()
        print_tree(10)
        time.sleep(0.5)


if __name__ == "__main__":
    main()
