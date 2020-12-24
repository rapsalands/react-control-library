# React-Control-Library

[![npm version](https://badge.fury.io/js/react-control-library.svg)](//badge.fury.io/js/react-control-library)

## Install
```
npm install react-control-library

# or

yarn add react-control-library

```

## Example
```jsx
import React from 'react';
import { SecureMaskedInput } from 'react-control-library';

const App = () => {

    const ssnMask = [/^[0-9]*$/, /^[0-9]*$/, /^[0-9]*$/, '-', /^[0-9]*$/, /^[0-9]*$/, '-', /^[0-9]*$/, /^[0-9]*$/, /^[0-9]*$/, /^[0-9]*$/];

    const [ssn, setSsn] = React.useState('');

    return (
        <SecureMaskedInput
            mask={ssnMask}
            value={ssn}
            onChange={(e: any) => setSsn(e.target.value)}
            secure={{
                getValue: (detail, ssnValue) => {
                    return '***-HIDDEN';
                }
            }}
        />
    );
};

export default App;
```


## Demo
Please try [react-control-library](https://codesandbox.io/s/react-control-library-kkbeh) controls on CodeSandbox.

## Controls
1. MaskedInput
2. SecureMaskedInput
3. NumberInput
4. DecimalInput
5. Password
6. Alphanumeric
7. TextInput
8. Email
9. Checkbox
10. RadioButton

## About
This project provides some awesome light weight controls for every web application that is designed and developed. They are developed upon pure HTML input controls and hence can be used and styled in a known manner. Controls can be styled using any styling library like BootStrap.

React-Control-Library was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). They are easy to use in any web application, easy to integrate with any third party libraries like ReactStrap, Material UI. Upon integration with ReactStrap or Material UI, you can have ReactStrap or Material UI controls working usually with all functionalities of this library.

## Salient Features

##### Detail & Validation
All RCL controls (except Checkbox and RadioButton) comes with some validation features in-built which helps developers avoid writing repeated code. It makes development faster and convenient.

On every control `onChange` and `onBlur` event, eventArgs are populated with `detail` object. This behavior can be seen in [demo](https://codesandbox.io/s/react-control-library-kkbeh) for all controls.

Below is the schema for the detail object (in terms of typescript).

    isValid: boolean,
    value: any
    attribute: string | null,
    metadata?: any[]
    detail: any

* `isValid` (boolean)
    - Denotes weather the control is in valid or invalid state.
    - This flag is derived by based on various attributes that are sent to the controls.
    - In case of `SecureMaskedInput`, when value of the control is being set by the parent container/page, the `metadata` may contains value as `['Unknown Validity']`. In these cases `isValid` flag maybe incorrect. This documentation will updated once this is addressed nicely :).
* `value` (any)
    - Holds value of the control. We can continue to use `e.target.value` in order to fetch the value.
    - However in cases like `MaskedInput` and other such controls like phone number with format `(987) 654-3210`, `e.target.value` will provide the value in the same above format. But `e.detail.value` should provide you the actual value like `9876543210`.
* `attribute` (string | null)
    - When control is in invalid state, this attribute provides info on which attribute makes the control invalid.

        For example, in code `<NumberInput min={100} >` if user enters 50, then `e.detail` in `onChange` and `onBlur` should be populated with `isValid: false` and `attribute: min`.

    - When attribute value is `userinput` it denotes that the control is in invalid state due to behavior provided by rcl library.
    For example, if a user enters invalid email format in `Email` control, then attribute should be populated with `userInput` value.
* `metadata` (any[])
    - This attribute is populated to provide further information about the state of control if needed.
    - Look for `Password` control. In case control is valid, then metadata is populated with `strength` of the password. In case it is invalid, metedata is populated with all the password violations and strength of the password.
* `detail` (any)
    - This is populated with original `e.detail` value.
    - The value will be mostly null until set explictly.

##### Attributes
RCL controls accept all attribtes that of HTML input controls. However there are additional attributes introduced with this library to perform additional validation.

* `exactLength` (number)
    - This attribute can be passed to see if user input the control value is of exact length passed by user.
    - If user input is not that of length passed by user, validation is considered as failed and `e.detail.isValid` is populated with `false` flag. `e.detail.attribute` will hold `exactLength` as value.
* `mask` (any[])
    - This attribute can be passed to `MaskedInput` and `SecureMaskedInput` control.
    - They are generally array of strings and regex to hold a mask on the control. See [demo](https://codesandbox.io/s/react-control-library-kkbeh) for more details on usage.
    - In case the mask is empty array, the control behaves without any masking and any of the characters are allowed.
* `inputTag` (React Component)
    - RCL controls can be integrated with any third party libraries like ReactStrap, Material UI.
    - For example, we can pass `Input` from ReactStrap as `inputTag` attribute. Like `<NumberInput inputTag={Input}`.
* `detailModes` (string[])
    - This attribute decides on which event `e.detail` is populated.
    - Possible values: `onChange`, `onBlur`, `onKeyPress`, `none`.
    - Default value is `["onChange", "onBlur"]`.
* `decimalLimit` (number)
    - This attribute is specific to `DecimalInput` control. It limits the decimal point on the decimal value.
    - Default value is `4`.
* `allowSymbols` (string)
    - `AlphaNumeric` control allows only numbers, A-Z and a-z.
    - This attribute is specific to `AlphaNumeric` control. And allows any symbols passed in the control.
    - For example, `<AlphaNumeric allowSymbols="@._" />` will allow '@', '_', '.' along with alphanumeric values.
* `restrictSymbols` (string)
    - `TextInput` control allows any characters to be typed by user.
    - This attribute is specific to `TextInput` control. And restricts any symbols passed in the control.
    - For example, `<TextInput restrictSymbols="@._" />` will restrict '@', '_', '.' characters to be typed by user.
* `passwordCriteria` (object)
    - This attribute is specific to `Password` control.
    - It specifies the criteria for a password.
        1. `capital`: (number): Minimum number of capital characters required. Defaults to `1`;
        2. `minLength`: (number): Minimum number of characters required. Defaults to `8`;
        3. `maxLength`: (number): Maximum number of characters allowed. Defaults to `0` which means infinite.;
        4. `numberCount`: (number): Minimum numbers required. Defaults to `1`.;
        5. `symbols`: (number): Minimum number of symbols required. Defaults to `1`.;
        6. `restrictSymbols`: (string): Characters that are not allowed in password. User will be allowed to type the characters however.
        7. `sequence`: (object): Maximum sequence of characters allowed.
            a. `number`: (number): Defaults to `5`. Means 6 or more consecutve numbers are considered invalid password.
            b. `characters`: (number): Defaults to `5`. Means 6 or more consecutve characters are considered invalid password.
* `secure` (object)
    - This attribute is specific to `SecureMaskedInput` control.
    - This provides the secure format of value when user leaves the control.
    - Function `getValue` is called to get the formatted text.
    - Original masking is not respected while showing secure text.
* `indeterminate` (boolean)
    - This attribute is specific to `Checkbox` control.
    - When trues, checkbox is rendered as partially checked.
    - See [demo](https://codesandbox.io/s/react-control-library-kkbeh) for more usage.

##### Copy and Paste

##### Seamless Integraton with Third Library controls

