import React from "react";

const RamTable = ({ memory }) => {
  return (
    <div className="table-container">
      <h2>RAM</h2>
      <table id="ramTable">
        <thead>
          <tr>
            <th>Address</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(memory).map((address) => (
            <tr key={address}>
              <td>{`0x${parseInt(address, 10).toString(16).toUpperCase()}`}</td>
              <td>{`0x${memory[address].toString(16).toUpperCase()}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RamTable;