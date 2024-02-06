
export const swap = (arr: Array<any>, firstIndex: number, secondIndex: number) => {
    const tmp = arr[firstIndex];
    arr[firstIndex] = arr[secondIndex];
    arr[secondIndex] = tmp;
}