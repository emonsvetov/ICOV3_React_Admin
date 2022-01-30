import React, {useState, useEffect} from 'react';
import { Col, Container, Row, Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Cancelled from './View/components/Cancelled';
import Pending from './View/components/Pending';
import Shipped from './View/components/Shipped';

const ORDERS_MENU_LINKS = [
    {
        value: 'cancelled',
        label: 'Cancelled'
    },
    {
        value: 'pending',
        label: 'Pending'
    },
    {
        value: 'shipped',
        label: 'Shipped'
    }
 
]


const OrdersIndex = () => {



    const [isLoading, setIsLoading] = useState(true) //first page load!
    

    const [selected, setSelected] = useState('pending')

    useEffect( ()=>{
      console.log(selected)
    }, [selected])

    const onClickMenuItem = (item) => {
        setSelected(item.value)
    }

    // const refresh = () => {
    //     remove()
    // }

    // React.useEffect(() => {
    //     fetchDomain( id );
    // }, [fetchDomain, id]);

  

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
                ORDERS_MENU_LINKS.map( (item, i) => <RenderItem item={item} key={'menu-item-'+i} />)
            }
            </ListGroup>
        )
    }

    
    
    return (
        <Container className="dashboard">
            <Row>
                <Col md={6}>
                    <h3 className="page-title">Physical Orders</h3>
                    <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / Physical Orders</h3>
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
            {selected === 'cancelled' && <Cancelled />}
            {selected === 'pending' && <Pending/>}
            {selected === 'shipped' && <Shipped /> }
            
        </Container>
    )
    
}

export default OrdersIndex;


