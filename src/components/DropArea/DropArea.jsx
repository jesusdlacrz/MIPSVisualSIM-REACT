import React, { useState } from 'react';
import { preventDefaults } from './utils/preventDefaults';
import { handleDrop } from './utils/handleDrop';
import '../../styles/DropArea.css';

const DropArea = ({ setMipsInput, setHexInput }) => {
  const [isHighlight, setIsHighlight] = useState(false);

  return (
    <div
      id="dropArea"
      onDragEnter={(e) => { preventDefaults(e); setIsHighlight(true); }}
      onDragOver={preventDefaults}
      onDragLeave={(e) => { preventDefaults(e); setIsHighlight(false); }}
      onDrop={(e) => handleDrop(e, setIsHighlight, setMipsInput, setHexInput)}
      onMouseEnter={() => document.getElementById('dropArea').style.backgroundColor = ''}
      onMouseLeave={() => document.getElementById('dropArea').style.backgroundColor = ''}
      className={`${isHighlight ? 'highlight' : ''} drop-area`}
    >
      Drag and drop a RAM file here, or click to select one.
    </div>
  );
};

export default DropArea;
