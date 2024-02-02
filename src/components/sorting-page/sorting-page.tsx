import React, { useState, useRef, useCallback } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Direction } from "../../types/direction";
import { Column } from "../ui/column/column";
import { sortSelection } from "../../utils/sortSelection";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { sortBubble } from "../../utils/sortBubble";
import { v4 as uuidv4 } from "uuid";
import { TElementData, getDefaultFrame } from "../../utils/frame";
import style from "./sorting-page.module.css"

export const SortingPage: React.FC = () => {
  
  const [currentArray, setCurrentArray] = useState<Array<number>>([]);
  const [ascLoader, setAscLoader] = useState<boolean>(false);
  const [dscLoader, setDscLoader] = useState<boolean>(false);
  const [disableBtn, setDisableBtn] = useState<boolean>(false);
  const [currentFrame, setCurrentFrame] = useState<Array<TElementData<number>> | null>(null);

  // 0 - Сортировка выбором, 0 - Сортировка пузырьком 
  const [sortType, setSortType] = useState<number>(0);
  const frameCollection = useRef<Array<Array<TElementData<number>>>>([]);

  const sort = (direction: Direction) => {
    setDisableBtn(true);

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
    frameCollection.current = result[1];
    
    showAnimation();    
  }

  const handleSortSelection = (direction: Direction) => {
    
    const result = sortSelection(currentArray, direction);
    frameCollection.current = result[1];

    showAnimation();
  }

  const showAnimation = useCallback(() => {
    
    const collectionSize = frameCollection.current.length;
    let step = 0;
    setCurrentFrame(frameCollection.current[step])
    
    let timeout = setInterval(() => {
      if(step < collectionSize) { 
        setCurrentFrame(frameCollection.current[step])
        step++;
      }
    }, SHORT_DELAY_IN_MS)

    setTimeout(() => {
      clearInterval(timeout);
      frameCollection.current = [frameCollection.current[collectionSize - 1]];
      setDisableBtn(false);
      setAscLoader(false);
      setDscLoader(false);
    }, SHORT_DELAY_IN_MS * collectionSize)

  }, []);

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
    
    setCurrentFrame(getDefaultFrame(newArray));

    setCurrentArray(newArray);
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
            currentFrame?.map((item) => {              
              return <div key={uuidv4()} className={style.circleContainer}>
                <Column index={item.value} state={item.state}/>
              </div>
            })
          }
        </div>      
    </SolutionLayout>
  );
};
