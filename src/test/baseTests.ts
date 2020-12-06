import { render, screen, queryAllByAttribute, fireEvent, waitForElement, getByLabelText,  RenderResult } from '@testing-library/react'
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
