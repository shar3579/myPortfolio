import type { NextApiRequest, NextApiResponse } from 'next'
import { NewsletterFormSchema } from '@/lib/schemas'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const result = NewsletterFormSchema.safeParse(req.body)
    
    if (!result.success) {
      return res.status(400).json({ 
        error: 'Invalid email address',
        details: result.error.errors 
      })
    }

    const { email } = result.data

    // Send welcome email to subscriber
    const { error } = await resend.emails.send({
      from: 'Sharmila <onboarding@resend.dev>',
      to: [email],
      subject: 'Welcome to My Portfolio!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Welcome to My Portfolio!
          </h2>
          
          <p>Hi there,</p>
          
          <p>Thank you for subscribing to my Portfolio! I'm excited to keep you updated with my latest projects, blog posts, and insights.</p>
          
          <p>You can expect to hear from me with:</p>
          <ul style="color: #555;">
            <li>New project updates and case studies</li>
            <li>Technical articles and tutorials</li>
            <li>Industry insights and trends</li>
            <li>Behind-the-scenes content</li>
          </ul>
          
          <p>Best regards,<br><strong>Sharmila</strong></p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you didn't sign up for this newsletter, you can safely ignore this email.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Failed to send welcome email:', error)
      return res.status(500).json({ error: 'Failed to send welcome email' })
    }

    res.status(200).json({ 
      success: true, 
      message: 'Successfully subscribed! Check your email for a welcome message.' 
    })

  } catch (error) {
    console.error('Newsletter API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}