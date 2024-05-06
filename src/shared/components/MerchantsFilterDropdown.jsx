import React, { useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { useQuery } from 'react-query';
import Select from 'react-select';

const MerchantsFilterDropdown = ({ organization, selectedMerchants, setSelectedMerchants }) => {
    const fetchMerchants = async () => {
        const apiUrl = `/organization/${organization.id}/merchant?page=0&limit=9999999999&minimal=1&tree=1`;

        try {
            const response = await axios.get(apiUrl);
            return response.data.map((merchant) => ({
                value: merchant.id,
                label: merchant.name,
            }));
        } catch (error) {
            console.error('Error fetching merchants:', error);
            return [];
        }
    };

    const { isLoading, error, data: fetchedMerchants } = useQuery(
        ['merchants', organization.id],
        fetchMerchants,
        {
            enabled: !!organization.id,
            retry: false,
            refetchOnWindowFocus: false,
        }
    );

    useEffect(() => {
        // Clear selected merchants if the fetched list is empty
        if (!fetchedMerchants || fetchedMerchants.length === 0) {
            setSelectedMerchants([]);
        }
    }, [fetchedMerchants, setSelectedMerchants]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const handleChange = (selectedOptions) => {
        setSelectedMerchants(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Select
                id="merchantsDropdown"
                options={fetchedMerchants}
                isMulti
                value={fetchedMerchants.filter(merchant => selectedMerchants.includes(merchant.value))}
                onChange={handleChange}
                placeholder="Select merchants"
                isClearable
                className="react-select-container"
                classNamePrefix="react-select"
            />
        </div>
    );
};

const mapStateToProps = (state) => ({
    organization: state.organization,
});

export default connect(mapStateToProps)(MerchantsFilterDropdown);
