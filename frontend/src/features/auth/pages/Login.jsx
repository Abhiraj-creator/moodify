import React from 'react'
import FormGroup from '../componets/FormGroup'
import '../styles/Login.scss'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { useNavigate } from 'react-router'

const Login = () => {

    const {HandleLogin}= useAuth();
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const navigate= useNavigate()

    const HandleSubmit=async (e)=>{
      e.preventDefault()
      const result = await HandleLogin({email,password});
      if (result.success) {
        navigate('/')
      } else {
        alert(result.error || 'Login failed')
      }
  }
  
  return (
    <div>
        <main className="login-page">
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={HandleSubmit}>

                   <FormGroup label='email' placeholder='enter username/email'
                   onChange={(e)=>{setemail(e.target.value)}}
                   value={email}
                   />

                   <FormGroup label='password' placeholder='enter password'
                   onChange={(e)=>{setpassword(e.target.value)}}
                   value={password}
                   />

                   <button className='button'>Submit</button>
                </form>
            </div>
        </main>
    </div>
  )
}

export default Login