import Image from 'next/image'
import authorImage from '@/public/images/authors/authorsImage.png'

export default function Intro() {
  return (
    <section className='flex flex-col-reverse items-start gap-x-10 gap-y-4 pb-24 md:flex-row md:items-center'>
      <div className='mt-2 flex-1 md:mt-0'>
        <h1 className='title no-underline'>Hey, I&#39;m Sharmila.</h1>
        <p className='mt-3 font-light text-muted-foreground'>
          I&#39;m a computer science undergraduate from Tamil Nadu, India. I&#39;m passionate about exploring emerging technologies, solving real-world problems, and sharing my knowledge to help others grow.
        </p>
      </div>
      <div className='relative'>
        <Image
        className='flex-1 rounded-[40px]'
          src={authorImage}
          alt='Sharmila'
          width={175}
          height={175}
          priority
        />
      </div>
    </section>
  )
}