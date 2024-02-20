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

it('Should return one element array after bubble sort', () => {
    const array = [4];
    const descSortArray = [4]

    expect(descSortArray).toEqual(sortBubble(array, Direction.Descending)[0])
})

it('Should return empty array after bubble sort', () => {
    const array = [];
    const descSortArray = []

    expect(descSortArray).toEqual(sortBubble(array, Direction.Descending)[0])
})