
export const fibonacchi = (num: number, cash: Record<number, number>): number => {
    
    if (num < 0) return -1;

    if (!(num in cash)) {
        cash[num] = fibonacchi(num - 1, cash) + fibonacchi(num - 2, cash)
    }

    return cash[num];
}