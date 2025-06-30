'use client'

import { useEffect } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { submitNewsletterForm } from '@/app/actions/newsletter'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const initialState = { success: false, error: '' }

export default function NewsletterForm() {
const [state, formAction] = useActionState(submitNewsletterForm, initialState)

  useEffect(() => {
    if (state.success) {
      toast.success('Subscribed successfully!')
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <section>
      <Card className='rounded-lg border-0 dark:border'>
        <CardContent className='flex flex-col gap-8 pt-6 md:flex-row md:justify-between md:pt-8'>
          <div>
            <h2 className='text-2xl font-bold'>Subscribe to my newsletter</h2>
            <p className='text-muted-foreground'>
              Get updates on my work and projects.
            </p>
          </div>

          <form action={formAction} className='flex flex-col items-start gap-3'>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full"
            />
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full disabled:opacity-50">
      {pending ? 'Submitting...' : 'Subscribe'}
    </Button>
  )
}
