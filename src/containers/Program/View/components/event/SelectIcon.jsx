import React, {useEffect, useState} from 'react';
import {Modal, Radio} from 'antd';

const SelectIcon = ({activeIcon, handleSelectedIcon}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const icons = ['g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C'];
    const [showIcon, setShowIcon] = useState('');

    const showModal = () => {
        setModalVisible(true);
    };

    const handleOk = () => {
        setModalVisible(false);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const onChange = (e) => {
        handleSelectedIcon(e.target.value);
        setShowIcon(e.target.value);
    };

    useEffect(() => {
        setShowIcon(activeIcon && typeof activeIcon === 'object' ? activeIcon.name : activeIcon);
    }, [activeIcon]);

    return (
        <div>
            {showIcon ? (
                <span onClick={showModal} style={{cursor: 'pointer'}} className="icons">{showIcon}</span>
            ) : (
                <span onClick={showModal} style={{cursor: 'pointer'}}>Select an icon</span>
            )}
            <Modal
                title="Please select an icon"
                visible={modalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Radio.Group onChange={onChange} value={showIcon}>
                    {icons.map((icon1, index) => (
                        <Radio key={index} value={icon1}>
                            <span className="icons">{icon1}</span>
                        </Radio>
                    ))}
                </Radio.Group>
            </Modal>
        </div>
    );
};

export default SelectIcon;
