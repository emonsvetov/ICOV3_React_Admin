import axios from 'axios'
export const isEmpty = (object) => { for(var i in object) { return false; } return true; }

export const fetchUser = async (organization_id, id ) => {
    try {
        const response = await axios.get(`/organization/${organization_id}/user/${id}`);
        // console.log(response)
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

export const Loader = () => (
  <div className="inner-load">
    <div className="load__icon-wrap">
      <svg className="load__icon">
        <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
      </svg>
    </div>
  </div>
);

export const getProgramById = async(organizationId, programId) => {
    try {
        const response = await axios.get(`/organization/${organizationId}/program/${programId}`);
        // console.log(response)
        return response.data
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

export const fetchRoles = async(organization_id, is_program_role = null, is_backend_role = null ) => {
    try {
        
        let url = `/organization/${organization_id}/role?minimal=true`

        if( is_program_role !== null )
        {
            url += `&is_program_role=${is_program_role ? 1: 0}`
        }
        
        if( is_backend_role !== null )
        {
            url += `&is_backend_role=${is_backend_role ? 1: 0}`
        }

        const response = await axios.get(url);
        // console.log(response)
        const results = response.data;
        return results;
    } catch (e) {
        throw new Error(`API error:${e?.message}`)
    }
}

export const fetchUserPrograms = async(organization_id, user_id) => {
    try {
        const response = await axios.get(
        `/organization/${organization_id}/user/${user_id}/program?minimal=true`
        );
        // console.log(response)
        const results = response.data;
        return results;
    } catch (e) {
        throw new Error(`API error:${e?.message}`)
    }
}

export const fetchUserProgramRoles = async(organization_id, user_id, program_id) => {
    try {
        const response = await axios.get(
        `/organization/${organization_id}/user/${user_id}/program/${program_id}/role`
        );
        // console.log(response)
        let results = response.data;
        return results;
    } catch (e) {
        throw new Error(`API error:${e?.message}`)
    }
}

export const fetchEventTypes = async(oId, pId) => {
    try {
        const response = await axios.get(
        `/organization/${oId}/program/${pId}/eventtype`
        );
        // console.log(response)
        const results = response.data;
        return results;
    } catch (e) {
        throw new Error(`API error:${e?.message}`)
    }
}

export const fetchEmailTemplates = async(organization, program, type) => {
    try {
        const response = await axios.get(
        `/organization/${organization}/program/${program}/emailtemplate/?type=${type}`
        );
        // console.log(response)
        const results = response.data;
        return results;
    } catch (e) {
        throw new Error(`API error:${e?.message}`)
    }
}

export const fetchProgramList = async(organization_id, flatList = false) => {
    try {
        // console.log(forceOrg)
        let url = `/organization/${organization_id}/program?minimal=true`
        if( flatList )  {
            url += `&tree=0`
        }
        const response = await axios.get(
            url
        );
        // console.log(response)
        const results = response.data;
        return results;
    } catch (e) {
        throw new Error(`API error:${e?.message}`)
    }
}

export const fetchProgramFlatListAndDifference = async (organization_id, program_id, action = 'add') => {
    try {
        // console.log(forceOrg)
        let url = `/organization/${organization_id}/subprogram/${program_id}/available/${action}`
        const response = await axios.get(
            url
        );
        const available = response.data;
        if( action == 'move') return available;
        let url2 = `/organization/${organization_id}/program/${program_id}/subprogram?paginate=false&minimal=true&flatlist=true`
        const response2 = await axios.get(
            url2
        );
        // console.log(response)
        const subprograms = response2.data;
        return {
            available,
            subprograms
        };
    } catch (e) {
        throw new Error(`API error:${e?.message}`)
    }
}

export const fetchProgramTreeForMoving = async (organization_id, program_id) => {
    try {
        // console.log(forceOrg)
        let url = `/organization/${organization_id}/subprogram/${program_id}/available/move`
        const response = await axios.get(
            url
        );
        // console.log(response)
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`)
    }
}

export const fetchEventIcons = async(organizationId) => {
  try {
      const response = await axios.get(`/organization/${organizationId}/event_icons`);
      return response.data
  } catch (e) {
      throw new Error(`API error:${e?.message}`);
  }
};

export const getPrograms = async (organizationId, paramStr = "") => {
  try {
    let url = `/organization/${organizationId}/program`
    if( paramStr !=="" )
    {
      url += "?" + paramStr
    }
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
}

export const getAllPrograms = async (paramStr = "") => {
    try {
        let url = `/programs-all`
        if( paramStr !=="" )
        {
            url += "?" + paramStr
        }
        const response = await axios.get(url);
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
}

export const getProgramsHierarchyByProgram = async (organizationId, parentProgramId) => {
    try {
        let url = `/organization/${organizationId}/program/${parentProgramId}/hierarchy`
        const response = await axios.get(url);
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
}

export const getProgramsHierachy = async (organizationId) => {
  try {
    let url = `/organization/${organizationId}/program/hierarchy`
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
}

export const getMilestoneOptions = async(organizationId, programId) => {
  try {
      const response = await axios.get(
      `/organization/${organizationId}/program/${programId}/eventtype-milestone-frequency`
      );
      // console.log(response)
      const results = response.data;
      return results;
  } catch (e) {
      throw new Error(`API error:${e?.message}`)
  }
}

export const getEventLedgerCodes = async(organizationId, programId) => {
  try {
      const response = await axios.get(`/organization/${organizationId}/program/${programId}/ledgercode`);
      // console.log(response)
      return response.data
  } catch (e) {
      throw new Error(`API error:${e?.message}`);
  }
};

export const createEventLedgerCode = async(organizationId, programId, data) => {
  try {
      const response = await axios.post(`/organization/${organizationId}/program/${programId}/ledgercode`, data);
      // console.log(response)
      return response.data
  } catch (e) {
      throw new Error(`API error:${e?.message}`);
  }
};

export const updateEventLedgerCode = async(organizationId, programId, ledgerCode, data) => {
  try {
      const response = await axios.put(`/organization/${organizationId}/program/${programId}/ledgercode/${ledgerCode}`, data);
      return response.data
  } catch (e) {
      throw new Error(`API error:${e?.message}`);
  }
};

export const deleteEventLedgerCode = async(organizationId, programId, ledgerCode) => {
  try {
      const response = await axios.delete(`/organization/${organizationId}/program/${programId}/ledgercode/${ledgerCode}`);
      return response.data
  } catch (e) {
      throw new Error(`API error:${e?.message}`);
  }
};
