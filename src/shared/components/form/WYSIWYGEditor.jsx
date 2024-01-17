import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from '@tinymce/tinymce-react'
import { renderComponentField } from '@/shared/components/form/FormField'
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'

var _wysiwyg_flag = true //this is an ugly hack to set initialValue only once!
const WYSIWYGEditor = ({
    onChange, value, name
}) => {
    const [content, setContent] = React.useState();
    const handleChange = (e) => {
        setContent(e)
        onChange(e)
    }
    return (
        <ReactQuill 
        value={_wysiwyg_flag ? value : null}
        onChange={handleChange} />
    );
}

WYSIWYGEditor.propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string
}
  
WYSIWYGEditor.defaultProps = {
}

export default renderComponentField(WYSIWYGEditor);
