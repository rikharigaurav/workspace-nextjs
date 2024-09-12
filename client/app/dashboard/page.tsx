'use client'

import { useOrganization } from '@clerk/nextjs'
import { EmptyOrg } from './_components/empty-org'
import HomeCard from '@/components/HomeCard'
import { api } from '@/convex/_generated/api'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useUser } from '@clerk/nextjs'
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import { Inbox, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { uploadToS3, getS3Url } from '@/lib/aws.action'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const DashboardPage = () => {
  const { organization } = useOrganization()
  const router = useRouter()
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
  })
  const [callDetail, setCallDetail] = useState<Call>()
  const client = useStreamVideoClient()
  const { user } = useUser()
  const { mutate: mutateDocs, pending: PendingDocs } = useApiMutation(api.document.Createdoc)
  const { mutate, pending } = useApiMutation(api.board.create)
  const [isDocumentationModalOpen, setIsDocumentationModalOpen] =
    useState(false)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  const createBoard = () => {
    if (!organization) return

    setLoading(true)
    mutate({
      orgId: organization.id,
      title: 'Untitled',
    })
      .then((id) => {
        toast.success('Board Created')
        router.push(`/board/${id}`)
      })
      .catch(() =>  
        toast.error('Failed to create Board')
      )
      .finally(() => setLoading(false))
  }

  const createMeeting = async () => {
    if (!client || !user) return console.log('No user or client')

    setLoading(true)
    try {
      if (!values.dateTime) {
        toast.error('Please select a date and time' )
        return
      }
      const id = crypto.randomUUID()
      const call = client.call('default', id)
      if (!call) throw new Error('Failed to create meeting')
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString()
      const description = values.description || 'Instant Meeting'
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      })
      setCallDetail(call)
      if (!values.description) {
        router.push(`/meeting/${call.id}`)
      }
      toast.success( 'Meeting Created')
    } catch (error) {
      console.error(error)
      toast.error('Failed to create Meeting')
    } finally {
      setLoading(false)
    }
  }

  const { mutate: executeMutation } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string
      file_name: string
    }) => {
      const response = await axios.post('/api/chat', {
        file_key,
        file_name,
      })
      return response.data
    },
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles: any) => {
      const file = acceptedFiles[0]
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File too large')
        return
      }

      try {
        console.log('pendidn docs', PendingDocs)
        setUploading(true)
        setLoading(true)
        const data = await uploadToS3(file)
        const url = await getS3Url(data.file_key)

        const payload = {
            orgId: organization?.id,
            Filename: file.name,
            documenturl: url,
            filekey: data.file_key
        }
        console.log("Payload to be sent:", payload)
        await mutateDocs(payload)

        if (!data?.file_key || !data?.file_name) {
          toast.error('Something went wrong')
          setUploading(false)
          setLoading(false)
          return
        }

        executeMutation(data, {
          onSuccess: () => {
            toast.success('File Uploaded!')
          },
          onError: (err: Error) => {
            toast.error('Error uploading file')
            console.error(err)
          },
        })
        // console.log("pendidn docs", PendingDocs)
        if(!PendingDocs){
            setUploading(false)
            setLoading(false)

        }
      } catch (error) {
        console.log(error)
        setUploading(false)
        setLoading(false)
      }
    },
  })

  return (
    <div className='relative flex-1 h-[calc(100%-80px)] p-6 bg-gray-50 overflow-y-auto'>
      {loading && (
        <div className='absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <Loader2 className='h-16 w-16 text-white animate-spin' />
        </div>
      )}
        <section className='flex flex-wrap justify-center items-center h-full w-full gap-10'>
          <HomeCard
            img='/icons/add-meeting.svg'
            title='New Meeting'
            description='Start an instant meeting'
            handleClick={createMeeting}
          />
          <HomeCard
            img='/icons/join-meeting.svg'
            title='Create Board'
            description='Canvas to organize'
            handleClick={createBoard}
          />
          <HomeCard
            img='/icons/schedule.svg'
            title='Documentation'
            description='Add Your Docs'
            handleClick={() => setIsDocumentationModalOpen(true)}
          />
        </section>
      <Dialog
        open={isDocumentationModalOpen}
        onOpenChange={setIsDocumentationModalOpen}
      >
        <DialogContent className='flex w-full max-w-[520px] flex-col gap-6 border-none bg-gray-400 px-6 py-9'>
          <div
            {...getRootProps({
              className:
                'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col',
            })}
          >
            <input {...getInputProps()} />
            {uploading || pending ? (
              <>
                <Loader2 className='h-10 w-10 text-blue-500 animate-spin' />
                <p className='mt-2 text-sm text-slate-400'>
                  Uploading Docs...
                </p>
              </>
            ) : (
              <>
                <Inbox className='w-10 h-10 text-blue-500' />
                <p className='mt-2 text-sm text-slate-400'>Drop PDF Here</p>
              </>
            )}
          </div>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DashboardPage
