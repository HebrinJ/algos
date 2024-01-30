import React, { useEffect, useRef, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import style from './queue-page.module.css';
import { Queue } from "../../utils/queue";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

export const QueuePage: React.FC = () => {

  //const [queue, setQueue] = useState<Queue<number>>(new Queue<number>(7));
  const [currentArray, setCurrentArray] = useState<Array<any>>([]);
  const [input, setInput] = useState<string>('')
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [isRemove, setIsRemove] = useState<boolean>(false);

  const queue = useRef(new Queue<number>(7));

  useEffect(() => {
    const newArray = queue.current.getAllQueue();

    setCurrentArray(newArray.slice());    
  }, [])

  useEffect(() => {
    if(isAdd || isRemove) {
      setTimeout(() => {
        setIsAdd(false);
        setIsRemove(false);
      }, SHORT_DELAY_IN_MS)
    }
  }, [isAdd, isRemove])

  const onChange = (origin: string) => {
    setInput(origin);
  }
  
  const add = () => {
    queue.current.enqueue(+input);

    const newArray = queue.current.getAllQueue();
    setCurrentArray(newArray);
    clearInput();
    setIsAdd(true);
  }

  const remove = () => {
    setIsRemove(true);

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
  }

  const clearInput = () => {
    setInput('');
  }

  const buttonState = (): boolean => {
    for (let i = 0; i < currentArray.length; i++) {
      if(currentArray[i] !== null) {
        return false;
      }      
    }

    return true;
    // if(currentArray.length === 0) {
    //   return true;
    // } else {
    //   return false;
    // }
  }

  return (
    <SolutionLayout title="Очередь">
      <div className={style.controlBox}>
        <Input type='text' maxLength={4} onChange={event => { onChange(event.currentTarget.value) }} value={input} />
        <Button text='Добавить' onClick={add} disabled={!input} />
        <Button text='Удалить' onClick={remove} disabled={buttonState()} />
        <Button text='Очистить' extraClass={style.clear} onClick={clearQueue} disabled={buttonState()} />
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
              
              return <div className={style.circleBox}>
                {isHead ? <p className={style.topText}>head</p> : <p className={style.topText}></p>}
                <Circle letter={item?.toString()} state={state}/>
                <p>{index}</p>
                {isTail ? <p className={style.topText}>tail</p> : <p className={style.topText}></p>} 
              </div>
            } else {
              return <div className={style.circleBox}>
                <p className={style.topText}></p>
                <Circle />
                <p>{index}</p>
                <p className={style.topText}></p>
              </div>
            }
          })
        }
      </div>
    </SolutionLayout>
  );
};
