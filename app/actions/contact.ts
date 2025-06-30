// app/actions/contact.ts
'use server'

import { ContactFormSchema } from '@/lib/schemas'
import { sendEmail } from '@/lib/actions'

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    console.log('Contact form submission started')
    
    const raw = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    }

    console.log('Form data received:', { 
      name: raw.name, 
      email: raw.email, 
      messageLength: raw.message?.toString().length 
    })

    const parsed = ContactFormSchema.safeParse(raw)
    if (!parsed.success) {
      console.error('Form validation failed:', parsed.error.errors)
      return { 
        success: false, 
        error: 'Please fill all fields correctly.' 
      }
    }

    console.log('Form validation passed, calling sendEmail...')
    const result = await sendEmail(parsed.data)

    if (result?.error) {
      console.error('sendEmail returned error:', result.error)
      return { 
        success: false, 
        error: result.error 
      }
    }

    console.log('Contact form submission successful')
    return { 
      success: true, 
      error: '' 
    }

  } catch (error) {
    console.error('Contact form submission failed:', error)
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    }
  }
}