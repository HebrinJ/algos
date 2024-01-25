import { ElementStates } from "../types/element-states"

export type TSnapShot<T> = {
    object: Array<T>,
    states: {
        [key in ElementStates]: Array<number> | null
    }
}

export function snapShot<T>(array: Array<T>, changing: Array<number>, modified: Array<number>): TSnapShot<T> {
    const unDefaultElementsIndexes = changing.concat(modified);
    let defaultElementsIndexes: Array<number> | null = [];

    defaultElementsIndexes = array.reduce((result, element, index) => {
        
        if(!unDefaultElementsIndexes.includes(index)) {
            result.push(index);
        }
        
        return result;
    }, defaultElementsIndexes)
    
    return {
        object: array.slice(),
        states: {
            [ElementStates.Default]: defaultElementsIndexes,
            [ElementStates.Changing]: changing,
            [ElementStates.Modified]: modified,
        }
    }
}