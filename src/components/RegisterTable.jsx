import React from "react";

const RegisterTable = ({ registers }) => {
  return (
    <div className="table-container">
      <h2>Registers</h2>
      <table id="registerTable">
        <thead>
          <tr>
            <th>Register</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(registers).map((regName) => (
            <tr key={regName}>
              <td>{regName}</td>
              <td>{`0x${registers[regName].toString(16).toUpperCase()}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegisterTable;