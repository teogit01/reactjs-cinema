import React from 'react';
import PropTypes from 'prop-types';
import FormAdd from '../components/form-add'
Add.propTypes = {
    //optionsTheater: PropTypes.array,
    optionsBranch: PropTypes.array
};

function Add(props) {
    const { optionsBranch } = props
    return (
        <FormAdd optionsBranch={optionsBranch} />
    );
}

export default Add;