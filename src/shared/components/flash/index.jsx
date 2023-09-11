import {useDispatch} from 'react-redux';
import {sendFlashMessage} from '@/redux/actions/flashActions';
import FlashMessage from "@/shared/components/flash/FlashMessage";
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"

export const dispatchError = (message) => {
  sendFlashMessage(<ApiErrorMessage errors={message} />, 'alert-danger', 'top')
}

export const dispatchSuccess = (message) => {
  sendFlashMessage( sendFlashMessage(message, 'alert-success', 'top') )
}

const flash = (type = 'warning', dispatch, message) => {
    if( type === 'success' )
    {
        dispatch(sendFlashMessage(message, 'alert-success', 'top'))
    }
    else if( type === '422' || type === 'errors' )
    {
        dispatch(sendFlashMessage(<ApiErrorMessage errors={message} />, 'alert-danger', 'top'))
    }
    else
    {
        dispatch(sendFlashMessage(message, 'alert-warning', 'top'))
    }
}

const flash422 = (dispatch, errors) =>  flash('422', dispatch, errors)
const flashSuccess = (dispatch, message) =>  flash('success', dispatch, message)
const flashError = (dispatch, errors) => flash('errors', dispatch, errors)

export {
    useDispatch,
    sendFlashMessage,
    FlashMessage,
    ApiErrorMessage,
    flash422,
    flashError,
    flashSuccess,
    flash
}