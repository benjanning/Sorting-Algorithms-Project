def quickSort(arr, low, high):
    # if array has one or zero elements, it is already sorted
    if low < high:
        # partition the array around a pivot
        pi = partition(arr, low, high)
        # sort the left subarray
        quickSort(arr, low, pi - 1)
        # sort the right subarray
        quickSort(arr, pi + 1, high)

def partition(arr, low, high):
    # choose the rightmost element as pivot
    pivot = arr[high]
    # initialize i as low - 1
    i = low - 1
    # loop from low to high - 1
    for j in range(low, high):
        # if element is smaller than pivot
        if arr[j] < pivot:
            # increment i by one
            i += 1
            # swap arr[i] and arr[j]
            arr[i], arr[j] = arr[j], arr[i]
    # swap arr[i + 1] and pivot
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    # return i + 1 as the partition index
    return i + 1