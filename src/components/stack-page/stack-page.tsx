import React, { useEffect, useState, useRef } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { v4 as uuidv4 } from "uuid";
import { Stack } from "../../utils/stack";
import style from './stack-page.module.css'

export const StackPage: React.FC = () => {

  const [currentStack, setCurrentStack] = useState<Array<any>>([]);
  const [input, setInput] = useState<string>('');
  const [isChanging, setIsChanging] = useState<boolean>(false);

  const stack = useRef<Stack<any>>(new Stack());

  useEffect(() => {
    if(isChanging) {
      const timerId = setTimeout(() => {
        setIsChanging(false);
      }, SHORT_DELAY_IN_MS)

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [isChanging])

  const push = (item: any) => {
    if (!item) return

    setIsChanging(true);
    setInput('');
    
    stack.current.push(item);
    setCurrentStack(stack.current.getStack().slice());
  }

  const pop = () => {

    if (stack) {
      setIsChanging(true)

      setTimeout(() => {
        stack.current.pop();
        setCurrentStack(stack.current.getStack().slice());
      }, SHORT_DELAY_IN_MS);
    }
  }

  const onChange = (origin: string) => {
    if(input.length > 4) return;

    setInput(origin);
  }

  const onClear = () => {
    stack.current = new Stack();
    setCurrentStack(stack.current.getStack().slice());
  }

  const buttonState = (): boolean => {
    for (let i = 0; i < currentStack.length; i++) {
      if(currentStack[i] !== null) {
        return false;
      }      
    }

    return true;
  }

  return (
    <SolutionLayout title="Стек">
      <div className={style.controlBox}>
        <Input type='text' maxLength={4} isLimitText={true} onChange={event => {onChange(event.currentTarget.value)}} value={input} extraClass={style.input} />
        <Button text='Добавить' onClick={() => { push(input) }} disabled={isChanging}/>
        <Button text='Удалить' onClick={pop} disabled={buttonState()}/>
        <Button text='Очистить' extraClass={style.clear} onClick={onClear} disabled={buttonState()}/>
      </div>
      <div className={style.animationBox}>
        {
          currentStack?.map((item, index) => {
            if(index === currentStack.length - 1 && isChanging) {
              return <div key={uuidv4()} className={style.circleBox}>
                <p className={style.topText}>{'top'}</p>
                <Circle letter={item} state={ElementStates.Changing}/>
                <p>{index}</p>
              </div>              
            }

            if(index === currentStack.length - 1) {
              return <div key={uuidv4()} className={style.circleBox}>
                <p className={style.topText}>{'top'}</p>
                <Circle letter={item}/>
                <p>{index}</p>
              </div> 
            }

            return <div key={uuidv4()} className={style.circleBox}>
              <p className={style.topText}></p>
              <Circle letter={item}/>
              <p>{index}</p>
            </div>
          })
        }
      </div>
    </SolutionLayout>
  );
};
