import { Direction } from "../types/direction";
import { TSnapShot, snapShot } from "./snapShot";
import { swap } from "./swap";

export const sortBubble = (originArray: Array<number>, direction: Direction): [Array<number>, Record<number, TSnapShot<number>>] => {
    const snapShotCollection: Record<number, TSnapShot<number>> = {};
    const tmpArray = originArray.slice();
    const end = tmpArray.length - 1;
    let step = 0;
    let changing: Array<number> = [];
    const modified: Array<number> = [];

    // Создаём первый снимок и добавляем в коллекцию
    let shot = snapShot(tmpArray, [], []);
    snapShotCollection[step] = shot;

    if (direction === Direction.Ascending) {
        for (let i = end; i > 0; i--) {
            for (let j = 0; j < i; j++) {

                changing = [j, j + 1];
                shot = snapShot(tmpArray, changing.slice(), modified.slice());
                snapShotCollection[step] = shot;
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
                shot = snapShot(tmpArray, changing.slice(), modified.slice());
                snapShotCollection[step] = shot;
                step++;

                if (tmpArray[j] < tmpArray[j + 1]) {
                    swap(tmpArray, j, j + 1);
                }
            }

            modified.push(i)
        }
    }

    return [tmpArray, snapShotCollection];
}