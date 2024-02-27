import React, { useMemo, useState, useEffect } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ThemeProps, RTLProps } from '@/shared/prop-types/ReducerProps';
import {
    Modal,
    ModalBody,
} from "reactstrap";
import {Button} from 'antd';
import CloseButton from "@/shared/components/CloseButton";
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { Col, Row } from 'antd';
import axios from "axios";

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Number of Participants',
        dataIndex: 'number_of_participants',
        key: 'number_of_participants',
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">

            </Space>
        ),
    },
];

const AwardLevelsModal = ({ isOpen, setOpen, toggle, theme, rtl, organization, data }) => {
    const [dataItems,setDataItems] = useState([]);

    const getDataItems = async () => {
        const response = await axios.get(
            `/organization/${data.organization_id}/program/${data.id}/program-award-levels`,
        );
        setDataItems(response.data)
    };

    useEffect(()=>{
        getDataItems();
    },[]);

    return (
        <Modal
            className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`}
            isOpen={isOpen}
            toggle={toggle}
        >
            <CloseButton onClick={toggle} />
            <ModalBody className="modal-lg">
                <Row>
                    <Col span={24}>
                        <h3>Award Levels</h3>
                        <h5 className="colorgrey">Programs / Program's Award Levels</h5>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}></Col>
                    <Col span={4}>
                        <Button style={{marginLeft:20,marginBottom:5}} type="primary">New Award Level</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table columns={columns} dataSource={dataItems} />
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    );
};

AwardLevelsModal.propTypes = {
    theme: ThemeProps.isRequired,
    rtl: RTLProps.isRequired,
    organization: Object.isRequired,
    data: Object.isRequired
};

export default withRouter(connect((state) => ({
    theme: state.theme,
    rtl: state.rtl,
    organization: state.organization,
    data: state.program
}))(AwardLevelsModal));
