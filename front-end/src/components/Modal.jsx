import React, { useState } from "react";

const Modal = ({ onClick }) => {
  const [value, setValue] = useState("");

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        }}
      >
        <input value={value} onChange={(e) => setValue(e.target.value)} />
        <button
          onClick={() => {
            onClick(value);
            setValue("");
          }}
        >
          Add val
        </button>
      </div>
    </div>
  );
};

export default Modal;
