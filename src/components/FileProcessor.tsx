import React, { useRef } from "react";

interface FileProcessorProps {
  onProcessFile: (content: string) => void;
}

const FileProcessor: React.FC<FileProcessorProps> = ({ onProcessFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target?.result as string;
      onProcessFile(fileContent);
    };
    reader.readAsText(file);
  };

  return (
    <div className="button-container">
      <div id="dropArea">
        <p>Drag and drop a RAM file here, or click to select one.</p>
        <input type="file" id="fileInput" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
        <button id="process-file-button" onClick={handleFileSelect}>
          Process File
        </button>
      </div>
      <button id="simulate-mips-button" onClick={() => {}}>
        Simulate MIPS
      </button>
    </div>
  );
};

export default FileProcessor;