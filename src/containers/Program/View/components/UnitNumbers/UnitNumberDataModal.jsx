import React, { useMemo, useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { ThemeProps, RTLProps } from "@/shared/prop-types/ReducerProps";
import { Modal, ModalBody, Button, ButtonToolbar, Row, Col } from "reactstrap";
import ReactTableBase from "@/shared/components/table/ReactTableBase";
import AddUnitNumbersForm from "./AddUnitNumbersForm";
import { COLUMNS } from "./columns";
import axios from "axios";
import {
  useDispatch,
  flashSuccess,
  flashError,
} from "@/shared/components/flash";
import Edit from "./edit";

const UnitNumbersDataModal = ({
  isOpen,
  toggle,
  data,
  theme,
  rtl,
  program,
}) => {
  const tableConfig = {
    isResizable: true,
    isSortable: false,
  };
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [editableUnitId, setEditableUnitId] = useState(null);
  const [loading, setLoading] = useState(false);
  var [data, setData] = useState(data);
  var [programUnitNumbers, setProgramUnitNumbers] = useState([]);

  const fetchUnitNumbers = async (organizationId, programId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/organization/${organizationId}/program/${programId}/unitnumber?disabled=true`
      );
      // console.log(response)
      setProgramUnitNumbers(response.data);
      setLoading(false);
    } catch (e) {
      throw new Error(`API error:${e?.message}`);
    }
  };

  useEffect(() => {
    if (data.organization_id && data.id) {
      fetchUnitNumbers(data.organization_id, data.id);
    }
  }, [data.organization_id, data.id, step]);
  console.log(data);
  const onClickRemove = (unitnumber) => {
    if(!window.confirm('Are you sure to delete this?')) return;
    setLoading(true);
    console.log(unitnumber);
    axios
      .delete(
        `/organization/${data.organization_id}/program/${unitnumber.program_id}/unitnumber/${unitnumber.id}`,
        { data: unitnumber }
      )
      .then((res) => {
        if (res.status === 200) {
          console.log("delete", res);
          fetchUnitNumbers(data.organization_id, data.id);
          // setProgramUnitNumbers(res);
          flashSuccess(dispatch, "Unit number deleted successfully");
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        flashError(dispatch, error.message);
      });
  };

  const onClickEdit = (unitId) => {
    if (unitId) {
      setStep(3);
      setEditableUnitId(unitId);
    }
  };

  const RenderActions = ({ row }) => {
    return (
      <>
        <span
          className="table-hover text-primary "
          style={{ cursor: "pointer" }}
          color="#ffffff"
          onClick={() => onClickEdit(row.original.id)}
        >
          View
        </span>{" "}
        | {" "}
        <span
          className="table-hover text-primary "
          style={{ cursor: "pointer" }}
          color="#ffffff"
          onClick={() => onClickEdit(row.original.id)}
        >
          Edit
        </span>{" "}
        |{" "}
        <span
          className="table-hover text-primary"
          style={{ cursor: "pointer" }}
          color="#ffffff"
          onClick={() => onClickRemove(row.original)}
        >
          {" "}
          Delete
        </span>
      </>
    );
  };

  let finalColumns = [
    ...COLUMNS,
    ...[
      {
        Header: "",
        accessor: "action",
        Cell: ({ row }) => <RenderActions row={row} />,
      },
    ],
  ];

  let columns = useMemo(() => finalColumns, []);

  const handleStep = (step) => {
    setStep(step);
  };

  const RenderUnitNumbersData = (props) => {
    if (loading) return "Loading...";

    return (
      <>
        <Row className="w100">
          <Col md="6" lg="6" xl="6">
            <div className="react-table__wrapper">
              <div className="card__title">
                <h5 className="bold-text">Unit Numbers</h5>
                <h5 className="subhead">Create/View unit numbers</h5>
              </div>
            </div>
          </Col>
          <Col md="6" lg="6" xl="6" className="text-right">
            <ButtonToolbar className="modal__footer flex justify-content-right w100">
              <Button outline color="primary" className="mr-3" onClick={toggle}>
                Close
              </Button>{" "}
              <Button
                type="submit"
                onClick={() => props.onStep(1)}
                className={data.uses_units ? "btn btn-primary" : "d-none"}
                color="#ffffff"
              >
                Add Unit Number
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>

        {(data.uses_units && (
          <>
            <Row className="mb-2">
              <Col>
                <h5>Total Units = {programUnitNumbers?.length}</h5>
              </Col>
            </Row>
            <ReactTableBase
              columns={columns}
              data={programUnitNumbers}
              tableConfig={tableConfig}
              program={data}
            />
          </>
        )) || <p>Program does not use Unit Numbers</p>}
      </>
    );
  };

  return (
    <Modal
      className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`}
      isOpen={isOpen}
      toggle={toggle}
    >
      <ModalBody className="modal-lg">
        <Col md={12} lg={12}>
          {step === 0 && (
            <RenderUnitNumbersData programId={data.id} onStep={handleStep} />
          )}
          {step === 1 && (
            <AddUnitNumbersForm onStep={handleStep} program={data} />
          )}
          {step === 3 && editableUnitId && (
            <Edit onStep={handleStep} unitId={editableUnitId} />
          )}
        </Col>
      </ModalBody>
    </Modal>
  );
};

UnitNumbersDataModal.propTypes = {
  theme: ThemeProps.isRequired,
  rtl: RTLProps.isRequired,
  data: Object.isRequired,
};

export default withRouter(
  connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
    data: state.program,
  }))(UnitNumbersDataModal)
);
