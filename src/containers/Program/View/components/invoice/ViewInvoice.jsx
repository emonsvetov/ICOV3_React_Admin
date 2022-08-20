import React, {useState} from 'react';
import { useEffect } from 'react';
import { Button, ButtonToolbar, Row, Col  } from 'reactstrap';

const ViewInvoice = (props) => {
    const [loading, setLoading] = useState(false)
    const [prev, setPrev] = useState(props.invoice)
    useEffect( () => {
        if( prev ) {
            console.log("load")
            console.log(props.invoice)
        }
    }, [props])
    return (
        <Row className="w100">
            <Col md="6" lg="6" xl="6">
                <div className="modal__title">
                    <h3 className="mb-4">View Invoice </h3>
                </div>
            </Col>
            <Col md="6" lg="6" xl="6" className="text-right">
            <ButtonToolbar className="modal__footer flex justify-content-right w100">
                <Button
                outline
                color="primary"
                className="mr-3"
                onClick={()=>props.setStep(0)}
                >
                Back
                </Button>{" "}
            </ButtonToolbar>
            </Col>
        </Row>
    )
}
export default ViewInvoice;