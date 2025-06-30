// app/actions/newsletter.ts
'use server'

import { subscribe } from '@/lib/actions'
import { NewsletterFormSchema } from '@/lib/schemas'

export async function submitNewsletterForm(
  prevState: any,
  formData: FormData
) {
  try {
    console.log('Newsletter subscription started')
    
    const raw = { email: formData.get('email') }
    console.log('Newsletter email received:', raw.email)

    const parsed = NewsletterFormSchema.safeParse(raw)
    if (!parsed.success) {
      console.error('Newsletter validation failed:', parsed.error.errors)
      return { 
        success: false, 
        error: 'Please enter a valid email address.' 
      }
    }

    console.log('Newsletter validation passed, calling subscribe...')
    const result = await subscribe(parsed.data)

    if (result?.error) {
      console.error('subscribe returned error:', result.error)
      return { 
        success: false, 
        error: result.error 
      }
    }

    console.log('Newsletter subscription successful')
    return { 
      success: true, 
      error: '' 
    }

  } catch (error) {
    console.error('Newsletter subscription failed:', error)
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    }
  }
}