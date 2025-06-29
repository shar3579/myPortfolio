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
      return res.status(400).json({ error: 'Invalid email' })
    }

    const { email } = result.data

    const { error } = await resend.emails.send({
      from: 'Sharmila <onboarding@resend.dev>',
      to: [email],
      subject: 'Welcome to My Portfolio!',
      html: `<h2>Welcome!</h2><p>Thanks for subscribing to my portfolio newsletter!</p>`
    })

    if (error) {
      return res.status(500).json({ error: 'Failed to send welcome email' })
    }

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}