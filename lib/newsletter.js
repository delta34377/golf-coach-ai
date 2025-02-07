import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function subscribeToNewsletter(email) {
  try {
    const subscribersRef = collection(db, 'newsletter_subscribers');
    const subscriberDoc = {
      email,
      subscribed_at: serverTimestamp(),
      status: 'active'
    };
    
    await addDoc(subscribersRef, subscriberDoc);
    return true;
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return false;
  }
}