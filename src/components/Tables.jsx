import React from 'react';
import '../styles/Tables.css';

const SimulationTables = ({ registers, memory }) => {
  return (
    <div id="simulation-tables" className='tables-container'>
      <table id="ramTable" className='table' >
        <h2>RAM</h2>
        <thead>
          <tr className='values'>
            <th>Address</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(memory)
            .filter(addr => parseInt(addr) <= 0xF)
            .map((addr) => (
              <tr key={addr} className='values'>
                <td>{`0x${parseInt(addr).toString(16).toUpperCase()}`}</td>
                <td>{`0x${memory[addr].toString(16).toUpperCase()}`}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <table id="registerTable" className='table'>
        <h2>Registers</h2>
        <thead>
          <tr className='values'>
            <th>Register</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(registers).map((reg) => (
            <tr key={reg} className='values'>
              <td>{reg}</td>
              <td>{`0x${registers[reg].toString(16).toUpperCase()}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimulationTables;
