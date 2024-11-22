// components/RegisterTable.js
import React from 'react';

function RegisterTable({ registers }) {
  return (
    <div className="table-container">
      <h2>Registros</h2>
      <table id="registerTable">
        <thead>
          <tr>
            <th>Registro</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(registers).map(([register, value]) => (
            <tr key={register}>
              <td>{register}</td>
              <td>{`0x${value.toString(16).padStart(2, '0')}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RegisterTable;