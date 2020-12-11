import * as React from 'react'
import { fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import { Email } from '../../../components';
import { renderControl } from '../../baseTests';
import userEvent from '@testing-library/user-event'
import { ValidationType } from '../../../components/shared/enumerations';

function render(component: React.ReactElement<any> | null = null, key: string | null = null) {

    const comp = component || <Email aria-label='email-input' />;
    const id = key || 'email-input';
    return renderControl(comp, id);
}

describe('Rendering', () => {
    test('Email rendering', async () => {
        const { input, renderResult } = render();

        expect(input).not.toBeNull();
        expect(input.value).toBe('');
    });

    test('Email rerender', async () => {
        let { input, renderResult } = render(<Email aria-label='email-input' value='750' />);
        expect(input.value).toBe('750');

        renderResult.rerender(<Email aria-label='email-input' value='890' />)
        expect(input).not.toBeNull();
        expect(input.value).toBe('890');
    });

    test('Email rerender with mixed numeric and text', async () => {
        let { input, renderResult } = render(<Email aria-label='email-input' value='750qwe' />);

        expect(input.value).toBe('750qwe');

        renderResult.rerender(<Email aria-label='email-input' value='Test890!@#' />)
        expect(input).not.toBeNull();
        expect(input.value).toBe('Test890!@#');
    });

    test('Email render with only symbols', async () => {
        let { input, renderResult } = render(<Email aria-label='email-input' value='!@#$%' />);
        expect(input.value).toBe('!@#$%');
    });
});

describe('onChange', () => {
    test('Email on Change with numbers', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: '12345' } });
        expect(input.value).toBe('12345');

        fireEvent.change(input, { target: { value: 12345 } });
        expect(input.value).toBe('12345');
    });

    test('Email on Change with mixed', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: '1w2e3yyu4t5dfdf' } });

        expect(input.value).toBe('1w2e3yyu4t5dfdf');
    });

    test('Email on Change with not defined', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: null } });
        expect(input.value).toBe('');

        fireEvent.change(input, { target: { value: undefined } });
        expect(input.value).toBe('');
    });

    test('Email on Change with symbols only', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { value: '!@#!' } });

        expect(input.value).toBe('!@#!');
    });
    test('Email on Change with invalid maxlength', async () => {

        const onChange = jest.fn((e) => {
        });

        const { input } = render(<Email aria-label='email-input' maxLength={10} onChange={onChange} />);

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

    test('Email on typing number', async () => {

        const keyPressSpy = jest.fn((e) => {
            expect(e).not.toBeNull();
            expect(e.key).toBe('1');
        });

        const { input } = render(<Email aria-label='email-input' onKeyPress={keyPressSpy} />);

        fireEvent.keyPress(input, keyPressEvent(1));

        expect(keyPressSpy).toHaveBeenCalledTimes(1);
    });

    test('Email on typing invalid char', async () => {

        const keyPressSpy = jest.fn((e) => { });

        const { input } = render(<Email aria-label='email-input' onKeyPress={keyPressSpy} />);

        fireEvent.keyPress(input, keyPressEvent('A'));
        expect(keyPressSpy).toHaveBeenCalledTimes(1);

        fireEvent.keyPress(input, keyPressEvent(' '));
        expect(keyPressSpy).toHaveBeenCalledTimes(2);

        fireEvent.keyPress(input, keyPressEvent('.'));
        expect(keyPressSpy).toHaveBeenCalledTimes(3);
    });
});

