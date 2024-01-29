import React, { useEffect, useState, useRef } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import style from './sorting-page.module.css'
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Direction } from "../../types/direction";
import { Column } from "../ui/column/column";
import { swap } from "../../utils/swap";
import { sortSelection } from "../../utils/sortSelection";
import { TSnapShot } from "../../utils/snapShot";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { ElementStates } from "../../types/element-states";
import { sortBubble } from "../../utils/sortBubble";

export const SortingPage: React.FC = () => {
  
  const [currentArray, setCurrentArray] = useState<Array<number>>([]);
  const [snapShotCollection, setSnapShotCollection] = useState<Record<number, TSnapShot<number>>>({})
  const [snapShot, setSnapShot] = useState<TSnapShot<number> | null>();
  const [isLoader, setLoader] = useState<boolean>(false);

  // 0 - Сортировка выбором, 0 - Сортировка пузырьком 
  const [sortType, setSortType] = useState<number>(0)

  const animationStep = useRef<number>(0);

  useEffect(() => {

    // Анимация не начиналась
    if (animationStep.current === 0) {
      return;
    }
    // Анимация в процессе
    else {
      setTimeout(() => {
        showAnimation();
      }, SHORT_DELAY_IN_MS)
    }

  }, [snapShot, snapShotCollection])

  const sort = (direction: Direction) => {
    animationStep.current = 0;
    setLoader(true);

    if (sortType === 0) {
      handleSortSelection(direction);
    } else if (sortType === 1) {
      handleSortBubble(direction);
    }
  }

  const handleSortBubble = (direction: Direction) => {

    const result = sortBubble(currentArray, direction);
    setCurrentArray(result[0])
    setSnapShotCollection(result[1]);
    showAnimation();
  }

  const handleSortSelection = (direction: Direction) => {

    const result = sortSelection(currentArray, direction);
    setCurrentArray(result[0]);
    setSnapShotCollection(result[1]);
    showAnimation();
  }

  const showAnimation = () => {

    // Устанавливаем снимок для анимации или сбрасываем анимацию если снимки кончились    
    if (snapShotCollection[animationStep.current]) {
      setSnapShot(snapShotCollection[animationStep.current]);
    } else {
      animationStep.current = 0;      
      setLoader(false);
    }

    // Увеличиваем шаг анимации, если снимки не закончились или устанавливаем шаг в 0 если что-то не так
    if (animationStep.current <= Object.keys(snapShotCollection).length) {
      animationStep.current++;
    } else {
      animationStep.current = 0;
    }
  }

  const randomArr = () => {
    const minArrLen = 3;
    const maxArrLen = 17;
    const arrLen = Math.floor(Math.random() * (maxArrLen - minArrLen + 1)) + minArrLen;

    const minNum = 0;
    const maxNum = 100;
    const newArray = [];
    for (let i = 0; i < arrLen; i++) {
      newArray.push(Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
    }

    setCurrentArray(newArray);
    setSnapShotCollection({});
    setSnapShot(null);
    animationStep.current = 0;
  }

  return (
    <SolutionLayout title="Сортировка массива">      
        <div className={style.controlBox}>
          <div className={style.selectors}>
            <RadioInput label='Выбор' name='sortType' onChange={() => setSortType(0)} />
            <RadioInput label='Пузырёк' name='sortType' onChange={() => setSortType(1)} />
          </div>
          <div className={style.sort}>
            <Button text='По возрастанию' sorting={Direction.Ascending} onClick={() => sort(Direction.Ascending)} isLoader={isLoader} />
            <Button text='По убыванию' sorting={Direction.Descending} onClick={() => sort(Direction.Descending)} isLoader={isLoader} />
          </div>
          <Button text='Новый массив' onClick={randomArr} isLoader={isLoader}/>
        </div>
        <div className={style.imageBox}>
          {animationStep.current && snapShot ?
            snapShot?.object.map((item, index) => {

              // Определяем статус текущего элемента массива
              let state: ElementStates = ElementStates.Default;
              if (snapShot.states.changing?.includes(index)) {
                state = ElementStates.Changing;
              } else if (snapShot.states.modified?.includes(index)) {
                state = ElementStates.Modified;
              }

              // Обработка последнего снимка. Все элементы должны стать Modified
              if (Object.keys(snapShotCollection).length - 1 === animationStep.current) {
                state = ElementStates.Modified;
              }

              return <Column index={item} state={state} />
            }) : currentArray.map((item) => {
              return <Column index={item} />
            })}
        </div>      
    </SolutionLayout>
  );
};
