import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export type QuizQuestion = {
  question: string
  choices: string[]
  answer: string
  topic: string
}

type QuizDialogProps = {
  QuizArray: QuizQuestion[]
  open: boolean
  setOpen: (open: boolean) => void
}

export const QuizDialog: React.FC<QuizDialogProps> = ({
  QuizArray,
  open,
  setOpen,
}) => {
  // console.log('the quiz array ', QuizArray)

  // console.log(
  //   'the Quiz content is ',
  //   QuizArray.map((question, index) => {
  //     console.log(
  //       `Question no. ${index}`,
  //       question.question,
  //       '\n',
  //       question.answer,
  //       '\n',
  //       question.choices,
  //       '\n',
  //       question.topic
  //     )
  //   })
  // )

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='custom-dialog-content my-4 p-4 min-w-[80%] h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Quiz Time!</DialogTitle>
            <DialogDescription>
              Answer the following questions:
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            {QuizArray.map((question, index) => (
              <div key={index} className='p-4 border rounded-md shadow-sm'>
                <p className='font-semibold'>{question.question}</p>
                <div className='mt-2 space-y-2'>
                  {question.choices.map((choice, idx) => (
                    <div key={idx} className='flex items-center'>
                      <input
                        type='radio'
                        name={`question-${index}`}
                        id={`choice-${index}-${idx}`}
                      />
                      <label
                        htmlFor={`choice-${index}-${idx}`}
                        className='ml-2'
                      >
                        {choice}
                      </label>
                    </div>
                  ))}
                </div>
                <div className='mt-2 text-sm text-gray-500'>
                  <p>
                    <strong>Hint:</strong> {question.topic}
                  </p>
                </div>
                <div
                  className='mt-2 text-sm text-gray-500 hidden'
                  id={`answer-${index}`}
                >
                  <p>
                    <strong>Answer:</strong> {question.answer}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    document
                      .getElementById(`answer-${index}`)
                      ?.classList.toggle('hidden')
                  }
                  className='mt-2'
                >
                  Show Answer
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
