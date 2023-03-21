import React, {useState, useEffect} from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import PermissionDetails from './View/components/PermissionDetails';
import {isEmpty} from '@/shared/helpers'

const ViewPermission = ( {organization} ) => {

    // console.log(organization)

    const fetchPermission = async ( id, organization ) => {
        // console.log(permission);

        if( permission ) return permission
        if( isEmpty(organization) ) return;

        try {
            console.log('fetching permission')
            const response = await axios.get(`/organization/${organization.id}/permission/${id}`);
            return response.data;
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    };

    let { id } = useParams();
    const [isLoading, setIsLoading] = useState(true) //first page load!
    let [permission, setPermission] = useState(null)

    useEffect( ()=>{
        fetchPermission( id, organization )
        .then( response => {
            setPermission(response)
            setIsLoading(false)
        })
    }, [id, organization])

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if( !permission )   {
        return <p>Error loading permission!</p>;
    }

    console.log(permission)

    if( permission )   {
        return (
            <Container className="dashboard">
                <Row>
                    <Col md={6}>
                        <h3 className="page-title">{permission.name}</h3>
                        <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/permissions">Permissions</Link> / {permission.name}</h3>
                    </Col>
                </Row>
                {!organization?.id && 'Loading, please wait...'}
                {organization?.id && <PermissionDetails organization={organization} permission={permission}/>}
            </Container>
        )
    }
}
export default withRouter(connect((state) => ({
    organization: state.organization
}))(ViewPermission));

// export default ViewPermission


