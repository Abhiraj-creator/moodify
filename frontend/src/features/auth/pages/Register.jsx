import React, { useState } from "react";
import FormGroup from "../componets/FormGroup";
import "../styles/register.scss";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";


const Register = () => {

  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const {  HandleRegister } = useAuth();
  const navigate= useNavigate();

  const HandleSubmit = async (e) => {
    e.preventDefault();
    await HandleRegister({username: Username, email: Email, password: Password });
   navigate('/');
};

  return (
    <div>
      <main className="Register-page">
        <div className="form-container">
          <h1>Register</h1>

          <form onSubmit={(e)=>{
                HandleSubmit(e)
          }}>

            <FormGroup
              label="username"
              placeholder="enter username"
              onChange={(e) => {
               setUsername( e.target.value)
              }}
              value={Username}
            />

            <FormGroup
              label="email"
              placeholder="enter email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={Email}
            />

            <FormGroup
              label="password"
              placeholder="enter password"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={Password}
            />

            <button className="button">Submit</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Register;
