import { TSnapShot, snapShot } from "./snapShot";
import { swap } from './swap'
import { TElementData, getElementForFrame } from "./frame";
import { ElementStates } from "../types/element-states";

export const revert = (str: string): [string, Array<Array<TElementData<string>>>] => {
    const frameCollection: Array<Array<TElementData<string>>> = [];
    const origin = Array.from(str);

    let start = 0;
    let end = origin.length - 1;

    // Массивы индексов элементов у которых должны быть состояния changing и modified
    let changing: Array<number> = [];
    const modified: Array<number> = [];

    // Создаём первый снимок и добавляем в коллекцию
    let frame: Array<TElementData<string>>;
    frame = origin.map((item, index) => {
        return getElementForFrame<string>(item, index)
    })
    frameCollection.push(frame);

    // Логика реверса элементов строки
    while(start < end) {
        // Сохраняем индексы меняющихся элементов для последующего шага      
        changing = [start + 1, end - 1];

        // Меняем значения в массиве
        swap(origin, start, end);

        // Сохраняем индексы измененных элементов
        modified.push(start, end);

        // Создаем снимок с элементами которые будут меняться на следующем шаге и которые изменились на этом
    
        frame = origin.map((item, index) => {
            if(changing.includes(index)) {
                return getElementForFrame<string>(item, index, ElementStates.Changing)
            } else if (modified.includes(index)) {
                return getElementForFrame<string>(item, index, ElementStates.Modified)
            }

            return getElementForFrame<string>(item, index)
        })
        frameCollection.push(frame);

        // Изменяем указатели элементов массива для следующей итерации
        start++;
        end--;        
    }

    // Создаем финальный снимок, где все элементы модифицированы
    frame = origin.map((item, index) => {
        return getElementForFrame<string>(item, index, ElementStates.Modified)
    })
    frameCollection.push(frame);

    return [origin.join(''), frameCollection];
}