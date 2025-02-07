'use client'

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { logInteraction } from '../lib/trackInteraction';
import NewsletterSignup from '../components/NewsletterSignup';

const trackEvent = (category, action, label) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      send_to: process.env.NEXT_PUBLIC_GA_ID
    });
  }
};


// Add this JSON-LD script component right after your imports
const SchemaData = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsApplication",
    "name": "Coach Chip AI Golf Coach",
    "description": "AI-powered golf instruction providing personalized coaching for all skill levels.",
    "applicationCategory": "Sports Training",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "sportsActivity": ["Golf", "Golf Instruction", "Golf Training"],
    "sportsActivityLocation": "Online",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

// Utility function to count tokens (simple approximation)
function countTokens(text) {
  // Rough token estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}

export default function Home() {
  // Initial message
  const initialMessage = { 
    role: 'assistant', 
    content: "Hi! I'm your AI golf coach. Select your skill level and ask me anything or use the quick questions above!",
    tokens: countTokens("Hi! I'm your AI golf coach. Select your skill level and ask me anything or use the quick questions above!")
  };

  // State management
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [skillLevel, setSkillLevel] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const MAX_REQUESTS_PER_HOUR = 20; // Maximum number of requests allowed per hour
  const REQUEST_TIMEOUT = 3600000; // 1 hour in milliseconds
  const checkRateLimit = () => {
    if (requestCount >= MAX_REQUESTS_PER_HOUR) {
      return false;
    }
    setRequestCount(prev => prev + 1);
    setTimeout(() => setRequestCount(prev => Math.max(0, prev - 1)), REQUEST_TIMEOUT);
    return true;
  };

  // Token and message management
  const MAX_TOTAL_TOKENS = 3000; // OpenAI token limit
  const MAX_MESSAGES = 10; // Limit conversation history

  const handleFeedback = async (messageIndex, isHelpful) => {
    // Prevent multiple feedback on the same message
    if (feedbackGiven[messageIndex]) {
        return;
    }

    try {
      // Log feedback to Firestore
      await logInteraction({
        type: 'feedback',
        content: messages[messageIndex].content,
        skillLevel: skillLevel,
        isHelpful: isHelpful
      });

      // Existing Google Analytics tracking
      if (typeof window !== 'undefined' && window.gtag) {
          // Get the question
          const questionText = messages[messageIndex - 1].content;
          
          // Create more specific event name for quick visibility
          const eventName = isHelpful ? 'helpful_response' : 'unhelpful_response';
          
          window.gtag('event', eventName, {
              'question': questionText,
              'skill_level': skillLevel || 'not_specified',
              'skill_feedback_combo': `${skillLevel || 'no_level'}_${isHelpful ? 'helpful' : 'not_helpful'}`
          });
          
          console.log(`Question "${questionText}" was marked ${isHelpful ? 'HELPFUL' : 'NOT HELPFUL'} by ${skillLevel || 'unspecified'} skill level user`);
      }

      // Update state to track feedback
      setFeedbackGiven(prev => ({
          ...prev,
          [messageIndex]: isHelpful ? 'helpful' : 'not_helpful'
      }));
  } catch (error) {
      console.error('Failed to log feedback:', error);
  }
};

  // Responsive design check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Check initial load
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup listener
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

    const allQuickQuestions = [
    // Swing Mechanics
    "How do I fix my slice?",
    "How can I stop hooking the ball?",
    "Improve my swing consistency",
    "Correct my swing path",
    "How to generate more power in my swing",
    "Reduce my swing's lateral movement",
    "Improve my follow-through technique",

    // Putting
    "Help me improve my putting",
    "Read greens more effectively",
    "Improve putting accuracy",
    "Consistent putting technique",
    "Overcome putting yips",
    "Improve short putting",
    "Develop a reliable putting routine",

    // Short Game
    "Fix my chip shots",
    "Improve my wedge play",
    "Mastering different chip shot types",
    "How to hit a perfect flop shot",
    "Bunker shot techniques",
    "Improve sand trap play",
    "Precision around the green",

    // Distance and Power
    "How do I get more distance?",
    "Increase driver distance",
    "Improve iron shot distance",
    "Golf fitness for more power",
    "Proper weight transfer in swing",

    // Equipment and Technique
    "What's the proper golf grip?",
    "Choose the right golf clubs",
    "Correct club fitting tips",
    "Understanding club selection",
    "Improve ball striking consistency",
    "Mental game strategies",
    "Pre-shot routine improvement"
  ];

  // Function to get 6 random unique questions
  const getRandomQuestions = () => {
    const shuffled = [...allQuickQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  };

  // Initial quick questions before randomization
  const initialQuickQuestions = allQuickQuestions.slice(0, 6);

  // State to manage quick questions
  const [quickQuestions, setQuickQuestions] = useState(initialQuickQuestions);

// Use useEffect to handle client-side random selection
useEffect(() => {
  // Generate random questions
  const randomQuestions = getRandomQuestions();
  
  // Set the questions in state
  setQuickQuestions(randomQuestions);
}, []); // Empty dependency array means this runs only on initial mount
  // Manage conversation sliding window and token count
  const pruneConversation = (currentMessages) => {
    let totalTokens = currentMessages.reduce((sum, msg) => sum + (msg.tokens || 0), 0);
    let prunedMessages = [...currentMessages];

    // Remove oldest messages while over token limit or message count
    while (
      (totalTokens > MAX_TOTAL_TOKENS || prunedMessages.length > MAX_MESSAGES) && 
      prunedMessages.length > 1 // Keep at least the initial message
    ) {
      const removedMessage = prunedMessages.splice(1, 1)[0]; // Remove second message (keep initial)
      totalTokens -= removedMessage.tokens || 0;
    }

    return prunedMessages;
  };

  // Clear conversation history
  const clearHistory = () => {
    setMessages([initialMessage]);
  };

  async function handleSubmit(e, quickQuestion = null) {
    e?.preventDefault();
    const messageToSend = quickQuestion || input;
    
    console.log('Question asked:', messageToSend); // Log question immediately
 
    // Google Analytics tracking
    try {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'golf_question', {
                'event_category': 'Interaction',
                'question_type': quickQuestion ? 'quick_question' : 'custom_question',
                'question_text': messageToSend,
                'skill_level': skillLevel || 'not_specified'
            });
        }
    } catch (err) {
        console.error('GA Error:', err);
    }
 
    // Log the question to Firestore
    try {
        await logInteraction({
            type: 'question',
            content: messageToSend,
            skillLevel: skillLevel
        });
        console.log('Successfully logged to Firebase:', messageToSend);
    } catch (error) {
        console.error('Failed to log question:', error);
    }
 
    if ((!messageToSend.trim() && !quickQuestion) || isLoading) return;
    if (!checkRateLimit()) {
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: 'You have reached the maximum number of requests per hour. Please try again later.',
            tokens: 20
        }]);
        return;
    }
 
    setIsLoading(true);
    setIsTyping(true);
 
    const userMessage = { 
        role: 'user', 
        content: messageToSend,
        tokens: countTokens(messageToSend)
    };




    // Update messages with pruning
    const updatedMessages = pruneConversation([...messages, userMessage]);
    setMessages(updatedMessages);
    setInput('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `CRITICAL INSTRUCTIONS:
            - You are EXCLUSIVELY a golf AI instructor
            - ONLY discuss topics DIRECTLY related to golf
            - If ANY question is NOT about golf, IMMEDIATELY respond with:
              "I apologize, but I am designed ONLY to assist with golf-related questions. Please ask something specifically about golf techniques, equipment, rules, or gameplay."
            
            SKILL LEVEL CONTEXT: ${skillLevel ? `The user is a ${skillLevel} golfer. Adjust all advice to be specifically appropriate for ${skillLevel} skill level.` : 'No skill level specified - provide general advice that can be understood by any golfer.'}
            
            When giving advice:
            - For beginners: Focus on fundamentals and basic concepts
            - For intermediate: Build on basics and introduce more complex techniques
            - For advanced: Discuss nuanced adjustments and sophisticated strategies
            
            Provide clear, detailed advice focused 100% on golf. Give:
            - Actionable golf-specific steps
            - Practical golf drills
            - Break down golf techniques into simple parts
            - Include specific golf examples
            - Highlight common golf mistakes to avoid`
            },
            ...updatedMessages.filter(m => m.role !== 'system')
          ]
        })
      });

      const data = await response.json();
      const assistantMessage = { 
        role: 'assistant', 
        content: data.choices[0].message.content,
        tokens: countTokens(data.choices[0].message.content)
      };

      // Update messages with pruning again
      setMessages(prevMessages => pruneConversation([...prevMessages, assistantMessage]));
    } catch (error) {
      console.error(error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, there was an error. Please try again.',
        tokens: countTokens('Sorry, there was an error. Please try again.')
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
    
    setIsLoading(false);
    setIsTyping(false);
  }

  // Mobile-friendly styles
  const styles = {
    main: {
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      padding: isMobile ? '10px' : '20px',
      boxSizing: 'border-box'
    },
    headerContainer: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      gap: '10px'
    },
    skillLevelContainer: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center',
      gap: '10px'
    },
    quickQuestionsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '20px'
    },
    quickQuestionButton: {
      padding: isMobile ? '10px 12px' : '8px 15px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: isMobile ? '12px' : '14px',
      flex: isMobile ? '1 1 calc(50% - 10px)' : 'none',
      maxWidth: isMobile ? 'none' : 'auto'
    },
    inputForm: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '10px'
    },
    input: {
      flex: 1,
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '16px',
      width: isMobile ? '100%' : 'auto',
      marginBottom: isMobile ? '10px' : '0'
    },
    sendButton: {
      padding: '10px 20px',
      backgroundColor: isLoading ? '#ccc' : '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      width: isMobile ? '100%' : 'auto'
    },
    messageContainer: {
      padding: '15px',
      margin: '10px 0',
      borderRadius: '10px',
      whiteSpace: 'pre-wrap',
      lineHeight: '1.5',
      fontSize: isMobile ? '14px' : '16px',
      overflowWrap: 'break-word',
      wordWrap: 'break-word'
    }
  };

  return (
<>
<Head>
  
  <title>Coach Chip | Your AI Golf Coach - Instant Golf Tips & Instruction</title>
  <meta name="description" content="Get instant, personalized golf coaching from Coach Chip AI. Improve your swing, putting, and overall game with 24/7 access to AI-powered golf instruction for all skill levels." />
  <meta name="keywords" content="golf coach, golf instruction, golf lessons, golf tips, golf swing help, putting tips, golf AI, golf training, golf improvement, golf coach online" />
  
  {/* Open Graph / Facebook */}
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Coach Chip AI Golf Coach" />
  <meta property="og:description" content="Get instant, personalized golf coaching anytime. AI-powered instruction for all skill levels." />
  <meta property="og:site_name" content="Coach Chip" />
  
  {/* Twitter */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Coach Chip AI Golf Coach" />
  <meta name="twitter:description" content="Get instant, personalized golf coaching anytime. AI-powered instruction for all skill levels." />
  
  {/* Additional SEO meta tags */}
  <meta name="robots" content="index, follow" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="language" content="English" />
  <link rel="canonical" href="https://coachchip.ai" />
  
  {/* Fonts */}
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />
  
  {/* Schema.org structured data */}
  <SchemaData />
    {/* Google Analytics Script */}
    <script
    async
    src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  />
  <script
    dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
          page_path: window.location.pathname,
        });
      `,
    }}
  />