describe('onBlur', () => {

    test('Email on blur with valid char', async () => {

        const blurSpy = jest.fn((e) => {
            expect(e).not.toBeNull();
            expect(e.target.value).toBe('1');
        });

        const { input } = render(<Email aria-label='email-input' onBlur={blurSpy} />);

        fireEvent.blur(input, { target: { value: 1 } });
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    test('Email on blur with invalid char', async () => {

        const blurSpy = jest.fn((e) => {
            expect(e).not.toBeNull();
            expect(e.target.value).toBe('sferfefer1erferfe2efrferf3efrfefre');
        });

        const { input } = render(<Email aria-label='email-input' onBlur={blurSpy} />);

        fireEvent.blur(input, { target: { value: 'sferfefer1erferfe2efrferf3efrfefre' } });
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });
});


describe('userEvent', () => {
    test('Email on Change with invalid char', async () => {

        const onChange = jest.fn((e) => { });
        const onKeyPress = jest.fn((e) => { });

        const { input } = render(<Email aria-label='email-input' onChange={onChange} onKeyPress={onKeyPress} />);

        userEvent.type(input, 'a');
        expect(onKeyPress).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledTimes(1);

        userEvent.type(input, '.');
        expect(onKeyPress).toHaveBeenCalledTimes(2);
        expect(onChange).toHaveBeenCalledTimes(2);
    });
});

describe('detail', () => {

    test('Email detail with valid char', async () => {

        function validate(e: any) {
            expect(e).not.toBeNull();
            expect(e.detail.attribute).toBe(ValidationType.userinput);
            expect(e.detail.isValid).toBe(false);
            expect(e.target.value).toBe('abc');
        }

        const blurSpy = jest.fn((e) => validate(e));
        const changeSpy = jest.fn((e) => validate(e));

        const { input } = render(<Email aria-label='email-input' onBlur={blurSpy} onChange={changeSpy} />);

        fireEvent.change(input, { target: { value: 'abc' } });
        fireEvent.blur(input, { target: { value: 'abc' } });

        expect(changeSpy).toHaveBeenCalledTimes(1);
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    test('Email detail with invalid input', async () => {

        function validate(e: any) {
            expect(e).not.toBeNull();
            expect(e.detail.attribute).toBe(ValidationType.userinput);
            expect(e.detail.isValid).toBe(false);
            expect(e.target.value).toBe('wewe1erwerwe2rwerwe3werwerew');
        }

        const blurSpy = jest.fn((e) => validate(e));
        const changeSpy = jest.fn((e) => validate(e));

        const { input } = render(<Email aria-label='email-input' onBlur={blurSpy} onChange={changeSpy} />);

        fireEvent.change(input, { target: { value: 'wewe1erwerwe2rwerwe3werwerew' } });
        fireEvent.blur(input, { target: { value: 'wewe1erwerwe2rwerwe3werwerew' } });

        expect(changeSpy).toHaveBeenCalledTimes(1);
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    test('Email detail with invalid minLength', async () => {

        function validate(e: any) {
            expect(e).not.toBeNull();
            expect(e.detail.attribute).toBe('minLength');
            expect(e.detail.isValid).toBe(false);
            expect(e.target.value).toBe('a@b.com');
        }

        const blurSpy = jest.fn((e) => validate(e));
        const changeSpy = jest.fn((e) => validate(e));

        const { input } = render(<Email aria-label='email-input' minLength={10} onBlur={blurSpy} onChange={changeSpy} />);

        fireEvent.change(input, { target: { value: 'a@b.com' } });
        fireEvent.blur(input, { target: { value: 'a@b.com' } });

        expect(changeSpy).toHaveBeenCalledTimes(1);
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    test('Email detail with valid value', async () => {

        function validate(e: any) {
            expect(e).not.toBeNull();
            expect(e.detail.attribute).toBe(null);
            expect(e.detail.isValid).toBe(true);
            expect(e.target.value).toBe('a@b.com');
        }

        const blurSpy = jest.fn((e) => validate(e));
        const changeSpy = jest.fn((e) => validate(e));

        const { input } = render(<Email aria-label='email-input' onBlur={blurSpy} onChange={changeSpy} />);

        fireEvent.change(input, { target: { value: 'a@b.com' } });
        fireEvent.blur(input, { target: { value: 'a@b.com' } });

        expect(changeSpy).toHaveBeenCalledTimes(1);
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

});

describe('validation', () => {
    test('Email for required', async () => {

        const onChangeValue = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(false);
            expect(e.detail.attribute).toBe('required');
        });

        const { input } = render(<Email required aria-label='email-input' onChange={onChangeValue} value='123' />);

        fireEvent.change(input, { target: { value: '' } });
        expect(onChangeValue).toHaveBeenCalledTimes(1);
    });

    test('Email for invalid exactLength', async () => {

        const onChangeValue = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(false);
            expect(e.detail.attribute).toBe('exactLength');
        });

        const { input } = render(<Email aria-label='email-input' onChange={onChangeValue} exactLength={10} />);

        fireEvent.change(input, { target: { value: 'a@b.com' } });
        expect(onChangeValue).toHaveBeenCalledTimes(1);
    });

    test('Email for valid exactLength', async () => {

        const onChangeValue = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(true);
            expect(e.detail.attribute).toBe(null);
        });

        const { input } = render(<Email aria-label='email-input' onChange={onChangeValue} exactLength={7} />);

        fireEvent.change(input, { target: { value: 'a@b.com' } });
        expect(onChangeValue).toHaveBeenCalledTimes(1);
    });
});
