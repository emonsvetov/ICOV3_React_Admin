import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import { Field } from 'react-final-form';
import { labelizeNamedData } from '@/shared/helpers';
import { fetchRoles } from '@/shared/apiHelper';

const RoleFilter = ({ organization }) => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRoles = async () => {
            try {
                const rolesData = await fetchRoles(organization.id);
                setRoles(labelizeNamedData(rolesData, ['id', 'name']));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching roles:', error);
                setLoading(false);
            }
        };

        if (organization?.id) {
            fetchUserRoles();
        }
    }, [organization]);

    return (
        <Field name="user_role_id">
            {({ input, meta }) => (
                <div className="form__form-group">
                    <span className="form__form-group-label">User Role Type</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-row">
                            <Select
                                options={roles}
                                className="react-select"
                                placeholder="Select Role"
                                classNamePrefix="react-select"
                                {...input}
                            />
                            {meta.touched && meta.error && (
                                <span className="form__form-group-error">{meta.error}</span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Field>
    );
};

RoleFilter.propTypes = {
    organization: Object.isRequired,
};

export default withRouter(
    connect(state => ({
        organization: state.organization,
    }))(RoleFilter)
);
