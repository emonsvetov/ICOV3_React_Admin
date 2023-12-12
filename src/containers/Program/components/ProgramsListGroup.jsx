import React, {useState} from "react";
import { Col, Row} from 'reactstrap';
import CheckboxField from "@/shared/components/form/CheckboxField";

const ProgramsListGroup = () => {

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([1, 2, 3, 4, 5, 6, 7, 8]);


  const checkboxOptions = [
    { id: 'checkbox1', label: 'Cash Deposit' },
    { id: 'checkbox2', label: 'Inventory' },
    { id: 'checkbox3', label: 'Journal Detailed' },
    { id: 'checkbox4', label: 'Points Reserve' },
    { id: 'checkbox5', label: 'Program Status' },
    { id: 'checkbox6', label: 'Supplier Redemption' },
    { id: 'checkbox7', label: 'Expire Points' },
    { id: 'checkbox8', label: 'Expire Monies' },
    { id: 'checkbox9', label: 'Deposit Transfer' },
    { id: 'checkbox10', label: 'Award Detail' },
    { id: 'checkbox11', label: 'Deposit' },
    { id: 'checkbox12', label: 'Unassigned Program Domains' },
    { id: 'checkbox13', label: 'Monies Pending Amount' },
    { id: 'checkbox14', label: 'Participant Status Summary' },
    { id: 'checkbox15', label: 'Participant Account Summary' },
   
  ];

  
  const handleCheckboxChange = (checkboxId) => {
      if (selectedCheckboxes.includes(checkboxId)) {
    
      setSelectedCheckboxes((prevSelected) =>
          prevSelected.filter((id) => id !== checkboxId)
      );
      } else {

      setSelectedCheckboxes((prevSelected) => [...prevSelected, checkboxId]);
      }
  };

  return (
    <>
      
        {checkboxOptions.map((option) => (
           <Col md="6" lg="4" xl="4">
            <div className="form__form-group">
              <CheckboxField
                name={`ww${option.id}`}
                label="Enable Social Wall"
              />
            </div>
          </Col>
         
        ))}
    </>
  );
};

export default ProgramsListGroup;

