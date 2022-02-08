import React, {useState, useEffect, useMemo} from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card, CardBody, Col, Row, ButtonToolbar} from 'reactstrap';
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import axios from 'axios'
import { Link } from 'react-router-dom'
import DomainProgramsDataTable from './DomainProgramsDataTable';
import AddProgramToDomain from './AddProgramToDomain';

const DomainPrograms = ( {domain, organization} ) => {
    // alert(JSON.stringify(organization))
    return (
        <>
            <AddProgramToDomain organization={organization} domain={domain} />
            <DomainProgramsDataTable organization={organization} domain={domain} />
        </>
    )
}
export default withRouter(connect((state) => ({
    organization: state.organization
}))(DomainPrograms));
// export default DomainPrograms;
