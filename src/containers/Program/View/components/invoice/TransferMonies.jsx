import React, { useState, useEffect} from 'react';
import {Row, Col, Button} from 'reactstrap';
import { Form, Field } from 'react-final-form';
import {getTransferMonies, postTransferMonies} from '@/service/program/transferMonies';
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import TransferMoniesConfirm from './TransferMoniesConfirm';

const TransferMonies = (props) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState( true );
    const [data, setData] = useState( null );
    const [amounts, setAmounts] = useState( null );
    const [isOpen, setOpen] = useState(false);

    const toggle = () => {
        setOpen(prev => !prev)
    }

    useEffect(() => {
        if(props?.organization?.id)  {
            getTransferMonies(props.program.organization_id, props.program.id)
            .then( response => {
                console.log(response)
                setData(response);
                setLoading(false)
            })
            .catch( error => {
                // console.log(error)
                setLoading(false)
            })
        }
    }, [props]);

    const onConfirmTransferMonies = () => {
        // console.log(amounts.length)
        let amountData = {}
        if(amounts) {
            for (const [key, amount] of Object.entries(amounts)) {
                if( amount !== "" ) {
                    if( !isNaN(amount) ) {
                        const programId = key.replace("amounts_", "")
                        amountData[programId] = parseFloat(amount)
                    }
                }
            }
        }
        // console.log(Object.keys(data).length)
        if(Object.keys(amountData).length > 0) {
            const formData = {
                "amounts": amountData
            }
            postTransferMonies(props.program.organization_id, props.program.id, formData)
            .then( response => {
                // console.log(response)
                // setData(response);
                if( response.success )  {
                    dispatch(sendFlashMessage('Monies Transfer Completed!', 'alert-success', 'top'))
                    const newData = {...data, ...{balance: response.balance}}
                    // console.log(newData)
                    setData(newData)
                    setAmounts(null)
                    toggle()
                }
                setLoading(false)
            })
            .catch( error => {
                console.log(error)
                setLoading(false)
            })

        }
    }

    const onClickTransferMonies = values => {
        if( values )    {
            setAmounts(values)
            toggle()
        }
    }    
    const validate = values => {
        let errors = {}
        for (const [key, amount] of Object.entries(values)) {
            if( amount !== "" ) {
                if( isNaN(amount) ) {
                    errors[key] = "Please enter a valid amount"
                }
            }
        }
        return errors;
    }
    
    if( loading ) return 'Loading...'
    if( !data ) return 'Data not found'

    // console.log(data.programs)

    return (
        <Row>
            <Col md="12">
                <h4 className="mb-3">Current Balance: ${parseFloat(data.balance).toFixed(2)}</h4>
            </Col>
            {data.balance > 0 && <Col md="6">
                <p className="mb-4">Tranfer monies to</p>
                <Form
                    onSubmit={onClickTransferMonies}
                    validate={validate}
                    initialValues={amounts}
                >
                {({ handleSubmit, form, submitting, pristine, values }) => (
                    <form className="form" onSubmit={handleSubmit}>
                    {
                        data.programs.map(program => 
                            <Field name={`amounts_${program.id}`}>
                                {({ input, meta }) => (
                                    <Row>
                                        <Col md={6}>{program.name}</Col>
                                        <Col md={6}  className="mb-1">
                                            <div className="d-flex justify-content-start align-items-center">
                                                <div className="pr-1">$</div>
                                                <div><input type="text" {...input} /></div>
                                            </div>
                                            {meta.touched && meta.error && <span className="form__form-group-error mt-0 mb-2" >{meta.error}</span>}
                                        </Col>
                                    </Row>
                                )}
                            </Field>
                        )
                    }
                    <div className="form__form-group">
                        <span className="form__form-group-label d-block">&nbsp;</span>
                        <Button type="submit" disabled={submitting} className="btn btn-primary btn-sm" color="#ffffff">Submit</Button>
                    </div>
                    </form>
                )}
                </Form>
                <TransferMoniesConfirm programs={data.programs} amounts={amounts} action={onConfirmTransferMonies} isOpen={isOpen} setOpen={setOpen} toggle={toggle} />
            </Col>}
        </Row>
    )
}
export default TransferMonies