import {useDispatch} from 'react-redux';
import {sendFlashMessage} from '@/redux/actions/flashActions';
import FlashMessage from "@/shared/components/flash/FlashMessage";

export {
    useDispatch,
    sendFlashMessage,
    FlashMessage
}