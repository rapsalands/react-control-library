import * as React from 'react'
import { fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import { renderControl } from '../../baseTests';
import userEvent from '@testing-library/user-event'
import SecureMaskedInput from '../../../components/form/controls/secureMaskedInput';

const num = /^[0-9]*$/;

const ssnMask = [num, num, num, '-', num, num, '-', num, num, num, num];

function getValue(detail, data) {
    return `*${data || ''}*`;
}

function render(component: React.ReactElement<any> | null = null, key: string | null = null) {

    const comp = component || <SecureMaskedInput secure={{ getValue }} mask={ssnMask} aria-label='secure-input' />;
    const id = key || 'secure-input';
    return renderControl(comp, id);
}

describe('Rendering', () => {
    test('Secure Input is rendering', async () => {
        const { input, renderResult } = render();

        expect(input).not.toBeNull();
        expect(input.value).toBe('**');
    });

    test('Secure Input is rerender', async () => {
        let { input, renderResult } = render(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} aria-label='secure-input' value='750' />);
        expect(input.value).toBe('*750*');

        renderResult.rerender(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} aria-label='secure-input' value='8906' />)
        expect(input).not.toBeNull();
        expect(input.value).toBe('*890-6*');
    });

    test('Secure Input is rerender with incorrect value', async () => {
        let { input, renderResult } = render(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} aria-label='secure-input' value='750qwe' />);

        expect(input.value).toBe('*750*');

        renderResult.rerender(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} aria-label='secure-input' value='Test890' />)
        expect(input).not.toBeNull();
        expect(input.value).toBe('*890*');
    });

    test('Secure Input is rerender with incorrect max', async () => {
        let { input, renderResult } = render(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} max={100} aria-label='secure-input' value='200' />);
        expect(input.value).toBe('*200*');
    });

    test('Secure Input is rerender with 5 values', async () => {
        let { input, renderResult } = render(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} aria-label='secure-input' value='42567' />);
        expect(input.value).toBe('*425-67*');
    });

    test('Secure Input is rerender with 6 values', async () => {
        let { input, renderResult } = render(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} aria-label='secure-input' value='425678' />);
        expect(input.value).toBe('*425-67-8*');
    });

    test('Secure Input is rerender with 7 values', async () => {
        let { input, renderResult } = render(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} aria-label='secure-input' value='4256781' />);
        expect(input.value).toBe('*425-67-81*');
    });
});

describe('onChange', () => {
    test('Secure Input on Change full value', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: '987654321' } });
        expect(input.value).toBe('987-65-4321');
    });

    test('Secure Input on Change with last value', async () => {

        const { input } = render(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} aria-label='secure-input' value='' />);

        userEvent.type(input, '987654321');
        expect(input.value).toBe('987-65-4321');
    });

    test('Secure Input on Change with numbers as string', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: '12345' } });
        expect(input.value).toBe('123-45');
    });

    test('Secure Input on Change with mixed', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: '1w2e3yyu4t5dfdf' } });

        expect(input.value).toBe('123-45');
    });

    test('Secure Input on Change with not defined', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: null } });
        expect(input.value).toBe('');
    });

    test('Secure Input on Change with only string', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: 'uyuyfgeurbfgeu' } });

        expect(input.value).toBe('');
    });

    test('Secure Input on Change with decimal', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: 456.232 } });
        expect(input.value).toBe('456-23-2');

        fireEvent.blur(input);
        expect(input.value).toBe('*456-23-2*');
    });

    test('Secure Input on Change with onChange called', async () => {

        const onChange = jest.fn((e) => {

        });

        const { input } = render(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} aria-label='secure-input' onChange={onChange} />);

        fireEvent.change(input, { target: { value: 50 } });
        expect(input.value).toBe('50');
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('Secure Input on Change with onChange 3 calls', async () => {

        const onChange = jest.fn((e) => {
        });

        const { input } = render(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} aria-label='secure-input' onChange={onChange} />);

        fireEvent.change(input, { target: { value: 5555 } });
        expect(input.value).toBe('555-5');
        expect(onChange).toHaveBeenCalledTimes(1);

        fireEvent.change(input, { target: { value: 55555 } });
        expect(input.value).toBe('555-55');
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

    test('Secure Input on typing number', async () => {

        const keyPressSpy = jest.fn((e) => {
            expect(e).not.toBeNull();
            expect(e.key).toBe('1');
        });

        const { input } = render(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} aria-label='secure-input' onKeyPress={keyPressSpy} />);

        fireEvent.keyPress(input, keyPressEvent(1));

        expect(keyPressSpy).toHaveBeenCalledTimes(1);
    });

    // KeyPress is always called.
    test('Secure Input on typing invalid char', async () => {

        const keyPressSpy = jest.fn((e) => { });

        const { input } = render(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} aria-label='secure-input' onKeyPress={keyPressSpy} />);

        fireEvent.keyPress(input, keyPressEvent('A'));
        expect(keyPressSpy).toHaveBeenCalledTimes(1);

        fireEvent.keyPress(input, keyPressEvent(' '));
        expect(keyPressSpy).toHaveBeenCalledTimes(2);

        fireEvent.keyPress(input, keyPressEvent('.'));
        expect(keyPressSpy).toHaveBeenCalledTimes(3);
    });

    test('Keypress allowed on passing', async () => {

        const keyPressSpy = jest.fn((e) => {
            expect(e).not.toBeNull();
            expect(e.key).toBe('1');
        });

        const { input } = render(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} max={20} aria-label='secure-input' onKeyPress={keyPressSpy} value='20' />);

        expect(input.value).toBe('*20*');

        fireEvent.keyPress(input, keyPressEvent('1'));

        expect(keyPressSpy).not.toHaveBeenCalledTimes(1);
    });
});

