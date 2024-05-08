import axios from "axios";
export const getPositionLevels = async (organizationId, programId) => {
  try {
    let url = `/organization/${organizationId}/program/${programId}/positionlevel`;
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};

export const getPositionLevel = async (p, postionAssignpermissionId) => {
  try {
    const response = await axios.get(
      `/organization/${p.organization_id}/program/${p.id}/positionlevel/${postionAssignpermissionId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`API error:${error?.message}`);
  }
};

export const getPositionAssignPermissions = async (p, positionId) => {
  try {
    const response = await axios.get(
      `/organization/${p.organization_id}/program/${p.id}/positionlevel/${positionId}/assigned-permissions`
    );
    let assignPermissionData = response.data.data.map(
      (permissionData) => permissionData.position_permission
    );
    return assignPermissionData;
  } catch (error) {
    throw new Error(`API error:${error?.message}`);
  }
};

export const getPermissions = async (p) => {
  try {
    const response = await axios.get(
      `/organization/${p.organization_id}/program/${p.id}/positionpermissions`
    );
    return response.data;
  } catch (error) {
    throw new Error(`API error:${error?.message}`);
  }
};

export const PositionPermissionAssigments = ({ value }) => {
  return (
    <>
      {value?.map((permission) => (
        <p key={permission.id} className="m-1 d-inline">
          {permission.position_permission.title},{" "}
        </p>
      ))}
    </>
  );
};
