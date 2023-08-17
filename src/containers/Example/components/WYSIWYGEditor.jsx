import React from 'react'
import PropTypes from 'prop-types'
import { Editor } from '@tinymce/tinymce-react'
import { renderComponentField } from '@/shared/components/form/FormField'

const WYSIWYGEditor = ({
    onChange, value, name
}) => {
    const handleChange = (e) => {
        onChange(e.target.getContent());
    };
    return (
        <Editor
            textareaName={name}
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
  };
  
WYSIWYGEditor.defaultProps = {
};

export default renderComponentField(WYSIWYGEditor);


// const renderWYSIWYGEditor = ({ input, meta }) => (
//     <div className="form__form-group-input-wrap">
//       <WYSIWYGEditor {...input} />
//       {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
//     </div>
//   );
// export default renderWYSIWYGEditor;
// export default renderComponentField(WYSIWYGEditor);
