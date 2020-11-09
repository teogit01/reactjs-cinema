import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap'

ToolTip.propTypes = {
    item: PropTypes.string,
    target: PropTypes.string
};

function ToolTip(props) {
    const { item, target } = props
    const [tooltipOpen, setTooltipOpen] = useState()
    const toggle = () => setTooltipOpen(!tooltipOpen)
    return (
        <Tooltip
            style={{ opacity: 0.3 }}
            placement='top'
            isOpen={tooltipOpen}
            target={`${target}`}
            toggle={toggle}
        >
            {item}
        </Tooltip>
    );
}

export default ToolTip;