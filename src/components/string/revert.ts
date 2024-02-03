import { swap } from '../../utils/swap'
import { TElementData, getDefaultFrame, getMultyStatesFrame } from "../../utils/frame";
import { ElementStates } from "../../types/element-states";

export const revert = (str: string): [string, Array<Array<TElementData<string>>>] => {

    // Массив снимков, каждый из которых содержит массив объектов описывающих состояние каждого элемента в обрабатываемом массиве
    const frameCollection: Array<Array<TElementData<string>>> = [];
    const origin = Array.from(str);

    let start = 0;
    let end = origin.length - 1;

    // Массивы индексов элементов у которых должны быть состояния changing и modified
    let changing: Array<number> = [];
    const modified: Array<number> = [];

    // Создаём первый снимок и добавляем в коллекцию
    frameCollection.push(getDefaultFrame(origin));

    // Логика реверса элементов строки
    while(start < end) {
        // Сохраняем индексы меняющихся элементов для последующего шага      
        changing = [start + 1, end - 1];

        // Меняем значения в массиве
        swap(origin, start, end);

        // Сохраняем индексы измененных элементов
        modified.push(start, end);

        // Создаем снимок с элементами которые будут меняться на следующем шаге и которые изменились на этом
        frameCollection.push(getMultyStatesFrame(origin, changing, modified))

        // Изменяем указатели элементов массива для следующей итерации
        start++;
        end--;        
    }

    // Создаем финальный снимок, где все элементы модифицированы
    frameCollection.push(getDefaultFrame(origin, ElementStates.Modified));

    return [origin.join(''), frameCollection];
}