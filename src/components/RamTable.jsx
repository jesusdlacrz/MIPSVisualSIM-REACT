// components/RamTable.js
import React from 'react';

function RamTable({ memory }) {
  return (
    <div className="table-container">
      <h2>RAM</h2>
      <table id="ramTable">
        <thead>
          <tr>
            <th>Dirección</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(memory).map(([address, value]) => (
            <tr key={address}>
              <td>{`0x${address.toString(16).padStart(2, '0')}`}</td>
              <td>{`0x${value.toString(16).padStart(2, '0')}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RamTable;