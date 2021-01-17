import React from 'react';

import PropTypes from 'prop-types';

SeatDetail.propTypes = {
    type: PropTypes.string, // 
    length: PropTypes.number, // 
    index: PropTypes.number, // 
    child: PropTypes.string,
    isDamaged: PropTypes.bool,
    name: PropTypes.string,
    isSelected: PropTypes.bool

    //handleSetSeatDamged: PropTypes.func
};

SeatDetail.defaultProp = {
    length: 0,
    child: '',
    type: '',
    //handleSetSeatDamged: null
}

const background = [
    { type: 'default', color: '#C8CCB8' },
    { type: 'normal', color: '#6D72C3' },
    { type: 'vip', color: '#FCB97D' },
    { type: 'actived', color: '#0C8346' },
    { type: 'damaged', color: '#EAEAEA' },
]

function SeatDetail(props) {

    const { type, length, index, isDamaged, name, isSelected } = props

    const idx = background.findIndex(item => {
        if (item.type === type) {
            return item
        }
    })

    return (
        <div className={(index + 1 === 2) || (index + 1 === length - 2) ? 'seat mr-20' : 'seat '
        } style={{ backgroundColor: isDamaged ? background[4].color : background[idx].color }} >
            <div className={isSelected ? 'selected' : 'none'}>
                X
            </div >
        </div>
    );
}

export default SeatDetail;