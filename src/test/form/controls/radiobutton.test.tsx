import * as React from 'react'
import { fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import { renderControl } from '../../baseTests';
import RadioButton from '../../../components/form/controls/radioButton';

function render(component: React.ReactElement<any> | null = null, key: string | null = null) {

    const comp = component || <RadioButton aria-label='radio-input' />;
    const id = key || 'radio-input';
    return renderControl(comp, id);
}

describe('Rendering', () => {
    test('RadioButton rendering', async () => {
        const { input, renderResult } = render();

        expect(input).not.toBeNull();
        expect(input.checked).toBe(false);
    });

    test('RadioButton rerender', async () => {
        let { input, renderResult } = render(<RadioButton aria-label='radio-input' checked={true} />);
        expect(input.checked).toBe(true);

        renderResult.rerender(<RadioButton aria-label='radio-input' checked={false} />);

        expect(input).not.toBeNull();
        expect(input.checked).toBe(false);

        renderResult.rerender(<RadioButton aria-label='radio-input' checked={false} />);
        expect(input).not.toBeNull();
        expect(input.checked).toBe(false);

        renderResult.rerender(<RadioButton aria-label='radio-input' checked={true} />);
        expect(input).not.toBeNull();
        expect(input.checked).toBe(true);
    });
});

describe('onChange', () => {
    test('RadioButton on Change', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { checked: true } });
        expect(input.checked).toBe(true);

        fireEvent.change(input, { target: { checked: false } });
        expect(input.checked).toBe(false);

        fireEvent.change(input, { target: { checked: false } });
        expect(input.checked).toBe(false);
    });
});

describe('onBlur', () => {

    test('RadioButton on blur with 1', async () => {

        const blurSpy = jest.fn((e) => {
            expect(e).not.toBeNull();
            expect(e.target.checked).toBe(true);
        });

        const { input } = render(<RadioButton aria-label='radio-input' onBlur={blurSpy} />);

        fireEvent.blur(input, { target: { checked: 1 } });
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    test('RadioButton on blur with 0', async () => {

        const blurSpy = jest.fn((e) => {
            expect(e).not.toBeNull();
            expect(e.target.checked).toBe(false);
        });

        const { input } = render(<RadioButton aria-label='radio-input' onBlur={blurSpy} />);

        fireEvent.blur(input, { target: { checked: 0 } });
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

});

describe('detail', () => {

    xtest('RadioButton detail with change', async () => {

        function validate(e: any) {
            expect(e).not.toBeNull();
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(true);
        }

        const blurSpy = jest.fn((e) => validate(e));
        const changeSpy = jest.fn((e) => validate(e));

        const { input } = render(<RadioButton aria-label='radio-input' onBlur={blurSpy} onChange={changeSpy} />);

        fireEvent.change(input, { target: { checked: true } });

        expect(changeSpy).toHaveBeenCalledTimes(1);
    });
});
