import React, { useEffect, useState, useRef } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { v4 as uuidv4 } from "uuid";
import { Stack } from "./stack";
import style from './stack-page.module.css'
import { SHORT_INPUT_LENGTH } from "../../constants/inputLength";

export const StackPage: React.FC = () => {

  const [currentStack, setCurrentStack] = useState<Array<any>>([]);
  const [input, setInput] = useState<string>('');
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const [isLoaderAdd, setIsLoaderAdd] = useState<boolean>(false);
  const [isLoaderRemove, setIsLoaderRemove] = useState<boolean>(false);
  const [addBtnDisable, setaddBtnDisable] = useState<boolean>(true);
  const [disableBtns, setDisableBtns] = useState<boolean>(false);

  const stack = useRef<Stack<any>>(new Stack());

  useEffect(() => {
    if(input.length !== 0) {
      setaddBtnDisable(false);
    } else {
      setaddBtnDisable(true);
    }
  }, [input])

  useEffect(() => {
    if(isChanging) {
      const timerId = setTimeout(() => {
        setDefaultButtonState(false);
      }, SHORT_DELAY_IN_MS)

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [isChanging])

  const push = (item: any) => {
    if (!item) return

    setIsChanging(true);
    setIsLoaderAdd(true);
    setDisableBtns(true);
    setInput('');
    
    stack.current.push(item);
    setCurrentStack(stack.current.getStack().slice());
  }

  const pop = () => {   

    if (stack) {
      setIsChanging(true);
      setIsLoaderRemove(true);
      setDisableBtns(true);

      setTimeout(() => {
        stack.current.pop();
        setCurrentStack(stack.current.getStack().slice());
      }, SHORT_DELAY_IN_MS);
    }
  }

  const setDefaultButtonState = (state: boolean) => {
      setIsChanging(state);
      setDisableBtns(state);
      setIsLoaderAdd(state);
      setIsLoaderRemove(state);
  }

  const onChange = (origin: string) => {
    if(input.length > 4) return;

    setInput(origin);
  }

  const onClear = () => {
    stack.current = new Stack();
    setCurrentStack(stack.current.getStack().slice());
  }

  return (
    <SolutionLayout title="Стек">
      <div className={style.controlBox}>
        <Input type='text' maxLength={SHORT_INPUT_LENGTH} isLimitText={true} onChange={event => {onChange(event.currentTarget.value)}} value={input} extraClass={style.input} />
        <Button text='Добавить' onClick={() => { push(input) }} isLoader={isLoaderAdd} disabled={addBtnDisable}/>
        <Button text='Удалить' onClick={pop} isLoader={isLoaderRemove} disabled={disableBtns}/>
        <Button text='Очистить' extraClass={style.clear} onClick={onClear} disabled={disableBtns}/>
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
