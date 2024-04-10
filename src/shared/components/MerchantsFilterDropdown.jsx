import React, { useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { useQuery } from 'react-query';
import { isEmpty } from '@/shared/helpers';

const MerchantsFilterDropdown = ({ organization, selectedMerchants, setSelectedMerchants }) => {
    const [merchants, setMerchants] = useState([]);

    const fetchMerchants = async () => {
        const apiUrl = `/organization/${organization.id}/merchant?page=0&limit=9999999999&minimal=1&tree=1`;

        try {
            const response = await axios.get(apiUrl);
            if (response.data.length === 0) return [];
            return response.data;
        } catch (error) {
            console.error('Error fetching merchants:', error);
            return [];
        }
    };

    const { isLoading, error, data: fetchedMerchants } = useQuery('merchants', fetchMerchants);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const handleChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
        setSelectedMerchants(selectedOptions);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <label htmlFor="merchantsDropdown">Select Merchant(s):</label>
            <select id="merchantsDropdown" multiple onChange={handleChange} value={selectedMerchants} size={Math.min(fetchedMerchants.length, 5)}>
                {fetchedMerchants.map((merchant) => (
                    <option key={merchant.id} value={merchant.id}>
                        {merchant.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

const mapStateToProps = (state) => ({
    organization: state.organization,
});

export default connect(mapStateToProps)(MerchantsFilterDropdown);
