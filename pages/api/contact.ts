import type { NextApiRequest, NextApiResponse } from 'next'
import { ContactFormSchema } from '@/lib/schemas'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const result = ContactFormSchema.safeParse(req.body)
    
    if (!result.success) {
      return res.status(400).json({ 
        error: 'Invalid form data',
        details: result.error.errors 
      })
    }

    const { name, email, message } = result.data

    // Send email to you (the portfolio owner)
    const { error: emailError } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['sharmila091104@gmail.com'],
      subject: `Contact Form Submission from ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 3px; border-left: 4px solid #007bff;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This email was sent from your portfolio's contact form.
          </p>
        </div>
      `,
    })

    if (emailError) {
      console.error('Failed to send email:', emailError)
      return res.status(500).json({ error: 'Failed to send email' })
    }

    // Send auto-reply to the visitor
    const { error: replyError } = await resend.emails.send({
      from: 'Sharmila <onboarding@resend.dev>',
      to: [email],
      subject: 'Thank you for reaching out!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Thank you for reaching out!
          </h2>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for contacting me through my portfolio. I've received your message and will get back to you shortly.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Your message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 3px; border-left: 4px solid #28a745;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <p>Best regards,<br><strong>Sharmila</strong></p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This is an automated response. Please don't reply to this email.
          </p>
        </div>
      `,
    })

    if (replyError) {
      console.error('Failed to send auto-reply:', replyError)
      // Don't fail the request if auto-reply fails
    }

    res.status(200).json({ success: true, message: 'Email sent successfully!' })

  } catch (error) {
    console.error('Contact API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
