'use client'
import React, { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { useOrganization } from '@clerk/nextjs'
import { toast } from 'sonner'
import { LoaderIcon, Trash } from 'lucide-react'
import { useQuery } from 'convex/react'

type Props = {}

const CalendarPage = (props: Props) => {
  const { organization } = useOrganization()
  const [date, setDate] = useState<Date>(new Date())
  const [time, setTime] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const { mutate: createMutate } = useApiMutation(api.calendar.create)
  const { mutate: deleteMutate } = useApiMutation(api.calendar.remove)
  const data = useQuery(api.calendar.get, {
    orgId: organization?.id.toString() || '',
    date: date?.toLocaleDateString('en-GB') || '',
  })

  const handleDateSelect = (day: Date | undefined) => {
    console.log(
      `data for current date ${date?.toLocaleDateString('en-GB')}`,
      data
    )
    if (day) {
      setDate(day)
    }
  }

  const handleDelete = (id: string) => {
    console.log('the _id', id)
    deleteMutate(id)
      .then(() => {
        toast.success('Event Deleted')
      })
      .catch(() => {
        toast.error('Event not deleted')
      })
  }

  const handleAddEvent = async () => {
    await createMutate({
      orgId: organization?.id,
      title,
      description,
      date: date.toLocaleDateString('en-GB'),
      time,
    })
      .then(() => {
        toast.success('Event Added')
      })
      .catch(() => {
        toast.error('Event not created')
      })
  }

  const formattedDate = date
    ? date.toLocaleDateString('en-GB')
    : 'No date selected'

  return (
    <div className='flex flex-row m-2 p-4 gap-x-10 justify-center'>
      {/* Event List */}
      <div className='shadow-md p-4 w-1/3'>
        <h1 className='text-2xl font-bold mb-4'>Events</h1>
        {data?.length !== 0 ? (
          data?.map((event: any) => (
            <div
              key={event._id}
              className='bg-white p-4 m-2 shadow-md rounded-md flex flex-row justify-between items-center hover:bg-gray-100 transition duration-200'
            >
              <div className='flex flex-col'>
                <h2 className='text-xl font-semibold text-gray-800'>
                  {event.title}
                </h2>
                <p className='text-sm text-gray-600'>{event.description}</p>
                <p className='text-sm text-gray-500'>
                  {event.date} at {event.time}
                </p>
              </div>
              <Trash
                onClick={() => handleDelete(event._id)}
                className='cursor-pointer text-red-500 hover:text-red-700 transition duration-200'
              />
            </div>
          ))
        ) : (
          <div className='bg-gray-200 p-4 m-2 shadow-sm rounded-md'>
            <h1 className='text-xl font-bold text-gray-800'>
              No Event Schedules
            </h1>
          </div>
        )}
      </div>

      {/* Calendar */}
      <div className='flex items-center justify-center w-1/3'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={handleDateSelect}
          disabled={(date) => date < new Date()}
          className='rounded-md border h-full '
        />
      </div>

      {/* Create Event Form */}
      <div className='flex flex-col gap-y-5 justify-center items-center w-1/3 border border-black rounded-md p-4'>
        <h1 className='text-xl font-bold mb-4'>Create a New Event</h1>
        <div className='mb-6 text-center'>
          <p className='text-gray-600'>
            Selected Date:{' '}
            <span className='text-blue-500 font-semibold'>{formattedDate}</span>
          </p>
          <p className='text-gray-600'>
            Please enter the title and description for the event.
          </p>
        </div>

        <Input
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          type='time'
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className='border rounded-md p-2'
        />

        <Button onClick={handleAddEvent}>Add Event</Button>
      </div>
    </div>
  )
}

export default CalendarPage
