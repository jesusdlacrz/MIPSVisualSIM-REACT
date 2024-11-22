// DropArea.jsx
import React, { useRef } from 'react';

function DropArea({ setMemory }) {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target.result;
      // Procesar el contenido del archivo y actualizar la memoria
      const lines = contents.split('\n');
      const newMemory = {};
      lines.forEach((line) => {
        const [addressStr, valueStr] = line.trim().split(' ');
        if (addressStr && valueStr) {
          const address = parseInt(addressStr, 16);
          const value = parseInt(valueStr, 16);
          newMemory[address] = value;
        }
      });
      setMemory(newMemory);
    };
    reader.readAsText(file);
  };

  return (
    <div
      id="dropArea"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
    >
      <p>Arrastra y suelta un archivo RAM aquí, o haz clic para seleccionar uno.</p>
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
}

export default DropArea;