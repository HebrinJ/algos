import React, { useCallback, useEffect, useRef, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { LinkedList, Node } from "../../utils/linkedList";
import { Circle } from "../ui/circle/circle";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { DELAY_IN_MS } from "../../constants/delays";
import style from './list-page.module.css';
import { TElementData, getElementForFrame } from "../../utils/frame";
import { ElementStates } from "../../types/element-states";

export const ListPage: React.FC = () => {

  const linkedList = useRef(new LinkedList([0, 34, 8, 1]));

  // Массив снимков, каждый из которых содержит массив объектов описывающих состояние каждого элемента в обрабатываемом массиве
  const frameCollection = useRef<Array<Array<TElementData<string>>>>([]);

  const [inputValue, setInputValue] = useState<string>();
  const [inputIndex, setInputIndex] = useState<string>();
  const [currentFrame, setCurrentFrame] = useState<Array<TElementData<string>> | null>(null);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false);

  useEffect(() => {

    const currentArray = setListToArray();
    setCurrentFrame(getDefaultFrame(currentArray));
    
  }, [])

  const fillFramePattern = (
    item: any,
    index: number,
    array: Array<any>,
    setHead: (item: string, index: number) => TElementData<string>,
    setTail: (item: string, index: number) => TElementData<string>,
    setExtra: null | ((item: string, index: number, extraIndex: number) => TElementData<string>) = null,
    extraIndex: number | undefined = undefined,
    saveChanges: boolean = false
    ) => {
      if(index === 0) {        
        return setHead(item, index);
      } else if (index === array.length - 1) {
        return setTail(item, index);
      }

      if(setExtra && extraIndex) {        
        if(extraIndex === index || (saveChanges && extraIndex >= index)) {
          return setExtra(item, index, extraIndex);
        }
      }

      return getElementForFrame<string>(item, index);
  }

  const getDefaultFrame = (array: Array<string>): Array<TElementData<string>> => {
    let frame: Array<TElementData<string>>;

    const setHead = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, 'head' );
    const setTail = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, null, 'tail' );   

    frame = array.map((item, index, array) => {
        return fillFramePattern(item, index, array, setHead, setTail);
    })

    return frame;
  }

  const showAnimation = useCallback(() => {
    
    const collectionSize = frameCollection.current.length;
    let step = 0;
    setCurrentFrame(frameCollection.current[step])
    
    let timeout = setInterval(() => {
      if(step < collectionSize) { 
        setCurrentFrame(frameCollection.current[step])
        step++;
      }
    }, DELAY_IN_MS)

    setTimeout(() => {
      clearInterval(timeout);
      frameCollection.current = [frameCollection.current[collectionSize - 1]];
    }, DELAY_IN_MS * collectionSize)

  }, []);

  const setListToArray = () => {
    let current = linkedList.current.getHead();

    const array = []
    while (current) {
      array.push(current.value.toString())
      current = current.next
    }
    
    return array;
  }

  const addToTail = () => {

    if(inputValue) {
      let frame: Array<TElementData<string>>;
      frameCollection.current = [];

      // Первый кадр состояния
      let setHead = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, 'head');
      let setTail = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Changing, <Circle letter={inputValue} state={ElementStates.Changing} isSmall={true}/>, 'tail' );   
      
      frame = setListToArray().map((item, index, array) => {        
        return fillFramePattern(item, index, array, setHead, setTail);
      })
      frameCollection.current.push(frame);

      // Изменение списка
      linkedList.current.addToTail(+inputValue);
      const newArray = setListToArray();

      // Второй кадр состояния
      setHead = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, 'head');
      setTail = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Modified, null, 'tail' );   

      frame = newArray.map((item, index, array) => {
        return fillFramePattern(item, index, array, setHead, setTail);
      })
      frameCollection.current.push(frame);

      // Последний кадр - значения по умолчанию
      frame = getDefaultFrame(newArray);
      frameCollection.current.push(frame);

      // Запуск покадровой анимации
      showAnimation();

      setInputValue('');
    }
  }

  const addToHead = () => {
    if(inputValue) {

      let frame: Array<TElementData<string>>;
      frameCollection.current = [];

      // Первый кадр состояния
      let setHead = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Changing, <Circle letter={inputValue} state={ElementStates.Changing} isSmall={true}/>);
      let setTail = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, null, 'tail' );   
      
      frame = setListToArray().map((item, index, array) => {        
        return fillFramePattern(item, index, array, setHead, setTail);
      })      
      frameCollection.current.push(frame);
      
      // Изменение списка
      linkedList.current.addToHead(+inputValue);
      const newArray = setListToArray();

      // Второй кадр состояния
      setHead = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Modified, 'head');
      setTail = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, null, 'tail' );   

      frame = newArray.map((item, index, array) => {
        return fillFramePattern(item, index, array, setHead, setTail);
      })
      frameCollection.current.push(frame);

      // Последний кадр - значения по умолчанию
      frame = getDefaultFrame(newArray);
      frameCollection.current.push(frame);

      // Запуск покадровой анимации
      showAnimation();

      setInputValue('');
    }    
  }

  const removeFromHead = () => {

    let frame: Array<TElementData<string>>;
    frameCollection.current = [];

    // Первый кадр состояния
    let setHead = (item: string, index: number) => getElementForFrame<string>('', index, ElementStates.Changing, 'head', <Circle letter={item} state={ElementStates.Changing} isSmall={true}/>);
    let setTail = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, null, 'tail' );   

    frame = setListToArray().map((item, index, array) => {
      return fillFramePattern(item, index, array, setHead, setTail);
    })
    frameCollection.current.push(frame);
    
    // Изменение списка
    linkedList.current.removeFromHead();
    const newArray = setListToArray();

    // Последний кадр - значения по умолчанию
    frame = getDefaultFrame(newArray);
    frameCollection.current.push(frame);

    // Запуск покадровой анимации
    showAnimation();
  }

  const removeFromTail = () => {

    let frame: Array<TElementData<string>>;
    frameCollection.current = [];

    // Первый кадр состояния
    let setHead = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, 'head' );
    let setTail = (item: string, index: number) => getElementForFrame<string>('', index, ElementStates.Changing, null, <Circle letter={item} state={ElementStates.Changing} isSmall={true}/> );   

    frame = setListToArray().map((item, index, array) => {
      return fillFramePattern(item, index, array, setHead, setTail);
    })
    frameCollection.current.push(frame);

    // Изменение списка
    linkedList.current.removeFromTail();
    const newArray = setListToArray();

    // Последний кадр - значения по умолчанию
    frame = getDefaultFrame(newArray);
    frameCollection.current.push(frame);

    // Запуск покадровой анимации
    showAnimation();
  }

  const removeAtIndex = () => {

    let frame: Array<TElementData<string>>;
    frameCollection.current = [];
    let currIndex = 0;

    if(inputIndex) {

      // Создаём кадры передвижения по массиву
      while(currIndex <= +inputIndex) {
        
        let setHead = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Changing, 'head' );
        let setTail = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, null, 'tail' );
        let setExtra = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Changing );

        frame = setListToArray().map((item, index, array) => {
          return fillFramePattern(item, index, array, setHead, setTail, setExtra, currIndex, true);
        })
        frameCollection.current.push(frame);

        currIndex++;
      }

      // Кадр с изменяемым элементом
      let setHead = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, 'head' );
      let setTail = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, null, 'tail' );
      let setExtra = (item: string, index: number) => getElementForFrame<string>('', index, ElementStates.Changing, null, <Circle letter={item} state={ElementStates.Changing} isSmall={true}/> );

      frame = setListToArray().map((item, index, array) => {
        return fillFramePattern(item, index, array, setHead, setTail, setExtra, +inputIndex);
      })
      frameCollection.current.push(frame);      

      linkedList.current.removeAt(+inputIndex);
      const newArray = setListToArray();

      // Кадр с измененным массивом
      frame = getDefaultFrame(newArray);
      frameCollection.current.push(frame); 

      showAnimation();
      setInputIndex('');
    }
  }

  const addAtIndex = () => {
    let frame: Array<TElementData<string>>;
    frameCollection.current = [];
    let currIndex = 0;

    if(inputIndex && inputValue) {

      // Создаём кадры передвижения по массиву
      while(currIndex <= +inputIndex) {
        
        let setHead = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Changing, 'head' );
        let setTail = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, null, 'tail' );
        let setExtra = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Changing );

        frame = setListToArray().map((item, index, array) => {
          return fillFramePattern(item, index, array, setHead, setTail, setExtra, currIndex, true);
        })
        frameCollection.current.push(frame);

        currIndex++;
      }

      // Кадр с изменяемым элементом
      let setHead = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, 'head' );
      let setTail = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, null, 'tail' );
      let setExtra = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Changing, <Circle letter={inputValue} state={ElementStates.Changing} isSmall={true}/>  );

      frame = setListToArray().map((item, index, array) => {
        return fillFramePattern(item, index, array, setHead, setTail, setExtra, +inputIndex);
      })
      frameCollection.current.push(frame); 

      linkedList.current.insertAt(+inputValue, +inputIndex);
      const newArray = setListToArray();

      // Кадр с измененным массивом
      frame = getDefaultFrame(newArray);
      frameCollection.current.push(frame); 

      showAnimation();

      setInputIndex('');
      setInputValue('');
    }    
  }

  const onInputValueChange = (origin: string) => {
    setInputValue(origin);
  }

  const onInputIndexChange = (origin: string) => {
    setInputIndex(origin);
  }

  return (
    <SolutionLayout title="Связный список">
      <div className={style.controlBox}>
        <div className={style.menu}>
          <Input value={inputValue} onChange={event => onInputValueChange(event.currentTarget.value) }/>
          <Button text='Добавить в head' onClick={addToHead} />
          <Button text='Добавить в tail' onClick={addToTail}/>
          <Button text='Удалить из head' onClick={removeFromHead}/>
          <Button text='Удалить из tail' onClick={removeFromTail}/>
        </div>
        <p>Максимум - 4 символа</p>
        <div className={style.menu}>
          <Input value={inputIndex} onChange={event => onInputIndexChange(event.currentTarget.value)} />
          <Button text='Добавить по индексу' onClick={addAtIndex}/>
          <Button text='Удалить по индексу' onClick={removeAtIndex}/>
        </div>
      </div>
      <div className={style.animationBox}>
        {          
          currentFrame?.map((item, index, array) => {
            const arrSize = array.length - 1;
            
            return <div className={style.circleContainer}>
              <Circle letter={item.value} index={index} head={item.upperData} tail={item.lowerData} state={item.state}/>
              {index !== arrSize && <ArrowIcon />}
            </div>
          })
        }
      </div>
    </SolutionLayout>
  );
};
