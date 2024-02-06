import { Direction } from "../../types/direction";
import { swap } from "../../utils/swap";
import { TElementData, getDefaultFrame, getMultyStatesFrame } from "../../utils/frame";
import { ElementStates } from "../../types/element-states";

export const sortSelection = (originArray: Array<number>, direction: Direction): [Array<number>, Array<Array<TElementData<number>>>] => {
    const frameCollection: Array<Array<TElementData<number>>> = [];

    const tmpArray = originArray.slice();
    let step = 0;
    let modifiedItemIndex = 0;
    let changing: Array<number> = [];
    const modified: Array<number> = [];

    // Создаём первый снимок и добавляем в коллекцию
    frameCollection.push(getDefaultFrame(tmpArray));

    // Логика сортировки по убыванию
    if (direction === Direction.Descending) {
        for (let i = 0; i < tmpArray.length - 1; i++) {
            let maxInd = i;

            for (let j = i + 1; j < tmpArray.length; j++) {

                // Снимок каждого проверяемого элемента
                changing = [j, i];

                frameCollection.push(getMultyStatesFrame(tmpArray, changing, modified));

                step++;

                if (tmpArray[maxInd] < tmpArray[j]) {
                    maxInd = j;
                }
            }

            swap(tmpArray, maxInd, i)
            
            // Снимок измененного массива            
            modified.push(modifiedItemIndex);
            modifiedItemIndex++;

            frameCollection.push(getMultyStatesFrame(tmpArray, changing, modified));

            step++;
        }
    }

    // Логика сортировки по возрастанию
    if (direction === Direction.Ascending) {
        for (let i = 0; i < tmpArray.length - 1; i++) {
            let minInd = i;

            for (let j = i + 1; j < tmpArray.length; j++) {

                // Снимок каждого проверяемого элемента
                changing = [j, i];

                frameCollection.push(getMultyStatesFrame(tmpArray, changing, modified));

                step++;

                if (tmpArray[minInd] > tmpArray[j]) {
                    minInd = j;
                }
            }

            swap(tmpArray, minInd, i)
          
            modified.push(modifiedItemIndex);
            modifiedItemIndex++;
            
            frameCollection.push(getMultyStatesFrame(tmpArray, changing, modified));

            step++;
        }        
    }

    // Создаем финальный снимок, где все элементы модифицированы
    frameCollection.push(getDefaultFrame(tmpArray, ElementStates.Modified));

    return [tmpArray, frameCollection];
}