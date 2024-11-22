// components/InputContainer.js
import React from 'react';

function InputContainer({ mipsInput, setMipsInput }) {
  return (
    <div className="input-container">
      <textarea
        className="textarea"
        value={mipsInput}
        onChange={(e) => setMipsInput(e.target.value)}
        placeholder="Ingrese las instrucciones MIPS aquí..."
      />
    </div>
  );
}

export default InputContainer;