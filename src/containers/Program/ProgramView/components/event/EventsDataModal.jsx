import CreateTableData from "./CreateData";
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
import AddEventForm from './AddEventForm';
import AddIconForm from './AddIconForm'

const EventsDataModal = ({
  isOpen,
  setOpen,
  toggle,
  data,
  theme,
  rtl,
}) => {
  const reactTableData = CreateTableData();

  let event_columns = [
      ...reactTableData.tableHeaderData, 
      ...[{
          Header: "",
          accessor: "action",
          Cell: ({ row }) => <RenderActions row={row} />,
      }]
  ]
  let columns = useMemo( () => event_columns, [])
  
  const [step, setStep] = useState(0);  
  var [data, setData] = useState(data)

  const handleStep = (step) =>{
    setStep(step);
  }
  const RenderActions = ({row}) => {
      return (
          <>
              <Link to={`/program/${data.id}/event/${row.original.id}/edit`}>
                  View
              </Link>
          </>
      )
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
    const isResizable = true
    const isSortable = true
    const tableConfig = {
      isResizable,
      isSortable,
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
                isResizable
                ? "modified"
                : "common"
            }
            columns={columns}
            data={data}
            tableConfig={tableConfig}
          />
          }
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
        { step === 1 && <AddEventForm onStep = { handleStep} />}
        { step === 2 && <AddIconForm onStep = { handleStep} />}
          
        </Col>
      </ModalBody>
    </Modal>
  );
};

EventsDataModal.propTypes = {};

export default EventsDataModal;
