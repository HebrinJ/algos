import { Direction } from "../../types/direction";
import { swap } from "../../utils/swap";
import { TElementData, getDefaultFrame, getElementForFrame, getMultyStatesFrame } from "../../utils/frame";
import { ElementStates } from "../../types/element-states";

export const sortBubble = (originArray: Array<number>, direction: Direction): [Array<number>, Array<Array<TElementData<number>>>] => {
    const frameCollection: Array<Array<TElementData<number>>> = [];
    
    const tmpArray = originArray.slice();
    const end = tmpArray.length - 1;
    let step = 0;
    let changing: Array<number> = [];
    const modified: Array<number> = [];

    // Создаём первый снимок и добавляем в коллекцию    
    frameCollection.push(getDefaultFrame(tmpArray));

    if (direction === Direction.Ascending) {
        for (let i = end; i > 0; i--) {
            for (let j = 0; j < i; j++) {

                changing = [j, j + 1];
                
                frameCollection.push(getMultyStatesFrame(tmpArray, changing, modified));

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
                
                frameCollection.push(getMultyStatesFrame(tmpArray, changing, modified));

                step++;

                if (tmpArray[j] < tmpArray[j + 1]) {
                    swap(tmpArray, j, j + 1);
                }
            }

            modified.push(i)
        }
    }

    // Создаем финальный снимок, где все элементы модифицированы    
    frameCollection.push(getDefaultFrame(tmpArray, ElementStates.Modified));

    return [tmpArray, frameCollection];
}