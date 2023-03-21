import React, {useState} from 'react';
import AlertPopup from './AlertPopup';

const AlertModalWrapper = ({alertRef, title, message, action}) => {
  const [isOpen, setOpen] = useState(false);
  const toggle = () => {
    setOpen(prev => !prev)
  }
  if( !title && alertRef.current.title) {
    title = alertRef.current.title
  }
  if( !message && alertRef.current.message) {
    message = alertRef.current.message
  }
  alertRef.current.toggle = toggle

  const props = {
    title, message, action, isOpen, setOpen, toggle
  }
  return (
    <>
      {
        <AlertPopup {...props} />
      }
    </>
  )
}

AlertModalWrapper.defaultProps = {
  alertRef: {current: {}}
}

export default AlertModalWrapper;
