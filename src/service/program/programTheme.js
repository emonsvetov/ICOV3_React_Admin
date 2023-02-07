import axios from 'axios'
export const getTheme = async (organizationId, programId) => {
    const response = await axios.get(
        `/organization/${organizationId}/program/${programId}/template`
    );
    return response.data;
};
export const getThemeByName = async (organizationId, programId, name) => {
    const response = await axios.get(
        `/organization/${organizationId}/program/${programId}/template/${name}`
    );
    return response.data;
};
export const resetTheme = async (organizationId, programId, templateId) => {
    const response = await axios.delete(
        `/organization/${organizationId}/program/${programId}/template/${templateId}`
    );
    return response.data;
};