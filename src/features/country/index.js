import React, { useEffect } from 'react';
import './country.scss'
import PageMain from './pages/page.main';
import { useDispatch, useSelector } from 'react-redux';
import { loadCountry } from './countrySlice'
import callApi from 'api/apiCaller'

function CountryIndex() {
    const dispatch = useDispatch()
    const country_store = useSelector(state => state.countrys)
    useEffect(() => {
        const LoadCountry = async () => {
            let data = await callApi('country')
            if (data) {
                dispatch(loadCountry(data.data))
            }
        }
        if (country_store.length === 0) {
            LoadCountry()
        }
    }, [])
    return (
        <div className='wrap-page'>
            <PageMain countrys={country_store} />
        </div>
    )
}
export default CountryIndex;