import React, { useEffect } from 'react';
import './country.scss'
import PageMain from './pages/page.main';
import callApi from 'api/apiCaller'

function CountryIndex() {    
    useEffect(() => {
        const LoadCountry = async () => {
            let data = await callApi('country')
        }

    }, [])
    return (
        <div className='wrap-page'>
            <PageMain countrys={[]} />
        </div>
    )
}
export default CountryIndex;