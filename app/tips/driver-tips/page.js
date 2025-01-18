'use client'
import Head from 'next/head';
import Link from 'next/link';

export default function DriverTips() {
    return (
        <>
            <Head>
                <title>How to Hit Your Driver | Expert Golf Tips from Coach Chip</title>
                <meta name="description" content="Learn how to hit your driver better with expert tips from Coach Chip. Master driver setup, increase distance, and find more fairways with our comprehensive guide." />
                <meta name="keywords" content="golf driver tips, how to hit driver, golf driving tips, increase driver distance, golf tee shot, driver setup golf, golf driving accuracy" />
            </Head>
            <header style={{
                backgroundColor: '#2c3e50',
                color: 'white',
                padding: '20px',
                marginBottom: '30px',
                textAlign: 'center',
            }}>
                <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
                    <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 600 }}>Coach Chip</h1>
                    <h2 style={{ margin: '10px 0 0', fontSize: '16px', fontWeight: 300, opacity: 0.8 }}>Your AI Golf Coach</h2>
                </Link>
            </header>

            <main style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '20px',
                fontFamily: '"Inter", sans-serif',
                backgroundColor: '#f4f7f6',
                minHeight: '100vh',
            }}>

<div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '10px',
                    marginBottom: '30px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h1 style={{ 
                        fontSize: '2.5em', 
                        color: '#2c3e50', 
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        How to Hit Your Driver: Complete Guide
                    </h1>

                    <p style={{
                        fontSize: '18px',
                        color: '#666',
                        textAlign: 'center',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Master your tee shots, increase your distance, and find more fairways with these proven driver techniques.
                    </p>
                </div>

                <div style={{ 
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '10px',
                    marginBottom: '30px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <section>
                        <h2 style={{
                            color: '#2c3e50',
                            fontSize: '24px',
                            marginBottom: '20px',
                            paddingBottom: '10px',
                            borderBottom: '2px solid #4CAF50'
                        }}>Proper Driver Setup</h2>
                        
                        <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333', marginBottom: '20px' }}>
                            The key to hitting your driver effectively starts with proper setup. A few small adjustments to your stance and ball position can dramatically improve your drives.
                        </p>

                        <ul style={{ 
                            listStyleType: 'none',
                            padding: '0',
                            margin: '0 0 30px 0'
                        }}>
                            <li style={{
                                padding: '10px 15px',
                                marginBottom: '10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '5px',
                                fontSize: '16px',
                                lineHeight: '1.6'
                            }}>• Position the ball just inside your lead foot (forward in stance)</li>
                            <li style={{
                                padding: '10px 15px',
                                marginBottom: '10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '5px',
                                fontSize: '16px',
                                lineHeight: '1.6'
                            }}>• Wider stance than other clubs - slightly wider than shoulder width</li>
                            <li style={{
                                padding: '10px 15px',
                                marginBottom: '10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '5px',
                                fontSize: '16px',
                                lineHeight: '1.6'
                            }}>• Tilt your spine slightly away from the target at address</li>
                            <li style={{
                                padding: '10px 15px',
                                marginBottom: '10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '5px',
                                fontSize: '16px',
                                lineHeight: '1.6'
                            }}>• Tee height: half the ball should be above the club head at address</li>
                        </ul>
                    </section>
                    <section style={{ marginTop: '40px' }}>
                        <h2 style={{
                            color: '#2c3e50',
                            fontSize: '24px',
                            marginBottom: '20px',
                            paddingBottom: '10px',
                            borderBottom: '2px solid #4CAF50'
                        }}>Driver Swing Fundamentals</h2>

                        <h3 style={{ color: '#2c3e50', fontSize: '20px', marginTop: '30px' }}>The Takeaway</h3>
                        <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333', marginBottom: '15px' }}>
                            A proper takeaway sets up your entire swing:
                        </p>
                        <ul style={{ 
                            listStyleType: 'none',
                            padding: '0',
                            margin: '0 0 30px 0'
                        }}>
                            <li style={{
                                padding: '10px 15px',
                                marginBottom: '10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '5px',
                                fontSize: '16px',
                                lineHeight: '1.6'
                            }}>• Start the club back low and slow - no rushing</li>
                            <li style={{
                                padding: '10px 15px',
                                marginBottom: '10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '5px',
                                fontSize: '16px',
                                lineHeight: '1.6'
                            }}>• Keep your arms connected to your body turn</li>
                            <li style={{
                                padding: '10px 15px',
                                marginBottom: '10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '5px',
                                fontSize: '16px',
                                lineHeight: '1.6'
                            }}>• Maintain width in your swing arc</li>
                        </ul>

                        <h3 style={{ color: '#2c3e50', fontSize: '20px', marginTop: '30px' }}>The Power Move</h3>
                        <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333', marginBottom: '15px' }}>
                            Generate maximum distance with these key moves:
                        </p>
                        <ul style={{ 
                            listStyleType: 'none',
                            padding: '0',
                            margin: '0 0 30px 0'
                        }}>
                            <li style={{
                                padding: '10px 15px',
                                marginBottom: '10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '5px',
                                fontSize: '16px',
                                lineHeight: '1.6'
                            }}>• Create a full shoulder turn in the backswing</li>
                            <li style={{
                                padding: '10px 15px',
                                marginBottom: '10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '5px',
                                fontSize: '16px',
                                lineHeight: '1.6'
                            }}>• Start the downswing from the ground up - legs first</li>
                            <li style={{
                                padding: '10px 15px',
                                marginBottom: '10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '5px',
                                fontSize: '16px',
                                lineHeight: '1.6'
                            }}>• Keep your back elbow close to your body coming down</li>
                            <li style={{
                                padding: '10px 15px',
                                marginBottom: '10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '5px',
                                fontSize: '16px',
                                lineHeight: '1.6'
                            }}>• Release the club with authority through impact</li>
                        </ul>
                    </section>

                    <section style={{ marginTop: '40px' }}>
                        <h2 style={{
                            color: '#2c3e50',
                            fontSize: '24px',
                            marginBottom: '20px',
                            paddingBottom: '10px',
                            borderBottom: '2px solid #4CAF50'
                        }}>Common Driver Mistakes and Fixes</h2>
                        
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '10px',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{ color: '#2c3e50', fontSize: '20px', marginBottom: '15px' }}>Reverse Pivot</h3>
                            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                                If you find yourself leaning toward the target in the backswing, focus on keeping your spine tilted away from the target and maintaining your posture throughout the swing. This helps create proper weight shift and better contact.
                            </p>
                        </div>

                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '10px',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{ color: '#2c3e50', fontSize: '20px', marginBottom: '15px' }}>Casting the Club</h3>
                            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                                Early release of the club robs you of power. Focus on keeping your wrists cocked longer in the downswing and letting the club release naturally through impact, not before.
                            </p>
                        </div>

                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '10px',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{ color: '#2c3e50', fontSize: '20px', marginBottom: '15px' }}>Swinging Too Hard</h3>
                            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
                                Maximum power comes from speed, not force. Focus on smooth tempo and letting the club do the work. A controlled, balanced swing will produce better results than swinging as hard as you can.
                            </p>
                        </div>
                    </section>

                    <section style={{
                        marginTop: '40px',
                        backgroundColor: '#f8f9fa',
                        padding: '25px',
                        borderRadius: '10px'
                    }}>
                        <h2 style={{
                            color: '#2c3e50',
                            fontSize: '24px',
                            marginBottom: '20px',
                            paddingBottom: '10px',
                            borderBottom: '2px solid #4CAF50'
                        }}>Practice Drills for Better Drives</h2>
                        <ul style={{ 
                            listStyleType: 'none',
                            padding: '0',
                            margin: '0'
                        }}>
                            <li style={{
                                padding: '10px 15px',
                                marginBottom: '10px',
                                backgroundColor: 'white',
                                borderRadius: '5px',
                                fontSize: '16px',
                                lineHeight: '1.6',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}>• The Headcover Drill: Place a headcover just outside your back foot. Practice swinging without hitting it to groove an inside path.</li>
                            <li style={{
                                padding: '10px 15px',
                                marginBottom: '10px',
                                backgroundColor: 'white',
                                borderRadius: '5px',
                                fontSize: '16px',
                                lineHeight: '1.6',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}>• The Slow-Motion Swing: Make full swings at 50% speed, focusing on proper sequencing and balance.</li>
                            <li style={{
                                padding: '10px 15px',
                                marginBottom: '10px',
                                backgroundColor: 'white',
                                borderRadius: '5px',
                                fontSize: '16px',
                                lineHeight: '1.6',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}>• The Tee Height Test: Practice with different tee heights to find your optimal setup for consistent contact.</li>
                        </ul>
                    </section>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '10px',
                    marginBottom: '30px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{
                        color: '#2c3e50',
                        fontSize: '20px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>Related Golf Tips</h3>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        flexWrap: 'wrap'
                    }}>
                        <Link href="/tips/fix-slice" style={{
                            padding: '15px 25px',
                            backgroundColor: '#f8f9fa',
                            color: '#2c3e50',
                            textDecoration: 'none',
                            borderRadius: '5px',
                            textAlign: 'center',
                            minWidth: '200px'
                        }}>
                            How to Fix Your Slice
                        </Link>
                        <Link href="/tips/swing-basics" style={{
                            padding: '15px 25px',
                            backgroundColor: '#f8f9fa',
                            color: '#2c3e50',
                            textDecoration: 'none',
                            borderRadius: '5px',
                            textAlign: 'center',
                            minWidth: '200px'
                        }}>
                            Golf Swing Basics
                        </Link>
                    </div>
                </div>

                {/* Back to Home Button */}
                <div style={{ 
                    textAlign: 'center',
                    marginTop: '40px',
                    marginBottom: '60px'
                }}>
                    <Link href="/" style={{ 
                        display: 'inline-block',
                        padding: '15px 30px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        fontSize: '16px'
                    }}>
                        Back to Coach Chip
                    </Link>
                </div>
            </main>
        </>
    );
}