import * as React from 'react'
import { fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import { NumberInput } from '../../../components';
import { renderControl } from '../../baseTests';

function render(component: React.ReactElement<any> | null = null, key: string | null = null) {

    const comp = component || <NumberInput aria-label='num-input' />;
    const id = key || 'num-input';
    return renderControl(comp, id);
}

describe('Rendering', () => {
    test('Number Input is rendering', async () => {
        const { input, renderResult } = render();

        expect(input).not.toBeNull();
        expect(input.value).toBe('');
    });

    test('Number Input is rendering with input props', async () => {
        const { input, renderResult } = render(<NumberInput aria-label='num-input' value='750' />);
        expect(input.value).toBe('750');
    });

    test('Number Input is rerender', async () => {
        let { input, renderResult } = render(<NumberInput aria-label='num-input' value='750' />);

        renderResult.rerender(<NumberInput aria-label='num-input' value='890' />)
        expect(input).not.toBeNull();
        expect(input.value).toBe('890');
    });

    test('Number Input is rerender with incorrect value', async () => {
        let { input, renderResult } = render(<NumberInput aria-label='num-input' value='750qwe' />);

        expect(input.value).toBe('750');

        renderResult.rerender(<NumberInput aria-label='num-input' value='Test890' />)
        expect(input).not.toBeNull();
        expect(input.value).toBe('890');
    });
});

describe('onChange', () => {
    test('Number Input on Change with numbers as string', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: '12345' } });
        expect(input.value).toBe('12345');

        fireEvent.change(input, { target: { value: 12345 } });
        expect(input.value).toBe('12345');
    });

    test('Number Input on Change with mixed', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: '1w2e3yyu4t5dfdf' } });

        expect(input.value).toBe('12345');
    });

    test('Number Input on Change with not defined', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: null } });
        expect(input.value).toBe('');

        fireEvent.change(input, { target: { value: undefined } });
        expect(input.value).toBe('');
    });

    test('Number Input on Change with only string', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: 'uyuyfgeurbfgeu' } });

        expect(input.value).toBe('');
    });

    test('Number Input on Change with decimal', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: 456.232 } });
        expect(input.value).toBe('456232');

        fireEvent.change(input, { target: { value: '321.897' } });
        expect(input.value).toBe('321897');
    });

});

describe('onKeyPress', () => {
    test('Number Input on typing number', async () => {

        const keyPressSpy = jest.fn((e) => {
            expect(e).not.toBeNull();
            expect(e.key).toBe('1');
        });

        const { input } = render(<NumberInput aria-label='num-input' onKeyPress={keyPressSpy} />);

        const event = {
            key: '1',
            code: '1',
            keyCode: 49,
            charCode: 49
        };

        fireEvent.keyPress(input, event);

        expect(keyPressSpy).toHaveBeenCalledTimes(1);
    });
});
