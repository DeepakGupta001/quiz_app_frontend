// src/components/Modal.js
import React from "react";

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    onSubmit(name);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Enter Your Name</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            className="border border-gray-300 p-2 rounded-md w-full mb-4"
            placeholder="Your Name"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
