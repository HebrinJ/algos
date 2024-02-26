import React, { useRef, useState, useCallback, useEffect } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { revert } from "./revert";
import { DELAY_IN_MS } from "../../constants/delays";
import { TElementData } from "../../utils/frame";
import { v4 as uuidv4 } from "uuid";
import style from "./string.module.css"
import { LONG_INPUT_LENGTH } from "../../constants/inputLength";

export const StringComponent: React.FC = () => {

  const [input, setInput] = useState<string>('');
  const [isLoader, setLoader] = useState<boolean>(false);
  const [isDisabled, setDisabled] = useState<boolean>(true);
  const [currentFrame, setCurrentFrame] = useState<Array<TElementData<string>> | null>(null);

  const frameCollection = useRef<Array<Array<TElementData<string>>>>([]);

  useEffect(() => {

    setDisabled(input.length === 0);
    
  }, [input])

  const onChange = (origin: string) => {
    if (input.length > 11) return;

    setInput(origin);
  }

  const revertInput = () => {
    let result = revert(input);
    frameCollection.current = result[1];
    showAnimation();
    setLoader(true);
    setInput('');
  }

  const showAnimation = useCallback(() => {

    const collectionSize = frameCollection.current.length;
    let step = 0;
    setCurrentFrame(frameCollection.current[step])
    let timeout = setInterval(() => {

      if (step < collectionSize) {
        setCurrentFrame(frameCollection.current[step])
        step++;
      }
    }, DELAY_IN_MS)

    setTimeout(() => {
      clearInterval(timeout);
      frameCollection.current = [frameCollection.current[collectionSize - 1]]
      setLoader(false);
    }, DELAY_IN_MS * collectionSize)

  }, []);

  return (
    <SolutionLayout title="Строка">
      <div className={style.content}>
        <div className={style.inputBox}>
          <Input value={input} type='text' isLimitText={true} maxLength={LONG_INPUT_LENGTH} onChange={event => { onChange(event.currentTarget.value) }} />
          <Button text='Развернуть' onClick={revertInput} isLoader={isLoader} disabled={isDisabled}></Button>
        </div>
        <div className={style.animationBox}>
          {
            currentFrame?.map((item, index) => {
              return <div key={uuidv4()} className={style.circleContainer}>
                <Circle letter={item.value} index={index} head={item.upperData} tail={item.lowerData} state={item.state} />
              </div>
            })
          }
        </div>
      </div>
    </SolutionLayout>
  );
};

