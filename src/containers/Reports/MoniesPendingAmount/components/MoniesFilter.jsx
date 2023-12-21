import React, {useState, useEffect} from "react";
import renderDatePickerField from '@/shared/components/form/DatePicker';
import { Field, Form } from 'react-final-form';
import { Button, Row, Col } from 'reactstrap';
import ProgramTreeView from "../../components/MerchantTreeView";
import axios from 'axios'
import RenderDatePicker from '@/shared/components/form/DatePickerWithInitial';

const getFirstDay = () =>{
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1)
}
const fetchPrograms = async () => {
    try {
        const response = await axios.get(
        `/organization/1/program`
        );
        console.log(response)
        return response.data.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};
const MoniesFilter = ({onClickFilterCallback}) => {
    const [loading, setLoading] = React.useState(false)
    const [data, setData] = React.useState([])
    const [selected, setSelected] = React.useState([]);


    const onSubmitFilter = (values) => {

        values.merchant_id = values.merchant_id?.filter(n => n) //remove empty elements
        values.from = values.from.toISOString().slice(0, 10);
        values.to = values.to.toISOString().slice(0, 10);
        // alert( JSON.stringify(values) )        
        onClickFilterCallback( values )
    }

    useEffect( () => {
        fetchPrograms()
        .then( response => {
            setData(response)
        })
    }, [])

    return (
        <Form onSubmit={(e)=>onSubmitFilter(e)}
            initialValues={{                
              from: getFirstDay(),
              to: new Date()
            }}>
            {({ handleSubmit, form, submitting, pristine, values }) => (
            <form className="form" onSubmit={handleSubmit}>
            <Row>
                <div className="col-md-4">
                    <span
                    className="form__form-group-label"
                    >
                    View for Program
                    </span>
                    {data && data.length > 0 && 
                        <div className="merchant-treeview px-2">
                            <ProgramTreeView merchants={data} form={form} selected={selected} 
                                setSelected={(v) => {
                                    form.change('merchant_id', v)
                                    setSelected(v)}} />
                        </div>
                    }
                </div>
                <div className="col-md-2">
                    <div className="form__form-group">
                    <span className="form__form-group-label">From</span>
                    <div className="form__form-group-field">
                        <Field
                            name="from"
                            dueDate={getFirstDay}
                            onChange={(e) => form.change('from', e)}
                            component={RenderDatePicker}    
                        />
                    </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form__form-group">
                    <span className="form__form-group-label">To</span>
                    <div className="form__form-group-field">
                        <Field
                            name="to"
                            dueDate={new Date()}
                            onChange={(e) => form.change('to', e)}
                            component={RenderDatePicker}    
                        />
                    </div>
                    </div>
                </div>
                <div className="col-md-4 d-flex align-items-end pl-1" >
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
                        className="btn btn-sm btn-success" 
                        color="#ffffff"
                    >Export CSV</Button>
                </div>
                </Row>
            </form>
            )}
        </Form>
    )
}

export default MoniesFilter;