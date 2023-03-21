import React from 'react';
import PropTypes from 'prop-types';

const CloseButton = ({
    onClick
}) => {
    return (
        <button className="close" type="button" onClick={onClick}>
            <span className="lnr lnr-cross" />
        </button>
    );
};

CloseButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};
  
CloseButton.defaultProps = {
};

export default CloseButton;


