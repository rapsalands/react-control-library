interface IBaseInput extends React.HTMLProps<HTMLInputElement> {

}

export interface ICustomInputProps extends IBaseInput {
    isValid?: (data: any) => boolean
}
