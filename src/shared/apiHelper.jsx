import axios from 'axios'

export const fetchUser = async (organization_id, id ) => {
    try {
        const response = await axios.get(`/organization/${organization_id}/user/${id}`);
        // console.log(response)
        return response.data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

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

export const fetchEventTypes = async() => {
    try {
        const response = await axios.get(
        `/eventtype`
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
        let url2 = `/organization/${organization_id}/program/${program_id}/subprogram?minimal=true&flatlist=true`
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