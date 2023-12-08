import React, { useState } from 'react';
import CheckboxHierarchy from '@/shared/components/form/CheckboxHierarchy'
import {withRouter, useParams} from "react-router-dom";
import {connect} from "react-redux";
import {useQuery} from "react-query";
import {getProgramsHierachyReport} from "@/shared/apiHelper.jsx";

const ProgramsHierarchyReport = ({organization, selectedPrograms, setSelectedPrograms}) => {

  const { programId } = useParams();

  const fetchProgramData = async (pageFilterO, programId) => {
    const params = []
    let paramStr = ''
    if( pageFilterO ) {
      if(pageFilterO.status !== 'undefined' && pageFilterO.status) params.push(`status=${pageFilterO.status}`)
      if(pageFilterO.keyword !== 'undefined' && pageFilterO.keyword) params.push(`keyword=${pageFilterO.keyword}`)
      paramStr = params.join('&')
    }

    return getProgramsHierachyReport( programId )
      .then( response => {
          return response;
      })
  };

  const queryPageFilter = '';
  const {isLoading, error, data, isSuccess} = useQuery(
      ['programs', queryPageFilter, programId],
      () => fetchProgramData(queryPageFilter, programId),
      {
        keepPreviousData: true,
        staleTime: Infinity,
      }
  );

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
}))(ProgramsHierarchyReport));