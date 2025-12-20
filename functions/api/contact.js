/**
 * Cloudflare Pages Function to send contact form emails
 * Uses Resend API (free: 3,000 emails/month)
 * 
 * Setup:
 * 1. Sign up at https://resend.com (free)
 * 2. Get API key from dashboard
 * 3. Add RESEND_API_KEY to Cloudflare Pages environment variables
 * 4. Add CONTACT_EMAIL to environment variables (your email address)
 */

export async function onRequestPost(context) {
  const { request, env } = context
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }
  
  try {
    const data = await request.json()
    const { name, email, comment } = data
    
    // Validate required fields
    if (!name || !email || !comment) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Get configuration from environment variables
    const resendApiKey = env.RESEND_API_KEY
    const yourEmail = env.CONTACT_EMAIL || 'xdrar@gmail.com'
    // Force use of verified domain - must use xdrar.xyz domain, not onboarding@resend.dev
    const hostname = new URL(request.url).hostname
    // Always use the verified domain, ignore env var if it's still the test email
    let fromEmail = env.FROM_EMAIL || `noreply@${hostname}`
    if (fromEmail.includes('onboarding@resend.dev') || fromEmail.includes('resend.dev')) {
      fromEmail = `noreply@${hostname}`
    }
    
    console.log('📧 Contact form submission:', { name, email, commentLength: comment.length })
    console.log('🔑 Config check:', { 
      hasApiKey: !!resendApiKey, 
      apiKeyPrefix: resendApiKey ? resendApiKey.substring(0, 10) + '...' : 'missing',
      yourEmail,
      fromEmail 
    })
    
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Send email to you
    console.log(`📤 Sending email to ${yourEmail}...`)
    try {
      await sendEmail({
        apiKey: resendApiKey,
        to: yourEmail,
        from: fromEmail,
        subject: `Contact from Portfolio: ${name}`,
        text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${comment}`,
        replyTo: email,
      })
      console.log(`✅ Email sent to ${yourEmail}`)
    } catch (error) {
      console.error(`❌ Failed to send email to ${yourEmail}:`, error.message)
      throw error
    }
    
    // Send confirmation to client
    console.log(`📤 Sending confirmation email to ${email}...`)
    try {
      await sendEmail({
        apiKey: resendApiKey,
        to: email,
        from: fromEmail,
        subject: 'Thanks for reaching out',
        text: `Hi ${name},\n\nThanks for reaching out, I've received your inquiry and will be in touch soon.\n\nYour message:\n${comment}\n\nBest regards,\nXDRAR`,
      })
      console.log(`✅ Confirmation email sent to ${email}`)
    } catch (error) {
      console.error(`❌ Failed to send confirmation to ${email}:`, error.message)
      // Don't throw here - we already sent the main email
      console.warn('⚠️ Continuing despite confirmation email failure')
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Thank you! Your message has been sent.'
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
    
  } catch (error) {
    console.error('Contact form error:', error)
    const errorMessage = error.message || 'Failed to send email. Please try again.'
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        } 
      }
    )
  }
}

async function sendEmail({ apiKey, to, from, subject, text, replyTo }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: from,
      to: [to],
      subject: subject,
      text: text,
      reply_to: replyTo || from,
    }),
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `Resend API error (${response.status}): ${errorText}`
    try {
      const errorJson = JSON.parse(errorText)
      if (errorJson.message) {
        errorMessage = `Resend API error: ${errorJson.message}`
      }
    } catch (e) {
      // Not JSON, use text as is
    }
    throw new Error(errorMessage)
  }
  
  return response.json()
}






