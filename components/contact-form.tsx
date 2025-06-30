'use client'

import { useEffect } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { submitContactForm } from '@/app/actions/contact'

const initialState = { success: false, error: '' }

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState)

  useEffect(() => {
    if (state.success) toast.success('Message sent successfully!')
    if (state.error) toast.error(state.error)
  }, [state])

  return (
    <section className='relative isolate'>
      {/* Background pattern */}
      <svg
        className='absolute inset-0 -z-10 h-full w-full stroke-zinc-200 opacity-75 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)] dark:stroke-zinc-700'
        aria-hidden='true'
      >
        <defs>
          <pattern
            id='83fd4e5a-9d52-42fc-97b6-718e5d7ee527'
            width={200}
            height={200}
            x='50%'
            y={-64}
            patternUnits='userSpaceOnUse'
          >
            <path d='M100 200V.5M.5 .5H200' fill='none' />
          </pattern>
        </defs>
        <svg
          x='50%'
          y={-64}
          className='overflow-visible fill-zinc-50 dark:fill-zinc-950/55'
        >
          <path
            d='M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M299.5 800h201v201h-201Z'
            strokeWidth={0}
          />
        </svg>
        <rect
          width='100%'
          height='100%'
          strokeWidth={0}
          fill='url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)'
        />
      </svg>

      {/* Form */}
      <div className='relative'>
        <form
          action={formAction}
          className='mt-16 lg:flex-auto'
          noValidate
        >
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            {/* Name */}
            <div>
              <Input
                id='name'
                name='name'
                type='text'
                placeholder='Name'
                autoComplete='given-name'
                required
              />
            </div>

            {/* Email */}
            <div>
              <Input
                type='email'
                id='email'
                name='email'
                autoComplete='email'
                placeholder='Email'
                required
              />
            </div>

            {/* Message */}
            <div className='sm:col-span-2'>
              <Textarea
                name='message'
                rows={4}
                placeholder='Message'
                required
              />
            </div>
          </div>
          <div className='mt-6'>
            <SubmitButton />
          </div>
        </form>
      </div>
    </section>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type='submit'
      disabled={pending}
      className='w-full disabled:opacity-50'
    >
      {pending ? 'Submitting...' : 'Submit'}
    </Button>
  )
}
