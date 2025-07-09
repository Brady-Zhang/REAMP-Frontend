import React, { useState } from 'react'
import { photographySignUp } from '../../api/photography/signUp-api';

const CompanySignUpPage = () => {
  const [photographyCompanyName, setPhotographyCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
      }

      try {
        await photographySignUp({
        password,
        email,
        phoneNumber,
        photographyCompanyName
        });  
      } catch (err){
        setError("Sign up failed. Please try again.")
      }
  };


  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <form onSubmit={handleSubmit} className=" bg-blue-100 rounded-xl shadow-lg p-4 flex-1 max-w-lg flex flex-col gap-y-10">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Sign Up</h1>
            {/*Company Name*/}
            <div>
                <label className="block mb-1 font-medium text-xl" htmlFor="comName">Company Name</label>
                <input 
                    type="text"
                    className="w-full px-3 py-3 border border-gray-300 rounded"
                    id='comName'
                    value={photographyCompanyName}
                    name='comName'
                    placeholder='Enter your company name'
                    onChange={(e) => setPhotographyCompanyName(e.target.value)}
                    required
                />
            </div>
            {/*Email*/}
            <div>
                <label className="block mb-1 font-medium text-xl" htmlFor="comEmail">Email Address</label>
                <input 
                    type="email"
                    className="w-full px-3 py-3 border border-gray-300 rounded"
                    id='comEmail'
                    value={email}
                    name='comEmail'
                    placeholder='Enter your email Address'
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            {/*Phone Number*/}
            <div>
                <label className="block mb-1 font-medium text-xl" htmlFor="phoneNumber">Phone Number</label>
                <input 
                    type="text"
                    className="w-full px-3 py-3 border border-gray-300 rounded"
                    id='phoneNumber'
                    value={phoneNumber}
                    name='phoneNumber'
                    placeholder='Enter your phone number'
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
            </div>
            {/*password*/}
            <div>
                <label className="block mb-1 font-medium text-xl" htmlFor="new-password">Password</label>
                <input 
                    type="password"
                    className="w-full px-3 py-3 border border-gray-300 rounded"
                    id='"new-password'
                    value={password}
                    name='"new-password'
                    placeholder='Enter your password'
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {/*confirm password*/}
            <div>
                <label className="block mb-1 font-medium text-xl" htmlFor="comPass">Confirm Password</label>
                <input 
                    type="password"
                    className="w-full px-3 py-3 border border-gray-300 rounded"
                    id='comPass'
                    value={confirmPassword}
                    name='comPass'
                    placeholder='Enter your password again'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            <button
                type='submit'
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded py-2 font-semibold"
            >
                Sign Up
            </button>
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        </form>
    </div>
  )
}

export default CompanySignUpPage