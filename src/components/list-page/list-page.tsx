import React, { useRef, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import style from './list-page.module.css'
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { LinkedList } from "../../utils/linkedList";
import { Circle } from "../ui/circle/circle";

export const ListPage: React.FC = () => {

  const linkedList = useRef(new LinkedList([0, 34, 8, 1]));

  const [inputValue, setInputValue] = useState<string>();
  const [inputIndex, setInputIndex] = useState<string>();

  const getArrayElements = () => {
    let current = linkedList.current.getHead();

    const array = []
    while (current) {
      array.push(current)
      current = current.next
    }

    return array;
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
          getArrayElements().map((item) => {
            return <Circle letter={item.value.toString()}/>
          })
        }
      </div>
    </SolutionLayout>
  );
};
