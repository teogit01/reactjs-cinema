import React, { useState } from 'react';
//import 'admin/assets/css/film.scss'
// validation
//import * as Yup from 'yup'
//import { BrowserRouter as Router, useHistory } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import { initialValues } from 'assets/constant/film'
import { useDispatch } from 'react-redux'
import { addFilm } from './../filmSlice'

import InputField from 'components/custom-field/input-field'
import SelectField from 'components/custom-field/select-field'
import TextAreaField from 'components/custom-field/text-field'
import DatePickerField from 'components/custom-field/datepicker-field'
import CustomPosterField from 'components/custom-field/custom-poster'
import { Formik, Form, FastField } from 'formik';

import PropTypes from 'prop-types';
import callApi from 'api/apiCaller';
import axios from 'axios'
import { useHistory } from 'react-router-dom';

FilmAdd.propTypes = {
    optionsGenre: PropTypes.array
};
function FilmAdd(props) {
    const { optionsGenre, optionsCountry } = props
    const [dataPoster, setDataPoster] = useState([])
    const history = useHistory()
    const distpatch = useDispatch()
    const handleSubmit = async (values) => {
        // console.log(values)
        //console.log(dataPoster)
        const formData = new FormData();
        formData.append("poster", dataPoster);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        let filePath
        await axios.post('http://localhost:5000/api/film/poster', formData, config).then(res => {
            //console.log('RES', res.data)
            filePath = res.data.split('/')[2]
        })

        let valueSubmit = { ...values, posterName: filePath }
        //console.log('valus', valueSubmit)
        callApi('film', 'POST', valueSubmit).then((res) => {
            distpatch(addFilm(res.data.film))
            //console.log('res', res)
            history.goBack()
        })
    }
    //receiveData poster
    const receiveData = (data) => {
        setDataPoster(data)
        //console.log('data', data)
    }
    return (
        <div className='wrap-form'>
            <div className='form__content'>
                <Formik
                    initialValues={initialValues}
                    //validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {
                        formikProps => {
                            return (
                                < Form encType="multipart/form-data" >
                                    <div className='col-12 form'>
                                        <div className='form__left'>

                                            <FastField name='name' component={InputField} label='Name' />

                                            <FastField name='genre'
                                                multi={true}
                                                close={false}
                                                component={SelectField}
                                                label='Genre'
                                                options={optionsGenre}
                                                placeholder='Select genre' />

                                            <FastField name='country'
                                                multi={true}
                                                close={false}
                                                component={SelectField}
                                                label='Country'
                                                options={optionsCountry}
                                                placeholder='Select Country' />
                                            <FastField name='runtime' component={InputField} type='number' label='Run time' />
                                            <FastField name='openday' component={DatePickerField} label='Open Day' />
                                            <FastField name='director' component={InputField} type='text' label='Director' />
                                            <FastField name='cast' component={InputField} type='text' label='Cast' />
                                            <FastField name='trailer' component={InputField} type='text' label='Trailer' />
                                            <FastField name='description' component={TextAreaField} type='text' label='Description' />
                                            <br />
                                            <div className='button'>
                                                <button type='submit' className='btn btn-info'>Add</button>
                                                <button className='btn btn-info'>reset</button>
                                            </div>
                                        </div>
                                        <div className='form__right'>
                                            <div className='poster'>
                                                <FastField name='poster'
                                                    component={CustomPosterField}
                                                    receiveData={receiveData}
                                                    label='Poster' />

                                            </div>
                                        </div>

                                    </div>

                                </Form>
                            )
                        }
                    }
                </Formik>
            </div>
        </div >
    );
}

export default FilmAdd;