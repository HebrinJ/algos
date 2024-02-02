import React, { useRef, useState, useEffect } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import style from './fibonacci-page.module.css'
import { fibonacchi } from "../../utils/fibon";
import { DELAY_IN_MS } from "../../constants/delays";
import { Circle } from "../ui/circle/circle";

export const FibonacciPage: React.FC = () => {

  const [input, setInput] = useState<number>(0);
  const [currentStepArray, setCurrentStepArray] = useState<Array<number>>([]);
  const [isLoader, setLoader] = useState<boolean>(false);

  const cash = useRef<Record<number, number>>({ 0: 0, 1: 1 });
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

  }, [currentStepArray]);

  const onChange = (origin: string) => {
    console.log(+origin);
    +origin <= 19 ? setInput(+origin) : setInput(19);
    
    if(+origin < 0) setInput(0);
  }

  // Вычисляем Фибоначчи и сохраняем список промежуточных чисел в cash
  const count = () => {
    cash.current = { 0: 0, 1: 1 };
    fibonacchi(input, cash.current);
    setLoader(true);
    showAnimation();
  }

  const showAnimation = () => {
    const array = []

    // Добавляем значения текущего шага анимации в массив из кэша
    for (const key in cash.current) {      
      if(animationStep.current >= +key) {
        array.push(cash.current[+key]);
      }
    }

    setCurrentStepArray(array);

    // Увеличиваем шаг анимации, если кэш не закончился
    if(animationStep.current <= Object.keys(cash.current).length - 1) {
      animationStep.current++;
    } else {
      animationStep.current = 0;
      setLoader(false);
    }
  }

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <div className={style.content}> 
        <div className={style.inputBox}>
          <Input value={input} type={'number'} max={19} isLimitText={true} onChange={event => {onChange(event.currentTarget.value)}}/>
          <Button text='Рассчитать' onClick={count} isLoader={isLoader}></Button>
        </div>
        <div className={style.animationBox}>
          {             
            currentStepArray?.map((item, index) => {
              return <div className={style.circleBox}>
                <Circle letter={item.toString()} />
                <p>{index}</p>
              </div>              
            })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
