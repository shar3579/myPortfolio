'use client'

import { set, z } from 'zod'
import { toast } from 'sonner'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NewsletterFormSchema } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { subscribe } from '@/lib/actions'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'

type Inputs = z.infer<typeof NewsletterFormSchema>

export default function NewsletterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(NewsletterFormSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      })
      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.error || 'An error occurred! Please try again.')
        return
      }

      const result = await response.json()

      if (result?.error) {
        toast.error('An error occurred! Please try again.')
        return;
      }

      toast.success('Subscribed successfully!')
      reset()
    } catch (error) {
      toast.error('An error occurred! Please try again.')
    }
  }

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

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col items-start gap-3'
          >
            <div className='w-full'>
              <Input
                type='email'
                id='email'
                autoComplete='email'
                placeholder='Email'
                className='w-full'
                {...register('email')}
              />

              {errors.email?.message && (
                <p className='ml-1 mt-2 text-sm text-rose-400'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className='w-full'>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='w-full disabled:opacity-50'
              >
                {isSubmitting ? 'Submitting...' : 'Subscribe'}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </section>
  )
}