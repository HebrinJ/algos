import renderer from 'react-test-renderer';
import { Circle } from './circle';
import { render, fireEvent, screen } from '@testing-library/react';
import { ElementStates } from '../../../types/element-states';

it('Should render Circle without letter', () => {
    const tree = renderer
    .create(<Circle />)
    .toJSON();
    expect(tree).toMatchSnapshot();
})

it('Should render Circle with letters', () => {
    const tree = renderer
    .create(<Circle letter='A' />)
    .toJSON();
    expect(tree).toMatchSnapshot();
})

it('Should render Circle with head', () => {
    const tree = renderer
    .create(<Circle head='head' />)
    .toJSON();
    expect(tree).toMatchSnapshot();
})

it('Should render Circle with Element in head', () => {
    const element = <Circle letter='1' />;
    const tree = renderer
    .create(<Circle head={element} />)
    .toJSON();
    expect(tree).toMatchSnapshot();
})

it('Should render Circle with tail', () => {
    const tree = renderer
    .create(<Circle tail='tail' />)
    .toJSON();
    expect(tree).toMatchSnapshot();
})

it('Should render Circle with Element in tail', () => {
    const element = <Circle letter='1' />;
    const tree = renderer
    .create(<Circle tail={element} />)
    .toJSON();
    expect(tree).toMatchSnapshot();
})

it('Should render Circle with index', () => {
    const tree = renderer
    .create(<Circle index={5} />)
    .toJSON();
    expect(tree).toMatchSnapshot();
})

it('Should render small Circle', () => {
    const tree = renderer
    .create(<Circle letter='A' isSmall={true} />)
    .toJSON();
    expect(tree).toMatchSnapshot();
})

it('Should render default state Circle', () => {
    const tree = renderer
    .create(<Circle letter='A' state={ElementStates.Default} />)
    .toJSON();
    expect(tree).toMatchSnapshot();
})

it('Should render changing state Circle', () => {
    const tree = renderer
    .create(<Circle letter='A' state={ElementStates.Changing} />)
    .toJSON();
    expect(tree).toMatchSnapshot();
})

it('Should render modified state Circle', () => {
    const tree = renderer
    .create(<Circle letter='A' state={ElementStates.Modified} />)
    .toJSON();
    expect(tree).toMatchSnapshot();
})