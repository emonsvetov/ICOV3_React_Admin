import React, { useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { Editor } from '@tinymce/tinymce-react'
import { renderComponentField } from '@/shared/components/form/FormField'
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import JoditEditor from 'jodit-react';

var _wysiwyg_flag = true //this is an ugly hack to set initialValue only once!
const WYSIWYGEditor = ({
    onChange, value, name
}) => {
    const editor = useRef(null);
    const [content, setContent] = React.useState();
    const handleChange = (e) => {
        setContent(e)
        onChange(e)
    }
    const config = useMemo(
        () => ({
            readonly: false,
            placeholder:'',
            maxWidth: 600,
            width:'100%',
            askBeforePasteHTML: false,
            imageDefaultWidth:80,
            buttons: [
                'source',
                '|', 'bold', 'italic',
                '|', 'ul', 'ol',
                '|', 'font', 'fontsize', 'brush', 'paragraph',
                '|', 'table', 'link', 'image',
                '|', 'left', 'center', 'right', 'justify',
                // '|', 'undo', 'redo',
                '|', 'hr', 'eraser'
            ],
            toolbarAdaptive: false,
            toolbarSticky: false,
            showCharsCounter: false,
            showWordsCounter: false,
            showXPathInStatusbar: false,
        }),
        []
      );

    return (
        <JoditEditor
			ref={editor}
			value={value}
			config={config}
			tabIndex={1} // tabIndex of textarea
			onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
			onChange={onChange}
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
