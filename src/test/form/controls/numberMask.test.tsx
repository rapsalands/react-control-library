import * as React from 'react'
import { fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import { keyPressEvent, renderControl } from '../../baseTests';
import userEvent from '@testing-library/user-event'
import NumberMask from '../../../components/form/controls/numberMask';
import { INumberMask } from '../../../components/shared/interfacesDelegates/controlInterfaces';

function defaultMask() {
    return {
        prefix: '$',
        suffix: '#',
        thousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        decimalSymbol: '.',
        decimalLimit: 4,
        maxLength: 20,
        negativeAllowed: true,
    } as INumberMask;
}

function customMask(params) {
    return {
        mask: {
            ...defaultMask(),
            ...params
        }
    };
}

const ariaLabel = 'nm-input';

function getComponent(props: any = {}) {
    return <NumberMask mask={defaultMask()} aria-label={ariaLabel} {...props} />;
}

function render(props: any = {}, component: React.ReactElement<any> | null = null) {
    const comp = component || getComponent(props);
    const id = props.ariaLabel || ariaLabel;
    return renderControl(comp, id);
}

describe('Rendering', () => {
    test('NumberMask rendering', async () => {
        const { input, renderResult } = render();

        expect(input).not.toBeNull();
        expect(input.value).toBe('');
    });

    test('NumberMask rerender', async () => {
        let { input, renderResult } = render({ value: '750' });
        expect(input.value).toBe('$750#');

        renderResult.rerender(getComponent({ value: '800' }));
        expect(input).not.toBeNull();
        expect(input.value).toBe('$800#');
    });

    test('NumberMask rerender with numbers formatted as commas', async () => {
        let { input, renderResult } = render({ value: '75005' });
        expect(input.value).toBe('$75,005#');

        renderResult.rerender(getComponent({ value: '80030' }));
        expect(input).not.toBeNull();
        expect(input.value).toBe('$80,030#');
    });

    test('NumberMask rerender with numbers formatted as commas with decimal', async () => {
        let { input, renderResult } = render({ value: '75005.875' });
        expect(input.value).toBe('$75,005.875#');

        renderResult.rerender(getComponent({ value: '80030.5638' }));
        expect(input).not.toBeNull();
        expect(input.value).toBe('$80,030.5638#');
    });

    test('NumberMask rerender with numbers formatted as commas with decimal negative', async () => {
        let { input, renderResult } = render({ value: '-75005.875' });
        expect(input.value).toBe('-$75,005.875#');
    });

    test('NumberMask rerender with numbers formatted as commas with decimal invalid negative', async () => {
        let { input, renderResult } = render({ value: '75-005.875' });
        expect(input.value).toBe('$75,005.875#');
    });

    test('NumberMask rerender with numbers formatted as commas with invalid maxlength decimal', async () => {
        let { input, renderResult } = render({ value: '75005.87534' });
        expect(input.value).toBe('$75,005.8753#');
    });

    test('NumberMask rerender with mixed numeric and text', async () => {
        let { input, renderResult } = render({ value: '750qwe' });

        expect(input.value).toBe('$750#');

        renderResult.rerender(getComponent({ value: 'Test890!@#' }));
        expect(input).not.toBeNull();
        expect(input.value).toBe('$890#');
    });

    test('NumberMask render with invalid and valid characters', async () => {
        let { input } = render({ value: '!@^^*#$%)(*' });
        expect(input.value).toBe('');
    });
});

describe('onChange', () => {

    test('valid numbers', async () => {
        const { input } = render();
        fireEvent.change(input, { target: { value: '5000' } });
        expect(input.value).toBe('$5,000#');
    });

    test('mixed characters', async () => {
        const { input } = render();
        fireEvent.change(input, { target: { value: 'w5word0e0tt0r' } });
        expect(input.value).toBe('$5,000#');

    });

    test('negative numbers', async () => {
        const { input } = render();
        fireEvent.change(input, { target: { value: '-98690' } });
        expect(input.value).toBe('-$98,690#');
    });

    test('negative decimals', async () => {
        const { input } = render();
        fireEvent.change(input, { target: { value: '-98690.8778' } });
        expect(input.value).toBe('-$98,690.8778#');
    });

    test('decimal numbers', async () => {
        const { input } = render();
        fireEvent.change(input, { target: { value: '-98690' } });
        expect(input.value).toBe('-$98,690#');
    });

    test('only symbols', async () => {
        const { input } = render();
        fireEvent.change(input, { target: { value: '$&*^*&^^*#' } });
        expect(input.value).toBe('');
    });

    test('only zero', async () => {
        const { input } = render();
        fireEvent.change(input, { target: { value: '0' } });
        expect(input.value).toBe('$0#');
    });

    test('only zero negative', async () => {
        const { input } = render();
        fireEvent.change(input, { target: { value: '-0' } });
        expect(input.value).toBe('-$0#');
    });

    test('decimal in end', async () => {
        const { input } = render();
        fireEvent.change(input, { target: { value: '978.' } });
        expect(input.value).toBe('$978.#');
    });

    test('multiple zeros', async () => {
        const { input } = render();
        fireEvent.change(input, { target: { value: '0000' } });
        expect(input.value).toBe('$0,000#');
    });

    test('only alphabets', async () => {
        const { input } = render();
        fireEvent.change(input, { target: { value: 'reactWorld' } });
        expect(input.value).toBe('');
    });

    test('multiple decimals', async () => {
        const { input } = render();
        fireEvent.change(input, { target: { value: '87.234.123.53.5231.3432' } });
        expect(input.value).toBe('$87.2341#');

    });

});

describe('onBlur', () => {

    test('decimal in end', async () => {
        const { input } = render({ value: '4120.' });
        fireEvent.blur(input);
        expect(input.value).toBe('$4,120.#');
    });

    test('only zero', async () => {
        const { input } = render({ value: '0' });
        fireEvent.blur(input);
        expect(input.value).toBe('$0#');
    });

    test('only decimal', async () => {
        const { input } = render({ value: '.' });
        fireEvent.blur(input);
        expect(input.value).toBe('$0.#');
    });

    test('valid numbers', async () => {
        const { input } = render({ value: '4120' });
        fireEvent.blur(input);
        expect(input.value).toBe('$4,120#');
    });

});

describe('onChange detail', () => {

    test('valid numbers', async () => {

        const onChange = jest.fn(e => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(true);
            expect(e.detail.attribute).toBeNull();
        });

        const { input } = render({ onChange, min: 100 });
        fireEvent.change(input, { target: { value: '150' } });

        expect(onChange).toHaveBeenCalledTimes(1);

    });

    test('only zero', async () => {

        const onChange = jest.fn(e => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(true);
            expect(e.detail.attribute).toBeNull();
        });

        const { input } = render({ onChange });
        fireEvent.change(input, { target: { value: '0' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('invalid min', async () => {
        const onChange = jest.fn(e => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(false);
            expect(e.detail.attribute).toBe('min');
        });

        const { input } = render({ onChange, min: 100 });
        fireEvent.change(input, { target: { value: '50' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('invalid min negative', async () => {
        const onChange = jest.fn(e => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(false);
            expect(e.detail.attribute).toBe('min');
        });

        const { input } = render({ onChange, min: -50 });
        fireEvent.change(input, { target: { value: '-90' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('invalid max negative', async () => {
        const onChange = jest.fn(e => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(false);
            expect(e.detail.attribute).toBe('max');
        });

        const { input } = render({ onChange, max: -50 });
        fireEvent.change(input, { target: { value: '-10' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('decimal in end', async () => {
        const onChange = jest.fn(e => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(true);
            expect(e.detail.attribute).toBeNull();
        });

        const { input } = render({ onChange });
        fireEvent.change(input, { target: { value: '345.' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

});

describe('onBlur detail', () => {

    test('valid numbers', async () => {

        const onChange = jest.fn(e => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(true);
            expect(e.detail.attribute).toBeNull();
        });

        const { input } = render({ onChange, min: 100 });
        fireEvent.change(input, { target: { value: '150' } });

        expect(onChange).toHaveBeenCalledTimes(1);

    });

    test('only zero', async () => {

        const onChange = jest.fn(e => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(true);
            expect(e.detail.attribute).toBeNull();
        });

        const { input } = render({ onChange });
        fireEvent.change(input, { target: { value: '0' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('invalid min', async () => {
        const onChange = jest.fn(e => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(false);
            expect(e.detail.attribute).toBe('min');
        });

        const { input } = render({ onChange, min: 100 });
        fireEvent.change(input, { target: { value: '50' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('invalid min negative', async () => {
        const onChange = jest.fn(e => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(false);
            expect(e.detail.attribute).toBe('min');
        });

        const { input } = render({ onChange, min: -50 });
        fireEvent.change(input, { target: { value: '-90' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('invalid max negative', async () => {
        const onChange = jest.fn(e => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(false);
            expect(e.detail.attribute).toBe('max');
        });

        const { input } = render({ onChange, max: -50 });
        fireEvent.change(input, { target: { value: '-10' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('decimal in end', async () => {
        const onChange = jest.fn(e => {
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(true);
            expect(e.detail.attribute).toBeNull();
        });

        const { input } = render({ onChange });
        fireEvent.change(input, { target: { value: '345.' } });
        expect(onChange).toHaveBeenCalledTimes(1);
    });


});
