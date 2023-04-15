def radixSort(arr):
    # find the maximum element in the array
    max_element = max(arr)
    # find the number of digits in the maximum element
    digits = len(str(max_element))
    # initialize a variable to store the place value
    place = 1
    # loop from 0 to digits - 1
    for i in range(digits):
        # use counting sort to sort the elements based on place value
        arr = countingSort(arr, place)
        # multiply the place value by 10
        place *= 10
    # return the sorted array
    return arr

def countingSort(arr, place):
    # find the length of the array
    n = len(arr)
    # initialize an output array of size n
    output = [0] * n
    # initialize a count array of size 10 (for digits from 0 to 9)
    count = [0] * 10
    # loop through the array and count the frequency of each digit at place value
    for i in range(n):
        # find the digit at place value
        digit = (arr[i] // place) % 10
        # increment the count of that digit by one
        count[digit] += 1
    # calculate the cumulative sum of the count array
    for i in range(1, 10):
        count[i] += count[i - 1]
    # loop through the array from right to left and place the elements in output array according to their count
    for i in range(n - 1, -1, -1):
        # find the digit at place value
        digit = (arr[i] // place) % 10
        # find the index of that digit in output array using count array
        index = count[digit] - 1
        # place the element at that index
        output[index] = arr[i]
        # decrement the count of that digit by one
        count[digit] -= 1
    # return the output array
    return output
