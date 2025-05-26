'use client';

import { useState, FormEvent } from 'react'

interface MessageFormProps {
  onSubmit: (data: { name: string; content: string }) => void;
  disabled?: boolean;
}

export default function MessageForm({ onSubmit, disabled = false }: MessageFormProps) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState<{ name?: string; content?: string }>({})

  const validateForm = () => {
    const newErrors: { name?: string; content?: string } = {}
    
    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!content.trim()) {
      newErrors.content = 'Message is required'
    } else if (content.length > 280) {
      newErrors.content = 'Message must be 280 characters or less'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    onSubmit({ name, content })
    setName('')
    setContent('')
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          disabled={disabled}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600" id="name-error">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          aria-invalid={!!errors.content}
          aria-describedby={errors.content ? 'message-error' : undefined}
          disabled={disabled}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600" id="message-error">
            {errors.content}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      >
        {disabled ? 'Posting...' : 'Post Message'}
      </button>
    </form>
  )
} 