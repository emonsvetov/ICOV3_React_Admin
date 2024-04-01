import React, {useMemo, useState, useEffect} from "react";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {ThemeProps, RTLProps} from '@/shared/prop-types/ReducerProps';
import {
    Modal,
    ModalBody,
} from "reactstrap";
import {Button, Form} from 'antd';
import CloseButton from "@/shared/components/CloseButton";
import {Space, Table} from 'antd';
import {Col, Row, Checkbox, Input} from 'antd';
import axios from "axios";

const AwardLevelsModal = ({isOpen, setOpen, toggle, theme, rtl, organization, data}) => {
    const [dataItems, setDataItems] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [awardLevelName, setAwardLevelName] = useState('');

    const [awardLevel, setAwardLevel] = useState({
        id: 0,
        name: "",
        number_of_participants: 0,
        program_account_holder_id: null,
        program_id: 0,
        updated_at: "",
        created_at: "",
        v2id: null
    });
    const [action, setAction] = useState('index');

    const getDataItems = async () => {
        const response = await axios.get(
            `/organization/${data.organization_id}/program/${data.id}/program-award-levels`,
        );
        setDataItems(response.data)
    };

    const createItems = async (fValue) => {
        const response = await axios.post(
            `/organization/${data.organization_id}/program/${data.id}/create-award-level`, fValue);
        if (response.data.success){
            getDataItems();
            setAction('index');
            setAwardLevelName('');
        }
    };

    const getParticipants = async (id) => {
        const response = await axios.post(
            `/organization/${data.organization_id}/program/${data.id}/award-level-participants`, {
                id: id
            });
        setParticipants(response.data.data);
        setAction('view')
    };


    useEffect(() => {
        getDataItems();
    }, []);

    const onFinish = (values) => {
        createItems(values);
    };

    const onFinishFailed = (errorInfo: any) => {

    };

    const viewAwardLevels = (record: any) => {
        setAwardLevelName('/'+record.name);
        console.log(record);
        getParticipants(record.id)
    };

    const editAwardLevels = (record: any) => {
        setAction('edit');
        setAwardLevel(record);
        console.log(record);
    };

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
                <>
                    <Space size="middle" style={{color: '#70bbfd', cursor: "pointer"}} onClick={()=>editAwardLevels(record)}>Edit</Space> &ensp;
                    <Space size="middle" style={{color: '#70bbfd', cursor: "pointer"}} onClick={()=>viewAwardLevels(record)}>View</Space>
                </>
            ),
        },
    ];

    const columnsParticipants = [
        {
            title: 'Display Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <span size="middle">{record.first_name} {record.last_name}</span>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle" style={{color: '#70bbfd', cursor: "pointer"}} onClick={()=>window.open(`/program/${data.id}/user/view/${record.id}`, '_blank')} >View</Space>
            ),
        },
    ];

    return (
        <Modal
            className={`modal-program modal-lg ${theme.className} ${rtl.direction}-support`}
            isOpen={isOpen}
            toggle={toggle}
        >
            <CloseButton onClick={toggle}/>
            <ModalBody className="modal-lg">
                <Row>
                    <Col span={24}>
                        <h3>Award Levels</h3>
                        <h5 className="colorgrey">Programs / Program's Award Levels{awardLevelName}</h5>
                    </Col>
                </Row>
                {action === 'index' && (
                    <>
                        <Row>
                            <Col span={20}></Col>
                            <Col span={4}>
                                <Button style={{marginLeft: 20, marginBottom: 5}} type="primary"
                                        onClick={() => setAction('edit')}>New Award Level</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table columns={columns} dataSource={dataItems}/>
                            </Col>
                        </Row>
                    </>
                )}
                {action === 'edit' && (
                    <Form
                        name="basic"
                        labelCol={{span: 8}}
                        wrapperCol={{span: 16}}
                        style={{maxWidth: 600, marginTop: 10}}
                        initialValues={{remember: true}}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Row>
                            <Col span={17}>
                                <Form.Item
                                    name="program_id"
                                    style={{display: 'none'}}
                                    initialValue={data.id}
                                >
                                    <Input/>
                                </Form.Item>
                                <Form.Item
                                    name="id"
                                    style={{display: 'none'}}
                                    initialValue={awardLevel.id}
                                >
                                    <Input/>
                                </Form.Item>
                                <Form.Item
                                    label="Award Level Name"
                                    name="name"
                                    rules={[{required: true, message: 'Please input your "Award Level Name"'}]}
                                    initialValue={awardLevel.name}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={3}>
                                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                                    <Button onClick={() => {
                                        setAction('index');
                                        setAwardLevelName('')
                                    }}>
                                        Close
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                                    <Button type="primary" htmlType="submit">
                                        Save
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )}

                {action === 'view' && (
                    <>
                        <Row>
                            <Col span={21}>
                            </Col>
                            <Col span={3}>
                                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                                    <Button onClick={() => {
                                        setAction('index');
                                        setAwardLevelName('');
                                    }}>
                                        Close
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table columns={columnsParticipants} dataSource={participants}/>
                            </Col>
                        </Row>
                    </>
                )}
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
