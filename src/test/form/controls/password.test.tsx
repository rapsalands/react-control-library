import * as React from 'react'
import { fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import { Password } from '../../../components';
import { renderControl, keyPressEvent } from '../../baseTests';
import userEvent from '@testing-library/user-event'
import { IPasswordCriteria } from '../../../components/shared/interfacesDelegates/controlInterfaces';
import { PasswordStrength } from '../../../components/shared/enumerations';

function defaultPassCriteria() {
    return {
        capital: 1,
        minLength: 8,
        maxLength: 0, // Means no restriction
        numberCount: 1,
        symbols: 1,
        restrictSymbols: '',
        sequence: {
            number: 5,
            characters: 5
        }
    } as IPasswordCriteria;
}

function customPc(params) {
    return {
        passwordCriteria: {
            ...defaultPassCriteria(),
            ...params
        }
    }
}

const ariaLabel = 'password-input';

function render(component: React.ReactElement<any> | null = null, key: string | null = null, props = {}) {

    const comp = component || <Password aria-label={key || ariaLabel} passwordCriteria={defaultPassCriteria()} {...props} />;
    const id = key || ariaLabel;
    return renderControl(comp, id);
}

describe('Rendering', () => {
    test('Password rendering', async () => {
        const { input, renderResult } = render();

        expect(input).not.toBeNull();
        expect(input.value).toBe('');
    });

    test('Password re-rendering', async () => {
        let { input, renderResult } = render(<Password aria-label={ariaLabel} value='750' />);
        expect(input.value).toBe('750');

        renderResult.rerender(<Password aria-label={ariaLabel} value='890' />)
        expect(input).not.toBeNull();
        expect(input.value).toBe('890');
    });
})

describe('onChange', () => {
    test('taking numbers valid', () => {
        const { input, renderResult } = render();
        fireEvent.blur(input, { target: { value: '8764' } });
        expect(input.value).toBe('8764');
    });

    test('taking numbers invalid', () => {
        const { input, renderResult } = render();
        fireEvent.blur(input, { target: { value: '123456789' } });
        expect(input.value).toBe('123456789');
    });

    test('taking characters', () => {
        const { input, renderResult } = render();
        fireEvent.blur(input, { target: { value: 'asffyyefyUIYUHYU' } });
        expect(input.value).toBe('asffyyefyUIYUHYU');
    });

    test('taking symbols', () => {
        const { input, renderResult } = render();
        fireEvent.blur(input, { target: { value: '*&*^*&^*^*&(\$=_*&^&^786475uiyhuf' } });
        expect(input.value).toBe('*&*^*&^*^*&(\$=_*&^&^786475uiyhuf');
    });

    test('taking 2 Caps', () => {
        const { input, renderResult } = render();
        fireEvent.blur(input, { target: { value: 'AeA' } });
        expect(input.value).toBe('AeA');
    });

    test('taking sequences of numbers', () => {
        const { input, renderResult } = render();
        fireEvent.blur(input, { target: { value: '123456789' } });
        expect(input.value).toBe('123456789');
    });

    test('taking sequences of numbers in desc order', () => {
        const { input, renderResult } = render();
        fireEvent.blur(input, { target: { value: '987654321' } });
        expect(input.value).toBe('987654321');
    });

    test('taking sequences of characters', () => {
        const { input, renderResult } = render();
        fireEvent.blur(input, { target: { value: 'abcdef' } });
        expect(input.value).toBe('abcdef');
    });

    test('detail is populated with invalid state', () => {

        const onChange = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(false);
        });

        const { input, renderResult } = render(null, null, { onChange });
        fireEvent.change(input, { target: { value: 'gferu' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('detail is populated with valid state', () => {

        const onChange = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(true);
        });

        const { input, renderResult } = render(null, null, { onChange });
        fireEvent.change(input, { target: { value: 'TheCodingWorld@React56431' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('accepted with invalid maxLength', () => {

        const pc = customPc({ maxLength: 10 });

        const { input, renderResult } = render(null, null, pc);
        fireEvent.change(input, { target: { value: '1234567890utweufewif' } });
        expect(input.value).toBe('1234567890utweufewif');
    });

})

describe('onBlur', () => {
    test('does not change value', () => {
        const { input, renderResult } = render(null, null, { value: 'ReactWorld' });
        fireEvent.blur(input);
        expect(input.value).toBe('ReactWorld');
    });

    test('detail is populated with invalid state', () => {
        const onBlur = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(false);
        });

        const { input, renderResult } = render(null, null, { value: 'ReactWorld', onBlur });
        fireEvent.blur(input);
        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    test('detail is populated with valid state', () => {
        const onBlur = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(true);
        });

        const { input, renderResult } = render(null, null, { value: 'TheCodingWorld@React56431', onBlur });
        fireEvent.blur(input);
        expect(onBlur).toHaveBeenCalledTimes(1);
    });

})

describe('keyPress', () => {
    test('detail is not populated', () => {
        const onKeyPress = jest.fn((e) => {
            expect(e.detail).toBeNull();
        });

        const { input } = render(null, null, { onKeyPress });
        fireEvent.keyPress(input, keyPressEvent(1));
        expect(onKeyPress).toHaveBeenCalledTimes(1);
    });

})

describe('detail onChange', () => {

    function onChangeSpy(key) {

        const onChange = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(false);
            expect(e.detail.metadata).not.toBeNull();

            const metadata = e.detail.metadata;
            const isGreaterThan0 = metadata.length > 0;

            expect(isGreaterThan0).toBe(true);

            const filter = metadata.filter(n => n.attribute === key);
            expect(filter).not.toBeNull();
            expect(filter.length).toBe(1);
        });

        return onChange;
    }

    test('detail is invalid with capital', () => {

        const onChange = onChangeSpy('capital');

        const { input } = render(null, null, { onChange });
        fireEvent.change(input, { target: { value: 'thecodingworld@react5' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('detail is invalid with minLength', () => {
        const onChange = onChangeSpy('minLength');

        const { input } = render(null, null, { onChange });
        fireEvent.change(input, { target: { value: 'The@5' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('detail is invalid with maxLength', () => {
        const onChange = onChangeSpy('maxLength');

        const { input } = render(null, null, { onChange, ...customPc({ maxLength: 10 }) });
        fireEvent.change(input, { target: { value: 'Thecodingworld@react5' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('detail is invalid with number sequence', () => {
        const onChange = onChangeSpy('numberSeq');

        const { input } = render(null, null, { onChange });
        fireEvent.change(input, { target: { value: 'Theco@!123456' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('detail is invalid with number sequence reverse', () => {
        const onChange = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(true);
        });

        const { input } = render(null, null, { onChange });
        fireEvent.change(input, { target: { value: 'Theco@!654321' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('detail is invalid with character sequence', () => {
        const onChange = onChangeSpy('characterSeq');

        const { input } = render(null, null, { onChange });
        fireEvent.change(input, { target: { value: 'The12co@abcdefg' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('detail is invalid with character sequence reverse', () => {
        const onChange = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(true);
        });

        const { input } = render(null, null, { onChange });
        fireEvent.change(input, { target: { value: 'The12co@gfedcba' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('detail is invalid with number count', () => {
        const onChange = onChangeSpy('numberCount');

        const { input } = render(null, null, { onChange });
        fireEvent.change(input, { target: { value: 'TheTRVC$#EEss' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('detail is invalid with symbols', () => {
        const onChange = onChangeSpy('symbols');

        const { input } = render(null, null, { onChange });
        fireEvent.change(input, { target: { value: 'The543hgcjdgf' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('detail is valid', () => {
        const onChange = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(true);
        });

        const { input } = render(null, null, { onChange });
        fireEvent.change(input, { target: { value: 'Thecodingworld@react5' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

})

describe('detail onBlur', () => {

    function onBlurSpy(key) {

        const onBlur = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(false);
            expect(e.detail.metadata).not.toBeNull();

            const metadata = e.detail.metadata;
            const isGreaterThan0 = metadata.length > 0;

            expect(isGreaterThan0).toBe(true);

            const filter = metadata.filter(n => n.attribute === key);
            expect(filter).not.toBeNull();
            expect(filter.length).toBe(1);
        });

        return onBlur;
    }

    test('detail is invalid with capital', () => {

        const onBlur = onBlurSpy('capital');

        const { input } = render(null, null, { onBlur });
        fireEvent.blur(input, { target: { value: 'thecodingworld@react5' } });
        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    test('detail is invalid with minLength', () => {
        const onBlur = onBlurSpy('minLength');

        const { input } = render(null, null, { onBlur });
        fireEvent.blur(input, { target: { value: 'The@5' } });
        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    test('detail is invalid with maxLength', () => {
        const onBlur = onBlurSpy('maxLength');

        const { input } = render(null, null, { onBlur, ...customPc({ maxLength: 10 }) });
        fireEvent.blur(input, { target: { value: 'Thecodingworld@react5' } });
        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    test('detail is invalid with number sequence', () => {
        const onBlur = onBlurSpy('numberSeq');

        const { input } = render(null, null, { onBlur });
        fireEvent.blur(input, { target: { value: 'Theco@!123456' } });
        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    test('detail is invalid with number sequence reverse', () => {
        const onBlur = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(true);
        });

        const { input } = render(null, null, { onBlur });
        fireEvent.blur(input, { target: { value: 'Theco@!654321' } });
        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    test('detail is invalid with character sequence', () => {
        const onBlur = onBlurSpy('characterSeq');

        const { input } = render(null, null, { onBlur });
        fireEvent.blur(input, { target: { value: 'The12co@abcdefg' } });
        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    test('detail is invalid with character sequence Caps', () => {
        const onBlur = onBlurSpy('characterSeq');

        const { input } = render(null, null, { onBlur });
        fireEvent.blur(input, { target: { value: 'The12co@ABCDEFG' } });
        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    test('detail is invalid with character sequence reverse', () => {
        const onBlur = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(true);
        });

        const { input } = render(null, null, { onBlur });
        fireEvent.blur(input, { target: { value: 'The12co@gfedcba' } });
        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    test('detail is invalid with number count', () => {
        const onBlur = onBlurSpy('numberCount');

        const { input } = render(null, null, { onBlur });
        fireEvent.blur(input, { target: { value: 'TheTRVC$#EEss' } });
        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    test('detail is invalid with symbols', () => {
        const onBlur = onBlurSpy('symbols');

        const { input } = render(null, null, { onBlur });
        fireEvent.blur(input, { target: { value: 'The543hgcjdgf' } });
        expect(onBlur).toHaveBeenCalledTimes(1);
    });

    test('detail is valid', () => {
        const onBlur = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(true);
        });

        const { input } = render(null, null, { onBlur });
        fireEvent.blur(input, { target: { value: 'Thecodingworld@react5' } });
        expect(onBlur).toHaveBeenCalledTimes(1);
    });

})

// VeryStrong = 'VeryStrong',
// Strong = 'Strong',
// Good = 'Good',
// Weak = 'Weak',
// VeryWeak = 'VeryWeak',

describe('password strength', () => {

    function onChangeSpy(key, value) {
        const onChange = jest.fn((e) => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(false);
            expect(e.detail.metadata).not.toBeNull();

            const metadata = e.detail.metadata;
            const isGreaterThan0 = metadata.length > 0;

            expect(isGreaterThan0).toBe(true);

            const filter = metadata.filter(n => n.attribute === key);
            expect(filter).not.toBeNull();
            expect(filter.length).toBe(1);

            const found = filter[0];

            expect(found.metadata.strength).toBe(value);
        });

        return onChange;
    }

    test('Very Weak', () => {

        const onChange = onChangeSpy('strength', PasswordStrength.VeryWeak);

        const { input } = render(null, null, { onChange });
        fireEvent.change(input, { target: { value: 'Re' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('Weak', () => {

        const onChange = onChangeSpy('strength', PasswordStrength.Weak);

        const { input } = render(null, null, { onChange });
        fireEvent.change(input, { target: { value: 'ReactWorld' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('Strong', () => {
        const onChange = onChangeSpy('strength', PasswordStrength.Strong);

        const { input } = render(null, null, { onChange });
        fireEvent.change(input, { target: { value: 'ReactWorld@Code' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('Very Strong', () => {
        const onChange = onChangeSpy('strength', PasswordStrength.VeryStrong);

        const { input } = render(null, null, { onChange });
        fireEvent.change(input, { target: { value: 'ReactWorld@Code&^%' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });
})
