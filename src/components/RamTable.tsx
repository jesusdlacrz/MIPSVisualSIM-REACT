import React from "react";

interface RamTableProps {
  memory: { [key: number]: number };
}

const RamTable: React.FC<RamTableProps> = ({ memory }) => {
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
              <td>{`0x${parseInt(address).toString(16).toUpperCase()}`}</td>
              <td>{`0x${memory[parseInt(address)].toString(16).toUpperCase()}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RamTable;