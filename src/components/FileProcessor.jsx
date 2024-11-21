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
      <input type="file" id="fileInput" onChange={handleFileChange} style={{ display: "none" }} />
      <button onClick={() => document.getElementById("fileInput").click()}>Process File</button>
    </div>
  );
};

export default FileProcessor;