describe('onBlur', () => {

    test('Secure Input on blur with valid char', async () => {

        const blurSpy = jest.fn((e) => {
            expect(e).not.toBeNull();
            expect(e.target.value).toBe('*1*');
        });

        const { input } = render(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} aria-label='secure-input' onBlur={blurSpy} value='1' />);

        fireEvent.blur(input);
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });
});

describe('userEvent', () => {
    xtest('Secure Input on Change with invalid char', async () => {

        const onChange = jest.fn((e) => { });
        const onKeyPress = jest.fn((e) => { });

        const { input } = render(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} aria-label='secure-input' onChange={onChange} onKeyPress={onKeyPress} />);

        userEvent.type(input, 'a');
        expect(onKeyPress).toHaveBeenCalledTimes(1);
        expect(onChange).not.toHaveBeenCalled();

        userEvent.type(input, '.');
        expect(onKeyPress).toHaveBeenCalledTimes(2);
        expect(onChange).not.toHaveBeenCalled();
    });

});

describe('detail', () => {

    test('Secure Input detail with valid char', async () => {

        function validate(e: any) {
            expect(e).not.toBeNull();
            expect(e.detail.attribute).toBe(null);
            expect(e.detail.isValid).toBe(true);
            expect(e.detail.value).toBe('*1*');
        }

        function validateBlur(e: any) {
            validate(e);
            expect(e.target.value).toBe('*1*');
        }

        const blurSpy = jest.fn((e) => validateBlur(e));

        const { input } = render(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} aria-label='secure-input' onBlur={blurSpy} value='1' />);

        fireEvent.blur(input);
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    test('Secure Input detail with invalid input', async () => {

        function validate(e: any) {
            expect(e).not.toBeNull();
            expect(e.detail.attribute).toBe(null);
            expect(e.detail.isValid).toBe(true);
            expect(e.detail.value).toBe('*123*');
        }

        function validateBlur(e: any) {
            validate(e);
            expect(e.target.value).toBe('*123*');
        }

        const blurSpy = jest.fn((e) => validateBlur(e));

        const { input } = render(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} aria-label='secure-input' onBlur={blurSpy} value='wewe1erwerwe2rwerwe3werwerew' />);

        fireEvent.blur(input);

        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

});

describe('validation', () => {
    test('Secure Input for required', async () => {

        const onChangeValue = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(false);
            expect(e.detail.attribute).toBe('required');
        });

        const { input } = render(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} required aria-label='secure-input' onChange={onChangeValue} value='123' />);

        fireEvent.change(input, { target: { value: '' } });
        expect(onChangeValue).toHaveBeenCalledTimes(1); // Each for "1", "12", "123".
    });

    test('Secure Input for invalid exactLength', async () => {

        const onChangeValue = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(false);
            expect(e.detail.attribute).toBe('exactLength');
        });

        const { input } = render(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} aria-label='secure-input' onChange={onChangeValue} exactLength={5} />);

        userEvent.type(input, '123');
        expect(onChangeValue).toHaveBeenCalledTimes(3); // Each for "1", "12", "123".
    });

    test('Secure Input for exactLength', async () => {

        const onChangeValue = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(true);
            expect(e.detail.value).toBe('12345');
            expect(e.detail.attribute).toBe(null);
        });

        const { input } = render(<SecureMaskedInput secure={{ getValue }} mask={ssnMask} aria-label='secure-input' onChange={onChangeValue} exactLength={5} />);

        fireEvent.change(input, { target: { value: '12345' } });
        expect(onChangeValue).toHaveBeenCalledTimes(1);
    });

});
