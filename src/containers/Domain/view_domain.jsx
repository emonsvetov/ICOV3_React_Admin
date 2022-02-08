import React, {useState, useEffect} from 'react';
import { Col, Container, Row, Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';
import { Link, useParams } from 'react-router-dom'
// import { connect } from 'react-redux'
// import { withRouter } from 'react-router-dom'
import axios from 'axios'
import DomainDetails from './View/components/DomainDetails';
import DomainPrograms from './View/components/DomainPrograms';
import {isEmpty} from '@/shared/helpers'
import { getOrganization } from '../App/auth';

const DOMAIN_MENU_LINKS = [
    {
        value: 'details',
        label: 'Details'
    },
    {
        value: 'domain-programs',
        label: 'Domain\'s Programs'
    },
 
]

const ViewDomain = () => {

    const organization = getOrganization(); //probably this needs to be get from the state, not working for first page load somehow. TODO

    const fetchDomain = async ( id, organization ) => {

        // console.log(domain);

        if( domain ) return domain
        if( isEmpty(organization) ) return;

        try {
            console.log('fetching domain')
            const response = await axios.get(`/organization/${organization.id}/domain/${id}`);
            return response.data;
        } catch (e) {
            throw new Error(`API error:${e?.message}`);
        }
    };

    let { id } = useParams();
    const [isLoading, setIsLoading] = useState(true) //first page load!
    let [domain, setDomain] = useState(null)
    const [selected, setSelected] = useState('details')

    useEffect( ()=>{
        fetchDomain( id, organization )
        .then( response => {
            setDomain(response)
            setIsLoading(false)
        })
    }, [id, organization])

    const onClickMenuItem = (e, item) => {
        e.preventDefault()
        setSelected(item.value)
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    const RenderItem = ({item, key}) => {
        return (<ListGroupItem
            className={selected === item.value ? 'selected' : ''}
            href={`#${item.value}`}
            tag="a" 
            key={key} 
            onClick={(e)=>onClickMenuItem(e, item)}>{item.label}</ListGroupItem>)
    }

    const RenderMenu = () => {
        return (
            <ListGroup horizontal>
            {
                DOMAIN_MENU_LINKS.map( (item, i) => <RenderItem item={item} key={'menu-item-'+i} />)
            }
            </ListGroup>
        )
    }

    if( domain )   {
        return (
            <Container className="dashboard">
                <Row>
                    <Col md={6}>
                        <h3 className="page-title">{domain.name}</h3>
                        <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/domains">domains</Link> / {domain.name}</h3>
                        {/* <span onClick={refresh}>Refresh</span> */}
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardBody className='merchant-view-menu'>
                                <RenderMenu />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                {selected === 'details' && (<DomainDetails organization={organization} data={domain}/>)}
                {selected === 'domain-programs' && <DomainPrograms organization={organization} domain={domain} /> }
            </Container>
        )
    }
}
// export default withRouter(connect((state) => ({
//     organization: state.organization
// }))(ViewDomain));

export default ViewDomain


