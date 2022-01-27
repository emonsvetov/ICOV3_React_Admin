import React, {useState, useEffect} from 'react';
import { Col, Container, Row, Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import DomainDetails from './View/components/DomainDetails';
import DomainPrograms from './View/components/DomainPrograms';

const DOMAIN_MENU_LINKS = [
    {
        value: 'details',
        label: 'Details'
    },
    {
        value: 'domain_programs',
        label: 'Domain\'s Programs'
    },
 
]

const fetchDomain = async ( id ) => {
    try {
        console.log('fetching domain')
        const response = await axios.get(`/domain/${id}`);
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};


const ViewDomain = () => {

    let { id } = useParams();

    const [isLoading, setIsLoading] = useState(true) //first page load!
    
    let [domain, setDomain] = useState({name: 'residentyesrewards.incentco.com', 'access_key': 5})
    const [selected, setSelected] = useState('details')

    // useEffect( ()=>{
    //     fetchDomain( id )
    //     .then( response => {
    //         setDomain(response)
    //         setIsLoading(false)
    //     })
    // }, [id])

    const onClickMenuItem = (item) => {
        setSelected(item.value)
    }

    // const refresh = () => {
    //     remove()
    // }

    // React.useEffect(() => {
    //     fetchDomain( id );
    // }, [fetchDomain, id]);

    if (isLoading) {
        // return <p>Loading...</p>;
    }

    const RenderItem = ({item, key}) => {
        return (<ListGroupItem
            className={selected === item.value ? 'selected' : ''}
            href="#" 
            tag="a" 
            key={key} 
            onClick={()=>onClickMenuItem(item)}>{item.label}</ListGroupItem>)
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

    // if( !isLoading && domain )   {
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
                {selected === 'details' && <DomainDetails data={domain}/>}
                                
                {selected === 'domain_programs' && <DomainPrograms /> }

                
            </Container>
        )
    }
}

export default ViewDomain;


