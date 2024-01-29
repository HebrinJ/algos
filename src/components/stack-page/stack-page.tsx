import React, { useEffect, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import style from './stack-page.module.css'
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

export const StackPage: React.FC = () => {

  const [stack, setStack] = useState<Array<any> | null>(null);
  const [input, setInput] = useState<string>('');
  const [isChanging, setIsChanging] = useState<boolean>(false);

  useEffect(() => {
    if(isChanging) {
      setTimeout(() => {
        setIsChanging(false);
      }, SHORT_DELAY_IN_MS)
    }
  }, [isChanging])

  const push = (item: any) => {
    if (!item) return

    setIsChanging(true)
    if (stack) {
      const tmp = stack.slice();
      tmp.push(item);
      setStack(tmp);
    } else {
      const tmp = [item];
      setStack(tmp);
    }

  }

  const pop = () => {

    if (stack) {
      setIsChanging(true)

      setTimeout(() => {
        const tmp = stack.slice();
        tmp.pop();
  
        setStack(tmp);
      }, SHORT_DELAY_IN_MS)      
    }
  }

  const onChange = (origin: string) => {
    setInput(origin);
  }

  const onClear = () => {
    setStack(null);
  }

  return (
    <SolutionLayout title="Стек">
      <div className={style.controlBox}>
        <Input type='text' maxLength={4} onChange={event => {onChange(event.currentTarget.value)}}/>
        <Button text='Добавить' onClick={() => { push(input) }} />
        <Button text='Удалить' onClick={pop} />
        <Button text='Очистить' extraClass={style.clear} onClick={onClear}/>
      </div>
      <div className={style.animationBox}>
        {
          stack?.map((item, index) => {
            if(index === stack.length - 1 && isChanging) {
              return <div className={style.circleBox}>
                <p className={style.topText}>{'top'}</p>
                <Circle letter={item} state={ElementStates.Changing}/>
                <p>{index}</p>
              </div>              
            }

            if(index === stack.length - 1) {
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
