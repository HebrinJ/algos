import React, { useCallback, useEffect, useRef, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { LinkedList } from "./linkedList";
import { Circle } from "../ui/circle/circle";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { DELAY_IN_MS } from "../../constants/delays";
import { TElementData, getElementForFrame } from "../../utils/frame";
import { ElementStates } from "../../types/element-states";
import { v4 as uuidv4 } from "uuid";
import { BtnsTypes } from "../../utils/btnsTypes";
import style from './list-page.module.css';
import { SHORT_INPUT_LENGTH } from "../../constants/inputLength";

export const ListPage: React.FC = () => {

  const linkedList = useRef(new LinkedList([0, 34, 8, 1]));

  // Массив снимков, каждый из которых содержит массив объектов описывающих состояние каждого элемента в обрабатываемом массиве
  const frameCollection = useRef<Array<Array<TElementData<string>>>>([]);

  const [inputValue, setInputValue] = useState<string>('');
  const [inputIndex, setInputIndex] = useState<string>('');
  const [currentFrame, setCurrentFrame] = useState<Array<TElementData<string>> | null>(null);
  const [pressedBtn, setPressedBtn] = useState<BtnsTypes>(BtnsTypes.none);
  const [isAddValueBtnDisable, setIsAddValueBtnDisable] = useState<boolean>(false);
  const [isRemoveBtnDisable, setIsRemoveBtnDisable] = useState<boolean>(false);
  const [isIndxAddBtnDisable, setIsIndxAddBtnDisable] = useState<boolean>(false);
  const [isIndxRemoveBtnDisable, setIsIndxRemoveBtnDisable] = useState<boolean>(false);
  

  useEffect(() => {

    const currentArray = setListToArray();
    setCurrentFrame(getDefaultFrame(currentArray));
    setDefaultBtnsStates();
    
  }, [])

  const fillFramePattern = (
    item: any,
    index: number,
    array: Array<any>,
    setHead: (item: string, index: number) => TElementData<string>,
    setTail: (item: string, index: number) => TElementData<string>,
    setExtra: null | ((item: string, index: number, extraIndex: number) => TElementData<string>) = null,
    extraIndex: number | undefined = undefined,
    ) => {
      if(index === 0) {        
        return setHead(item, index);
      } else if (index === array.length - 1) {
        return setTail(item, index);
      }

      if(setExtra && extraIndex) {        
        if(extraIndex === index) {
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
    disableAllBtns(true);
    
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
      setDefaultBtnsStates();
      setPressedBtn(BtnsTypes.none);
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
      setPressedBtn(BtnsTypes.addToTail);

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
      setPressedBtn(BtnsTypes.addToHead);

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

    setPressedBtn(BtnsTypes.removeFromHead);

    let frame: Array<TElementData<string>>;
    frameCollection.current = [];

    // Первый кадр состояния
    const setHead = (item: string, index: number) => getElementForFrame<string>('', index, ElementStates.Changing, 'head', <Circle letter={item} state={ElementStates.Changing} isSmall={true}/>);
    const setTail = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, null, 'tail' );   

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

    setPressedBtn(BtnsTypes.removeFromTail);

    let frame: Array<TElementData<string>>;
    frameCollection.current = [];

    // Первый кадр состояния
    const setHead = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, 'head' );
    const setTail = (item: string, index: number) => getElementForFrame<string>('', index, ElementStates.Changing, null, <Circle letter={item} state={ElementStates.Changing} isSmall={true}/> );   

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

    if((linkedList.current.getSize() - 1) < +inputIndex) {
      console.log(linkedList.current.getSize() - 1)
      console.log(inputIndex)
      console.log('Некорректный индекс');
      return;
    }

    setPressedBtn(BtnsTypes.removeAtIndex);

    let frame: Array<TElementData<string>>;
    frameCollection.current = [];
    let currIndex = 0;

    if(inputIndex) {

      // Создаём кадры передвижения по массиву
      while(currIndex <= +inputIndex) {
        
        const setHead = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Changing, 'head' );
        const setTail = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, null, 'tail' );
        const setExtra = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Changing );

        frame = setListToArray().map((item, index, array) => {
          if(index < currIndex && index !== 0) {
            return getElementForFrame<string>(item, index, ElementStates.Changing);
          }

          return fillFramePattern(item, index, array, setHead, setTail, setExtra, currIndex);
        })
        frameCollection.current.push(frame);

        currIndex++;
      }

      // Кадр с изменяемым элементом
      const setHead = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, 'head' );
      const setTail = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, null, 'tail' );
      const setExtra = (item: string, index: number) => getElementForFrame<string>('', index, ElementStates.Changing, null, <Circle letter={item} state={ElementStates.Changing} isSmall={true}/> );

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

  const insertAtIndex = () => {

    if((linkedList.current.getSize() - 1) < +inputIndex) {
      console.log('Некорректный индекс');
      return;
    }

    setPressedBtn(BtnsTypes.insertAtIndex);

    let frame: Array<TElementData<string>>;
    frameCollection.current = [];
    let currIndex = 0;

    if(inputIndex && inputValue) {

      // Создаём кадры передвижения по массиву
      while(currIndex <= +inputIndex) {
        
        const setHead = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Changing, 'head' );
        const setTail = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, null, 'tail' );
        const setExtra = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, <Circle letter={inputValue} state={ElementStates.Changing} isSmall={true}/> );

        frame = setListToArray().map((item, index, array) => {
          if(index < currIndex && index !== 0) {
            return getElementForFrame<string>(item, index, ElementStates.Changing);
          }

          return fillFramePattern(item, index, array, setHead, setTail, setExtra, currIndex );
        })
        frameCollection.current.push(frame);

        currIndex++;
      }

      // Кадр с изменяемым элементом
      const setHead = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, 'head' );
      const setTail = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Default, null, 'tail' );
      const setExtra = (item: string, index: number) => getElementForFrame<string>(item, index, ElementStates.Changing, <Circle letter={inputValue} state={ElementStates.Changing} isSmall={true}/>  );

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

    (origin.length > SHORT_INPUT_LENGTH || origin === '') ? setIsAddValueBtnDisable(true) : setIsAddValueBtnDisable(false);    
    setInputValue(origin);
  }

  const onInputIndexChange = (origin: string) => {
    // Удаление активно если индекс не пустой и в диапазоне
    (+origin >= linkedList.current.getSize() || origin === '') ? setIsIndxRemoveBtnDisable(true) : setIsIndxRemoveBtnDisable(false);

    // Добавление активно, если индекс не пустой, в диапазоне и есть значение в верхнем поле ввода
    if(+origin < linkedList.current.getSize() && origin !== '') {
      if(inputValue.length > 0) {
        setIsIndxAddBtnDisable(false);
      }      
    } else {
      setIsIndxAddBtnDisable(true);
    }

    setInputIndex(origin);
  }

  const setLoader = (type: BtnsTypes) => {
    if(type === pressedBtn) {
      return true;
    }

    return false;
  }

  const disableAllBtns = (state: boolean) => {
    setIsAddValueBtnDisable(state);
    setIsRemoveBtnDisable(state);
    setIsIndxRemoveBtnDisable(state);
    setIsIndxAddBtnDisable(state);
  }

  const setDefaultBtnsStates = () => {
    setIsAddValueBtnDisable(true);
    setIsIndxRemoveBtnDisable(true);
    setIsIndxAddBtnDisable(true);
    setIsRemoveBtnDisable(false);
  }

  return (
    <SolutionLayout title="Связный список">
      <div className={style.controlBox}>
        <div className={style.menu}>
          <Input maxLength={SHORT_INPUT_LENGTH} isLimitText={true} value={inputValue} onChange={event => onInputValueChange(event.currentTarget.value)} extraClass={style.input}/>
          <Button text='Добавить в head' onClick={addToHead} isLoader={setLoader(BtnsTypes.addToHead)} disabled={isAddValueBtnDisable} extraClass={style.upBtn}/>
          <Button text='Добавить в tail' onClick={addToTail} isLoader={setLoader(BtnsTypes.addToTail)} disabled={isAddValueBtnDisable} extraClass={style.upBtn}/>
          <Button text='Удалить из head' onClick={removeFromHead} isLoader={setLoader(BtnsTypes.removeFromHead)} disabled={isRemoveBtnDisable} extraClass={style.upBtn}/>
          <Button text='Удалить из tail' onClick={removeFromTail} isLoader={setLoader(BtnsTypes.removeFromTail)} disabled={isRemoveBtnDisable} extraClass={style.upBtn}/>
        </div>
        <div className={style.menu}>
          <Input value={inputIndex} onChange={event => onInputIndexChange(event.currentTarget.value)} extraClass={style.input} />
          <Button text='Добавить по индексу' onClick={insertAtIndex} isLoader={setLoader(BtnsTypes.insertAtIndex)} disabled={isIndxAddBtnDisable} extraClass={style.dnBtn}/>
          <Button text='Удалить по индексу' onClick={removeAtIndex} isLoader={setLoader(BtnsTypes.removeAtIndex)} disabled={isIndxRemoveBtnDisable} extraClass={style.dnBtn}/>
        </div>
      </div>
      <div className={style.animationBox}>
        {          
          currentFrame?.map((item, index, array) => {
            const arrSize = array.length - 1;
            
            return <div key={uuidv4()} className={style.circleContainer}>
              <Circle letter={item.value} index={index} head={item.upperData} tail={item.lowerData} state={item.state}/>
              {index !== arrSize && <ArrowIcon />}
            </div>
          })
        }
      </div>
    </SolutionLayout>
  );
};
