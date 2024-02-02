import { ReactElement } from "react";
import { ElementStates } from "../types/element-states"

export enum ExtraPosition {
    Up,
    Down,
    None,
}

export type TElementData<T> = {    
    value: T;
    index: number;
    state?: ElementStates;
    upperData?: string | ReactElement | null ;
    lowerData?: string | ReactElement | null ;
    extraIndex?: number | undefined;
}

export const getElementForFrame = <T>(
    value: T,
    index: number,
    state: ElementStates = ElementStates.Default,
    upperData: string | ReactElement | null = null,
    lowerData: string | ReactElement | null = null,
    extraIndex: number | undefined = undefined,
    ): TElementData<T> => {
                                        
    return {
        value,
        index,
        state,
        upperData,
        lowerData,
        extraIndex,
    }
}

export const getDefaultFrame = <T>(array: Array<T>, state: ElementStates = ElementStates.Default): Array<TElementData<T>> => {
    let frame: Array<TElementData<T>>;

    frame = array.map((item, index) => {
        return getElementForFrame(item, index, state);
    })

    return frame;
}

export const getMultyStatesFrame = <T>(originArray: Array<T>, arrChangesIndexes: Array<number>, arrModifiedIndexes: Array<number>): Array<TElementData<T>> => {
    let frame: Array<TElementData<T>>;

    frame = originArray.map((item, index) => {
        if(arrChangesIndexes.includes(index)) {
            return getElementForFrame<T>(item, index, ElementStates.Changing)
        } else if (arrModifiedIndexes.includes(index)) {
            return getElementForFrame<T>(item, index, ElementStates.Modified)
        }

        return getElementForFrame<T>(item, index)
    })

    return frame;
}
