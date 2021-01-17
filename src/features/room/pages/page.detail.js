import React, { useEffect, useState } from 'react';
import Detail from './../components/detail'
import callApi from 'api/apiCaller';
import { useRouteMatch } from 'react-router-dom';
// import PropTypes from 'prop-types';

// PageDetail.propTypes = {

// };

function PageDetail(props) {
    const match = useRouteMatch()
    const _idroom = match.params._id
    const [seats, setSeats] = useState([])
    useEffect(() => {
        const LoadSeat = async () => {
            let data = await callApi(`seat/room/${_idroom}`)
            setSeats(data.data)
        }
        LoadSeat()
    }, [])

    return (
        <div className='page-detail'>
            <Detail seats={seats} />
        </div>
    );
}

export default PageDetail;