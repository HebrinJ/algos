import { Direction } from "../types/direction";
import { TSnapShot, snapShot } from "./snapShot";
import { swap } from "./swap";
import { TElementData, getElementForFrame } from "./frame";
import { ElementStates } from "../types/element-states";

export const sortSelection = (originArray: Array<number>, direction: Direction): [Array<number>, Array<Array<TElementData<number>>>] => {
    const frameCollection: Array<Array<TElementData<number>>> = [];

    //const snapShotCollection: Record<number, TSnapShot<number>> = {};
    const tmpArray = originArray.slice();
    let step = 0;
    let modifiedItemIndex = 0;
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

    // Логика сортировки по убыванию
    if (direction === Direction.Descending) {
        for (let i = 0; i < tmpArray.length - 1; i++) {
            let maxInd = i;

            for (let j = i + 1; j < tmpArray.length; j++) {

                // Снимок каждого проверяемого элемента
                changing = [j, i];
                // let shot = snapShot(tmpArray, changing.slice(), modified.slice());
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

                if (tmpArray[maxInd] < tmpArray[j]) {
                    maxInd = j;
                }
            }

            swap(tmpArray, maxInd, i)
            
            // Снимок измененного массива            
            modified.push(modifiedItemIndex);
            modifiedItemIndex++;
            // let shot = snapShot(tmpArray, [], modified.slice());
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
        }
    }

    // Логика сортировки по возрастанию
    if (direction === Direction.Ascending) {
        for (let i = 0; i < tmpArray.length - 1; i++) {
            let minInd = i;

            for (let j = i + 1; j < tmpArray.length; j++) {

                // Снимок каждого проверяемого элемента
                changing = [j, i];
                // let shot = snapShot(tmpArray, changing.slice(), modified.slice());
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

                if (tmpArray[minInd] > tmpArray[j]) {
                    minInd = j;
                }
            }

            swap(tmpArray, minInd, i)

            // Снимок измененного массива            
            modified.push(modifiedItemIndex);
            modifiedItemIndex++;
            // let shot = snapShot(tmpArray, [], modified.slice());
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
        }        
    }

    // Создаем финальный снимок, где все элементы модифицированы
    frame = tmpArray.map((item, index) => {
        return getElementForFrame<number>(item, index, ElementStates.Modified)
    })
    frameCollection.push(frame);

    return [tmpArray, frameCollection];
}