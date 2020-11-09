import React, { useState, useEffect } from 'react';
//	import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'
import callApi from 'api/apiCaller'
import { useDispatch } from 'react-redux'
import * as action from './../countrySlice'

import PropTypes from 'prop-types'
Country.propTypes = {
    countrys: PropTypes.array
}
function Country(props) {
    const { countrys } = props
    //const country_store = useSelector(state => state.countrys)
    //const [countrys, setCountrys] = useState(country_store)
    const dispatch = useDispatch()

    const [value, setValue] = useState('')
    // change value
    function onChange(e) {
        //console.log(e.target.value)
        const newValue = e.target.value
        setValue(newValue)
    }
    // submit new country
    function onSubmit(e) {
        e.preventDefault()
        //console.log(value)
        if (value === '') return
        // call api -> recod{_id, .....}
        callApi('country', 'POST', { 'name': value })
            .then(res => {
                //console.log('res', res.data)
                // add to store { _id,...}
                dispatch(action.addCountry(res.data.country))
                //console.log(res.data.country)
            })
        setValue('')
        //console.log('store', country_store)		
    }
    // Del country
    function onDel(country) {
        // call api remove country        

        callApi(`country/${country._id}`, 'DELETE', null)
            .then(res => {
                //console.log('res', res.data._id)
                // remove in store { _id,...}
                dispatch(action.delCountry(res.data._id))
                //console.log(res.data.country)
            })
    }
    return (
        < div className='wrap_country' >
            <div className='country_title'>
                <h2>Country</h2>
                {/*<FontAwesomeIcon className='ic ic-black' icon="plus"/>*/}
            </div>
            <hr className='op-5' />

            <div className='country_list'>
                <div className='country_list--item row sticky'>
                    <form onSubmit={onSubmit} >
                        <input
                            type='text'
                            className='add col-12 '
                            placeholder='Enter new country! ...'

                            value={value}
                            onChange={onChange}
                        />
                    </form>
                </div>

                <div className='country_list--item col-12 row head'>
                    <div className='col-1'>#</div>
                    <div className='col-2'>Name</div>
                    <div className='col-2'>Action</div>
                </div>
                {countrys &&
                    countrys.map((country, index) => {
                        return (
                            <div key={country.code} className='country_list--item col-12 row'>
                                <div className='col-1'>{index + 1}</div>
                                <div className='col-2'>{country.name}</div>
                                <div className='col-2' onClick={() => onDel(country)}>Del</div>
                            </div>
                        )
                    })
                }
            </div>
        </div >
    );
}

export default Country;