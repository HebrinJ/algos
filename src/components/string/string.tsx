import React, { useEffect, useRef, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import style from "./string.module.css"
import { Circle } from "../ui/circle/circle";
import { revert } from "../../utils/revert";
import { TSnapShot } from "../../utils/snapShot";
import { DELAY_IN_MS } from "../../constants/delays";
import { ElementStates } from "../../types/element-states";

export const StringComponent: React.FC = () => {

  const [input, setInput] = useState<string>('');
  const [snapShotCollection, setSnapShotCollection] = useState<Record<number, TSnapShot<string>>>({})
  const [snapShot, setSnapShot] = useState<TSnapShot<string>>();

  const animationStep = useRef<number>(0);

  useEffect(() => {
    
    // Анимация не начиналась
    if(animationStep.current === 0) {
      return;
    } 
    // Анимация в процессе
    else {      
      setTimeout(() => {
        showAnimation();
      }, DELAY_IN_MS)
    }

  }, [snapShot, snapShotCollection])

  const onChange = (origin: string) => {
    setInput(origin);
  }

  const revertInput = () => {
    let result = revert(input);
    setSnapShotCollection(result[1]);
    showAnimation();
  }

  const showAnimation = () => {
    // Устанавливаем снимок для анимации  
    if(snapShotCollection[animationStep.current]) {
      setSnapShot(snapShotCollection[animationStep.current]);
    }
    
    // Увеличиваем шаг анимации, если снимки не закончились
    if(animationStep.current <= Object.keys(snapShotCollection).length) {
      animationStep.current++;
    } else {
      animationStep.current = 0;
    }    
  }

  return (
    <SolutionLayout title="Строка">
      <div className={style.content}> 
        <div className={style.inputBox}>
          <Input maxLength={11} onChange={event => {onChange(event.currentTarget.value)}}/>
          <Button text='Развернуть' onClick={revertInput}></Button>
        </div>
        <p className={style.text}>Максимум - 11 символов</p>
        <div className={style.animationBox}>
          {snapShot?.object.map((item, index) => {

            // Определяем статус текущего элемента массива
            let state: ElementStates = ElementStates.Default;
            if(snapShot.states.changing?.includes(index)) {
              state = ElementStates.Changing;
            } else if (snapShot.states.modified?.includes(index)) {
              state = ElementStates.Modified;
            }

            // Обработка последнего снимка. Все элементы должны стать Modified
            if(Object.keys(snapShotCollection).length - 1 === animationStep.current) {
              state = ElementStates.Modified;
            }
            
            return <Circle letter={item} state={state}/>
          })}
        </div>
      </div>
    </SolutionLayout>
  );
};
