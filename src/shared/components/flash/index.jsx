import {useDispatch} from 'react-redux';
import {sendFlashMessage} from '@/redux/actions/flashActions';
import FlashMessage from "@/shared/components/flash/FlashMessage";
import ApiErrorMessage from "@/shared/components/ApiErrorMessage"

const flash422 = (dispatch, errors) => {
    dispatch(sendFlashMessage(<ApiErrorMessage errors={errors} />, 'alert-danger', 'top'))
}

export {
    useDispatch,
    sendFlashMessage,
    FlashMessage,
    ApiErrorMessage,
    flash422
}