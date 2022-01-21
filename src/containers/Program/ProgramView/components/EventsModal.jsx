import CreateTableData from "./event/CreateData";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import ReactTableBase from "@/shared/components/table/ReactTableBase";

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

import axios from "axios";
import AddEventForm from './event/AddEventForm';
import AddIconForm from './event/AddIconForm'

const EventsModal = ({
  isOpen,
  setOpen,
  toggle,
  data,
  theme,
  rtl,
}) => {
  const reactTableData = CreateTableData();
  
  const [step, setStep] = useState(0);  
  var [data, setData] = useState(data)

  const handleStep = (step) =>{
    setStep(step);
  }
  const RenderEventsData = (props) =>{
    const {programId} = props;
    useEffect( () => {
      fetchEvents();
    }, []);
  
    const fetchEvents = async() =>{
      const result = await axios.get(
        `/organization/1/program/${programId}/event`
      );
      setData(result.data);
    }
    const [data, setData] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const [isResizable, setIsResizable] = useState(true);
    const [isSortable, setIsSortable] = useState(true);
    const [withDragAndDrop, setWithDragAndDrop] = useState(false);
    const [withPagination, setWithPaginationTable] = useState(true);
    const [withSearchEngine, setWithSearchEngine] = useState(false);
    const updateEditableData = (rowIndex, columnId, value) => {
      setData((old) =>
        old.map((item, index) => {
          if (index === rowIndex) {
            return {
              ...old[rowIndex],
              [columnId]: value,
            };
          }
          return item;
        })
      );
    };
    const tableConfig = {
      isEditable,
      isResizable,
      isSortable,
      withDragAndDrop,
      withPagination,
      withSearchEngine,
      manualPageSize: [10, 20, 30, 40],
      placeholder: "Search by Event name...",
    };
    // to={`/events/add/${programId}`}
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
          {!data?'Loading...': 
          <ReactTableBase
            key={
              withSearchEngine || isResizable || isEditable
                ? "modified"
                : "common"
            }
            columns={reactTableData.tableHeaderData}
            data={data}
            updateEditableData={updateEditableData}
            tableConfig={tableConfig}
          />
          }
      </>
    )
  }
  
  
  return (
    <Modal
      className={`modal-program-events modal-lg ${theme.className} ${rtl.direction}-support`}
      isOpen={isOpen}
      toggle={() => setOpen(true)}
    >
      <ModalBody className="modal-lg">
        <Col md={12} lg={12}>
        { step === 0 && <RenderEventsData programId = {data.id} onStep = { handleStep} />}
        { step === 1 && <AddEventForm onStep = { handleStep} />}
        { step === 2 && <AddIconForm onStep = { handleStep} />}
        </Col>
      </ModalBody>
    </Modal>
  );
};

EventsModal.propTypes = {};

export default EventsModal;
