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
      return res.status(400).json({ error: 'Invalid form data' })
    }

    const { name, email, message } = result.data

    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['sharmila091104@gmail.com'],
      subject: `Contact Form Submission from ${name}`,
      replyTo: email,
      html: `<h2>New Contact Form Submission</h2>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`
    })

    if (error) {
      return res.status(500).json({ error: 'Failed to send email' })
    }

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}