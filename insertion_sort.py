def insertion_sort(arr):
    # if array has one or zero elements, it is already sorted
    if len(arr) <= 1:
        return arr

    # loop from index 1 to n-1
    for i in range(1, len(arr)):
        # store the current element as key
        key = arr[i]
        # initialize j as i-1
        j = i - 1
        # loop while j is not negative and key is smaller than arr[j]
        while j >= 0 and key < arr[j]:
            # move arr[j] to arr[j+1]
            arr[j+1] = arr[j]
            # decrement j by one
            j -= 1
        # place key at arr[j+1]
        arr[j+1] = key

    return arr
