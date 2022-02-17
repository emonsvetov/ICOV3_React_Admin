import React, {useState, useEffect} from "react";
import Select from 'react-select'
import renderDatePickerField from '@/shared/components/form/DatePicker';
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
const InventoryFilter = ({onClickFilterCallback}) => {
    const [status, setStatus] = React.useState('')
    const [keyword, setKeyword] = React.useState('')
    const [data, setData] = React.useState([])
    const [selected, setSelected] = useState([]);
    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds)
    };

    const onStatusChange = (selectedOption) => {
        setStatus(selectedOption.value)
    };
    const onProgramPhaseChange = (e) => {
        setKeyword( e.target.value)
    }
    const onClickFilter = () => {
        onClickFilterCallback(status, keyword)
    }

    useEffect( () => {
        fetchMerchants()
        .then( response => {
            setData(response)
        })
        
    }, [])

    const statusPlaceholder = status ? status : 'All'
    return (
        <Form onSubmit={onClickFilter}>
            {({ handleSubmit }) => (
            <form className="form" onSubmit={handleSubmit}>
            <Row>
                <div className="col-md-4">
                    <span
                    className="form__form-group-label"
                    >
                    View for Merchant
                    </span>
                    {data && data.length > 0 && <div className="merchant-treeview px-2"><MerchantTreeView merchants={data} /></div>}
                </div>
                <div className="col-md-4">
                    <div className="form__form-group">
                    <span className="form__form-group-label">Through Date</span>
                    <div className="form__form-group-field">
                        <Field
                        name="trough_date"
                        component={renderDatePickerField}
                        />
                    </div>
                    </div>
                </div>
                
                <div className="col-md-4 d-flex align-items-center max-height-32px pl-1">
                    <span className="text-blue pointer" onClick={onClickFilter}>Filter</span>
                </div>
                </Row>
            </form>
            )}
        </Form>
    )
}

export default InventoryFilter;