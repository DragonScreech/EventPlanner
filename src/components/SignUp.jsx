import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import '../css/SignUp.scss'
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr(false)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Account created for', name, userCredential.user);
      navigate('/')
      // Additional user profile setup can go here
    } catch (error) {
      console.error('Error signing up:', error.message);
      setErr(true)
    }
  };

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" onSubmit={handleSignUp}>
        <h1>Sign Up</h1>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <button type="submit">Sign Up</button>
        <p>{err ? 'There was issue signing in. Please check if your password is more than six characters.' : ''}</p>
        <Link to={'/signin'}>Have an account? Sign In</Link>
      </form>
    </div>
  );
};

export default SignUp;