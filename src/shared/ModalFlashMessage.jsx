import React, {useEffect} from 'react';  
import {useDispatch, useSelector} from 'react-redux';
import {sendModalFlashMessage} from '@/redux/actions/flashActions';

const ModalFlashMessage = () => {

    const dispatch = useDispatch();
    const flashMessage = useSelector(state => state.modalFlashMessage)

    const {message, className} = flashMessage;

    useEffect(
        () => {
          let timer1 = setTimeout(() => dispatch(sendModalFlashMessage(null, null)), 3000);
          return () => {
            clearTimeout(timer1);
          };
        },
        [flashMessage]
    );

    if( !message )    {
      return null;
    }

    return (
      <div className="w100" style={{
          position:'fixed',
          top: '0px',
          zIndex:666,
          left:0
      }}>
        <div 
        className={'col-md-12 alert justify-content-center text-white ' + className} 
        role="alert">
          {message}
        </div>
      </div>
    );
  }

export default ModalFlashMessage;