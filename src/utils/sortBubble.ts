import { Direction } from "../types/direction";
import { swap } from "./swap";
import { TElementData, getElementForFrame } from "./frame";
import { ElementStates } from "../types/element-states";

export const sortBubble = (originArray: Array<number>, direction: Direction): [Array<number>, Array<Array<TElementData<number>>>] => {
    const frameCollection: Array<Array<TElementData<number>>> = [];

    //const snapShotCollection: Record<number, TSnapShot<number>> = {};
    const tmpArray = originArray.slice();
    const end = tmpArray.length - 1;
    let step = 0;
    let changing: Array<number> = [];
    const modified: Array<number> = [];

    // Создаём первый снимок и добавляем в коллекцию
    // let shot = snapShot(tmpArray, [], []);
    // snapShotCollection[step] = shot;
    let frame: Array<TElementData<number>>;
    frame = tmpArray.map((item, index) => {
        return getElementForFrame<number>(item, index)
    })
    frameCollection.push(frame);

    if (direction === Direction.Ascending) {
        for (let i = end; i > 0; i--) {
            for (let j = 0; j < i; j++) {

                changing = [j, j + 1];

                // shot = snapShot(tmpArray, changing.slice(), modified.slice());
                // snapShotCollection[step] = shot;
                frame = tmpArray.map((item, index) => {
                    if(changing.includes(index)) {
                        return getElementForFrame<number>(item, index, ElementStates.Changing)
                    } else if (modified.includes(index)) {
                        return getElementForFrame<number>(item, index, ElementStates.Modified)
                    }
        
                    return getElementForFrame<number>(item, index)
                })
                frameCollection.push(frame);

                step++;

                if (tmpArray[j] > tmpArray[j + 1]) {
                    swap(tmpArray, j, j + 1);
                }
            }

            modified.push(i)
        }
    }

    if (direction === Direction.Descending) {
        for (let i = end; i > 0; i--) {
            for (let j = 0; j < i; j++) {

                changing = [j, j + 1];

                frame = tmpArray.map((item, index) => {
                    if(changing.includes(index)) {
                        return getElementForFrame<number>(item, index, ElementStates.Changing)
                    } else if (modified.includes(index)) {
                        return getElementForFrame<number>(item, index, ElementStates.Modified)
                    }
        
                    return getElementForFrame<number>(item, index)
                })
                frameCollection.push(frame);

                step++;

                if (tmpArray[j] < tmpArray[j + 1]) {
                    swap(tmpArray, j, j + 1);
                }
            }

            modified.push(i)
        }
    }

    // Создаем финальный снимок, где все элементы модифицированы
    frame = tmpArray.map((item, index) => {
        return getElementForFrame<number>(item, index, ElementStates.Modified)
    })
    frameCollection.push(frame);

    return [tmpArray, frameCollection];
}