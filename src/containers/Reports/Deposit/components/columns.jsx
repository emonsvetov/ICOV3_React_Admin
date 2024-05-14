import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { formatDate } from '../../../../shared/helpers';
import axios from "axios";
import { Modal, ModalBody, ModalHeader, Button, Row, Col } from 'reactstrap';
import ViewInvoice from "../../../Program/View/components/invoice/ViewInvoice";

const InvoicesModal = ({ invoice, isOpen, closeModal }) => {
    return (
        <Modal isOpen={isOpen} toggle={closeModal} size="xl">
            <ModalHeader toggle={closeModal}>Invoice Details</ModalHeader>
            <ModalBody>
                <Row>
                    <Col>
                        <ViewInvoice invoice={invoice} {...invoice} />
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    );
};

const handleLinkClick = async (id, setIsModalOpen, setInvoiceData) => {
    try {
        const response = await axios.get(`/organization/1/program/1/invoice/${id}`);
        console.log(response.data);
        setInvoiceData(response.data);
        setIsModalOpen(true);
    } catch (error) {
        console.error(error);
    }
};

export const PROGRAM_DEPOSIT_COLUMNS = [
    {
        Header: "Program Name",
        accessor: "name",
        Footer: "Total",
        // sticky:'left'
    },
    {
        Header: "Program ID",
        accessor: "program_id",
        Footer: "",
        maxWidth: 100,
    },
    {
        Header: "Root Program Name",
        accessor: "root_name",
    },
    {
        Header: "Invoice Number",
        accessor: "invoice_number",
        Cell: ({ row }) => {
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [invoiceData, setInvoiceData] = useState(null);
            return (
                <>
                    <Link style={{ color: '#70bbfd', cursor: 'pointer' }} onClick={() => handleLinkClick(row.original.invoice_id, setIsModalOpen, setInvoiceData)}>
                        {row.original.invoice_number}
                    </Link>
                    {isModalOpen && invoiceData && (
                        <InvoicesModal invoice={invoiceData} isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
                    )}
                </>
            );
        },
    },
    {
        Header: "Monies Deposited",
        accessor: "amount",
        Cell: ({ value }) => `$${parseFloat(value).toFixed(2)}`,
        Footer: (info) => {
            const { rows } = info;
            const totalValue = rows.reduce((sum, row) => Number(row.values.amount) + sum, 0);
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Deposit Fee",
        accessor: "deposit_fee",
        Cell: () => `$0.00`,
        Footer: (info) => {
            const { rows } = info;
            const totalValue = rows.reduce((sum, row) => Number(0) + sum, 0);
            return <span>{`$${parseFloat(totalValue).toFixed(2)}`}</span>;
        },
    },
    {
        Header: "Posting Date",
        accessor: "date_paid",
        Cell: ({ value }) => formatDate(value),
    },
    {
        Header: "Posted By",
        accessor: "admin",
    },
];
