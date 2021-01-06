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
[React-Control-Library](https://codesandbox.io/s/react-control-library-demo-kkbeh)

[React-Control-Library With Material UI](https://codesandbox.io/s/react-control-library-demo-materialui-dyl2v)

[React-Control-Library With ReactStrap](https://codesandbox.io/s/react-control-library-reactstrap-demo-5qocq)

## Controls
1. [NumberMask](#NumberMask)
2. [MaskedInput](#MaskedInput)
3. [SecureMaskedInput](#SecureMaskedInput)
4. [NumberInput](#NumberInput)
5. [DecimalInput](#DecimalInput)
6. [Password](#Password)
7. [Alphanumeric](#Alphanumeric)
8. [TextInput](#TextInput)
9. [Email](#Email)
10. [Checkbox](#Checkbox)
11. [RadioButton](#RadioButton)

## About
This project provides some awesome light weight controls for every web application that is designed and developed. They are developed upon pure HTML input controls and hence can be used and styled in a known manner. Controls can be styled using any styling library like BootStrap.

React-Control-Library was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). They are easy to use in any web application, easy to integrate with any third party libraries like ReactStrap, Material UI. Upon integration with ReactStrap or Material UI, you can have ReactStrap or Material UI controls working usually with all functionalities of this library.

## Salient Features

#### Detail & Validation
All RCL controls (except Checkbox and RadioButton) comes with some validation features in-built which helps developers avoid writing repeated code. It makes development faster and convenient.

On every control `onChange` and `onBlur` event, eventArgs are populated with `detail` object. This behavior can be seen in [demo](https://codesandbox.io/s/react-control-library-demo-kkbeh) for all controls.

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

    - When attribute value is `userInput` it denotes that the control is in invalid state due to behavior provided by rcl library.
    For example, if a user enters invalid email format in `Email` control, then attribute should be populated with `userInput` value.
* `metadata` (any[])
    - This attribute is populated to provide further information about the state of control if needed.
    - Look for `Password` control. In case control is valid, then metadata is populated with `strength` of the password. In case it is invalid, metadata is populated with all the password violations and strength of the password.
* `detail` (any)
    - This is populated with original `e.detail` value.
    - The value will be mostly null until set explicitly.

#### Attributes
RCL controls accept all attributes that of HTML input controls. However there are additional attributes introduced with this library to perform additional validation.

* `exactLength` (number)
    - This attribute can be passed to see if user input the control value is of exact length passed by user.
    - If user input is not that of length passed by user, validation is considered as failed and `e.detail.isValid` is populated with `false` flag. `e.detail.attribute` will hold `exactLength` as value.
* `hasError` (boolean)
    - When passed as true, this will assign a `class` to control with value `rcl-control-error`.
    - Class `rcl-control-error` will also be assigned when `e.detail.isValid` is false on `onChange` and `onBlur` event.
    - This attribute is present for all controls.
* `mask` (any[])
    - This attribute can be passed to `MaskedInput` and `SecureMaskedInput` control.
    - They are generally array of strings and regex to hold a mask on the control. See [demo](https://codesandbox.io/s/react-control-library-demo-kkbeh) for more details on usage.
    - In case the mask is empty array, the control behaves without any masking and any of the characters are allowed.
* `mask` (object)
    - This attribute is specific to `NumberMask` control.
    - It provides configuration for `NumberMask` control.
        1. `prefix`: (string): Prefix string that will concatenated to the user input when entered. Defaults to `$`.
        2. `suffix`: (string): Suffix string that will concatenated to the user input when entered. Defaults to empty string.
        3. `thousandsSeparatorSymbol`: (string): Can be useful to format currency. String that will be used every thousand denomination of the user input. When passed empty string, nothing no formatting will be done at thousand denomination. Defaults to `,`.
        4. `decimalLimit`: (number): Maximum of decimal limit allowed in the user input. Defaults to `4`. If passed as `0`, then decimal will not be allowed.
        5. `decimalSymbol`: (string): String used to denote decimal point. Defaults to `.`. Will never be used if `decimalLimit` is passed as `0`.
        6. `maxLength`: (number): Maximum length of user input allowed. Defaults to 20. This length will exclude `thousandsSeparatorSymbol`, `decimalSymbol` etc.
        7. `negativeAllowed`: (boolean): Negative currency allowed is `true`. Defaults to `false`.
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
            a. `number`: (number): Defaults to `5`. Means 6 or more consecutive numbers are considered invalid password.
            b. `characters`: (number): Defaults to `5`. Means 6 or more consecutive characters are considered invalid password.
* `secure` (object)
    - This attribute is specific to `SecureMaskedInput` control.
    - This provides the secure format of value when user leaves the control.
    - Function `getValue` is called to get the formatted text.
    - Original masking is not respected while showing secure text.
* `indeterminate` (boolean)
    - This attribute is specific to `Checkbox` control.
    - When trues, checkbox is rendered as partially checked.
    - See [demo](https://codesandbox.io/s/react-control-library-demo-kkbeh) for more usage.

#### Copy/Paste & Drag/Drop
* RCL controls do allow copy/paste or drag/drop of text into the controls.
* Only valid characters are accepted upon action for that specific control.
* For example, `<NumberInput />` upon dragging and dropping text of `425 123 4567` or `(425) 123-4567`, only `4251234567` will be seen and accepted in the control.
#### Seamless Integration with Third Library controls
* RCL controls are designed to provide awesome and useful functionality. However they do not come with any predefined styles.
* RCL controls can be integrated with any third party controls. Any Component to be rendered can be passed as `inputTag`.
* For example, `<NumberInput inputTag={TextField} />` will render `TextField` from `@material-ui/core` with functionality of `NumberInput` control.
* Please note that, any custom-attributes like `label`, `passing children for Checkbox/RadioButton`, `indeterminate` etc. may or may not work based on the implementation of third party control and how they handle that attribute internally.

## Controls
##### <a name="NumberMask"></a> ## NumberMask

[NumberMask](https://codesandbox.io/s/react-control-library-numbermask-mhplf)

[NumberMask with Material UI](https://codesandbox.io/s/react-control-library-numbermask-materialui-mfkt2)

[NumberMask With ReactStrap](https://codesandbox.io/s/react-control-library-numbermask-reactstrap-xfdqk)

```jsx
import React from "react";
import { NumberMask } from "react-control-library";

const App = () => {

    const [data, setData] = React.useState('');

    function getNumberMask() {
        return {
            prefix: '$',
            suffix: '',
            thousandsSeparatorSymbol: ',',
            decimalSymbol: '.',
            decimalLimit: 4,
            maxLength: 20,
            negativeAllowed: false,
        };
    }

    return (
        <React.Fragment>
            Enter USD: <NumberMask mask={getNumberMask()} value={data} onChange={(e) => setData(e.target.value)} />
        </React.Fragment>
    );
};

export default App;
```

###### Attributes

1. Attribute `mask` must be passed to `NumberMask` control. `mask` is of type object.
2. Designed to take input of only numbers/digits  and symbols/string passed in `mask`.
3. Copy & Paste or Drag & Drop text from outside source must be formatted in control as per the `mask` provided.
4. `e.detail` will be populated on `onChange` and `onBlur` event by default.

<hr />

##### <a name="MaskedInput"></a> ## MaskedInput

[MaskedInput](https://codesandbox.io/s/react-control-library-maskedinput-n0tlk)

[MaskedInput with Material UI](https://codesandbox.io/s/react-control-library-maskedinput-materialui-gsbo0)

[MaskedInput With ReactStrap](https://codesandbox.io/s/react-control-library-maskedinput-reactstrap-sxtno)

```jsx
import React from "react";
import { MaskedInput } from "react-control-library";

const App = () => {
    const [data, setData] = React.useState();
    const phoneMask = () => ["(", /^[0-9]*$/, /^[0-9]*$/, /^[0-9]*$/, ")", " ", /^[0-9]*$/, /^[0-9]*$/, /^[0-9]*$/, "-", /^[0-9]*$/, /^[0-9]*$/, /^[0-9]*$/, /^[0-9]*$/];

    return (
        <React.Fragment>
            Enter Phone Number {" "}
            <MaskedInput
                mask={phoneMask()}
                value={data}
                onChange={(e) => setData(e.target.value)}
            />
        </React.Fragment>
    );
};

export default App;
````

###### Attributes

1. Attribute `mask` must be passed to `MaskedInput` control. `mask` is an array of `string` and `RegExp`.
2. Copy & Paste or Drag & Drop text from outside source must be formatted in textbox as per the `mask` provided.
3. Attribute `exactLength` ca be passed which will be used to determine the validity of the control. Validation will be done against the values falling under regex and not the hard coded values.
For example, if `mask` passed is `[/^[0-9]*$/, '-', /^[0-9]*$/, '-', /^[0-9]*$/]`, then validation for value `3-1-3` will done against value `313`.
4. `e.detail` will be populated on `onChange` and `onBlur` event by default.

<hr />

##### <a name="SecureMaskedInput"></a> ## SecureMaskedInput

[SecureMaskedInput](https://codesandbox.io/s/react-control-library-securemaskedinput-4u1yu)

[SecureMaskedInput with Material UI](https://codesandbox.io/s/react-control-library-securemaskedinput-forked-nz94n)

[SecureMaskedInput with ReactStrap](https://codesandbox.io/s/react-control-library-securemaskedinput-reactstrap-xb0m2)

```jsx
import React from "react";
import { SecureMaskedInput } from "react-control-library";

const App = () => {
  const [data, setData] = React.useState("");
  const n = /^[0-9]*$/;
  const cardMask = () => [n, n, n, n, " ", n, n, n, n, " ", n, n, n, n, " ", n, n, n, n];

  return (
    <React.Fragment>
      Enter Credit Card Number {" "}
      <SecureMaskedInput
        mask={cardMask()}
        secure={{
          getValue: (detail, data) => {
            if (detail.value.length < 16) {
              return data;
            }
            return `****-****-****-${detail.value.substring(
              detail.value.length - 4,
              detail.value.length
            )}`;
          }
        }}
        exactLength={16}
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
    </React.Fragment>
  );
};

export default App;
```

###### Attributes
1. Attribute `mask` must be passed to `SecureMaskedInput` control. `mask` is an array of `string` and `RegExp`.
2. Copy & Paste or Drag & Drop text from outside source must be formatted in textbox as per the `mask` provided.
3. Attribute `secure` must be passed to `SecureMaskedInput` control. `secure` is an object with a property `getValue`.
The return value of `getValue` function will be used as the value after user leaves the control.
`getValue` function gets 2 parameters, `detail` and currentValue of control.
4. Attribute `exactLength` ca be passed which will be used to determine the validity of the control. Validation will be done against the values falling under regex and not the hard coded values.
For example, if `mask` passed is `[/^[0-9]*$/, '-', /^[0-9]*$/, '-', /^[0-9]*$/]`, then validation for value `3-1-3` will done against value `313`.
5. `e.detail` will be populated on `onChange` and `onBlur` event by default.

<hr />

##### <a name="NumberInput"></a> ## NumberInput

[NumberInput](https://codesandbox.io/s/react-control-library-numberinput-y45ed)

[NumberInput with Material UI](https://codesandbox.io/s/react-control-library-numberinput-materialui-v72uy)

[NumberInput with ReactStrap](https://codesandbox.io/s/react-control-library-numberinput-reactstrap-g3lkg)

```jsx
import React from "react";
import { NumberInput } from "react-control-library";

const App = () => {
  const [data, setData] = React.useState("");

  return (
    <React.Fragment>
      Enter Numeric Characters {" "}
      <NumberInput value={data} onChange={(e) => setData(e.target.value)} />
    </React.Fragment>
  );
};

export default App;
```

###### Attributes
1. Attribute `max` restricts the user character input if validation fails. This is unlike traditional controls who allows user input even when max validation fails.
2. Attributes like `min`, `minLength`, `max`, `maxLength`, and `exactLength` can be passed to control to validate various conditions. All validation result will be present in `e.detail`.
3. Copy & Paste or Drag & Drop text from outside source must be take numbers only from the text.
4. During Copy & Paste or Drag & Drop, if validation fails based on the attributes passed, the value of control must not change and should remain as it was before user action.

<hr />

##### <a name="DecimalInput"></a> ## DecimalInput

[DecimalInput](https://codesandbox.io/s/react-control-library-decimalinput-uyrtb)

[DecimalInput with Material UI](https://codesandbox.io/s/react-control-library-decimalinput-materialui-ejymj)

[DecimalInput with ReactStrap](https://codesandbox.io/s/react-control-library-decimalinput-reactstrap-4x3jo)

```jsx
import React from "react";
import { DecimalInput } from "react-control-library";

const App = () => {
  const [data, setData] = React.useState("");

  return (
    <React.Fragment>
      Enter Decimal Value{" "}
      <DecimalInput
        maxLength={8}
        decimalLimit={2}
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
    </React.Fragment>
  );
};

export default App;
```

###### Attributes
1. Attribute `decimalLimit` restricts the characters after decimal point. Default value for this attribute is `4`.
2. Attribute `maxLength` is closely related to `decimalLimit`. Default value of `maxLength` is {20}.
3. For example, if `maxLength` value is `8` and `decimalLimit` is `2` then the control will allow the input in format of `NNNNN.NN`. That means `5` digits before decimal, 2 digits after decimal.
So `maxLength = 8 = 5 + 2 + dot`.
4. Attribute `max` will restrict user entry if validation fails for `max`.
5. Copy & Paste or Drag & Drop text from outside source must be take numbers and dot only from the text. All the validations will still be restricted during the action.
6. During Copy & Paste or Drag & Drop, if validation fails based on the attributes passed, the value of control must not change and should remain as it was before user action.

<hr />

##### <a name="Password"></a> ## Password
[Password](https://codesandbox.io/s/react-control-library-password-6zcte)

[Password with Material UI](https://codesandbox.io/s/react-control-library-password-materialui-30o6c)

[Password with ReactStrap](https://codesandbox.io/s/react-control-library-password-reactstrap-t5fq0)

```jsx
import React from "react";
import { Password } from "react-control-library";

const App = () => {
  const [data, setData] = React.useState("");

  const passCriteria = () => {
    return {
      capital: 1, // at least 1 capital
      minLength: 8, // must minimum length of password
      maxLength: 0, // Means no restriction
      numberCount: 1, // at least 1 number
      symbols: 1, // at least 1 symbol
      restrictSymbols: "", // any characters that are not allowed
      sequence: {
        number: 5, // max 5 consecutive numbers allowed.
        characters: 5 // max 5 consecutive characters allowed.
      }
    };
  };

  return (
    <React.Fragment>
      Enter Password{" "}
      <Password
        passwordCriteria={passCriteria()}
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
    </React.Fragment>
  );
};

export default App;
```

###### Attributes
1. Attribute `passwordCriteria` must be passed to `Password` control.
2. `passwordCriteria` is an object. Following are the properties of the object with their default values.
    - `capital`: 1, // at least 1 capital
    - `minLength`: 8, // must minimum length of password
    - `maxLength`: 0, // Means no restriction
    - `numberCount`: 1, // at least 1 number
    - `symbols`: 1, // at least 1 symbol
    - `restrictSymbols`: "", // any characters that are not allowed
    - `sequence`: {
      - `number`: 5, // max 5 consecutive numbers allowed.
      - `characters`: 5 // max 5 consecutive characters allowed.
    }
3. `e.detail.metadata`, an object array, provides additional information about the password typed by user.
4. `e.detail.metadata` array last item provides `Password Strength` of the user input.

<hr />

##### <a name="AlphaNumeric"></a> ## AlphaNumeric

[AlphaNumeric](https://codesandbox.io/s/react-control-library-alphanumeric-154n5)

[AlphaNumeric with Material UI](https://codesandbox.io/s/react-control-library-alphanumeric-materialui-klgh1)

[AlphaNumeric with ReactStrap](https://codesandbox.io/s/react-control-library-alphanumeric-reactstrap-ujoq6)

```jsx
import React from "react";
import { AlphaNumeric } from "react-control-library";

const App = () => {
  const [data, setData] = React.useState("");

  return (
    <React.Fragment>
      Enter Alpha Numeric Characters{" "}
      <AlphaNumeric
        allowSymbols="!#%&"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
    </React.Fragment>
  );
};

export default App;
```

###### Attributes
1. Control `AlphaNumeric` allows user to type only digits and alphabets in the control.
2. Attribute `allowSymbols` allows user to type additional characters apart from alpha numeric characters.
3. Copy & Paste or Drag & Drop text from outside source must be take alpha numeric characters and allowed symbols only.

<hr />

##### <a name="TextInput"></a> ## TextInput

[TextInput](https://codesandbox.io/s/react-control-library-textinput-ifl7u)

[TextInput with Material UI](https://codesandbox.io/s/react-control-library-textinput-materialui-qccbm)

[TextInput with ReactStrap](https://codesandbox.io/s/react-control-library-textinput-reactstrap-wx02q)

```jsx
import React from "react";
import { TextInput } from "react-control-library";

const App = () => {
  const [data, setData] = React.useState("");

  return (
    <React.Fragment>
      Enter Anything{" "}
      <TextInput
        restrictSymbols="!#%&"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
    </React.Fragment>
  );
};

export default App;

```
###### Attributes
1. Control `TextInput` allows user to type only anything like a regular textbox.
2. Attribute `restrictSymbols` restricts user entry for certain symbols.
3. Copy & Paste or Drag & Drop text from outside source must be take anything but restricted symbols.

<hr />

##### <a name="Email"></a> ## Email

[Email](https://codesandbox.io/s/react-control-library-email-e7y47)

[Email with Material UI](https://codesandbox.io/s/react-control-library-email-materialui-itiy5)

[Email with ReactStrap](https://codesandbox.io/s/react-control-library-email-reactstrap-jh7r8)

```jsx
import React from "react";
import { Email } from "react-control-library";

const App = () => {
  const [data, setData] = React.useState("");

  return (
    <React.Fragment>
      Enter Email{" "}
      <Email
        pattern="/^[^@s]+@[^@s.]+.[^@.s]+$/"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
    </React.Fragment>
  );
};

export default App;
```

###### Attributes
1. Allows all the characters to be typed.
2. Internally `Email` control uses regex to validate user input. Regex is taken from [here](https://www.w3resource.com/javascript/form/email-validation.php) under <b>RFC 2822 standard email validation</b>.
3. Attributes `pattern` overrides the default regex pattern.
4. Do not pass pattern value that start with '/' and ends with '/'. Please ignore the escape characters while passing. As an example, if you want to pass email pattern as `\^[^@\s]+@[^@\s\.]+\.[^@\.\s]+$\` then pass `^[^@\s]+@[^@\s\.]+\.[^@\.\s]+$` by leaving the escape characters out.
5. Validation about the user input can be accessed via `e.detail`.

<hr />

##### <a name="Checkbox"></a> ## Checkbox

[Checkbox](https://codesandbox.io/s/react-control-library-checkbox-c0xnm)

[Checkbox with Material UI](https://codesandbox.io/s/react-control-library-checkbox-materialui-bq3g4)

[Checkbox with ReactStrap](https://codesandbox.io/s/react-control-library-checkbox-reactstrap-974iy)

```jsx
import React from "react";
import { Checkbox } from "react-control-library";

const App = () => {
  const [ca, setCa] = React.useState(true);
  const [wa, setWa] = React.useState(false);

  function allInDiffState() {
    if (ca && wa) return false;
    if (!ca && !wa) return false;
    return true;
  }

  function selectAllEvent(e) {
    setCa(e.target.checked);
    setWa(e.target.checked);
  }

  return (
    <div id="checkbox">
      <Checkbox
        indeterminate={allInDiffState()}
        checked={ca && wa}
        onChange={(e) => selectAllEvent(e)}
      />{" "}
      Select All
      <br />
      <Checkbox checked={ca} onChange={(e) => setCa(e.target.checked)} /> CA
      <br />
      <Checkbox checked={wa} onChange={(e) => setWa(e.target.checked)} /> WA
      <br />
    </div>
  );
};

export default App;
```
###### Attributes
1. Clicking associated label must toggle checkbox. To have associated label, pass `label` attribute like `<Checkbox label='Agreement Read' />` or children to component like `<Checkbox>Agreement Read</Checkbox>`.
2. However note that, passing `label` in above mentioned fashion may not work in ReactStrap based on internal implementation of ReactStrap.
3. Attribute `indeterminate` when passed as true, checkbox will be in partially checked state. `indeterminate` attribute may not work as expected in ReactStrap based on internal implementation of ReactStrap.
4. All checked checkboxes will have a class assigned as `checkbox_checked`.

<hr />

##### <a name="RadioButton"></a> ## RadioButton

[RadioButton](https://codesandbox.io/s/react-control-library-radiobutton-1pgf0)

[RadioButton with ReactStrap](https://codesandbox.io/s/react-control-library-radiobutton-reactstrap-mejme)

```jsx
import React from "react";
import { RadioButton } from "react-control-library";

const App = () => {
  const [data, setData] = React.useState("");

  return (
    <div id="radio" className="App">
        <RadioButton
          name="notification"
          value={data}
          checked={data === "email"}
          onChange={() => setData("email")}
        />{" "}
        Email
        <br />
        <RadioButton
          name="notification"
          checked={data === "sms"}
          onChange={() => setData("sms")}
        />{" "}
        SMS
        <br />
        <RadioButton
          name="notification"
          checked={data === "push"}
          onChange={() => setData("push")}
        />
        Push Notification
        <br />
        <RadioButton
          name="notification"
          checked={data === "all"}
          onChange={() => setData("all")}
        />{" "}
        All
    </div>
  )
}

export default App;
```
###### Attributes
1. Clicking associated label must toggle checkbox. To have associated label, pass `label` attribute like `<RadioButton label='Home' />` or children to component like `<RadioButton>Home</RadioButton>`.
2. However note that, passing `label` in above mentioned fashion may not work in ReactStrap based on internal implementation of ReactStrap.
3. Clicking the label should toggle the checkbox value.
4. All checked checkboxes will have a class assigned as `{name}_radio_checked`.

<hr />
