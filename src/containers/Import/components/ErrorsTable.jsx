import React from "react";

const ErrorsTable = ({ errors }) => {
  return (
    <div>
      <table>
        <thead>
          <th style={{ padding: "0px 5px 5px 5px", color: "#646777" }}>Line</th>
          <th style={{ padding: "0px 5px 5px 5px", color: "#646777" }}>
            Error
          </th>
        </thead>
        <tbody>
          {errors.map((error, index) => (
            <tr key={index}>
              <td
                style={{
                  maxWidth: 50,
                  padding: 5,
                  borderTop: "1px solid #ccc",
                }}
              >
                {error.row}
              </td>
              <td style={{ padding: 5, borderTop: "1px solid #ccc" }}>
                {error.error}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ErrorsTable;
