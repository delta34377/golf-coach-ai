import { useState } from 'react';
import { logInteraction } from '../lib/trackInteraction';

export default function GatedContent({ children, isPreview, onRegister }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log the registration
    try {
      await logInteraction({
        type: 'registration',
        content: `User registered: ${name}, ${email}`,
        skillLevel: 'not_specified'
      });
      
      // Store in localStorage to remember the user
      localStorage.setItem('registered', 'true');
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      
      // Call the parent function to update state
      onRegister();
    } catch (error) {
      console.error('Failed to log registration:', error);
    }
  };
  
  if (!isPreview) {
    return children;
  }
  
  return (
    <div className="border-t relative">
      {/* Blurred content */}
      <div className="bg-white p-4 relative overflow-hidden" style={{ maxHeight: '150px' }}>
        <div className="whitespace-pre-line">
          {children}
        </div>
        {/* Gradient blur overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white"
          style={{ top: '40px' }}
        ></div>
      </div>
      
      {/* Registration form */}
      <div className="bg-blue-50 p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-blue-800">Get Your Complete Answer</h3>
          <p className="text-sm text-blue-600 mt-1">
            Register for free to view the full response and unlock unlimited AI golf coaching
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-3">
            <input
              type="text"
              placeholder="First Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded"
            >
              See Full Answer
            </button>
            <p className="text-xs mt-3 text-gray-500">
              By registering, you agree to receive golf tips and updates. 
              We respect your privacy and will never share your information.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}