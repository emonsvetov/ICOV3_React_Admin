import React from 'react';
import CheckboxHierarchy from '@/shared/components/form/CheckboxHierarchy'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {useQuery} from "react-query";
// import {isEmpty} from '@/shared/helpers'
import { getProgramsHierachy } from '@/shared/apiHelper.jsx';
import { useParams } from "react-router-dom";
import { getProgramsHierarchyByProgram } from "../apiHelper";

const ProgramsHierarchy = ({organization, selectedPrograms, setSelectedPrograms}) => {

  // const [programs, setPrograms] = useState([])

  const fetchProgramData = async (pageFilterO, programId) => {
    const params = []
    let paramStr = ''
    if( pageFilterO ) {
      if(pageFilterO.status !== 'undefined' && pageFilterO.status) params.push(`status=${pageFilterO.status}`)
      if(pageFilterO.keyword !== 'undefined' && pageFilterO.keyword) params.push(`keyword=${pageFilterO.keyword}`)
      // console.log(params)
      paramStr = params.join('&')
    }

    if (organization?.id && programId) {
      return getProgramsHierarchyByProgram(organization.id, programId)
          .then(response => {
            return response;
          })
    }

    if(organization?.id) {
      return getProgramsHierachy( organization.id )
      .then( response => {
        return response;
      })
    }
  };

  let {programId} = useParams();

  const queryPageFilter = '';
  const {isLoading, error, data, isSuccess} = useQuery(
    ['programs', queryPageFilter, programId],
    () => fetchProgramData(queryPageFilter, programId),
    {
      keepPreviousData: true,
      staleTime: Infinity,
    }
  );

  // console.log(data)

  if( !data ) return 'loading...'

  if (data) {
    return (
      <>
        {isLoading && 'loading...'}
        <CheckboxHierarchy
          name="programs[]"
          attr='account_holder_id'
          options={data}
          fields={selectedPrograms}
          setFields={setSelectedPrograms}
          isRoot={true}
          label='View for Program'
        />
      </>
    );
  }

  return '';
};


export default withRouter(connect((state) => ({
  organization: state.organization
}))(ProgramsHierarchy));