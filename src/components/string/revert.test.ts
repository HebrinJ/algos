import { revert } from "./revert";

it('Should revert even string', () => {
    const input = 'собака';
    
    expect('акабос').toEqual(revert(input)[0]);
})

it('Should revert odd string', () => {
    const input = 'компьютер';
    
    expect('ретюьпмок').toEqual(revert(input)[0]);
})

it('Should revert 1 symbol', () => {
    const input = 'а';
    
    expect('а').toEqual(revert(input)[0]);
})

it('Should revert empty string', () => {
    const input = '';
    
    expect('').toEqual(revert(input)[0]);
})