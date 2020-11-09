import React from 'react';

import { useHistory } from 'react-router-dom'

import { Formik, Form, FastField } from 'formik';
import InputField from 'components/custom-field/input-field'
import SelectField from 'components/custom-field/select-field'
import TextField from 'components/custom-field/text-field.js'

import { initiaValues, citys, provinces, villages, districts } from 'assets/const'
//import { validationSchema } from 'assets/validations/valid-branch'

import callApi from 'api/apiCaller';

import PropTypes from 'prop-types'

FormAdd.propTypes = {
    onSubmit: PropTypes.func
}
function FormAdd(props) {
    const { onSubmit } = props
    const history = useHistory()

    // handle submit
    const handelSubmit = values => {
        // call api send data submited
        callApi('branch', 'POST', values)
            .then((res) => {
                onSubmit(values)
                //console.log('res', res.data)
                history.goBack()
            })
    }
    const handleReset = (resetForm) => {
        if (window.confirm('Reset?')) {
            resetForm();
        }
    };
    return (
        <div className='form'>
            <Formik
                initialValues={initiaValues}
                onSubmit={handelSubmit}
            >
                {
                    formikProps => {
                        return (
                            <Form>
                                <FastField name='name' component={InputField} label='Name' />
                                <FastField name='email' component={InputField} label='Email' />
                                <FastField name='hotline' component={InputField} label='Hot line' />
                                <div className='city'>
                                    <div className='control'>
                                        <FastField name='city'
                                            component={SelectField}
                                            label='City'
                                            placeholder='Select city'
                                            options={citys} />
                                    </div>
                                    <div className='control'>
                                        <FastField
                                            name='province'
                                            component={SelectField}
                                            label='Province'
                                            placeholder='Select Province'
                                            options={provinces} />
                                    </div>
                                </div>

                                <div className='city'>
                                    <div className='control'>
                                        <FastField
                                            name='district'
                                            component={SelectField}
                                            label='District'
                                            placeholder='Select District'
                                            options={districts} />
                                    </div>
                                    <div className='control'>
                                        <FastField
                                            name='village'
                                            component={SelectField}
                                            label='Village'
                                            placeholder='Select Village'
                                            options={villages} />
                                    </div>
                                </div>
                                <FastField
                                    name='address'
                                    component={TextField}
                                    label='Address' />
                                <br />

                                <div className='button'>
                                    <div
                                        className='btn btn-secondary'
                                        onClick={handleReset.bind(null, formikProps.resetForm)}
                                    >Cancal</div>
                                    <button type='submit' className='btn btn-info'>Add</button>
                                </div>
                            </Form>
                        )
                    }
                }
            </Formik>
        </div>

    );
}

export default FormAdd;
