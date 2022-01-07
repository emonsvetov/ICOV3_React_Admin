import React, {useEffect} from 'react';  
import {useDispatch, useSelector} from 'react-redux';
import {sendFlashMessage} from '../redux/actions/flashActions';

const FlashMessage = () => {

    const dispatch = useDispatch();
    const flashMessage = useSelector(state => state.flashMessage)

    const {message, className} = flashMessage;

    useEffect(
        () => {
          let timer1 = setTimeout(() => dispatch(sendFlashMessage(null, null)), 3000);
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
          top: '60px',
          zIndex:666
      }}>
        <div 
        className={'col-md-12 alert justify-content-center text-white ' + className} 
        role="alert">
          {message}
        </div>
      </div>
    );
  }

export default FlashMessage;