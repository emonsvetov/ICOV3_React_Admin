import React, { useState, useRef } from 'react';
import { Button, Row } from 'reactstrap';
import { CSVLink } from 'react-csv';

const UnassignedProgramDomainFilter = ({ onClickFilterCallback, download, filter, exportData, exportHeaders }) => {
    const [keyword, setKeyword] = useState('');
    const csvLinkRef = useRef();

    const onKeywordChange = (event) => {
        setKeyword(event.target.value);
    };

    const onSubmitFilter = (event) => {
        event.preventDefault();
        onClickFilterCallback({ keyword: keyword, rootProgramName: '' });
    };

    const handleExportClick = () => {
        download(filter).then(() => {
            if (csvLinkRef.current) {
                csvLinkRef.current.link.click();
            }
        });
    };

    return (
        <form className="form" onSubmit={onSubmitFilter}>
            <Row>
                <div className="col-md-3">
                    <div className="form__form-group">
                        <span className="form__form-group-label">Program Name:</span>
                        <div className="form__form-group-field">
                            <input type="text" value={keyword} onChange={onKeywordChange} placeholder="" />
                        </div>
                    </div>
                </div>
                <div className="col-md-4 d-flex align-items-end pl-1">
                    <Button type="submit" className="btn btn-sm btn-primary" color="#ffffff">Filter</Button>
                    <Button onClick={handleExportClick} className="btn btn-sm btn-success ml-2" color="#ffffff">Export to CSV</Button>
                    <CSVLink
                        data={exportData}
                        headers={exportHeaders}
                        filename="unassigned_program_domain_report.csv"
                        className="hidden"
                        ref={csvLinkRef}
                        target="_blank"
                    />
                </div>
            </Row>
        </form>
    );
};

export default UnassignedProgramDomainFilter;
