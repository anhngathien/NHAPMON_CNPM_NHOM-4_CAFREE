# NHAPMON_CNPM_NHOM-4_CAFREE

bài 4
import random
def generate_numbers():
  numbers = []
  for i in range(1,101):
      numbers.append(int(random.randint(1, 50)))
  return numbers
def generate_numbers_with_parameters(n, lower_bound, upper_bound):
  numbers = []
  for i in range(1,n+1):
      numbers.append(random.randint(lower_bound, upper_bound))
  return numbers
print("Nhập số n:")
n=int(input())
print("Nhập số dưới:")
lower_bound=int(input())
print("Nhập số trên:")
upper_bound=int(input())
rand_numbers = generate_numbers_with_parameters(n,lower_bound,upper_bound)
def filter_even_numbers(list):
  e_list = []
  for i in list:
    i=int(i)
    if i % 2 == 0:
      e_list.append(i)
  return e_list
random = generate_numbers()
even_list=filter_even_numbers(random)
print("Danh sách câu 1 sau khi kiểm tra số chẵn:")
print(even_list)
ab=filter_even_numbers(rand_numbers)
print("Danh sách câu 2 sau khi kiểm tra số chẵn:")
print(ab)
