import * as React from 'react'
import { fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';
import { renderControl } from '../../baseTests';
import userEvent from '@testing-library/user-event'
import Checkbox from '../../../components/form/controls/checkbox';

function render(component: React.ReactElement<any> | null = null, key: string | null = null) {

    const comp = component || <Checkbox aria-label='checkbox-input' />;
    const id = key || 'checkbox-input';
    return renderControl(comp, id);
}

describe('Rendering', () => {
    test('Checkbox rendering', async () => {
        const { input, renderResult } = render();

        expect(input).not.toBeNull();
        expect(input.checked).toBe(false);
        expect(input.indeterminate).toBe(false);
    });

    test('Checkbox rerender', async () => {
        let { input, renderResult } = render(<Checkbox aria-label='checkbox-input' checked={true} />);
        expect(input.checked).toBe(true);
        expect(input.indeterminate).toBe(false);

        renderResult.rerender(<Checkbox aria-label='checkbox-input' checked={false} />);

        expect(input).not.toBeNull();
        expect(input.checked).toBe(false);
        expect(input.indeterminate).toBe(false);

        renderResult.rerender(<Checkbox aria-label='checkbox-input' checked={false} indeterminate={true} />);
        expect(input).not.toBeNull();
        expect(input.checked).toBe(false);
        expect(input.indeterminate).toBe(true);

        renderResult.rerender(<Checkbox aria-label='checkbox-input' checked={true} indeterminate={false} />);
        expect(input).not.toBeNull();
        expect(input.checked).toBe(true);
        expect(input.indeterminate).toBe(false);
    });
});

describe('onChange', () => {
    test('Checkbox on Change', async () => {

        const { input } = render();

        fireEvent.change(input, { target: { checked: true } });
        expect(input.checked).toBe(true);

        fireEvent.change(input, { target: { checked: false } });
        expect(input.checked).toBe(false);

        fireEvent.change(input, { target: { checked: false, indeterminate: true } });
        expect(input.checked).toBe(false);
        expect(input.indeterminate).toBe(true);
    });
});

describe('onBlur', () => {

    test('Checkbox on blur with 1', async () => {

        const blurSpy = jest.fn((e) => {
            expect(e).not.toBeNull();
            expect(e.target.checked).toBe(true);
        });

        const { input } = render(<Checkbox aria-label='checkbox-input' onBlur={blurSpy} />);

        fireEvent.blur(input, { target: { checked: 1 } });
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    test('Checkbox on blur with 0', async () => {

        const blurSpy = jest.fn((e) => {
            expect(e).not.toBeNull();
            expect(e.target.checked).toBe(false);
        });

        const { input } = render(<Checkbox aria-label='checkbox-input' onBlur={blurSpy} />);

        fireEvent.blur(input, { target: { checked: 0 } });
        expect(blurSpy).toHaveBeenCalledTimes(1);
    });

});

describe('detail', () => {

    test('Checkbox detail with change', async () => {

        function validate(e: any) {
            expect(e).not.toBeNull();
            expect(e.detail).not.toBeNull();
            expect(e.detail.isValid).toBe(true);
        }

        const changeSpy = jest.fn((e) => validate(e));

        const { input } = render(<Checkbox aria-label='checkbox-input' onChange={changeSpy} />);

        fireEvent.click(input);
        expect(changeSpy).toHaveBeenCalledTimes(1);
    });
});
