import * as React from 'react'
import { fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import { NumberInput } from '../../../components';
import { renderControl } from '../../baseTests';
import userEvent from '@testing-library/user-event'

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
});

describe('onKeyPress', () => {

    function getAscii(data: number | string): string {
        if (data === 0) return '48';
        if (data === 1) return '49';
        if (data === 'A') return '65';
        if (data === ' ') return '32';
        if (data === '.') return '250';
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

    test('Number Input on typing invalid char', async () => {

        const keyPressSpy = jest.fn((e) => { });

        const { input } = render(<NumberInput aria-label='num-input' onKeyPress={keyPressSpy} />);

        fireEvent.keyPress(input, keyPressEvent('A'));
        expect(keyPressSpy).not.toHaveBeenCalled();

        fireEvent.keyPress(input, keyPressEvent(' '));
        expect(keyPressSpy).not.toHaveBeenCalled();

        fireEvent.keyPress(input, keyPressEvent('.'));
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

describe('onBlur', () => {

    test('Number Input on blur with valid char', async () => {

        const blurSpy = jest.fn((e) => {
            expect(e).not.toBeNull();
            expect(e.target.value).toBe('1');
        });

        const { input } = render(<NumberInput aria-label='num-input' onBlur={blurSpy} />);

        fireEvent.blur(input, { target: { value: 1 } });
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    test('Number Input on blur with invalid char', async () => {

        const blurSpy = jest.fn((e) => {
            expect(e).not.toBeNull();
            expect(e.target.value).toBe('123');
        });

        const { input } = render(<NumberInput aria-label='num-input' onBlur={blurSpy} />);

        fireEvent.blur(input, { target: { value: 'sferfefer1erferfe2efrferf3efrfefre' } });
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });
});


describe('userEvent', () => {
    test('Number Input on Change with invalid char', async () => {

        const onChange = jest.fn((e) => { });
        const onKeyPress = jest.fn((e) => { });

        const { input } = render(<NumberInput aria-label='num-input' onChange={onChange} onKeyPress={onKeyPress} />);

        userEvent.type(input, 'a');
        expect(onKeyPress).not.toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();

        userEvent.type(input, '.');
        expect(onKeyPress).not.toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();
    });

});

describe('detail', () => {

    test('Number Input detail with valid char', async () => {

        function validate(e: any) {
            expect(e).not.toBeNull();
            expect(e.detail.attribute).toBe(null);
            expect(e.detail.isValid).toBe(true);
            expect(e.target.value).toBe('1');
        }

        const blurSpy = jest.fn((e) => validate(e));
        const changeSpy = jest.fn((e) => validate(e));

        const { input } = render(<NumberInput aria-label='num-input' onBlur={blurSpy} onChange={changeSpy} />);

        fireEvent.change(input, { target: { value: 1 } });
        fireEvent.blur(input, { target: { value: 1 } });

        expect(changeSpy).toHaveBeenCalledTimes(1);
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    test('Number Input detail with invalid input', async () => {

        function validate(e: any) {
            expect(e).not.toBeNull();
            expect(e.detail.attribute).toBe(null);
            expect(e.detail.isValid).toBe(true);
            expect(e.target.value).toBe('123');
        }

        const blurSpy = jest.fn((e) => validate(e));
        const changeSpy = jest.fn((e) => validate(e));

        const { input } = render(<NumberInput aria-label='num-input' onBlur={blurSpy} onChange={changeSpy} />);

        fireEvent.change(input, { target: { value: 'wewe1erwerwe2rwerwe3werwerew' } });
        fireEvent.blur(input, { target: { value: 'wewe1erwerwe2rwerwe3werwerew' } });

        expect(changeSpy).toHaveBeenCalledTimes(1);
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    test('Number Input detail with invalid min', async () => {

        function validate(e: any) {
            expect(e).not.toBeNull();
            expect(e.detail.attribute).toBe('min');
            expect(e.detail.isValid).toBe(false);
            expect(e.target.value).toBe('10');
        }

        const blurSpy = jest.fn((e) => validate(e));
        const changeSpy = jest.fn((e) => validate(e));

        const { input } = render(<NumberInput aria-label='num-input' min={100} onBlur={blurSpy} onChange={changeSpy} />);

        fireEvent.change(input, { target: { value: 10 } });
        fireEvent.blur(input, { target: { value: 10 } });

        expect(changeSpy).toHaveBeenCalledTimes(1);
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    test('Number Input detail with invalid minLength', async () => {

        function validate(e: any) {
            expect(e).not.toBeNull();
            expect(e.detail.attribute).toBe('minLength');
            expect(e.detail.isValid).toBe(false);
            expect(e.target.value).toBe('10');
        }

        const blurSpy = jest.fn((e) => validate(e));
        const changeSpy = jest.fn((e) => validate(e));

        const { input } = render(<NumberInput aria-label='num-input' minLength={3} onBlur={blurSpy} onChange={changeSpy} />);

        fireEvent.change(input, { target: { value: 10 } });
        fireEvent.blur(input, { target: { value: 10 } });

        expect(changeSpy).toHaveBeenCalledTimes(1);
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

});
