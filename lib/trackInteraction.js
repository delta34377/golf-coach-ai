import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function logInteraction(params) {
  try {
    const interactionsRef = collection(db, 'interactions');
    
    const interactionDoc = {
      type: params.type,
      content: params.content,
      skillLevel: params.skillLevel || 'not_specified',
      timestamp: serverTimestamp(),
      isHelpful: params.isHelpful ?? null
    };

    const docRef = await addDoc(interactionsRef, interactionDoc);
    
    return docRef.id;
  } catch (error) {
    console.error('Error logging interaction:', error);
    return null;
  }
}