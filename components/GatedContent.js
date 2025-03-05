import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { logInteraction } from '../lib/trackInteraction';

export default function GatedContent({ children, isPreview, onRegister }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Starting registration process for:', name, email);
      
      // Log to separate users collection
      const usersRef = collection(db, 'users');
      const userDoc = {
        name: name,
        email: email,
        skillLevel: localStorage.getItem('skillLevel') || 'not_specified',
        registeredAt: serverTimestamp()
      };
      
      const docRef = await addDoc(usersRef, userDoc);
      console.log('User registered with ID:', docRef.id);
      
      // Also log as an interaction for analytics
      await logInteraction({
        type: 'registration',
        content: `User registered: ${name}, ${email}`,
      });
      
      // Store in localStorage to remember the user
      localStorage.setItem('registered', 'true');
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      
      // Call the parent function to update state
      onRegister();
      
      // Track in Google Analytics if available
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'user_registration', {
          'event_category': 'Conversion',
          'user_email': email,
          'user_name': name
        });
      }
    } catch (error) {
      console.error('Failed to register user:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
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
      <div style={{ backgroundColor: '#EDF7ED', padding: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#2E7D32', marginBottom: '8px' }}>
            Get Your Complete Answer
          </h3>
          <p style={{ fontSize: '14px', color: '#1B5E20', margin: '8px 0' }}>
            Register for free to view the full response and unlock unlimited AI golf coaching
          </p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="First Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #AAA', 
                borderRadius: '5px',
                fontSize: '16px'
              }}
              required
              disabled={isSubmitting}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #AAA', 
                borderRadius: '5px',
                fontSize: '16px'
              }}
              required
              disabled={isSubmitting}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                backgroundColor: isSubmitting ? '#86C188' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isSubmitting ? 'default' : 'pointer'
              }}
            >
              {isSubmitting ? 'Registering...' : 'See Full Answer'}
            </button>
            <p style={{ fontSize: '12px', marginTop: '12px', color: '#666' }}>
              By registering, you agree to receive golf tips and updates. 
              We respect your privacy and will never share your information.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}