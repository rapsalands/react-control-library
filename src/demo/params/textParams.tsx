import React from 'react';
import { TextField } from '@material-ui/core';
import TextInput from '../../components/form/controls/textInput';

const TextParams = () => {

    const [rest, setRest] = React.useState('');

    return (
        <TextInput inputTag={TextField} label='Restricted Characters' value={rest} onChange={(e) => { setRest(e.currentTarget.value) }} />
    );
};

export default TextParams;
