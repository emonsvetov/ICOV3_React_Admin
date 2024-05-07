import React, { useState, useEffect } from 'react';

const RoleFilter = ({ roles, selectedRole, onRoleChange }) => {
    const handleRoleChange = (event) => {
        const selectedRoleId = event.target.value;
        onRoleChange(selectedRoleId);
    };

    return (
        <select
            value={selectedRole}
            onChange={handleRoleChange}
            className="form-control"
        >
            <option value="">All Roles</option>
            {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
            ))}
        </select>
    );
};

export default RoleFilter;
