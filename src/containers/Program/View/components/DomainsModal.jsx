import React, {useEffect, useState} from 'react';
import {useDispatch, sendFlashMessage} from "@/shared/components/flash"
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import {Modal, ModalBody, Row, Col, Card, CardBody, ButtonToolbar, Button} from 'reactstrap';

import CloseButton from "@/shared/components/CloseButton";
import { Form, Field } from 'react-final-form';
import renderSelectField from '@/shared/components/form/Select'
import axios from "axios";


const DomainsModal = ({isOpen, toggle, program, theme, rtl}) => {
  const dispatch = useDispatch()
  const [errors, setErrors] = useState(null);
  const [domainOptions, setDomainOptions] = useState(null);
  const [defaultDomain, setDefaultDomain] = useState(null);

  const [loading, setLoading] = useState(false);

  const modalProps = {
        isOpen, toggle
    }

  useEffect(() => {
    if(!defaultDomain && program.default_domain){
      setDefaultDomain({'label': program.default_domain[0].name, 'value': program.default_domain[0].id});
    }
    if (!domainOptions) {
      let options = [];
      program.domains.map( (domain, i) => {
        options.push({'label': domain.name, 'value': '' + domain.id})
      });
      setDomainOptions(options)
    }
  }, [program]);

  const onChangeDefaultDomain = (value) => {
    setDefaultDomain(value);
  }

  const onSubmit = async (values) => {
    const url = `/organization/${program.organization_id}/program/${program.id}/default-domain`

    axios.post(url, {default_domain: defaultDomain?.value})
      .then( (res) => {
        if(res.status === 200)  {
          dispatch(sendFlashMessage('Default Domain added successfully!', 'alert-success'))
          toggle();
        }
      })
      .catch( error => {
          setErrors(error.response.data);
          setLoading(false)
      })
  };

  return (
        <Modal className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`} {...modalProps}>
            <CloseButton onClick={toggle} />
            <ModalBody className='modal-lg'>
                <Card>
                    <CardBody className='pt-0'>
                        <Row>
                            <Col md="12" lg="12" xl="12">
                                <div className="card__title">
                                    <h3>Domain settings.</h3>
                                    <h5 className="colorgrey">{program.name}</h5>
                                </div>
                            </Col>
                        </Row>
                      <Row>
                        <Col md="12" lg="12" xl="12">
                          <Form
                            onSubmit={onSubmit}
                            render={({ handleSubmit, form, submitting, pristine, values }) => (
                              <form className="form" onSubmit={handleSubmit}>
                                {
                                  errors && <ApiErrorMessage className="alert alert-danger fade show w100" errors={errors} />
                                }
                                <div style={{float: 'left', padding: '5px 10px 0px 0px'}}>Default domain:</div>
                                <div style={{float: 'left', minWidth: '250px'}}>
                                  <Field
                                    name="default_domain"
                                    options={domainOptions}
                                    initialValue={defaultDomain?.value}
                                    component={renderSelectField}
                                    parse={(value) => {
                                      onChangeDefaultDomain(value);
                                      return value;
                                    }}
                                  />
                                </div>
                                <Button style={{padding: '4px 25px', marginLeft: '10px'}}
                                  type="submit" disabled={loading} className="btn btn-primary" color="#ffffff">Save</Button>
                                <div style={{paddingTop: '10px', clear: 'both', width: '100%'}}>&nbsp;</div>
                              </form>
                            )}
                          />

                        </Col>
                      </Row>
                        <Row>
                            <Col md="12" lg="12" xl="12">
                                <div className="">
                                    {
                                        program.domains.length > 0 &&
                                        program.domains.map( (domain, i) => {
                                            return <div key={`domain-list-${i}`}>
                                                <Link target={`_blank`} className="" to={{pathname:`http://${domain.name}`}}>{domain.name}</Link> → <Link className="" to={`/domains/view/${domain.id}`}>settings</Link>
                                            </div>
                                        })
                                    }
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </ModalBody>
        </Modal>
    )
}

DomainsModal.propTypes = {
  theme: ThemeProps.isRequired,
  rtl: RTLProps.isRequired,
  setOpen: PropTypes.func.isRequired,
  organization: PropTypes.object.isRequired,
  program: PropTypes.object.isRequired,
};

export default withRouter(connect((state) => ({
  theme: state.theme,
  rtl: state.rtl,
  organization: state.organization,
  program: state.program
}))(DomainsModal));
