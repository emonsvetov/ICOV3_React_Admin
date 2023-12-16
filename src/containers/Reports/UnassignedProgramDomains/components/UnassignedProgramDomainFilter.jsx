import React, { useState } from 'react';
import { Button, Row } from 'reactstrap';

const UnassignedProgramDomainFilter = ({ onClickFilterCallback }) => {
    const [keyword, setKeyword] = useState('');

    const onKeywordChange = (event) => {
        setKeyword(event.target.value);
    };

    const onSubmitFilter = (event) => {
        event.preventDefault();
        onClickFilterCallback({ keyword: keyword, rootProgramName: '' });
    };

    return (
        <form className="form" onSubmit={onSubmitFilter}>
            <Row>
                {/* Program Name Field */}
                <div className="col-md-3">
                    <div className="form__form-group">
                        <span className="form__form-group-label">Program Name:</span>
                        <div className="form__form-group-field">
                            <input type="text" value={keyword} onChange={onKeywordChange} placeholder="" />
                        </div>
                    </div>
                </div>
                <div className="col-md-6 d-flex align-items-end pl-5">
                    <Button
                        type="submit"
                        className="btn btn-sm btn-primary"
                    >Filter</Button>
                </div>
            </Row>
        </form>
    );
};

export default UnassignedProgramDomainFilter;
