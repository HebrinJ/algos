import React, { useEffect, useState, useRef } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import style from './stack-page.module.css'
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { Stack } from "../../utils/stack";

export const StackPage: React.FC = () => {

  const [currentStack, setCurrentStack] = useState<Array<any>>([]);
  const [input, setInput] = useState<string>('');
  const [isChanging, setIsChanging] = useState<boolean>(false);

  const stack = useRef<Stack<any>>(new Stack());

  useEffect(() => {
    if(isChanging) {
      setTimeout(() => {
        setIsChanging(false);
      }, SHORT_DELAY_IN_MS)
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
    setInput(origin);
  }

  const onClear = () => {
    stack.current = new Stack();
    setCurrentStack(stack.current.getStack().slice());
  }

  return (
    <SolutionLayout title="Стек">
      <div className={style.controlBox}>
        <Input type='text' maxLength={4} onChange={event => {onChange(event.currentTarget.value)}} value={input} />
        <Button text='Добавить' onClick={() => { push(input) }} disabled={isChanging}/>
        <Button text='Удалить' onClick={pop} />
        <Button text='Очистить' extraClass={style.clear} onClick={onClear}/>
      </div>
      <div className={style.animationBox}>
        {
          currentStack?.map((item, index) => {
            if(index === currentStack.length - 1 && isChanging) {
              return <div className={style.circleBox}>
                <p className={style.topText}>{'top'}</p>
                <Circle letter={item} state={ElementStates.Changing}/>
                <p>{index}</p>
              </div>              
            }

            if(index === currentStack.length - 1) {
              return <div className={style.circleBox}>
                <p className={style.topText}>{'top'}</p>
                <Circle letter={item}/>
                <p>{index}</p>
              </div> 
            }

            return <div className={style.circleBox}>
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
