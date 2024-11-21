import React from "react";

const InputArea = ({ mipsInput, onChange }) => {
  return (
    <div className="input-container">
      <textarea
        className="textarea"
        id="mips-input"
        placeholder="Enter MIPS instructions here..."
        value={mipsInput}
        onChange={onChange}
      />
    </div>
  );
};

export default InputArea;