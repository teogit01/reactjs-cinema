import PropTypes from 'prop-types'
import React, { useState } from 'react';

import { Label } from 'reactstrap'
import Select from 'react-select';

SelectField.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,

    label: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    options: PropTypes.array,
    close: PropTypes.bool,
    multi: PropTypes.bool


}
SelectField.defaultProps = {
    label: '',
    placeholder: '',
    disabled: false,
    options: [],
    close: true,
    multi: false
}

function SelectField(props) {
    const {
        field,
        options, placeholder, label, multi, close
    } = props
    const { name } = field
    const [selectedOption, setSelectedOption] = useState(null);
    const handleSelectOptionChange = (selectedOption) => {
        setSelectedOption(selectedOption)
        const selectedValue = selectedOption ? selectedOption.value : selectedOption
        let newValue = []
        if (multi === true) {
            if (selectedOption) {
                selectedOption.map(item => {
                    newValue.push(item.value)
                })
            }
        }
        // console.log(newValue)
        const changeEvent = {
            target: {
                name: name,
                value: multi === true ? newValue : selectedValue
            }
        }
        field.onChange(changeEvent)
    }
    //console.log(selectedOption)
    return (
        <div className='select-field'>
            <div className=''>
                {label && <Label for={name}>{label}</Label>}
            </div>
            <div className='col-12'>
                <Select
                    className='select'
                    id={name}
                    {...field}
                    value={selectedOption}
                    onChange={handleSelectOptionChange}
                    options={options}
                    placeholder={placeholder}
                    isMulti={multi}
                    closeMenuOnSelect={close}
                />
            </div>
        </div>
    );
}
export default SelectField;
