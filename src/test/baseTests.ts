import { render, screen, queryAllByAttribute, fireEvent, waitForElement, getByLabelText, RenderResult } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect';

export function renderControl<T = HTMLInputElement>(component: React.ReactElement<any>, key: string): IRenderControlReturn<T> {
    const renderResult = render(component);
    const input = renderResult.getByLabelText(key);
    //@ts-ignore
    return { input: (input as T), renderResult };
}

interface IRenderControlReturn<T> {
    input: T,
    renderResult: RenderResult
}

function getAscii(data: number | string): string {
    if (data === 0) return '48';
    if (data === 1) return '49';
    if (data === 'A') return '65';
    if (data === 'a') return '97';
    if (data === ' ') return '32';
    if (data === '.') return '250';
    return '';
}

export const keyPressEvent = (key: number | string) => {
    const keyText = `${key}`;
    const charCode = getAscii(key);
    return { key: keyText, code: keyText, keyCode: charCode, charCode }
}
