import React from "react";

const FileProcessor = ({ onProcessFile }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      onProcessFile(event.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div id="dropArea">
      <p>Drag and drop a RAM file here, or click to select one.</p>
      <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleFileChange} />
      <button id="process-file-button" onClick={() => document.getElementById("fileInput").click()}>
        Process File
      </button>
    </div>
  );
};

export default FileProcessor;