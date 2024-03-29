import React, {useState, useEffect} from 'react';
import { Col, Container, Row, Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';
import { Link, useParams } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {setMerchant} from '@/redux/actions/merchantActions';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import axios from 'axios'
import MerchantDetails from './View/components/MerchantDetails';
import AvailableGiftCodes from './View/components/AvailableGiftCodes';
import AvailableTestGiftCodes from './View/components/AvailableTestGiftCodes';
import VirtualGiftCodes from './View/components/VirtualGiftCodes';
import RedeemedGiftCodes from './View/components/RedeemedGiftCodes';
import TransferedGiftCodes from './View/components/TransferedGiftCodes';
import OptimalAmount from './View/components/OptimalAmount';
import SubMerchants from './View/components/SubMerchants';
import Callbacks from './View/components/Callbacks';

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
        value: 'available_test_gift_codes',
        label: 'Test Gift Codes'
    },
    {
        value: 'virtual_gift_codes',
        label: 'Virtual Gift Codes'
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
        // console.log('fetching merchant')
        const response = await axios.get(`/merchant/${id}`);
        // console.log(response);
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

const ViewMerchant = ( {merchant} ) => {

    let { id } = useParams();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true) //first page load!
    
    // let [merchant, setMerchant] = useState(null)
    const [selected, setSelected] = useState('details')

    useEffect( ()=>{
        fetchMerchant( id )
        .then( response => {
            dispatch(setMerchant(response))
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

    if (isLoading || !merchant) {
        return <p>Loading...</p>;
    }

    const RenderItem = ({item}) => {
        return (<ListGroupItem
            className={selected === item.value ? 'selected' : ''}
            tag="span" 
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
                            <CardBody className='view-tabbed-menu'>
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
                                {selected === 'available_gift_codes' && <AvailableGiftCodes merchant={merchant}  /> }
                                {selected === 'available_test_gift_codes' && <AvailableTestGiftCodes merchant={merchant}  /> }
                                {selected === 'virtual_gift_codes' && <VirtualGiftCodes merchant={merchant}  /> }
                                {selected === 'redeemed_gift_codes' && <RedeemedGiftCodes merchant={merchant} /> }
                                {selected === 'transferred_gift_codes' && <TransferedGiftCodes merchant={merchant} /> }
                                {selected === 'optimal_amount' && <OptimalAmount merchant={merchant} /> }
                                {selected === 'sub_merchants' && <SubMerchants merchant={merchant} /> }
                                {selected === 'callbacks' && <Callbacks merchant={merchant} /> }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

ViewMerchant.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired
};
  
export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
    merchant: state.merchant
}))(ViewMerchant));

// export default ViewMerchant;


