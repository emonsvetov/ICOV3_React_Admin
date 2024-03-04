import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Select } from 'antd';
import axios from "axios";

const { Option } = Select;

const AddAwardLevel = ({ visible, onClose, onSave, data, organization, programId }) => {
    const [formData, setFormData] = useState({
        id: 0,
        event_id: 0,
        amount: 0,
        award_level_id: '',
    });

    const [awardLevels, setAwardLevels] = useState([]);

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    useEffect(() => {
        setFormData(data);
        getDataAwardLevels();
    }, [data]);

    const getDataAwardLevels = async () => {
        const response = await axios.get(
            `/organization/${organization}/program/${programId}/program-award-levels`,
        );
        setAwardLevels(response.data)
    };

    return (
        <Modal
            title="Add Award Level"
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={handleSave}>
                    Save
                </Button>,
            ]}
        >
            <div style={{ marginBottom: '10px' }}>
                <label>Award Level</label>
                <Select
                    placeholder="Select Award Level"
                    style={{width:'100%'}}
                    value={formData.award_level_id? formData.award_level_id : ''}
                    onChange={(value) => setFormData({
                        ...formData,
                        award_level_id: value
                    })}
                >
                    {awardLevels.map(level => (
                        <Option key={level.id} value={level.id}>{level.name}</Option>
                    ))}
                </Select>
            </div>
            <div>
                <label>Amount</label>
                <Input
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({
                        ...formData,
                        amount: e.target.value
                    })}
                />
            </div>
        </Modal>
    );
};

export default AddAwardLevel;