</Head>

      <main style={{
        ...styles.main,
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
        backgroundColor: '#f4f7f6'
      }}>
        {/* New Header */}
        <header 
  style={{
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer' // Add this to show it's clickable
  }}
>
  <Link href="/" style={{ 
    color: 'white', 
    textDecoration: 'none' 
  }}>
    <h1 style={{
      margin: 0,
      fontSize: isMobile ? '24px' : '32px',
      fontWeight: 600,
      letterSpacing: '-0.5px'
    }}>
      Coach Chip
    </h1>
    <h2 style={{
      margin: '10px 0 0',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: 300,
      opacity: 0.8
    }}>
      Your AI Golf Coach
    </h2>
  </Link>
</header>

      {/* Skill Level and Clear History Container */}
      <div style={styles.headerContainer}>
      <div style={styles.skillLevelContainer}>
  <label style={{ 
    fontWeight: 'bold', 
    marginRight: '10px', 
    color: 'black', // Explicitly set a dark color
    fontSize: '16px' // Ensure it's readable
  }}>Skill Level:</label>
  <select 
    value={skillLevel} 
    onChange={(e) => setSkillLevel(e.target.value)}
    style={{ 
      padding: '8px', 
      borderRadius: '5px',
      border: '1px solid #ccc',
      width: isMobile ? '100%' : 'auto',
      backgroundColor: 'white', // Explicitly set background to white
    color: 'black', // Ensure black text
    fontSize: '16px' // Consistent font size

    }}
  >
    <option value="">Select Level (Optional)</option>
    <option value="beginner">Beginner</option>
    <option value="intermediate">Intermediate</option>
    <option value="advanced">Advanced</option>
  </select>
