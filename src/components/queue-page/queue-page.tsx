import React, { useEffect, useRef, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Queue } from "./queue";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { v4 as uuidv4 } from "uuid";
import style from './queue-page.module.css';
import { SHORT_INPUT_LENGTH } from "../../constants/inputLength";

export const QueuePage: React.FC = () => {
  
  const [currentArray, setCurrentArray] = useState<Array<any>>([]);
  const [input, setInput] = useState<string>('');
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [isRemove, setIsRemove] = useState<boolean>(false);
  const [endStack, setEndStack] = useState<boolean>(false);
  const [isLoaderAdd, setIsLoaderAdd] = useState<boolean>(false);
  const [isLoaderRemove, setIsLoaderRemove] = useState<boolean>(false);
  const [disableBtns, setDisableBtns] = useState<boolean>(false);

  const queue = useRef(new Queue<number>(7));

  useEffect(() => {
    const newArray = queue.current.getAllQueue();
    setCurrentArray(newArray.slice());    
  }, [])

  useEffect(() => {
    if(isAdd || isRemove) {
      const timerId = setTimeout(() => {
        setDefaultButtonState(false);
        setIsAdd(false);
        setIsRemove(false);
      }, SHORT_DELAY_IN_MS)

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [isAdd, isRemove])

  const onChange = (origin: string) => {
    if(input.length > 4) return;

    setInput(origin);
  }
  
  const add = () => {

    queue.current.enqueue(+input);

    const newArray = queue.current.getAllQueue();
    setCurrentArray(newArray);
    clearInput();
    setIsAdd(true);
    setDisableBtns(true);
    setIsLoaderAdd(true);

    if((queue.current.getTail() - 1) >= 6) {
      console.log('Превышен индекс');
      setEndStack(true);
    }
  }

  const remove = () => {
    setIsRemove(true);
    setDisableBtns(true);
    setIsLoaderRemove(true);

    setTimeout(() => {
      queue.current.dequeue();

    const newArray = queue.current.getAllQueue();
    setCurrentArray(newArray.slice());
    }, SHORT_DELAY_IN_MS)   
    
  }

  const clearQueue = () => {
    queue.current = new Queue<number>(7);
    const newArray = queue.current.getAllQueue();

    setCurrentArray(newArray.slice());
    setEndStack(false);
  }

  const clearInput = () => {
    setInput('');
  }

  const setDefaultButtonState = (state: boolean) => {
    setDisableBtns(state);
    setIsLoaderAdd(state);
    setIsLoaderRemove(state);
}

  return (
    <SolutionLayout title="Очередь">
      <div className={style.controlBox}>
        <Input type='text' maxLength={SHORT_INPUT_LENGTH} isLimitText={true} onChange={event => { onChange(event.currentTarget.value) }} value={input} extraClass={style.input} />
        <Button text='Добавить' onClick={add} isLoader={isLoaderAdd} disabled={!input || endStack} />
        <Button text='Удалить' onClick={remove} isLoader={isLoaderRemove} disabled={disableBtns} />
        <Button text='Очистить' extraClass={style.clear} onClick={clearQueue} disabled={disableBtns} />
      </div>
      <div className={style.animationBox}>
        {
          currentArray.map((item, index) => {
            const head = queue.current.getHead();
            const tail = queue.current.getTail() - 1;
            let state = ElementStates.Default;

            if(item) {
              let isHead = false;
              let isTail = false;

              if(head === index) {
                isHead = true;
              }
              if(tail === index) {
                isTail = true;
              }
              if(index === head && isRemove || index === tail && isAdd) {
                state = ElementStates.Changing;
              }
              
              return <div key={uuidv4()} className={style.circleBox}>                
                <Circle letter={item?.toString()} state={state} index={index} head={isHead ? 'head' : ''} tail={isTail ? 'tail' : ''}/>
              </div>
            } else {
              return <div key={uuidv4()} className={style.circleBox}>
                <Circle index={index} />
              </div>
            }
          })
        }
      </div>
    </SolutionLayout>
  );
};
