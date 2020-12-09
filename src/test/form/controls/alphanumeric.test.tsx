import * as React from 'react'
import { fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import { AlphaNumeric } from '../../../components';
import { renderControl } from '../../baseTests';
import userEvent from '@testing-library/user-event'

function render(component: React.ReactElement<any> | null = null, key: string | null = null) {

    const comp = component || <AlphaNumeric allowSymbols='!@#$%' aria-label='alpha-input' />;
    const id = key || 'alpha-input';
    return renderControl(comp, id);
}

describe('Rendering', () => {
    test('Alphanumeric rendering', async () => {
        const { input, renderResult } = render();

        expect(input).not.toBeNull();
        expect(input.value).toBe('');
    });

    test('Alphanumeric rerender', async () => {
        let { input, renderResult } = render(<AlphaNumeric allowSymbols='!@#$%' aria-label='alpha-input' value='750' />);
        expect(input.value).toBe('750');

        renderResult.rerender(<AlphaNumeric allowSymbols='!@#$%' aria-label='alpha-input' value='890' />)
        expect(input).not.toBeNull();
        expect(input.value).toBe('890');
    });

    test('Alphanumeric rerender with mixed numeric and text', async () => {
        let { input, renderResult } = render(<AlphaNumeric allowSymbols='!@#$%' aria-label='alpha-input' value='750qwe' />);

        expect(input.value).toBe('750qwe');

        renderResult.rerender(<AlphaNumeric allowSymbols='!@#$%' aria-label='alpha-input' value='Test890!@#' />)
        expect(input).not.toBeNull();
        expect(input.value).toBe('Test890!@#');
    });

    test('Alphanumeric render with only symbols', async () => {
        let { input, renderResult } = render(<AlphaNumeric allowSymbols='!@#$%' aria-label='alpha-input' value='!@#$%' />);
        expect(input.value).toBe('!@#$%');
    });

    test('Alphanumeric render with invalid and valid characters', async () => {
        let { input, renderResult } = render(<AlphaNumeric allowSymbols='!@#$%' aria-label='alpha-input' value='!@^^*#$%)(*' />);
        expect(input.value).toBe('!@#$%');
    });
});

describe('onChange', () => {
    test('Alphanumeric on Change with numbers', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: '12345' } });
        expect(input.value).toBe('12345');

        fireEvent.change(input, { target: { value: 12345 } });
        expect(input.value).toBe('12345');
    });

    test('Alphanumeric on Change with mixed', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: '1w2e3yyu4t5dfdf' } });

        expect(input.value).toBe('1w2e3yyu4t5dfdf');
    });

    test('Alphanumeric on Change with not defined', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: null } });
        expect(input.value).toBe('');

        fireEvent.change(input, { target: { value: undefined } });
        expect(input.value).toBe('');
    });

    test('Alphanumeric on Change with symbols only', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: '!@#!' } });

        expect(input.value).toBe('!@#!');
    });

    test('Alphanumeric on Change with decimal', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: 456.232 } });
        expect(input.value).toBe('456232');

        fireEvent.change(input, { target: { value: '321.897' } });
        expect(input.value).toBe('321897');
    });

    test('Alphanumeric on Change with invalid chars', async () => {

        const onChange = jest.fn((e) => { });

        const { input } = render(<AlphaNumeric allowSymbols='!@#$%' aria-label='alpha-input' max={100} onChange={onChange} />);

        fireEvent.change(input, { target: { value: ')(*&&^' } });
        expect(input.value).toBe('');
        expect(onChange).toHaveBeenCalledTimes(1);

        fireEvent.change(input, { target: { value: 'wer)wrw(er*we&&wer^2423432' } });
        expect(input.value).toBe('werwrwerwewer2423432');
        expect(onChange).toHaveBeenCalledTimes(2);
    });

    test('Alphanumeric on Change with invalid maxlength', async () => {

        const onChange = jest.fn((e) => {
        });

        const { input } = render(<AlphaNumeric allowSymbols='!@#$%' aria-label='alpha-input' maxLength={10} onChange={onChange} />);

        fireEvent.change(input, { target: { value: '5555' } });
        expect(input.value).toBe('5555');
        expect(onChange).toHaveBeenCalledTimes(1);

        fireEvent.change(input, { target: { value: 'werwrwerwewer2423432' } });
        expect(input.value).toBe('5555');
        expect(onChange).toHaveBeenCalledTimes(1);
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

    test('Alphanumeric on typing number', async () => {

        const keyPressSpy = jest.fn((e) => {
            expect(e).not.toBeNull();
            expect(e.key).toBe('1');
        });

        const { input } = render(<AlphaNumeric allowSymbols='!@#$%' aria-label='alpha-input' onKeyPress={keyPressSpy} />);

        fireEvent.keyPress(input, keyPressEvent(1));

        expect(keyPressSpy).toHaveBeenCalledTimes(1);
    });

    test('Alphanumeric on typing invalid char', async () => {

        const keyPressSpy = jest.fn((e) => { });

        const { input } = render(<AlphaNumeric allowSymbols='!@#$%' aria-label='alpha-input' onKeyPress={keyPressSpy} />);

        fireEvent.keyPress(input, keyPressEvent('A'));
        expect(keyPressSpy).toHaveBeenCalledTimes(1);

        fireEvent.keyPress(input, keyPressEvent(' '));
        expect(keyPressSpy).toHaveBeenCalledTimes(1);

        fireEvent.keyPress(input, keyPressEvent('.'));
        expect(keyPressSpy).toHaveBeenCalledTimes(1);
    });
});

