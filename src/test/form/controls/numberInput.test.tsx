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

    test('Number Input is rerender', async () => {
        let { input, renderResult } = render(<NumberInput aria-label='num-input' value='750' />);
        expect(input.value).toBe('750');

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

    test('Number Input on Change with invalid max', async () => {

        const onChange = jest.fn((e) => {

        });

        const { input } = render(<NumberInput aria-label='num-input' max={100} onChange={onChange} />);

        fireEvent.change(input, { target: { value: 50 } });
        expect(input.value).toBe('50');
        expect(onChange).toHaveBeenCalledTimes(1);

        fireEvent.change(input, { target: { value: 500 } });
        expect(input.value).toBe('50');
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('Number Input on Change with invalid maxlength', async () => {

        const onChange = jest.fn((e) => {
        });

        const { input } = render(<NumberInput aria-label='num-input' maxLength={5} onChange={onChange} />);

        fireEvent.change(input, { target: { value: 5555 } });
        expect(input.value).toBe('5555');
        expect(onChange).toHaveBeenCalledTimes(1);

        fireEvent.change(input, { target: { value: 55555 } });
        expect(input.value).toBe('55555');
        expect(onChange).toHaveBeenCalledTimes(2);

        fireEvent.change(input, { target: { value: 555555 } });
        expect(input.value).toBe('55555');
        expect(onChange).toHaveBeenCalledTimes(2);
    });

    test('Number Input on Change with invalid char', async () => {

        const onChange = jest.fn((e) => {
        });

        const { input } = render(<NumberInput aria-label='num-input' onChange={onChange} />);

        fireEvent.change(input, { target: { value: 'a' } });
        expect(input.value).toBe('');
        expect(onChange).not.toHaveBeenCalled();
    });

    test('Number Input on Change with dot for decimal', async () => {

        const onChange = jest.fn((e) => {
        });

        const { input } = render(<NumberInput aria-label='num-input' onChange={onChange} />);

        fireEvent.change(input, { target: { value: '.' } });
        expect(input.value).toBe('');
        expect(onChange).not.toHaveBeenCalled();
    });
});

describe('onKeyPress', () => {

    function getAscii(data: number | string): string {
        if (data === 0) return '48';
        if (data === 1) return '49';
        if (data === 'A') return '65';
        if (data === ' ') return '32';
        return '';
    }
    const keyPressEvent = (key: number | string) => {
        const keyText = `${key}`;
        const charCode = getAscii(key);
        return { key: keyText, code: keyText, keyCode: charCode, charCode }
    };

    test('Number Input on typing number', async () => {

        const keyPressSpy = jest.fn((e) => {
            expect(e).not.toBeNull();
            expect(e.key).toBe('1');
        });

        const { input } = render(<NumberInput aria-label='num-input' onKeyPress={keyPressSpy} />);

        fireEvent.keyPress(input, keyPressEvent(1));

        expect(keyPressSpy).toHaveBeenCalledTimes(1);
    });

    test('Number Input on typing A', async () => {

        const keyPressSpy = jest.fn((e) => { });

        const { input } = render(<NumberInput aria-label='num-input' onKeyPress={keyPressSpy} />);

        fireEvent.keyPress(input, keyPressEvent('A'));

        expect(keyPressSpy).not.toHaveBeenCalled();
    });

    test('Number Input on typing space', async () => {

        const keyPressSpy = jest.fn((e) => { });

        const { input } = render(<NumberInput aria-label='num-input' onKeyPress={keyPressSpy} />);

        fireEvent.keyPress(input, keyPressEvent(' '));

        expect(keyPressSpy).not.toHaveBeenCalled();
    });

    test('Keypress allowed on passing max', async () => {

        const keyPressSpy = jest.fn((e) => {
            expect(e).not.toBeNull();
            expect(e.key).toBe('1');
        });

        const { input } = render(<NumberInput max={20} aria-label='num-input' onKeyPress={keyPressSpy} value='20' />);

        expect(input.value).toBe('20');

        fireEvent.keyPress(input, keyPressEvent('1'));

        expect(keyPressSpy).not.toHaveBeenCalledTimes(1);
    });
});
