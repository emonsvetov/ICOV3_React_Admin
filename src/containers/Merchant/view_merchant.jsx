import React, {useState, useEffect} from 'react';
import { Col, Container, Row, Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import MerchantDetails from './View/components/MerchantDetails';
import AvailableGiftCodes from './View/components/AvailableGiftCodes';

const MERCHANT_MENU_LINKS = [
    {
        value: 'details',
        label: 'Details'
    },
    {
        value: 'available_gift_codes',
        label: 'Available Gift Codes'
    },
    {
        value: 'redeemed_gift_codes',
        label: 'Redeemed Gift Codes'
    },
    {
        value: 'transferred_gift_codes',
        label: 'Transferred Gift Codes'
    },
    {
        value: 'optimal_amount',
        label: 'Optimal Amount'
    },
    {
        value: 'sub_merchants',
        label: 'Sub Merchants'
    },
    {
        value: 'callbacks',
        label: 'Callbacks'
    },
]

const fetchMerchant = async ( id ) => {
    try {
        console.log('fetching merchant')
        const response = await axios.get(`/merchant/${id}`);
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};


const ViewMerchant = () => {

    let { id } = useParams();

    const [isLoading, setIsLoading] = useState(true) //first page load!
    
    let [merchant, setMerchant] = useState(null)
    const [selected, setSelected] = useState('details')

    useEffect( ()=>{
        fetchMerchant( id )
        .then( response => {
            setMerchant(response)
            setIsLoading(false)
        })
    }, [id])

    const onClickMenuItem = (item) => {
        setSelected(item.value)
    }

    // const refresh = () => {
    //     remove()
    // }

    // React.useEffect(() => {
    //     fetchMerchant( id );
    // }, [fetchMerchant, id]);

    if (isLoading) {
        return <p>Loading...</p>;
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
                MERCHANT_MENU_LINKS.map( (item, i) => <RenderItem item={item} key={'menu-item-'+i} />)
            }
            </ListGroup>
        )
    }

    if( !isLoading && merchant )   {
        return (
            <Container className="dashboard">
                <Row>
                    <Col md={6}>
                        <h3 className="page-title">{merchant.name}</h3>
                        <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/merchants">Merchants</Link> / {merchant.name}</h3>
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
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardBody className='infoview'>
                                {selected === 'details' && <MerchantDetails data={merchant}/>}
                                {selected === 'available_gift_codes' && <AvailableGiftCodes /> }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default ViewMerchant;


