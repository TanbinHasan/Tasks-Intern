import React, { ChangeEvent } from 'react';

interface TextAreaProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: React.FC<TextAreaProps> = ({ value, onChange }) => {
  return (
    <div className="form-floating _feed_inner_text_area_box_form">
      <textarea
        className="form-control _textarea"
        placeholder="Write something"
        value={value}
        onChange={onChange}
        rows={3}
      />
      <label className="_feed_textarea_label">Write something...</label>
    </div>
  );
};

export default TextArea;