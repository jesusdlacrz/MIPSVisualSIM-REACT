import React from "react";

interface InputAreaProps {
  mipsInput: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ mipsInput, onChange }) => {
  return (
    <div className="input-container">
      <textarea
        className="textarea"
        id="mips-input"
        placeholder="Enter MIPS instructions here..."
        value={mipsInput}
        onChange={onChange}
      ></textarea>
    </div>
  );
};

export default InputArea;