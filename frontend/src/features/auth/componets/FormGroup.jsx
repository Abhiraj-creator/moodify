import React from "react";

const FormGroup = ({label, placeholder, onChange, value, type = "text"}) => {
  return (
    <div className="form-group">
      <label htmlFor={label}>{label}</label>
      <input 
        type={type} 
        placeholder={placeholder} 
        onChange={onChange}
        value={value}
        id={label}
      />
    </div>
  );
};

export default FormGroup;
