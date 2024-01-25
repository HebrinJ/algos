import React, { useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import style from './sorting-page.module.css'
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Direction } from "../../types/direction";
import { Column } from "../ui/column/column";

export const SortingPage: React.FC = () => {

  const [direction, setDirection] = useState<Direction>(Direction.Ascending);
  const [currentArray, setCurrentArray] = useState<Array<number>>([]);

  // 0 - Сортировка выбором, 1 - Сортировка пузырьком
  const [sortType, setSortType] = useState<number>(0)

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
  }

  return (
    <SolutionLayout title="Сортировка массива">
      <div className={style.content}>
        <div className={style.controlBox}>          
          <RadioInput label='Выбор' name='sortType' onChange={() => setSortType(0)}/>
          <RadioInput label='Пузырёк' name='sortType' onChange={() => setSortType(1)}/>          
          <Button text='По возрастанию' sorting={Direction.Ascending} onClick={() => {setDirection(Direction.Ascending)}}/>
          <Button text='По убыванию' sorting={Direction.Descending} onClick={() => {setDirection(Direction.Descending)}}/>
          <Button text='Новый массив' onClick={randomArr}/>
        </div>
        <div className={style.imageBox}>
          {
            currentArray.map((item) => {
              return <Column index={item}/>
            })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
