import React from 'react';
import CheckboxHierarchy from '@/shared/components/form/CheckboxHierarchy'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {useQuery} from "react-query";
// import {isEmpty} from '@/shared/helpers'
import { getProgramsHierachy } from '@/shared/apiHelper.jsx';

const ProgramsHierarchy = ({organization, selectedPrograms, setSelectedPrograms}) => {

  // const [programs, setPrograms] = useState([]);

  const fetchProgramData = async (pageFilterO) => {
    const params = []
    let paramStr = ''
    if( pageFilterO ) {
      if(pageFilterO.status !== 'undefined' && pageFilterO.status) params.push(`status=${pageFilterO.status}`)
      if(pageFilterO.keyword !== 'undefined' && pageFilterO.keyword) params.push(`keyword=${pageFilterO.keyword}`)
      // console.log(params)
      paramStr = params.join('&')
    }

    if(organization?.id) {
      return getProgramsHierachy( organization.id )
      .then( response => {
        return response;
      })
    }
  };

  const queryPageFilter = '';
  const {isLoading, data} = useQuery(
    ['programs', queryPageFilter],
    () => fetchProgramData(queryPageFilter),
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