import React from 'react';
import PropTypes from 'prop-types';

Theater.propTypes = {
    theaters: PropTypes.array
};

function Theater(props) {
    const { theaters } = props
    return (
        <div className='branch-actived theaters'>
            {
                (theaters && theaters.length > 0) &&
                theaters.map(theater => {
                    return (
                        <div className='theater-item' onClick={() => detail(theater._id)}>
                            {
                                checkEdit &&
                                <div className='theater-remove'
                                    onClick={() => remove('theater', theater._id)}
                                >x
                                            </div>
                            }
                            <div className='theater' key={theater._id}>
                                <div>
                                    <label>Code: </label>
                                    {theater.code}
                                </div>
                                <div>
                                    <label>Name: </label>
                                    {theater.name}
                                </div>
                                <div>
                                    <label>Hotline: </label>
                                    {theater.hotline}
                                </div>
                                <div>
                                    <label>Address: </label>
                                    {theater.address}
                                </div>
                                <div>
                                    <label>Rooms: </label>
                                    {theater.rooms ? theater.rooms.length : 0}
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            {
                theaters.length === 0 ? <div><b><i>Not found theater...</i></b></div> : ''
            }
            <div className='theater-add'>
                <div className='button' onClick={() => toggleTheater()}>Add new branch</div>
            </div>
        </div>
    );
}

export default Theater;