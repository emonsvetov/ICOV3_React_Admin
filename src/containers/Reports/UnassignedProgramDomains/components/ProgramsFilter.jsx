import React from 'react'
import { Field, Form } from 'react-final-form';
import { Button, Row, Col } from 'reactstrap';

const ProgramFilter = ({onClickFilterCallback}) => {
    
    const [keyword, setKeyword] = React.useState('')

    const onProgramPhaseChange = (value) => {
        setKeyword(value)
    }
    const onClickFilter = () => {
        onClickFilterCallback(keyword)
    }
    
    return (
        <Form onSubmit={onClickFilter}
        >
            {({ handleSubmit, form, submitting, pristine, values }) => (
              <form className="form" onSubmit={handleSubmit}>
              <Row>
                    
                    <div className="col-md-3">
                        <Field 
                            name="participant"
                            parse={value => {
                                onProgramPhaseChange(value)
                                return value;
                            }}
                        >
                        {({ input, meta }) => (
                            <div className="form__form-group">
                                <span className="form__form-group-label">Program Name:</span>
                                <div className="form__form-group-field">
                                    <div className="form__form-group-row">
                                        <input type="text" {...input} placeholder="" />
                                    </div>
                                </div>
                            </div>
                        )}
                        </Field>
                    </div>   
            
                    <div className="col-md-6 d-flex align-items-end pl-5">
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

        // <div className="form__form-group">
          
        //     <div className="col-md-4">
        //         <div className="">
        //             <input 
        //                 value={keyword}
        //                 onChange={onProgramPhaseChange}
        //                 type="text"
        //                 placeholder="Program Name"
        //             />
        //         </div>
        //     </div>
            
        //     <div className="col-md-4 d-flex align-items-center max-height-32px pl-1">
        //         <span className="text-blue pointer" onClick={onClickFilter}>Filter</span>
        //     </div>
        // </div>
    )
}

export default ProgramFilter;