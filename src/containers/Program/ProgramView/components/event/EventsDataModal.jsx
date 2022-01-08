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

const EventsDataModal = ({
  isOpen,
  setOpen,
  toggle,
  programId,
  theme,
  rtl,
}) => {
  const reactTableData = CreateTableData();
  const [rows, setData] = useState(reactTableData.tableRowsData);
  const [isEditable, setIsEditable] = useState(false);
  const [isResizable, setIsResizable] = useState(true);
  const [isSortable, setIsSortable] = useState(true);
  const [withDragAndDrop, setWithDragAndDrop] = useState(false);
  const [withPagination, setWithPaginationTable] = useState(true);
  const [withSearchEngine, setWithSearchEngine] = useState(false);

  const [eventData, setEventData] = useState([]);
  useEffect(async () => {
    const result = await axios.get(
      `/organization/1/program/${programId}/event`
    );
    setData(result.data);
    
  }, []);
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
    placeholder: "Search by First name...",
  };
  
  return (
    <Modal
      className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`}
      isOpen={isOpen}
      toggle={() => setOpen(true)}
    >
      <ModalBody className="modal-lg">
        <Col md={12} lg={12}>
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
                {/* <Button outline color="primary" className="mr-3" onClick={onClickCancel}>Cancel</Button>{' '} */}
                <Link
                  style={{ paddingRight: "32px", paddingTop: "11px" }}
                  className=""
                  onClick={toggle}
                >
                  Cancel
                </Link>

                <Link
                  style={{ maxWidth: "200px" }}
                  className="btn btn-primary account__btn account__btn--small"
                  to={`/events/add/${programId}`}
                >
                  Add Event
                </Link>
              </ButtonToolbar>
            </Col>
          </Row>
          <ReactTableBase
            key={
              withSearchEngine || isResizable || isEditable
                ? "modified"
                : "common"
            }
            columns={reactTableData.tableHeaderData}
            data={rows}
            updateEditableData={updateEditableData}
            tableConfig={tableConfig}
          />
        </Col>
      </ModalBody>
    </Modal>
  );
};

EventsDataModal.propTypes = {};

export default EventsDataModal;
