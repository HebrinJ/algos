
// Оставлю реализацию на память =)

// export const fibonacchi = (num: number, cash: Record<number, number>): number => {
    
//     if (num < 0) return -1;

//     if (!(num in cash)) {
//         cash[num] = fibonacchi(num - 1, cash) + fibonacchi(num - 2, cash)
//     }

//     return cash[num];
// }

export function getFibonacciNumbers(count: number) {
    const fibonacciNumbers = [1, 1];
    for (let i = 2; i <= count; i++) {
      const a = fibonacciNumbers[i - 1];
      const b = fibonacciNumbers[i - 2];
      fibonacciNumbers.push(a + b);
    }
    return fibonacciNumbers;
  }