</div>
        
        {/* Clear History Button */}
        <button
          onClick={clearHistory}
          style={{
            padding: '8px 15px',
            backgroundColor: '#ff8080',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            width: isMobile ? '100%' : 'auto'
          }}
        >
          Clear History
        </button>
      </div>

      {/* Quick Questions */}
      <div style={styles.quickQuestionsContainer}>
        {quickQuestions.map((question, index) => (
          <button
            key={index}
            onClick={(e) => handleSubmit(e, question)}
            style={{
              ...styles.quickQuestionButton,
              opacity: isLoading ? 0.7 : 1,
            }}
            disabled={isLoading}
          >
            {question}
          </button>
        ))}
      </div>

{/* Chat Messages */}
<div style={{ marginBottom: '20px' }}>
  {messages.map((msg, i) => (
    <div 
      key={i} 
      style={{ 
        ...styles.messageContainer,
        backgroundColor: msg.role === 'user' ? '#e2f8e2' : '#f0f0f0',
        color: 'black', // Explicitly set text color to black
        fontSize: isMobile ? '16px' : '18px' // Ensure readable font size
      }}
    >
      <strong style={{ color: 'black' }}>{msg.role === 'user' ? 'You: ' : 'Coach: '}</strong>
      {msg.content}
     {/* Only show feedback buttons for coach responses (excluding initial message) */}
     {msg.role === 'assistant' && i !== 0 && (
    <div style={{
        marginTop: '10px',
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end'
    }}>
        <button
            onClick={() => handleFeedback(i, true)}
            style={{
                padding: '6px 12px',
                backgroundColor: feedbackGiven[i] === 'helpful' ? '#2ecc71' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                cursor: feedbackGiven[i] ? 'default' : 'pointer',
                fontSize: '12px',
                transform: feedbackGiven[i] === 'helpful' ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s ease',
                opacity: feedbackGiven[i] && feedbackGiven[i] !== 'helpful' ? 0.5 : 1
            }}
            disabled={!!feedbackGiven[i]}
        >
            {feedbackGiven[i] === 'helpful' ? '✓ Helpful' : '👍 Helpful'}
        </button>
        <button
            onClick={() => handleFeedback(i, false)}
            style={{
                padding: '6px 12px',
                backgroundColor: feedbackGiven[i] === 'not_helpful' ? '#ff8080' : '#f0f0f0',
                color: feedbackGiven[i] === 'not_helpful' ? 'white' : '#666',
                border: '1px solid #ddd',
                borderRadius: '15px',
                cursor: feedbackGiven[i] ? 'default' : 'pointer',
                fontSize: '12px',
                transform: feedbackGiven[i] === 'not_helpful' ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s ease',
                opacity: feedbackGiven[i] && feedbackGiven[i] !== 'not_helpful' ? 0.5 : 1
            }}
            disabled={!!feedbackGiven[i]}
        >
            {feedbackGiven[i] === 'not_helpful' ? '✓ Not Helpful' : '👎 Not Helpful'}
        </button>
    </div>
)}
    </div>
  ))}
