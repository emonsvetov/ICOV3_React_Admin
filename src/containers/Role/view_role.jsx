import React, {useState, useEffect} from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import RoleDetails from './View/components/RoleDetails';
import {isEmpty} from '@/shared/helpers'

const ViewRole = ( {organization} ) => {

    console.log(organization)

    const fetchRole = async ( id, organization ) => {
        // console.log(role);

        if( role ) return role
        if( isEmpty(organization) ) return;

        try {
            console.log('fetching role')
            const response = await axios.get(`/organization/${organization.id}/role/${id}`);
            return response.data;
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    };

    let { id } = useParams();
    const [isLoading, setIsLoading] = useState(true) //first page load!
    let [role, setRole] = useState(null)

    useEffect( ()=>{
        fetchRole( id, organization )
        .then( response => {
            setRole(response)
            setIsLoading(false)
        })
    }, [id, organization])

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if( !role )   {
        return <p>Error loading role!</p>;
    }

    console.log(role)

    if( role )   {
        return (
            <Container className="dashboard">
                <Row>
                    <Col md={6}>
                        <h3 className="page-title">{role.name}</h3>
                        <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/roles">Roles</Link> / {role.name}</h3>
                    </Col>
                </Row>
                {!organization?.id && 'Loading, please wait...'}
                {organization?.id && <RoleDetails organization={organization} role={role}/>}
            </Container>
        )
    }
}
export default withRouter(connect((state) => ({
    organization: state.organization
}))(ViewRole));

// export default ViewRole


