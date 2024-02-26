import renderer from 'react-test-renderer';
import { Button } from './button';
import { render, fireEvent, screen } from '@testing-library/react';

it('Should render default button with text', () => {
    const tree = renderer
    .create(<Button text='Нажми меня' isLoader={false} disabled={false} />)
    .toJSON();
    expect(tree).toMatchSnapshot();
})

it('Should renderer default button without text', () => {
    const tree = renderer
    .create(<Button text='' isLoader={false} disabled={false} />)
    .toJSON();
    expect(tree).toMatchSnapshot();
})

it('Should renderer button with loader', () => {
    const tree = renderer
    .create(<Button text='Лоадер' isLoader={true} disabled={false} />)
    .toJSON();
    expect(tree).toMatchSnapshot();
})

it('Should renderer disabled button', () => {
    const tree = renderer
    .create(<Button text='Отключенная кнопка' isLoader={false} disabled={true} />)
    .toJSON();
    expect(tree).toMatchSnapshot();
})

it('Should call onClick handler', () => {
    const mockFn = jest.fn();
    
    render(<Button text='Нажми меня' isLoader={false} disabled={false} onClick={mockFn}/>);
    const button = screen.queryByText('Нажми меня')
    fireEvent.click(button);

    expect(mockFn).toHaveBeenCalledTimes(1);
}); 