import React from 'react';
import '../styles/Circuit.css';
import defaultImage from '../images/MIPSCIRCUIT.png';
import addImage from '../images/ADD.png';
import subImage from '../images/MIPSCIRCUIT.png';


const instructionImages = {
  'add': addImage,
  'sub': subImage,

};

const CircuitImage = ({ currentInstruction }) => {
  // Extrae el operador de la instrucción actual
  const [opName] = currentInstruction.trim().split(' ');
  // Selecciona la imagen correspondiente o una por defecto
  const imageSrc = instructionImages[opName] || defaultImage;

  return (
    <div className="circuit-container">
      <img src={imageSrc} alt={`Circuito para ${opName}`} />
    </div>
  );
};

export default CircuitImage;