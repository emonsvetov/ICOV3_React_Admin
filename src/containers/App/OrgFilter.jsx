import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Select from 'react-select'
import {Col, Container, Label, Row} from 'reactstrap';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps'
import getOrganizationList from '@/service/getOrganizationList'
import {labelizeNamedData} from '@/shared/helpers'
import { SU_SELECT_ORGANIZATION_TREE, setOrganization as setAuthOrganization } from "@/containers/App/auth";
import {setOrganization} from '@/redux/actions/organizationActions';
import store from '@/containers/App/store';

const OrgFilter = ({
  theme, rtl, location, auth, organization
}) => {
  const [orgOptions, setOrgOptions] = React.useState([])
  const [org, setOrg] = React.useState('')
  const onOrgChange = (selectedOption) => {
    // const cachedTree = getCachedOrganizationTree()
    // console.log(cachedTree)
    // console.log(selectedOption)
    setOrg(selectedOption.value)
    const org  = {name: selectedOption.label, id: parseInt(selectedOption.value)}
    // setSuOrganization({name: selectedOption.label, id: parseInt(selectedOption.value)});
    store.dispatch(setOrganization(org))
    setAuthOrganization(org)
    // window.location.reload();
  }
  const cacheOrganizationTree = (tree) => {
    localStorage.setItem(SU_SELECT_ORGANIZATION_TREE, JSON.stringify(tree));
  }
  const getCachedOrganizationTree = (tree) => {
    return localStorage.getItem(SU_SELECT_ORGANIZATION_TREE);
  }
  // React.useEffect(() => {
  //   if( auth && auth?.isSuperAdmin )
  //   {
  //       const suSelectedOrganization = getSuOrganization();
  //       if( suSelectedOrganization ) {
  //         setOrg( suSelectedOrganization.id.toString()  )
  //       }
  //   }
  // }, [auth]);

  React.useEffect(() => {
    // console.log(organization)
    // const cachedTree = getCachedOrganizationTree()
    const cachedTree = false
    if( cachedTree ) {
      setOrgOptions(labelizeNamedData(JSON.parse(cachedTree)));
    } else {
      if( auth && auth?.isSuperAdmin && organization?.id )
      {
          setOrg( organization.id.toString()  )
          getOrganizationList()
          .then(list => {
              // console.log(list)
              list.unshift({name: "All", id:1})
              setOrgOptions(
                labelizeNamedData(list)
              )
              cacheOrganizationTree(list);
          })
      }
    }
  }, [ auth, organization ])

  let orgPlaceholder = 'All'
  if (org && org !== "1") {
      orgPlaceholder = orgOptions.filter(o => o.value === org).map(o => o.label)
  }

  if( !auth || !auth?.isSuperAdmin ) return null;

  const direction = location.pathname === '/' ? 'ltr' : rtl.direction;

  return (
      <Container className={`${theme.className} ${direction}-support orgFilter-wrapper`}>
        <Row>
          <Col md={6} className='text-right'><Label>Organization</Label></Col>
          <Col md={6} className='pl-0'>
            <Select
                value={org}
                onChange={onOrgChange}
                options={orgOptions}
                clearable={false}
                className="react-select"
                placeholder={orgPlaceholder}
                classNamePrefix="react-select"
            />
          </Col>
        </Row>
      </Container>
  );
};

OrgFilter.propTypes = {
  theme: ThemeProps.isRequired,
  rtl: RTLProps.isRequired,
  location: PropTypes.shape().isRequired,
};

export default withRouter(connect((state) => ({
  theme: state.theme,
  rtl: state.rtl,
  auth: state.auth,
  organization: state.organization
}))(OrgFilter));
