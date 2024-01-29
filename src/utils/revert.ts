import { TSnapShot, snapShot } from "./snapShot";
import { swap } from './swap'

// Временная сложность O(n/2), пространственная сложность O(n)
export const revert = (str: string): [string, Record<number, TSnapShot<string>>] => {
    const snapShotCollection: Record<number, TSnapShot<string>> = {};
    let step = 0;
    const origin = Array.from(str);

    let start = 0;
    let end = origin.length - 1;

    // Массивы индексов элементов у которых должны быть состояния changing и modified
    let changing: Array<number> = [];
    const modified: Array<number> = [];

    // Создаём первый снимок и добавляем в коллекцию
    let shot = snapShot(origin, [start, end], []);
    snapShotCollection[step] = shot;

    // Логика реверса элементов строки
    while(start < end) {
        // Сохраняем индексы меняющихся элементов для последующего шага      
        changing = [start + 1, end - 1];

        // Меняем значения в массиве
        swap(origin, start, end);

        // Сохраняем индексы измененных элементов
        modified.push(start, end);

        // Создаем снимок с элементами которые будут меняться на следующем шаге и которые изменились на этом
        shot = snapShot(origin, changing.slice(), modified.slice());
        step++;

        // Сохраняем снимок в коллекцию
        snapShotCollection[step] = shot;

        // Изменяем указатели элементов массива для следующей итерации
        start++;
        end--;        
    }

    // Создаем финальный снимок, где все элементы модифицированы
    shot = snapShot(origin, [], modified.slice());
    step++;
    snapShotCollection[step] = shot;

    return [origin.join(''), snapShotCollection];
}