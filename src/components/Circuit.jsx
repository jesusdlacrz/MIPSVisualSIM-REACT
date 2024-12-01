import React from 'react';
import '../styles/Circuit.css';
import circuitImage from '../images/MIPSCIRCUIT.png';

const CircuitImage = () => {
  return (
    <div className="circuit-container">
      <img src={circuitImage} alt="Diagrama del Circuito" />
    </div>
  );
};

export default CircuitImage;