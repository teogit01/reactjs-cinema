import React from 'react';
import FormAdd from '../components/form-add'

function Add(props) {
    const { optionsBranch } = props

    return (
        <FormAdd optionsBranch={optionsBranch} />
    );
}

export default Add;
