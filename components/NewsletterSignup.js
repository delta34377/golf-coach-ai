import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { subscribeToNewsletter } from '../lib/newsletter';

const NewsletterSignup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Show popup after 45 seconds or 50% scroll
    const timer = setTimeout(() => {
      if (!localStorage.getItem('newsletter_shown')) {
        setIsVisible(true);
      }
    }, 20000);

    const handleScroll = () => {
      if (!localStorage.getItem('newsletter_shown')) {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrolled > 50) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await subscribeToNewsletter(email);
    if (success) {
      localStorage.setItem('newsletter_shown', 'true');
      setSubmitted(true);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button 
          onClick={() => {
            setIsVisible(false);
            localStorage.setItem('newsletter_shown', 'true');
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        {!submitted ? (
          <>
            <h2 className="text-2xl font-bold text-green-700 mb-4">
  Improve Your Golf Game Today
</h2>
<p className="text-gray-600 mb-6">
  Join our newsletter for:
  • Simple tips to fix common mistakes
  • Easy-to-follow practice drills
  • Quick ways to lower your scores
</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Get Free Tips
              </button>
            </form>
          </>
        ) : (
            <div className="text-center py-8">
            <h3 className="text-xl font-bold text-green-700 mb-4">
              Welcome to the Coach Chip Community!
            </h3>
            <p className="text-gray-600">
              You'll receive our latest golf tips and exclusive content soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterSignup;