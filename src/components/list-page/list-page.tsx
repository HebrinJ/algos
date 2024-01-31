import React, { useEffect, useRef, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import style from './list-page.module.css'
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { LinkedList } from "../../utils/linkedList";
import { Circle } from "../ui/circle/circle";
import { ArrowIcon } from "../ui/icons/arrow-icon";

export const ListPage: React.FC = () => {

  const linkedList = useRef(new LinkedList([0, 34, 8, 1]));

  const [currentArray, setCurrentArray] = useState<Array<any>>([])
  const [inputValue, setInputValue] = useState<string>();
  const [inputIndex, setInputIndex] = useState<string>();

  useEffect(() => {
    getArrayElements();
  })

  const getArrayElements = () => {
    let current = linkedList.current.getHead();

    const array = []
    while (current) {
      array.push(current)
      current = current.next
    }

    setCurrentArray(array);
  }

  const addToTail = () => {
    if(inputValue) {
      linkedList.current.addToTail(+inputValue);
    }

    setInputValue('');
  }

  const addToHead = () => {
    if(inputValue) {      
      linkedList.current.addToHead(+inputValue);
    }

    setInputValue('');
  }

  const removeFromHead = () => {
    linkedList.current.removeFromHead();
  }

  const removeFromTail = () => {
    linkedList.current.removeFromTail();
  }

  const removeAtIndex = () => {
    if(inputIndex) {
      linkedList.current.removeAt(+inputIndex);
    }

    setInputIndex('');
  }

  const addAtIndex = () => {
    if(inputIndex && inputValue) {
      linkedList.current.insertAt(+inputValue, +inputIndex);
    }

    setInputIndex('');
  }

  const onInputValueChange = (origin: string) => {
    setInputValue(origin);
  }

  const onInputIndexChange = (origin: string) => {
    setInputIndex(origin);
  }

  const isHeadToRender = (index: number) => {
    if(index === 0) {
      return 'head';
    } else {
      return null;
    }
  }

  const isTailToRender = (index: number, arrSize: number) => {
    if(index === arrSize) {
      return 'tail';
    } else {
      return null;
    }
  }

  return (
    <SolutionLayout title="Связный список">
      <div className={style.controlBox}>
        <div className={style.menu}>
          <Input value={inputValue} onChange={event => onInputValueChange(event.currentTarget.value) }/>
          <Button text='Добавить в head' onClick={addToHead} />
          <Button text='Добавить в tail' onClick={addToTail}/>
          <Button text='Удалить из head' onClick={removeFromHead}/>
          <Button text='Удалить из tail' onClick={removeFromTail}/>
        </div>
        <p>Максимум - 4 символа</p>
        <div className={style.menu}>
          <Input value={inputIndex} onChange={event => onInputIndexChange(event.currentTarget.value)} />
          <Button text='Добавить по индексу' onClick={addAtIndex}/>
          <Button text='Удалить по индексу' onClick={removeAtIndex}/>
        </div>
      </div>
      <div className={style.animationBox}>
        {
          currentArray.map((item, index, array) => { 
            const arrSize = array.length - 1;

            return <div className={style.circleContainer}>
              <Circle letter={item.value.toString()} index={index} head={isHeadToRender(index)} tail={isTailToRender(index, arrSize)}/>
              {index !== arrSize && <ArrowIcon />}
            </div>
          })
        }
      </div>
    </SolutionLayout>
  );
};
