import React, { useState } from 'react';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [agreed, setAgreed] = useState(false); // ✅ Checkbox state

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("Login Function Executed", formData);
    let responseData;
    await fetch('https://e-commerce-app-backend-73bp.onrender.com/login', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json()).then((data) => responseData = data);

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  const signup = async () => {
    console.log("Signup Function Executed", formData);
    let responseData;
    await fetch('https://e-commerce-app-backend-73bp.onrender.com/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json()).then((data) => responseData = data);

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" && (
            <input
              name='username'
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder='Your Name'
            />
          )}
          <input
            name='email'
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder='Email Address'
          />
          <input
            name='password'
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder='Password'
          />
        </div>

        {/* ✅ Button disabled when not agreed */}
        <button
          onClick={() => { state === "Login" ? login() : signup(); }}
          disabled={!agreed}
          style={{
            opacity: agreed ? 1 : 0.5,
            cursor: agreed ? 'pointer' : 'not-allowed'
          }}
        >
          Continue
        </button>

        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account? <span onClick={() => { setState("Login"); }}>Login here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account? <span onClick={() => { setState("Sign Up"); }}>Click here</span>
          </p>
        )}

        <div className="loginsignup-agree">
          {/* ✅ Controlled checkbox */}
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
          />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
