def selectionSort(arr):
    # get the length of the array
    n = len(arr)

    # loop through each element of the array
    for i in range(n):

        # find the minimum element in the remaining unsorted part
        min_index = i
        for j in range(i+1, n):
            if arr[j] < arr[min_index]:
                min_index = j

        # swap the minimum element with the current element
        arr[i], arr[min_index] = arr[min_index], arr[i]
