import React, {useEffect, useState} from 'react';
import {Modal, Button, Input} from 'antd';

const AddAwardLevel = ({visible, onClose, onSave, data}) => {
    const [formData, setFormData] = useState({
        id: 0,
        event_id: 0,
        amount: 0,
        award_level_id: 0,
    });

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    useEffect(() => {
        setFormData(data);
    }, [data]);

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
            <div style={{marginBottom: '10px'}}>
                <label>Award Level Name</label>
                <Input
                    placeholder="Award Level Name"
                    value={formData.award_level_id}
                    onChange={(e) => setFormData({
                        ...formData,
                        award_level_id: e.target.value
                    })}
                />
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
