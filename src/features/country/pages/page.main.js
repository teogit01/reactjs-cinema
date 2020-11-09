import React from 'react';
import Country from 'features/country/components/country'

import PropTypes from 'prop-types'

Main.propTypes = {
    countrys: PropTypes.array
}

function Main(props) {
    const { countrys } = props
    return (
        <div>
            <Country countrys={countrys} />
        </div>
    );
}

export default Main;