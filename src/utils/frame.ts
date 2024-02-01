import { ReactElement } from "react";
import { ElementStates } from "../types/element-states"

export enum ExtraPosition {
    Up,
    Down,
    None,
}

type TFrame<T> = {
    array: Array<TElementData<T>>;
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
