import React from 'react';
import PropTypes from 'prop-types';
import { Label } from 'reactstrap'
import './css.scss'

InputField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    type: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    disable: PropTypes.bool
};
InputField.defaultProps = {
    type: 'text',
    label: '',
    placeholder: '',
    disable: false
}

function InputField(props) {
    const {
        field, form,
        type, label, placeholder
    } = props
    const { name } = field
    const { errors } = form
    //const showError = errors[name] && touched[name]

    return (
        <div className='input-field'>
            <div className=''>
                {label && <Label for={name}>{label}</Label>}
            </div>
            <div className='col-12'>
                <input
                    className={errors[name] ? 'input-error input' : 'input'}
                    id={name}
                    type={type}
                    {...field}
                    placeholder={errors[name] ? errors[name] : placeholder}
                />
            </div>
        </div>

    );
}

export default InputField;