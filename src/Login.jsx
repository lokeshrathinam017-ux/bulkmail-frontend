import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Login = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPass, setSigninPass] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPass, setSignupPass] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();
    axios.post(`${API_URL}/login`, { email: signinEmail, pass: signinPass })
      .then((res) => {
        if (res.data.success) {
          alert("Login Successful!");
          onLoginSuccess(res.data.user);
        } else {
          alert(res.data.message);
        }
      });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    axios.post(`${API_URL}/signup`, { name: signupName, email: signupEmail, pass: signupPass })
      .then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          setIsSignUp(false);
        } else {
          alert(res.data.message);
        }
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5DC] font-sans">
      <div className="relative w-[750px] h-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden flex">
        
        <div className={`w-1/2 p-8 flex flex-col justify-center items-center transition-all duration-700 ease-in-out ${isSignUp ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Sign In</h2>
          <form onSubmit={handleSignIn} className="w-full flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="Enter E-mail" 
              value={signinEmail} 
              onChange={(e) => setSigninEmail(e.target.value)} 
              className="w-full bg-slate-100 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]" 
              required
            />
            <input 
              type="password" 
              placeholder="Enter Password" 
              value={signinPass} 
              onChange={(e) => setSigninPass(e.target.value)} 
              className="w-full bg-slate-100 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]" 
              required
            />
            <button type="submit" className="w-full bg-[#008080] text-white font-semibold py-3 rounded-lg uppercase text-xs tracking-wider hover:bg-[#006666] transition mt-2">
              Sign In
            </button>
          </form>
          <p className="text-xs text-slate-500 mt-4 text-center">
            If you don't have an account, <button type="button" onClick={() => setIsSignUp(true)} className="text-[#008080] font-bold underline cursor-pointer">create one here</button>.
          </p>
        </div>

        <div className={`w-1/2 p-8 flex flex-col justify-center items-center transition-all duration-700 ease-in-out absolute right-0 h-full ${isSignUp ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Create Account</h2>
          <form onSubmit={handleSignUp} className="w-full flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="Name" 
              value={signupName} 
              onChange={(e) => setSignupName(e.target.value)} 
              className="w-full bg-slate-100 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]" 
              required
            />
            <input 
              type="email" 
              placeholder="Enter E-mail" 
              value={signupEmail} 
              onChange={(e) => setSignupEmail(e.target.value)} 
              className="w-full bg-slate-100 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]" 
              required
            />
            <input 
              type="password" 
              placeholder="Enter Password" 
              value={signupPass} 
              onChange={(e) => setSignupPass(e.target.value)} 
              className="w-full bg-slate-100 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]" 
              required
            />
            <button type="submit" className="w-full bg-[#008080] text-white font-semibold py-3 rounded-lg uppercase text-xs tracking-wider hover:bg-[#006666] transition mt-1">
              Sign Up
            </button>
          </form>
          <p className="text-xs text-slate-500 mt-3 text-center">
            Already have an account? <button type="button" onClick={() => setIsSignUp(false)} className="text-[#008080] font-bold underline cursor-pointer">Sign in</button>
          </p>
        </div>

        <div className={`absolute top-0 left-1/2 w-1/2 h-full bg-[#008080] text-white flex flex-col items-center justify-center text-center p-8 transition-transform duration-700 ease-in-out z-20 ${isSignUp ? '-translate-x-full rounded-r-[80px]' : 'rounded-l-[80px]'}`}>
          {isSignUp ? (
            <div>
              <h2 className="text-3xl font-bold mb-3">Welcome Back!</h2>
              <p className="text-sm text-teal-100 mb-6 leading-relaxed">To keep connected with us please login with your personal info.</p>
              <button 
                onClick={() => setIsSignUp(false)}
                className="border-2 border-white px-8 py-2.5 rounded-full font-semibold uppercase text-xs tracking-wider hover:bg-white hover:text-[#008080] transition"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold mb-3">Hello!</h2>
              <p className="text-sm text-teal-100 mb-6 leading-relaxed">Sign up now and enjoy our site with all custom features.</p>
              <button 
                onClick={() => setIsSignUp(true)}
                className="border-2 border-white px-8 py-2.5 rounded-full font-semibold uppercase text-xs tracking-wider hover:bg-white hover:text-[#008080] transition"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Login;