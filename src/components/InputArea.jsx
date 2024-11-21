import React from "react";

const InputArea = ({ mipsInput, onChange }) => {
  return (
    <div className="input-container">
      <textarea
        className="textarea"
        value={mipsInput}
        onChange={onChange}
        placeholder="Enter MIPS instructions here..."
      />
    </div>
  );
};

export default InputArea;