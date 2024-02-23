import React, { useRef, useState, useEffect } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { getFibonacciNumbers } from "./fibon";
import { DELAY_IN_MS } from "../../constants/delays";
import { Circle } from "../ui/circle/circle";
import { v4 as uuidv4 } from "uuid";
import style from "./fibonacci-page.module.css";
import { MAX_INPUT_VALUE, MIN_INPUT_VALUE } from "../../constants/inputLength";

export const FibonacciPage: React.FC = () => {

  const [input, setInput] = useState<number | undefined>();
  const [currentStepArray, setCurrentStepArray] = useState<Array<number>>([]);
  const [isDisabled, setDisabled] = useState<boolean>(true);
  const [isLoader, setLoader] = useState<boolean>(false);

  const cash = useRef<Record<number, number>>({ 0: 0, 1: 1 });
  const animationStep = useRef<number>(0);

  useEffect(() => {
    if(input && input >= 0 && input <= 19) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [input])

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
    
    +origin <= 19 ? setInput(+origin) : setInput(19);

    if(+origin < 0) setInput(0);
    
  }

  // Вычисляем Фибоначчи и сохраняем список промежуточных чисел в cash
  const count = () => {
    if(input) {
      const arr = getFibonacciNumbers(input);

      cash.current = {};
      for (let i = 0; i < arr.length; i++) {       
        cash.current[i] = arr[i];
      }

      setLoader(true);
      showAnimation();
    }    
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
          <Input value={input} type={'number'} min={MIN_INPUT_VALUE} max={MAX_INPUT_VALUE} isLimitText={true} placeholder='Выберите число' onChange={event => {onChange(event.currentTarget.value)}}/>
          <Button text='Рассчитать' onClick={count} isLoader={isLoader} disabled={isDisabled}></Button>
        </div>
        <div className={style.animationBox}>
          {             
            currentStepArray?.map((item, index) => {
              return <div key={uuidv4()} className={style.circleBox}>
                <Circle letter={item.toString()} index={index}/>
              </div>              
            })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};
