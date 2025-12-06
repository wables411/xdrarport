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
    const fromEmail = env.FROM_EMAIL || `noreply@${new URL(request.url).hostname}`
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Send email to you
    await sendEmail({
      apiKey: resendApiKey,
      to: yourEmail,
      from: fromEmail,
      subject: `Contact from Portfolio: ${name}`,
      text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${comment}`,
      replyTo: email,
    })
    
    // Send confirmation to client
    await sendEmail({
      apiKey: resendApiKey,
      to: email,
      from: fromEmail,
      subject: 'Thank you for contacting me',
      text: `Hi ${name},\n\nThank you for reaching out! I've received your message and will get back to you soon.\n\nYour message:\n${comment}\n\nBest regards,\nXDRAR`,
    })
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Thank you! Your message has been sent.'
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    console.error('Contact form error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to send email. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
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
    const error = await response.text()
    throw new Error(`Resend API error: ${error}`)
  }
  
  return response.json()
}
