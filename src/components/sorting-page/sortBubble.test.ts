import { Direction } from "../../types/direction";
import { sortBubble } from "./sortBubble";

it('Should bubble sort filled array asc', () => {
    const array = [5, 1, 0, 8, 6, 3, 2];
    const ascSortArray = [0, 1, 2, 3, 5, 6, 8]

    expect(ascSortArray).toEqual(sortBubble(array, Direction.Ascending)[0])
})

it('Should bubble sort filled array desc', () => {
    const array = [5, 1, 0, 8, 6, 3, 2];
    const descSortArray = [8, 6, 5, 3, 2, 1, 0]

    expect(descSortArray).toEqual(sortBubble(array, Direction.Descending)[0])
})

it('Should bubble sort array with retry numbers', () => {
    const array = [4, 1, 4, 3, 4, 3, 2, 5];
    const descSortArray = [5, 4, 4, 4, 3, 3, 2, 1]

    expect(descSortArray).toEqual(sortBubble(array, Direction.Descending)[0])
})

it('Should bubble sort already sorted array', () => {
    const array = [4, 3, 2, 1, 0];
    const descSortArray = [4, 3, 2, 1, 0];

    expect(descSortArray).toEqual(sortBubble(array, Direction.Descending)[0])
})

it('Should bubble sort array negarive numbers', () => {
    const array = [-1, 3, -4, 2, 0];
    const descSortArray = [3, 2, 0, -1, -4];

    expect(descSortArray).toEqual(sortBubble(array, Direction.Descending)[0])
})

it('Should return one element array after bubble sort', () => {
    const array = [4];
    const descSortArray = [4]

    expect(descSortArray).toEqual(sortBubble(array, Direction.Descending)[0])
})

it('Should return empty array after bubble sort', () => {
    const array: Array<number> = [];
    const descSortArray: Array<number> = []

    expect(descSortArray).toEqual(sortBubble(array, Direction.Descending)[0])
})