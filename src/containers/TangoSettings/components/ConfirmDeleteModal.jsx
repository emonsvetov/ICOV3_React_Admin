import React from 'react';

const ConfirmDeleteModal = ({ isOpen, onCancel, onConfirm }) => {
    if (!isOpen) return null;

    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
        content: {
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 1001,
        },
        actions: {
            marginTop: '20px',
            textAlign: 'right',
        },
        button: {
            padding: '8px 16px',
            marginLeft: '10px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
        cancelButton: {
            backgroundColor: '#ccc',
        },
        deleteButton: {
            backgroundColor: 'red',
            color: 'white',
        },
        header: {
            marginTop: 0,
        }
    };

    return (
        <div style={styles.overlay} onClick={onCancel}>
            <div style={styles.content} onClick={stopPropagation}>
                <h4 style={styles.header}>Confirm Deletion</h4>
                <p>Are you sure you want to delete this configuration?</p>
                <div style={styles.actions}>
                    <button style={{ ...styles.button, ...styles.cancelButton }} onClick={onCancel}>
                        Cancel
                    </button>
                    <button style={{ ...styles.button, ...styles.deleteButton }} onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
