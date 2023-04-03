import React, {useEffect, useState} from 'react';
import {Row, Col} from 'reactstrap';
import {Form, Field} from 'react-final-form';
import renderRadioButtonField from '@/shared/components/form/RadioButton';
import CheckboxField from '@/shared/components/form/CheckboxField';
import formValidation from "@/shared/validation/program-add";
import axios from 'axios';
import {isEmpty} from '@/shared/helpers'

const LiveModeForm = ({program, organization, auth}) => {

  const [programBalance, setProgramBalance] = useState(0);
  const [participantPointsBalance, setParticipantPointsBalance] = useState(2000);
  const [programInvoices, setProgramInvoices] = useState(0);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liveModeData, setLiveModeData] = useState([]);

  const prepareLiveMode = async (organizationId, programId) => {
    try {
      const response = await axios.get(`/organization/${organizationId}/program/${programId}/prepare-live-mode`);
      // console.log(response)
      return response.data
    } catch (e) {
      throw new Error(`API error:${e?.message}`);
    }
  }

  useEffect(() => {
    if (organization && program && isEmpty(liveModeData)) {
      prepareLiveMode(3, 22)
        .then(p => {
          setLiveModeData(p)
        })
    }
  }, [organization, program])

  const onSubmit = values => {
    const organizationId = organization.id;
    const programId = program.id;

    setLoading(true)
    axios.post(`/organization/${organizationId}/program/${programId}/live-mode`, values)
      .then((res) => {
        // console.log(res)
        if (res.status == 200 && res.data.success === true) {
          window.location = `/program/view/${programId}?message=Live Mode activated successfully!`
        }
      })
      .catch(error => {
        console.log(error.response.data);
        setErrors(error.response.data);
        setLoading(false)
      })
  }

  if (!organization || !program) return 'Loading...'

  return (
    <div>
      <p>The data of the current program and its subprograms, except for program settings, events and themes, will be
        deleted.</p>
      <div>&nbsp;</div>
      <ul className="styled_01">
        <li className={` ${liveModeData.users !== 0 ? 'hasError' : ''}`}>
          Users: <b>{liveModeData.users}</b>
        </li>
        <li className={` ${liveModeData.socialWalls !== 0 ? 'hasError' : ''}`}>
          Social wall: <b>{liveModeData.socialWalls}</b>
        </li>
        <li className={` ${liveModeData.invoices !== 0 ? 'hasError' : ''}`}>
          Invoices: <b>{liveModeData.invoices}</b>
        </li>
        <li className={` ${liveModeData.leaderboards !== 0 ? 'hasError' : ''}`}>
          Leaderboards: <b>{liveModeData.leaderboards}</b>
        </li>
        <li className={` ${liveModeData.budget !== 0 ? 'hasError' : ''}`}>
          Budget: <b>{liveModeData.budget}</b>
        </li>
        <li className={` ${liveModeData.giftCodes !== 0 ? 'hasError' : ''}`}>
          Gift сodes: <b>{liveModeData.giftCodes}</b>
        </li>
        <li className={` ${liveModeData.programsAward !== 0 ? 'hasError' : ''}`}>
          Programs award: <b>{liveModeData.programsAward}</b>
        </li>
      </ul>
      <p>&nbsp;</p>

      <Form
        onSubmit={onSubmit}
      >
        {({handleSubmit, form, submitting, values}) => (
          <form className="form" onSubmit={handleSubmit}>
            <button type="submit" className="btn btn-danger account__btn--small"
                    disabled={loading || errors}
            >Activate Live Mode
            </button>
          </form>
        )}
      </Form>
    </div>
  )
}

export default LiveModeForm;
