import {useDispatch} from 'react-redux';
import {sendFlashMessage, sendModalFlashMessage} from '@/redux/actions/flashActions';
import FlashMessage from "@/shared/components/flash/FlashMessage";
import ModalFlashMessage from "@/shared/components/flash/ModalFlashMessage";

export {
    useDispatch,
    sendFlashMessage,
    FlashMessage,
    sendModalFlashMessage,
    ModalFlashMessage
}