// actions.ts
'use server'

import { z } from 'zod'
import nodemailer from 'nodemailer'
import { ContactFormSchema, NewsletterFormSchema } from '@/lib/schemas'

type ContactFormInputs = z.infer<typeof ContactFormSchema>
type NewsletterFormInputs = z.infer<typeof NewsletterFormSchema>
// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_APP_PASSWORD // Gmail App Password
  }
})

// Helper function to generate email HTML
function generateEmailHtml(data: ContactFormInputs) {
  return `
    <div>
      <h1>Contact form submission</h1>
      <p>From <strong>${data.name}</strong> at ${data.email}</p>
      <h2>Message:</h2>
      <p>${data.message}</p>
    </div>
  `
}

// Function to handle sending emails
export async function sendEmail(data: ContactFormInputs) {
  const result = ContactFormSchema.safeParse(data);

  if (!result.success) {
    throw new Error('Validation failed: Invalid contact form inputs');
  }

  try {
    const { name, email, message } = result.data;

    // Email to you
    const emailHtml = generateEmailHtml({ name, email, message });
    const mailOptionsToYou = {
      to: 'sharmila091104@gmail.com',
      from: email,
      replyTo: email,
      subject: `Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: emailHtml,
    };
    await transporter.sendMail(mailOptionsToYou);

    // Email to the sender
    const emailHtmlForSender = `
      <div>
        <h1>Thank you for reaching out!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for contacting me. I’ve received your message and will get back to you shortly.</p>
        <p>Your message:</p>
        <blockquote>${message}</blockquote>
        <p>Best regards,<br>Sharmila</p>
      </div>
    `;
    const mailOptionsToSender = {
      to: email, // Sender's email
      from: 'sharmila091104@gmail.com', // Your Gmail address
      subject: 'Thank you for contacting me!',
      text: `Hi ${name},\n\nThank you for contacting me. I’ve received your message and will get back to you shortly.\n\nYour message:\n${message}\n\nBest regards,\nSharmila`,
      html: emailHtmlForSender,
    };
    await transporter.sendMail(mailOptionsToSender);

    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { error };
  }
}

export async function subscribe(data: NewsletterFormInputs) {
  const result = NewsletterFormSchema.safeParse(data)

  if (!result.data || result.error) {
    throw new Error('Failed to subscribe')
  }

  try {
    const { email } = result.data

    // Generate the welcome email content
    const welcomeHtml = `
      <div>
        <h1>Welcome to Our Newsletter!</h1>
        <p>Hi there,</p>
        <p>Thank you for subscribing to our newsletter. We're excited to keep you updated with the latest news and updates!</p>
        <p>Best regards,<br>Sharmila</p>
      </div>
    `;

    const mailOptions = {
      to: email, // Send the welcome email to the subscriber
      from: process.env.EMAIL_USER, // Your Gmail address
      subject: 'Welcome to Our Newsletter!',
      text: `Hi there,\n\nThank you for subscribing to my newsletter. I'm excited to keep you updated with the latest news and updates!\n\nBest regards,\nSharmila`,
      html: welcomeHtml,
    };

    // Send the welcome email using Nodemailer
    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    return { error }
  }
}