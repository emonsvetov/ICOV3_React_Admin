import React, {useState} from 'react';
import { Col, Row, ButtonToolbar} from 'reactstrap';
import {answerYesNo} from '@/shared/helpers'
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import axios from 'axios'
import { Link } from 'react-router-dom'
import TangoModal from './TangoModal'

const MerchantDetails = ( {data} ) => {

    const dispatch = useDispatch()

    //TangoModal BOF
    let [toaId, setToaId] = useState(null)
    const [isOpenTangoModal, setOpenTangoModal] = useState(false)
    const toggleTangoModal = () => {
      setOpenTangoModal(prevState => !prevState)
    }
    const onclickTangoApi = (id) => {
      setToaId(id)
      toggleTangoModal()
    }
    //TangoModal EOF

    const [loading, setLoading] = useState(false)
    let [merchant, setMerchant] = useState(data)

    const onClickDelete = (e) => {
        e.preventDefault()
        setLoading( true )
        axios.delete(`/merchant/${merchant.id}`)
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

    const onClickChangeStatus = (e) => {
        e.preventDefault()
        setLoading( true )
        const newStatus = merchant.status ? 0 : 1
        axios.patch(`/merchant/${merchant.id}/status`, {status: newStatus})
        .then( (res) => {
            setLoading( false )
            if(res.status == 200)  {
              setMerchant((prevState) => ({
                ...prevState,
                ['status']: newStatus,
              }));
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
    return(
    <>
        <Row>
            <Col md="6" lg="6" xl="6">
                <h3 className="mb-4">Merchant Details</h3>
            </Col>
            <Col md="6" lg="6" xl="6" className="text-right">
                <ButtonToolbar className="flex justify-content-right w100">
                    <Link className='text-blue' to={`/merchants/edit/${merchant.id}`}>Edit</Link>
                    <Link to={'#'} disabled={loading} className="text-danger" onClick={(e) => {if(window.confirm('Are you sure to delete this merchant?')){onClickDelete(e)}}}>Delete</Link>
                    <Link to={'#'} disabled={loading} className="text-grey" onClick={onClickChangeStatus}>{merchant.status ? 'Active' : 'Inactive'}</Link>
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
                {answerYesNo(merchant.is_premium)}
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
        {
          merchant.use_tango_api && merchant.tango_orders_api &&
            <Row>
              <Col md="4" lg="4" xl="4" sm="4" className='label'>
                Tango Configuration:
              </Col>
              <Col md="8" lg="8" xl="8" sm="8">
                  <span className='link' onClick={()=>onclickTangoApi(merchant.tango_orders_api.id)}>
                    {merchant.tango_orders_api.name}
                  </span>
              </Col>
            </Row>
        }
        <Row>
            <Col md="4" lg="4" xl="4" sm="4" className='label'>
                Use Virtual Inventory:
            </Col>
            <Col md="8" lg="8" xl="8" sm="8">
                {answerYesNo(merchant.use_virtual_inventory)}
            </Col>
        </Row>
        {merchant.use_virtual_inventory ? (
            <Row>
                <Col md="4" lg="4" xl="4" sm="4" className='label'>
                    Virtual denominations:
                </Col>
                <Col md="8" lg="8" xl="8" sm="8">
                    {merchant.virtual_denominations}
                </Col>
            </Row> ) : ''
        }
        {merchant.use_virtual_inventory ? (
            <Row>
                <Col md="4" lg="4" xl="4" sm="4" className='label'>
                    Virtual Discount:
                </Col>
                <Col md="8" lg="8" xl="8" sm="8">
                    {merchant.virtual_discount}
                </Col>
            </Row>  ) : ''
        }
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
        {toaId && <TangoModal toaId={toaId} isOpen={isOpenTangoModal} toggle={toggleTangoModal} />}
    </>
    )
}

export default MerchantDetails
