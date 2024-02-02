import React, { useEffect, useState, useRef } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import style from './sorting-page.module.css'
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Direction } from "../../types/direction";
import { Column } from "../ui/column/column";
import { sortSelection } from "../../utils/sortSelection";
import { TSnapShot } from "../../utils/snapShot";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { ElementStates } from "../../types/element-states";
import { sortBubble } from "../../utils/sortBubble";

export const SortingPage: React.FC = () => {
  
  const [currentArray, setCurrentArray] = useState<Array<number>>([]);
  const [sortedArray, setSortedArray] = useState<Array<number>>([]);
  const [snapShotCollection, setSnapShotCollection] = useState<Record<number, TSnapShot<number>>>({})
  const [snapShot, setSnapShot] = useState<TSnapShot<number> | null>();
  //const [isLoader, setLoader] = useState<boolean>(false);
  const [isAnimationEnd, setIsAnimationEnd] = useState<boolean>(false);
  const [ascLoader, setAscLoader] = useState<boolean>(false);
  const [dscLoader, setDscLoader] = useState<boolean>(false);
  const [disableBtn, setDisableBtn] = useState<boolean>(false);

  // 0 - Сортировка выбором, 0 - Сортировка пузырьком 
  const [sortType, setSortType] = useState<number>(0)

  const animationStep = useRef<number>(-1);

  useEffect(() => {

    // Анимация не начиналась или уже закончилась
    if (animationStep.current === -1) {
      return;
    }

    // Анимация завершена
    if (animationStep.current > Object.keys(snapShotCollection).length) {
      setIsAnimationEnd(true);
      animationStep.current = -1;
      //setLoader(false);
      setDisableBtn(false);
      setAscLoader(false);
      setDscLoader(false);
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
    setDisableBtn(true);
    //setLoader(true);
    if(direction === Direction.Ascending) {
      setAscLoader(true);
    } else {
      setDscLoader(true);
    }

    if (sortType === 0) {
      handleSortSelection(direction);
    } else if (sortType === 1) {
      handleSortBubble(direction);
    }
  }

  const handleSortBubble = (direction: Direction) => {
    
    const result = sortBubble(currentArray, direction);
    setSnapShotCollection(result[1]);
    setSortedArray(result[0].slice())
    showAnimation();
    
  }

  const handleSortSelection = (direction: Direction) => {
    
    const result = sortSelection(currentArray, direction);
    setSnapShotCollection(result[1]);
    setSortedArray(result[0].slice())
    showAnimation();
  }
  
  const showAnimation = () => {
    
    // Устанавливаем текущий кадр для анимации
    setSnapShot(snapShotCollection[animationStep.current]);

    // Увеличиваем шаг
    animationStep.current++

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
    setSortedArray([]);
    setSnapShotCollection({});
    setSnapShot(null);
    resetAnimation();
  }

  const getArrayToRender = () => {
    
    if(isAnimationEnd) {
      return sortedArray;
    } else {
      return currentArray;
    }
  }

  const resetAnimation = () => {
    animationStep.current = -1;
    setIsAnimationEnd(false);
  }

  return (
    <SolutionLayout title="Сортировка массива">      
        <div className={style.controlBox}>
          <div className={style.selectors}>
            <RadioInput label='Выбор' name='sortType' onChange={() => setSortType(0)} disabled={disableBtn} checked={sortType === 0} />
            <RadioInput label='Пузырёк' name='sortType' onChange={() => setSortType(1)} disabled={disableBtn} checked={sortType === 1} />
          </div>
          <div className={style.sort}>
            <Button text='По возрастанию' sorting={Direction.Ascending} onClick={() => sort(Direction.Ascending)} isLoader={ascLoader} disabled={disableBtn}/>
            <Button text='По убыванию' sorting={Direction.Descending} onClick={() => sort(Direction.Descending)} isLoader={dscLoader} disabled={disableBtn}/>
          </div>
          <Button text='Новый массив' onClick={randomArr} disabled={disableBtn}/>
        </div>
        <div className={style.imageBox}>
          {
            animationStep.current !== -1 && snapShot ?
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
            }) : getArrayToRender().map((item) => {
              if(isAnimationEnd) {
                return <Column index={item} state={ElementStates.Modified}/>
              } else {
                return <Column index={item} state={ElementStates.Default}/>
              }
            })}
        </div>      
    </SolutionLayout>
  );
};