describe('onBlur', () => {

    test('Alphanumeric on blur with valid char', async () => {

        const blurSpy = jest.fn((e) => {
            expect(e).not.toBeNull();
            expect(e.target.value).toBe('1');
        });

        const { input } = render(<AlphaNumeric allowSymbols='!@#$%' aria-label='alpha-input' onBlur={blurSpy} />);

        fireEvent.blur(input, { target: { value: 1 } });
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    test('Alphanumeric on blur with invalid char', async () => {

        const blurSpy = jest.fn((e) => {
            expect(e).not.toBeNull();
            expect(e.target.value).toBe('sferfefer1erferfe2efrferf3efrfefre');
        });

        const { input } = render(<AlphaNumeric allowSymbols='!@#$%' aria-label='alpha-input' onBlur={blurSpy} />);

        fireEvent.blur(input, { target: { value: 'sferfefer1erferfe2efrferf3efrfefre' } });
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });
});


describe('userEvent', () => {
    test('Alphanumeric on Change with invalid char', async () => {

        const onChange = jest.fn((e) => { });
        const onKeyPress = jest.fn((e) => { });

        const { input } = render(<AlphaNumeric allowSymbols='!@#$%' aria-label='alpha-input' onChange={onChange} onKeyPress={onKeyPress} />);

        userEvent.type(input, 'a');
        expect(onKeyPress).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledTimes(1);

        userEvent.type(input, '.');
        expect(onKeyPress).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledTimes(1);
    });

});

describe('detail', () => {

    test('Alphanumeric detail with valid char', async () => {

        function validate(e: any) {
            expect(e).not.toBeNull();
            expect(e.detail.attribute).toBe(null);
            expect(e.detail.isValid).toBe(true);
            expect(e.target.value).toBe('1');
        }

        const blurSpy = jest.fn((e) => validate(e));
        const changeSpy = jest.fn((e) => validate(e));

        const { input } = render(<AlphaNumeric allowSymbols='!@#$%' aria-label='alpha-input' onBlur={blurSpy} onChange={changeSpy} />);

        fireEvent.change(input, { target: { value: 1 } });
        fireEvent.blur(input, { target: { value: 1 } });

        expect(changeSpy).toHaveBeenCalledTimes(1);
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    test('Alphanumeric detail with invalid input', async () => {

        function validate(e: any) {
            expect(e).not.toBeNull();
            expect(e.detail.attribute).toBe(null);
            expect(e.detail.isValid).toBe(true);
            expect(e.target.value).toBe('wewe1erwerwe2rwerwe3werwerew');
        }

        const blurSpy = jest.fn((e) => validate(e));
        const changeSpy = jest.fn((e) => validate(e));

        const { input } = render(<AlphaNumeric allowSymbols='!@#$%' aria-label='alpha-input' onBlur={blurSpy} onChange={changeSpy} />);

        fireEvent.change(input, { target: { value: 'wewe1erwerwe2rwerwe3werwerew' } });
        fireEvent.blur(input, { target: { value: 'wewe1erwerwe2rwerwe3werwerew' } });

        expect(changeSpy).toHaveBeenCalledTimes(1);
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    test('Alphanumeric detail with invalid min', async () => {

        function validate(e: any) {
            expect(e).not.toBeNull();
            expect(e.detail.attribute).toBe('min');
            expect(e.detail.isValid).toBe(false);
            expect(e.target.value).toBe('10');
        }

        const blurSpy = jest.fn((e) => validate(e));
        const changeSpy = jest.fn((e) => validate(e));

        const { input } = render(<AlphaNumeric allowSymbols='!@#$%' aria-label='alpha-input' min={100} onBlur={blurSpy} onChange={changeSpy} />);

        fireEvent.change(input, { target: { value: 10 } });
        fireEvent.blur(input, { target: { value: 10 } });

        expect(changeSpy).toHaveBeenCalledTimes(1);
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    test('Alphanumeric detail with invalid minLength', async () => {

        function validate(e: any) {
            expect(e).not.toBeNull();
            expect(e.detail.attribute).toBe('minLength');
            expect(e.detail.isValid).toBe(false);
            expect(e.target.value).toBe('10');
        }

        const blurSpy = jest.fn((e) => validate(e));
        const changeSpy = jest.fn((e) => validate(e));

        const { input } = render(<AlphaNumeric allowSymbols='!@#$%' aria-label='alpha-input' minLength={3} onBlur={blurSpy} onChange={changeSpy} />);

        fireEvent.change(input, { target: { value: 10 } });
        fireEvent.blur(input, { target: { value: 10 } });

        expect(changeSpy).toHaveBeenCalledTimes(1);
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

});

describe('validation', () => {
    test('AlphaNumeric for required', async () => {

        const onChangeValue = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(false);
            expect(e.detail.attribute).toBe('required');
        });

        const { input } = render(<AlphaNumeric required aria-label='alpha-input' onChange={onChangeValue} value='123' />);

        fireEvent.change(input, { target: { value: '' } });
        expect(onChangeValue).toHaveBeenCalledTimes(1);
    });

    test('AlphaNumeric for invalid exactLength', async () => {

        const onChangeValue = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(false);
            expect(e.detail.attribute).toBe('exactLength');
        });

        const { input } = render(<AlphaNumeric aria-label='alpha-input' onChange={onChangeValue} exactLength={5} />);

        userEvent.type(input, '123');
        expect(onChangeValue).toHaveBeenCalledTimes(3); // Each for "1", "12", "123".
    });

    test('AlphaNumeric for exactLength', async () => {

        const onChangeValue = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(true);
            expect(e.detail.value).toBe('12345');
            expect(e.detail.attribute).toBe(null);
        });

        const { input } = render(<AlphaNumeric aria-label='alpha-input' onChange={onChangeValue} exactLength={5} />);

        fireEvent.change(input, { target: { value: '12345' } });
        expect(onChangeValue).toHaveBeenCalledTimes(1);
    });

});
