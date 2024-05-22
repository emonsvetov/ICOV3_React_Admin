import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditConfigurationModal = ({ isOpen, onClose, configuration, onSave }) => {
    const [formData, setFormData] = useState(configuration || {});

    useEffect(() => {
        setFormData(configuration || {});
    }, [configuration]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/tango-settings/edit/${formData.id}`, formData);
            onSave(formData);
            onClose();
        } catch (error) {
            console.error('Failed to update configuration:', error);
            alert('Error updating configuration');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h4>Edit Configuration</h4>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="platform_name">Platform Name:</label>
                    <input type="text" name="platform_name" value={formData.platform_name || ''} onChange={handleChange} />

                    <label htmlFor="platform_key">Platform Key:</label>
                    <input type="text" name="platform_key" value={formData.platform_key || ''} onChange={handleChange} />

                    <label htmlFor="platform_url">Platform URL:</label>
                    <input type="text" name="platform_url" value={formData.platform_url || ''} onChange={handleChange} />

                    <label htmlFor="platform_mode">Platform Mode:</label>
                    <input type="text" name="platform_mode" value={formData.platform_mode || ''} onChange={handleChange} />

                    <label htmlFor="account_identifier">Account Identifier:</label>
                    <input type="text" name="account_identifier" value={formData.account_identifier || ''} onChange={handleChange} />

                    <label htmlFor="account_number">Account Number:</label>
                    <input type="text" name="account_number" value={formData.account_number || ''} onChange={handleChange} />

                    <label htmlFor="customer_number">Customer Identifier:</label>
                    <input type="text" name="customer_number" value={formData.customer_number || ''} onChange={handleChange} />

                    <label htmlFor="udid">UDID:</label>
                    <input type="text" name="udid" value={formData.udid || ''} onChange={handleChange} />

                    <label htmlFor="etid">ETID:</label>
                    <input type="text" name="etid" value={formData.etid || ''} onChange={handleChange} />

                    <label htmlFor="status">Active:</label>
                    <input type="checkbox" name="status" checked={!!formData.status} onChange={handleChange} />

                    <label htmlFor="is_test">Test Configuration:</label>
                    <input type="checkbox" name="is_test" checked={!!formData.is_test} onChange={handleChange} />

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <input type="submit" value="Save Changes" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditConfigurationModal;
