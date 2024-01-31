import { Direction } from "../types/direction";
import { TSnapShot, snapShot } from "./snapShot";
import { swap } from "./swap";

export const sortSelection = (originArray: Array<number>, direction: Direction): [Array<number>, Record<number, TSnapShot<number>>] => {
    const snapShotCollection: Record<number, TSnapShot<number>> = {};
    const tmpArray = originArray.slice();
    let step = 0;
    let modifiedItemIndex = 0;
    let changing: Array<number> = [];
    const modified: Array<number> = [];

    // Создаём первый снимок и добавляем в коллекцию
    let shot = snapShot(tmpArray, [], []);
    snapShotCollection[step] = shot;

    // Логика сортировки по убыванию
    if (direction === Direction.Descending) {
        for (let i = 0; i < tmpArray.length - 1; i++) {
            let maxInd = i;

            for (let j = i + 1; j < tmpArray.length; j++) {

                // Снимок каждого проверяемого элемента
                changing = [j, i];
                let shot = snapShot(tmpArray, changing.slice(), modified.slice());
                snapShotCollection[step] = shot;
                step++;

                if (tmpArray[maxInd] < tmpArray[j]) {
                    maxInd = j;
                }
            }

            swap(tmpArray, maxInd, i)
            
            // Снимок измененного массива            
            modified.push(modifiedItemIndex);
            modifiedItemIndex++;
            let shot = snapShot(tmpArray, [], modified.slice());
            snapShotCollection[step] = shot;
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
                let shot = snapShot(tmpArray, changing.slice(), modified.slice());
                snapShotCollection[step] = shot;
                step++;

                if (tmpArray[minInd] > tmpArray[j]) {
                    minInd = j;
                }
            }

            swap(tmpArray, minInd, i)

            // Снимок измененного массива            
            modified.push(modifiedItemIndex);
            modifiedItemIndex++;
            let shot = snapShot(tmpArray, [], modified.slice());
            snapShotCollection[step] = shot;
            step++;
        }
    }

    return [tmpArray, snapShotCollection];
}