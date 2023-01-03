import React, { useMemo, useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  Button,
  ButtonToolbar,
  Row,
  Col,
} from "reactstrap";
import ReactTableBase from "@/shared/components/table/ReactTableBase";
import FolderMoveOutlineIcon from 'mdi-react/PencilIcon'
import CloseButton from "@/shared/components/CloseButton";
import { COLUMNS } from "./columns"
import axios from 'axios'
import EditEmailTemplate from './edit'

const EmailTemplateDataModal = ({
  isOpen,
  toggle,
  data,
  theme,
  rtl,
}) => {
    const tableConfig = {
      isResizable: true,
      isSortable:false
    }

    // console.log(data)
  
  const [step, setStep] = useState(0);  
  const [loading, setLoading] = useState(false);  
  var [emailTemplates, setEmailTemplates] = useState([])
  var [template, setTemplate] = useState(null)
  var [trigger, setTrigger] = useState(null)

  const fetchProgramEmailTemplates = async(organizationId, programId) => {
    setLoading(true)
    try {
        console.log("Triggered")
        const response = await axios.get(`/organization/${organizationId}/program/${programId}/emailtemplate`);
        setEmailTemplates(response.data);
        setLoading(false)
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

  useEffect(() => {
    fetchProgramEmailTemplates(data.organization_id, data.id)
  },[data, trigger])

  const RenderActions = ({row}) => {
    return (
        <>
            <span className="">
                <FolderMoveOutlineIcon size={16} onClick={() => onClickEdit(row.original)} />
            </span>
        </>
    )
  }

  const onClickEdit = row => {
    // console.log(row)
    setStep(1)
    setTemplate(row)
  }

  let template_columns = [
    ...COLUMNS
  ]

  template_columns.forEach( (column, i) => {
      if( column.accessor === 'action')
      {
        template_columns[i].Cell =  ({ row, value }) => <RenderActions row={row} />
      }
      if( column.accessor === 'name')
      {
        template_columns[i].Cell =  ({ row, value }) => <span className="link" onClick={() => onClickEdit(row.original)}>{value}</span>
      }
  })

  let columns = useMemo( () => template_columns, [])

  const handleStep = (step) =>{
    setStep(step);
  }
  
  const RenderEmailTemplateData = (props) =>{

    if( loading ) return 'Loading...'
        
    return (
      <>
        <Row className="w100">
            <Col md="6" lg="6" xl="6">
              <div className="react-table__wrapper">
                <div className="card__title">
                  <h5 className="bold-text">Email Templates</h5>
                  <h5 className="subhead">Manage Program Specific Email Templates here</h5>
                </div>
              </div>
            </Col>
            <Col md="6" lg="6" xl="6" className="text-right">
              <ButtonToolbar className="modal__footer flex justify-content-right w100">
                  <Button
                    outline
                    color="primary"
                    className="mr-3"
                    onClick={toggle}
                  >
                  Cancel
                  </Button>{" "}
                  <Button
                    type="submit"
                    onClick = {() => props.onStep(1)}
                    className="btn btn-primary"
                    color="#ffffff"
                    disabled={true}
                  >
                    Add Template
                  </Button>
              </ButtonToolbar>
            </Col>
          </Row>
          
          <ReactTableBase
              columns={columns}
              data={emailTemplates}
              tableConfig={tableConfig}
          />
      </>
    )
  }
  // console.log(template)
  return (
    <Modal
      className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`}
      isOpen={isOpen}
      toggle={toggle}
    >
      <CloseButton onClick={toggle} />
      <ModalBody className="modal-lg">
        <Col md={12} lg={12}>
        { step === 0 && <RenderEmailTemplateData programId = {data.id} onStep = { handleStep } />}
        { step === 1 && template && <EditEmailTemplate onStep={ handleStep } setStep={setStep} template={template} program={data} setTrigger={setTrigger} />}
        </Col>
      </ModalBody>
    </Modal>
  );
};

EmailTemplateDataModal.propTypes = {};



export default EmailTemplateDataModal;
