import React, { useMemo, useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Card,
  CardBody,
  ButtonToolbar,
  Row,
  Col,
} from "reactstrap";
import ReactTableBase from "@/shared/components/table/ReactTableBase";

import AddEventForm from './AddEventForm';
import AddIconForm from './AddIconForm'
import { COLUMNS } from "./columns"
import axios from 'axios'

const EventsDataModal = ({
  organization,
  isOpen,
  setOpen,
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
  var [data, setData] = useState(data)
  var [programEvents, setProgramEvents] = useState([])

  const fetchProgramEvents = async(programId) => {
    setLoading(true)
    try {
        const response = await axios.get(`/organization/${organization.id}/program/${programId}/event`);
        console.log(response)
        setProgramEvents(response.data);
        setLoading(false)
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

  useEffect(() => {
    fetchProgramEvents(data.id)
  },[data])

  let columns = useMemo( () => COLUMNS, [])

  const handleStep = (step) =>{
    setStep(step);
  }
  
  const RenderEventsData = (props) =>{

    if( loading ) return 'Loading...'
        
    return (
      <>
        <Row className="w100">
            <Col md="6" lg="6" xl="6">
              <div className="react-table__wrapper">
                <div className="card__title">
                  <h5 className="bold-text">Events</h5>
                  <h5 className="subhead">Description</h5>
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
                  >
                    Add Event
                  </Button>
              </ButtonToolbar>
            </Col>
          </Row>
          
          <ReactTableBase
              columns={columns}
              data={programEvents}
              tableConfig={tableConfig}
          />
      </>
    )
  }
  
  
  return (
    <Modal
      className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`}
      isOpen={isOpen}
      toggle={() => setOpen(true)}
    >
      <ModalBody className="modal-lg">
        <Col md={12} lg={12}>
        { step === 0 && <RenderEventsData programId = {data.id} onStep = { handleStep} />}
        { step === 1 && <AddEventForm onStep = { handleStep} program={data} />}
        { step === 2 && <AddIconForm onStep = { handleStep} />}
          
        </Col>
      </ModalBody>
    </Modal>
  );
};

EventsDataModal.propTypes = {};



export default EventsDataModal;
