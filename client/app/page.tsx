"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Component() {
  const router = useRouter()
  const onclick = () => {
    router.push('/sign-in/[[...sign-in]]')
  }
  return (
    <div className='flex flex-col min-h-[100dvh]'>
      <header className='fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-14 flex items-center bg-black text-white'>
        <Link
          href='#'
          className='flex items-center justify-center text-2xl font-bold'
          prefetch={false}
        >
          AI Space
        </Link>
        <div className='ml-auto flex items-center gap-4 sm:gap-6 md:gap-8'>
          <Button
          onClick={onclick}
            className='inline-flex h-8 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-black shadow transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
          >
            Sign In
          </Button>
          <Link
            href='#'
            className='inline-flex h-8 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white shadow transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
            prefetch={false}
          >
            Contact
          </Link>
        </div>
      </header>
      <main className='flex-1 pt-14'>
        <section className='w-full h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center'>
          <div className='space-y-4 px-4 sm:px-6 md:px-8 lg:px-0 max-w-3xl mx-auto text-center'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                A Personalized, AI-Integrated Platform for Teamwork
              </h2>
              <p className='text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                AI Space brings everything you need for seamless collaboration
                into one place, similar to Microsoft Teams but enhanced with AI
                features for smarter scheduling, data access, and task
                management.
              </p>
            </div>
            <div className='flex flex-col gap-2 min-[400px]:flex-row justify-center'>
              <Link
                href='#'
                className='inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
                prefetch={false}
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>
        <section className='w-full py-12 md:py-24 lg:py-32 bg-muted justify-center flex'>
          <div className='container grid items-center justify-between gap-8 px-4 sm:px-6 md:px-8 lg:grid-cols-2 lg:gap-12 '>
            <Image
              src={'/unified.webp'}
              alt={'Unified Dashboard'}
              width={'500'}
              height={'500'}
              layout='responsive' // This ensures the image adapts to its container's size
              objectFit='cover' // Keeps the aspect ratio and covers the container
              className='rounded-lg'
            />
            <div className='space-y-4 px-4  sm:px-6 md:px-8 lg:px-0'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                  Why hop from platform to platform?
                </h2>
                <p className='text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Unified Platform: Combines chat, meetings, cloud storage,
                  calendar, and canvas into one integrated system for
                  streamlined classroom management.
                </p>
              </div>
              <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                <Link
                  href='#'
                  className='inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
                  prefetch={false}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className='w-full py-12 md:py-24 lg:py-32 flex justify-center'>
          <div className='container grid items-center justify-between gap-6 px-4 sm:px-6 md:px-8 lg:grid-cols-2 lg:gap-12'>
            <div className='space-y-4 order-last lg:order-first px-4 sm:px-6 md:px-8 lg:px-0'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                  Need quick access to everything?
                </h2>
                <p className='text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Vector Store Integration: Securely stores and organizes all
                  classroom resources, including canvas boards, meeting notes,
                  and documents, allowing easy and intelligent retrieval.
                </p>
              </div>
              <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                <Link
                  href='#'
                  className='inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
                  prefetch={false}
                >
                  Get Started
                </Link>
              </div>
            </div>
            <Image
              src={'/vectorsctore.webp'}
              alt={'Unified Dashboard'}
              width={'500'}
              height={'500'}
              layout='responsive' // This ensures the image adapts to its container's size
              objectFit='cover' // Keeps the aspect ratio and covers the container
              className='rounded-lg'
            />
          </div>
        </section>
        <section className='w-full py-12 md:py-24 lg:py-32 bg-muted flex justify-center'>
          <div className='container grid items-center justify-between gap-6 px-4 sm:px-6 md:px-8 lg:grid-cols-2 lg:gap-12'>
            <Image
              src={'/imagerecog.webp'}
              alt={'Image recognition'}
              width={'500'}
              height={'500'}
              layout='responsive' // This ensures the image adapts to its container's size
              objectFit='cover' // Keeps the aspect ratio and covers the container
              className='rounded-lg'
            />
            <div className='space-y-4 px-4 sm:px-6 md:px-8 lg:px-0'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                  Need stronger security and attendance management?
                </h2>
                <p className='text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Enhanced Security and Privacy: Implements face recognition for
                  secure login and meeting attendance (optional).
                </p>
              </div>
              <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                <Link
                  href='#'
                  className='inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
                  prefetch={false}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className='w-full py-12 md:py-24 lg:py-32 flex justify-center'>
          <div className='container grid items-center justify-between gap-6 px-4 sm:px-6 md:px-8 lg:grid-cols-2 lg:gap-12'>
            <div className='space-y-4 order-last lg:order-first px-4 sm:px-6 md:px-8 lg:px-0'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                  Chatbot for Intelligent Access
                </h2>
                <p className='text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Provides personalized access to stored resources through
                  interaction with the vector store, making information
                  retrieval quick and efficient.
                </p>
              </div>
              <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                <Link
                  href='#'
                  className='inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
                  prefetch={false}
                >
                  Get Started
                </Link>
              </div>
            </div>
            <Image
              src={'/chatbot.jpg'}
              alt={'Chat Bot'}
              width={'500'}
              height={'500'}
              layout='responsive' // This ensures the image adapts to its container's size
              objectFit='cover' // Keeps the aspect ratio and covers the container
              className='rounded-lg'
            />
          </div>
        </section>
        <section className='w-full py-12 md:py-24 lg:py-32 bg-muted flex justify-center'>
          <div className='container grid items-center justify-between gap-6 px-4 sm:px-6 md:px-8 lg:grid-cols-2 lg:gap-12'>
            <Image
              src={'/calendarscheduling.webp'}
              alt={'Unified Dashboard'}
              width={'500'}
              height={'500'}
              layout='responsive' // This ensures the image adapts to its container's size
              objectFit='cover' // Keeps the aspect ratio and covers the container
              className='rounded-lg'
            />
            <div className='space-y-4 px-4 sm:px-6 md:px-8 lg:px-0'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                  Tired of manual scheduling?
                </h2>
                <p className='text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  AI-Driven Automated Scheduling: Automatically schedules
                  meetings, quizzes, and assignments based on real-time data
                  from the course.
                </p>
              </div>
              <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                <Link
                  href='#'
                  className='inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
                  prefetch={false}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className='w-full py-12 md:py-24 lg:py-32 flex justify-center'>
          <div className='container grid items-center justify-between gap-6 px-4 sm:px-6 md:px-8 lg:grid-cols-2 lg:gap-12'>
            <div className='space-y-4 order-last lg:order-first px-4 sm:px-6 md:px-8 lg:px-0'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                  Want to track progress easily?
                </h2>
                <p className='text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Knowledge Graph Creation: Uses AI to analyze stored data,
                  generating a knowledge graph to track student progress and
                  highlight areas for improvement.
                </p>
              </div>
              <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                <Link
                  href='#'
                  className='inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
                  prefetch={false}
                >
                  Get Started
                </Link>
              </div>
            </div>
            <Image
              src={'/knowledgegraph.jpg'}
              alt={'Unified Dashboard'}
              width={'500'}
              height={'500'}
              layout='responsive' // This ensures the image adapts to its container's size
              objectFit='cover' // Keeps the aspect ratio and covers the container
              className='rounded-lg'
            />
          </div>
        </section>
        <section className='w-full py-12 md:py-24 lg:py-32 bg-muted flex justify-center'>
          <div className='container grid items-center justify-between gap-6 px-4 sm:px-6 md:px-8 lg:grid-cols-2 lg:gap-12'>
            <Image
              src={'/dataversion.webp'}
              alt={'Unified Dashboard'}
              width={'500'}
              height={'500'}
              layout='responsive' // This ensures the image adapts to its container's size
              objectFit='cover' // Keeps the aspect ratio and covers the container
              className='rounded-lg'
            />
            <div className='space-y-4 px-4 sm:px-6 md:px-8 lg:px-0'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                  Data Versioning for canvas boards
                </h2>
                <p className='text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Enables users to revert to previous states of the canvas
                  board, ensuring that no changes or data are lost.
                </p>
              </div>
              <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                <Link
                  href='#'
                  className='inline-flex h-8 items-center justify-center rounded-md bg'
                  prefetch={false}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
