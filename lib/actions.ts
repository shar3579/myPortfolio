// lib/actions.ts
'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { ContactFormSchema, NewsletterFormSchema } from '@/lib/schemas'

type ContactFormInputs = z.infer<typeof ContactFormSchema>
type NewsletterFormInputs = z.infer<typeof NewsletterFormSchema>

const resend = new Resend(process.env.RESEND_API_KEY)

// Function to handle sending contact form emails
export async function sendEmail(data: ContactFormInputs) {
  const result = ContactFormSchema.safeParse(data);

  if (!result.success) {
    return { error: 'Validation failed: Invalid contact form inputs' };
  }

  try {
    const { name, email, message } = result.data;

    // Email to you (the portfolio owner)
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['sharmila091104@gmail.com'], // Your email where you receive messages
      subject: `Contact Form Submission from ${name}`,
      replyTo: email, // Visitor's email for easy reply
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
    });

    if (emailError) {
      console.error('Failed to send email to you:', emailError);
      return { error: 'Failed to send email' };
    }

    // Auto-reply email to the visitor
    const { error: replyError } = await resend.emails.send({
      from: 'Sharmila <onboarding@resend.dev>',
      to: [email], // Visitor's email
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
    });

    if (replyError) {
      console.error('Failed to send auto-reply:', replyError);
      // Don't return error here - the main email was sent successfully
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { error: 'Failed to send email' };
  }
}

export async function subscribe(data: NewsletterFormInputs) {
  const result = NewsletterFormSchema.safeParse(data)

  if (!result.data || result.error) {
    return { error: 'Failed to subscribe' };
  }

  try {
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
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      return { error: 'Failed to send welcome email' };
    }

    return { success: true };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { error: 'Failed to subscribe' };
  }
}