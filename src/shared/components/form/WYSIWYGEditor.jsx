import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from '@tinymce/tinymce-react'
import { renderComponentField } from '@/shared/components/form/FormField'
var _wysiwyg_flag = true //this is an ugly hack to set initialValue only once!
const WYSIWYGEditor = ({
    onChange, value, name
}) => {
    const handleChange = (e) => {
        _wysiwyg_flag = false
        onChange(e.target.getContent());
    }
    return (
        <Editor
            textareaName={name}
            initialValue={_wysiwyg_flag ? value : null}
            init={{
                plugins: 'link image code lists',
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | numlist bullist',
                branding:false
            }}
            onChange={handleChange}
            apiKey='gon1mvhgbsxhewi5urhgihbk3xq8oo6sw88hs1p399e8ar2z'
        />
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
