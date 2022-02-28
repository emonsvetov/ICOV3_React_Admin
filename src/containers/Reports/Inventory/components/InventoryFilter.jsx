import React, {useState, useEffect} from "react";
import renderDatePickerField from '@/shared/components/form/DatePicker';
import { Button } from 'reactstrap';
import { Field, Form } from 'react-final-form';
import { Row, Col } from 'reactstrap';
// import MerchantTreeView from "./MerchantTreeView__legacy";
import MerchantTreeView from "./MerchantTreeView";
import axios from 'axios'
  
const fetchMerchants = async () => {
    try {
        const response = await axios.get(
        `/merchant?minimal=true&sortby=name`
        );
        // console.log(response)
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};
const InventoryFilter = ({onSubmitFilterCb}) => {
    const [loading, setLoading] = React.useState(false)
    const [data, setData] = React.useState([])
    const [selected, setSelected] = React.useState([]);


    const onSubmitFilter = (values) => {
        values.merchant_id = values.merchant_id.filter(n => n) //remove empty elements
        // alert( JSON.stringify(values) )
        onSubmitFilterCb( values )
    }

    useEffect( () => {
        fetchMerchants()
        .then( response => {
            setData(response)
        })
    }, [])

    return (
        <Form onSubmit={(e)=>onSubmitFilter(e)}>
            {({ handleSubmit, form, submitting, pristine, values }) => (
            <form className="form" onSubmit={handleSubmit}>
            <Row>
                <div className="col-md-4">
                    <span
                    className="form__form-group-label"
                    >
                    View for Merchant
                    </span>
                    {data && data.length > 0 && <div className="merchant-treeview px-2"><MerchantTreeView merchants={data} form={form} selected={selected} setSelected={(v) => {
                        form.change('merchant_id', v)
                        setSelected(v)
                    }} /></div>}
                </div>
                <div className="col-md-4">
                    <div className="form__form-group">
                    <span className="form__form-group-label">Through Date</span>
                    <div className="form__form-group-field">
                        <Field
                        name="end_date"
                        component={renderDatePickerField}
                        />
                    </div>
                    </div>
                </div>
                <div className="col-md-4 d-flex align-items-end pl-1">
                    <Button 
                        type="submit"
                        onClick={() => {
                            form.change("action", "submit");
                        }}
                        disabled={submitting} 
                        className="btn btn-sm btn-primary" 
                        color="#ffffff"
                    >Filter</Button>
                    <Button
                        type="submit"
                        onClick={() => {
                            form.change("action", "export");
                        }}
                        disabled={submitting} 
                        className="btn btn-sm btn-primary" 
                        color="#ffffff"
                    >Export CSV</Button>
                </div>
                </Row>
            </form>
            )}
        </Form>
    )
}

export default InventoryFilter;