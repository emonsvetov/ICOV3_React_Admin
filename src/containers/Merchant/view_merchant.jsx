import React, {useState, useEffect} from 'react';
import { Col, Container, Row, Card, CardBody, ButtonToolbar, Button } from 'reactstrap';
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import {ORGANIZATION_ID} from '../App/auth'
import {answerYesNo} from '@/shared/helpers'
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"

const fetchMerchant = async ( id ) => {
    try {
        console.log('fetching merchant')
        const response = await axios.get(`/organization/${ORGANIZATION_ID}/merchant/${id}`);
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

const ViewMerchant = () => {

    let { id } = useParams();
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(true) //first page load!
    const [loading, setLoading] = useState(false)
    let [merchant, setMerchant] = useState(null)

    useEffect( ()=>{
        fetchMerchant( id )
        .then( response => {
            setMerchant(response)
            setIsLoading(false)
        })
    }, [id])

    const onClickDelete = () => {
        setLoading( true )
        axios.delete(`/organization/1/merchant/${merchant.id}`)
        .then( (res) => { 
            // console.log(res)
            if(res.status == 200)  {
                window.location = `/merchants?message=Merchant deleted successfully!`
            }
        })
        .catch( error => {
            console.log(error)
            setLoading( false )
            dispatch(sendFlashMessage(JSON.stringify(error.response.data), 'alert-danger'))
            // throw new Error(`API error:${e?.message}`);
        })
    }    
    
    const onClickChangeStatus = () => {
        setLoading( true )
        const newStatus = merchant.status ? 0 : 1
        axios.patch(`/organization/1/merchant/${merchant.id}/status`, {status: newStatus})
        .then( (res) => {
            setLoading( false )
            console.log(res)

            if(res.status == 200)  {
                setMerchant({...merchant, ...{status: newStatus}})
                dispatch(sendFlashMessage('Merchant status updated successfully', 'alert-success'))
                // window.location = `/merchants?message=Merchant deleted successfully!`
            }
        })
        .catch( error => {
            console.log(error)
            setLoading( false )
            dispatch(sendFlashMessage(JSON.stringify(error.response.data), 'alert-danger'))
            // throw new Error(`API error:${e?.message}`);
        })
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
    if( !isLoading && merchant )   {
        return (
            <Container className="dashboard">
                <Row>
                    <Col md={6}>
                        <h3 className="page-title">{merchant.name}</h3>
                        <h3 className="page-subhead subhead"><Link className="" to="/">Home</Link> / <Link className="" to="/merchants">Merchants</Link> / {merchant.name}</h3>
                        {/* <span onClick={refresh}>Refresh</span> */}
                    </Col>
                    <Col md={6} className="text-right">
                        
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardBody className='infoview'>
                                <Row>
                                    <Col md="6" lg="6" xl="6">
                                        <h3 className="mb-4">Merchant Details</h3>
                                    </Col>
                                    <Col md="6" lg="6" xl="6" className="text-right">
                                        <ButtonToolbar className="flex justify-content-right w100">
                                            <Button type="button" disabled={loading} className="btn btn-primary btn-sm"><Link className='color-white' to={`/merchants/edit/${merchant.id}`}>Edit</Link></Button>
                                            <Button type="button" disabled={loading} className="btn btn-primary btn-sm color-white" onClick={() => {if(window.confirm('Are you sure to delete this merchant?')){onClickDelete()}}}>Delete</Button>
                                            <Button type="button" disabled={loading} className="btn btn-primary btn-sm color-white" onClick={onClickChangeStatus}>Active</Button>
                                        </ButtonToolbar>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                        Merchant Name:
                                    </Col>
                                    <Col md="8" lg="8" xl="8" sm="8">
                                        {merchant.name}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                        Merchant Code:
                                    </Col>
                                    <Col md="8" lg="8" xl="8" sm="8">
                                        {merchant.merchant_code}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                        Status:
                                    </Col>
                                    <Col md="8" lg="8" xl="8" sm="8">
                                        {merchant.status ? 'Active' : 'Inactive'}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                        Default:
                                    </Col>
                                    <Col md="8" lg="8" xl="8" sm="8">
                                        {answerYesNo(merchant.is_default)}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                        Premium:
                                    </Col>
                                    <Col md="8" lg="8" xl="8" sm="8">
                                        {answerYesNo(merchant.is_permium)}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                        Gift Codes Require PIN:
                                    </Col>
                                    <Col md="8" lg="8" xl="8" sm="8">
                                        {answerYesNo(merchant.giftcodes_require_pin)}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                        Requires Shipping:
                                    </Col>
                                    <Col md="8" lg="8" xl="8" sm="8">
                                        {answerYesNo(merchant.requires_shipping)}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                        Physical Order:
                                    </Col>
                                    <Col md="8" lg="8" xl="8" sm="8">
                                        {answerYesNo(merchant.physical_order)}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                        Use Tango API:
                                    </Col>
                                    <Col md="8" lg="8" xl="8" sm="8">
                                        {answerYesNo(merchant.use_tango_api)}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                        Display Popup:
                                    </Col>
                                    <Col md="8" lg="8" xl="8" sm="8">
                                        {answerYesNo(merchant.display_popup)}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                        Available Gift Codes:
                                    </Col>
                                    <Col md="8" lg="8" xl="8" sm="8">
                                        {34}
                                    </Col>
                                </Row>                                
                                <Row>
                                    <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                        Redeemed Gift Codes:
                                    </Col>
                                    <Col md="8" lg="8" xl="8" sm="8">
                                        {1234}
                                    </Col>
                                </Row>     
                                <Row>
                                    <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                        Logo:
                                    </Col>
                                    <Col md="8" lg="8" xl="8" sm="8">
                                        <img className='merchant-index-logo' src={`${process.env.REACT_APP_API_STORAGE_URL}/${merchant.logo}`} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                        Icon:
                                    </Col>
                                    <Col md="8" lg="8" xl="8" sm="8">
                                        <img className='merchant-index-logo' src={`${process.env.REACT_APP_API_STORAGE_URL}/${merchant.icon}`} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                        Large Icon:
                                    </Col>
                                    <Col md="8" lg="8" xl="8" sm="8">
                                    {merchant.large_icon && <img className='merchant-index-logo' src={`${process.env.REACT_APP_API_STORAGE_URL}/${merchant.large_icon}`} />}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                        Banner:
                                    </Col>
                                    <Col md="8" lg="8" xl="8" sm="8">
                                        {merchant.banner && <img className='merchant-index-logo' src={`${process.env.REACT_APP_API_STORAGE_URL}/${merchant.banner}`} />}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                        Use Website as Redemption URL:
                                    </Col>
                                    <Col md="8" lg="8" xl="8" sm="8">
                                        {answerYesNo(merchant.website_is_redemption_url)}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="4" lg="4" xl="4" sm="4" className='label'>
                                        Get Gift Codes from Root Merchant:
                                    </Col>
                                    <Col md="8" lg="8" xl="8" sm="8">
                                        {answerYesNo(merchant.get_gift_codes_from_root)}
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default ViewMerchant;


