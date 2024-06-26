import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Select from 'react-select'
import {Col, Container, Label, Row} from 'reactstrap';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps'
import getOrganizationList from '@/service/getOrganizationList'
import {labelizeNamedData, showOrgFilter} from '@/shared/helpers'
import { setOrganization as setAuthOrganization, getOrganization, AUTH_ORGANIZATION_TREE } from "@/containers/App/auth";
import {setOrganization} from '@/redux/actions/organizationActions';
import store from '@/containers/App/store';

const OrganizationFilter = ({
  theme, rtl, location, auth, organization
}) => {
  const [orgOptions, setOrgOptions] = React.useState([])
  const [org, setOrg] = React.useState('')
  const onOrgChange = (selectedOption) => {
    // const cachedTree = getCachedOrganizationTree()
    // console.log(cachedTree)
    // console.log(selectedOption)
    let newOrg = {name: selectedOption.label, id: parseInt(selectedOption.value)}
    setOrg(selectedOption.value)
    store.dispatch(setOrganization(newOrg))
    setAuthOrganization(newOrg);
  }
  const cacheOrganizationTree = (tree) => {
    localStorage.setItem(AUTH_ORGANIZATION_TREE, JSON.stringify(tree));
  }
  const getCachedOrganizationTree = (tree) => {
    return localStorage.getItem(AUTH_ORGANIZATION_TREE);
  }
  React.useEffect(() => {
    if( auth && auth?.id )
    {
      const selectedOrganization = getOrganization();
      if( selectedOrganization ) {
        // console.log(selectedOrganization)
        setOrg( selectedOrganization.id.toString()  )
      }
    }
  }, [auth, organization]);

  React.useEffect(() => {
    // console.log(organization)
    // const cachedTree = getCachedOrganizationTree()
    const cachedTree = null
    if( cachedTree ) {
      setOrgOptions(labelizeNamedData(JSON.parse(cachedTree)));
    } else {
      if( auth && auth?.id )
      {
          getOrganizationList()
          .then(list => {
            if( auth?.isSuperAdmin)  {
              list.unshift({id:1, name: 'ALL'});
            }
            setOrgOptions(
                labelizeNamedData(list)
            )
            cacheOrganizationTree(list);
          })
      }
    }
  }, [ auth ])

  // console.log("auth")
  // console.log(auth)
  if( !showOrgFilter(location) ) return null

  let orgPlaceholder = 'ALL'
  if (org && org !== "1") {
      orgPlaceholder = orgOptions.filter(o => o.value === org).map(o => o.label)
  }

  if( !auth?.id ) return null;

  const direction = location.pathname === '/' ? 'ltr' : rtl.direction;

  return (
      <Container className={`${theme.className} ${direction}-support OrganizationFilter-wrapper`}>
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

OrganizationFilter.propTypes = {
  theme: ThemeProps.isRequired,
  rtl: RTLProps.isRequired,
  location: PropTypes.shape().isRequired,
  organization: PropTypes.object,
  auth: PropTypes.object
};

export default withRouter(connect((state) => ({
  theme: state.theme,
  rtl: state.rtl,
  auth: state.auth,
  organization: state.organization
}))(OrganizationFilter));
