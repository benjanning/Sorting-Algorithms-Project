def bubble_sort(arr):
    # get the length of the array
    n = len(arr)

    # loop through each element of the array
    for i in range(n-1):

        # keep track of swapping
        swapped = False

        # loop to compare adjacent elements
        for j in range(0, n-i-1):

            # compare two adjacent elements
            # change > to < to sort in descending order
            if arr[j] > arr[j+1]:

                # swapping occurs if elements
                # are not in the intended order
                arr[j], arr[j+1] = arr[j+1], arr[j]

                # set swapped to True
                swapped = True

        # no swapping means the array is already sorted
        # so no need for further comparison
        if not swapped:
            break

    return arr return sorted array
