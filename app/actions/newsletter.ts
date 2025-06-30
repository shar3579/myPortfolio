'use server'

import { subscribe } from '@/lib/actions'
import { NewsletterFormSchema } from '@/lib/schemas'

export async function submitNewsletterForm(
  prevState: any,
  formData: FormData
) {
  const raw = { email: formData.get('email') }

  const parsed = NewsletterFormSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  const result = await subscribe(parsed.data)

  if (result?.error) {
    return { success: false, error: result.error }
  }

  return { success: true, error: '' }
}
