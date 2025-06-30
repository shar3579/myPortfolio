'use server'

import { ContactFormSchema } from '@/lib/schemas'
import { sendEmail } from '@/lib/actions'

export async function submitContactForm(prevState: any, formData: FormData) {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  }

  const parsed = ContactFormSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: 'Please fill all fields correctly.' }
  }

  const result = await sendEmail(parsed.data)

  if (result?.error) {
    return { success: false, error: result.error }
  }

  return { success: true, error: '' }
}
