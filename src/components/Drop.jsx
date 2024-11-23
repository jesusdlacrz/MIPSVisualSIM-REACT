import React, { useState, useRef } from 'react';
import { handleDrop, preventDefaults } from '../utils/DropFunctions';
import '../styles/Drop.css';

const DropArea = ({ setMipsInput, setHexInput }) => {
  const [isHighlight, setIsHighlight] = useState(false);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFiles = (e) => {
    const files = e.target.files;
    if (files.length === 0) {
      console.error('No files selected');
      return;
    }
    const file = files[0];
    const event = {
      dataTransfer: { files: [file] },
      preventDefault: () => {},
      stopPropagation: () => {},
    };
    handleDrop(event, setIsHighlight, setMipsInput, setHexInput);
  };

  return (
    <div
      id="dropArea"
      onClick={handleClick}
      onDragEnter={(e) => { preventDefaults(e); setIsHighlight(true); }}
      onDragOver={preventDefaults}
      onDragLeave={(e) => { preventDefaults(e); setIsHighlight(false); }}
      onDrop={(e) => handleDrop(e, setIsHighlight, setMipsInput, setHexInput)}
      className={`${isHighlight ? 'highlight' : ''} drop-area`}
    >
      Drag and drop a RAM file here, or click to select one.
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFiles}
      />
    </div>
  );
};

export default DropArea;