</div>
        
        {/* Typing Indicator */}
        {isTyping && (
          <div style={{ 
            ...styles.messageContainer,
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#4CAF50',
              borderRadius: '50%',
              margin: '0 5px',
              animation: 'typing 1.4s infinite'
            }} />
            <span>Coach is typing...</span>
          </div>
        )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about your golf game..."
          style={{
            ...styles.input,
            ...(isLoading ? { cursor: 'not-allowed' } : {})
          }}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          style={styles.sendButton}
        >
          Send
        </button>
      </form>

      {/* Typing Animation */}
      <style jsx>{`
        @keyframes typing {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }

        * {
          -webkit-tap-highlight-color: transparent;
        }

        @media (max-width: 768px) {
          body {
            touch-action: manipulation;
          }
        }
      `}</style>

<NewsletterSignup />

{/* Footer Section */}
<footer style={{
  marginTop: '60px',
  padding: '20px',
  borderTop: '1px solid #ddd',
  color: '#4a5568'
}}>
  {/* Navigation and Contact */}
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px'
  }}>
    <button 
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        padding: '8px 15px',
        backgroundColor: '#2c3e50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      Back to Top
    </button>
    <a 
      href="mailto:hello@coachchip.ai"
      style={{
        color: '#2c3e50',
        textDecoration: 'none',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
      }}
    >
      <span>Contact: hello@coachchip.ai</span>
    </a>
  </div>

  {/* SEO Content */}
  <div style={{
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#666',
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center'
  }}>
    <p style={{ marginBottom: '15px' }}>
      Coach Chip is your personal AI golf coach, providing instant, customized golf instruction 24/7. 
      Get expert advice on improving your golf swing, putting technique, course management, and overall game strategy.
    </p>
    <p style={{ marginBottom: '15px' }}>
      Perfect for golfers of all skill levels - from beginners learning the basics to advanced players fine-tuning their technique. 
      Get immediate answers about driving, iron play, short game, putting, bunker shots, and golf rules.
    </p>
    <p>
      Access professional-level golf coaching anytime, anywhere. Improve your golf game with personalized tips, 
      actionable drills, and practical advice for common problems like fixing your slice, improving distance, 
      and developing a consistent swing.
    </p>
    <p style={{ 
      fontSize: '12px', 
      marginTop: '20px',
      color: '#888' 
    }}>
      © {new Date().getFullYear()} Coach Chip v1.0 | AI-Powered Golf Instruction
    </p>
  </div>
  <p style={{ 
  fontSize: '12px', 
  color: '#666',
  marginTop: '20px',
  padding: '10px',
  borderTop: '1px solid #eee',
  textAlign: 'center',
  lineHeight: '1.6'
}}>
  Disclaimer: Coach Chip is an AI-powered golf instruction tool designed exclusively for golf-related educational purposes. 
  The advice and suggestions provided should not be considered a substitute for professional in-person golf instruction. 
  Users should exercise their own judgment and assume all risks when implementing any golf techniques or advice. 
  We make no guarantees about the accuracy, reliability, or effectiveness of the guidance provided. 
  
  Coach Chip is not designed or intended to provide medical, legal, financial, or any non-golf-related advice. 
  Any attempts to manipulate the system to provide advice outside of golf instruction are strictly prohibited and may result in termination of access. 
  We are not responsible for any misuse of the system or unintended responses. Users agree to use this tool solely for its intended purpose of golf instruction.
  
  The service is provided "as is" without any warranties, express or implied. We disclaim all liability for any damages or losses arising from the use or misuse of this service. 
  Always consult with appropriate professionals for specific advice in their respective fields.
</p>
</footer>
    </main>
</>
  );
}