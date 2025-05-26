import { render, screen, waitFor } from '../utils/test-utils'
import userEvent from '@testing-library/user-event'
import MessageForm from '@/components/MessageForm'

describe('MessageForm', () => {
  it('renders the form with all required elements', () => {
    render(<MessageForm />)
    
    // Check for form elements
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<MessageForm />)
    
    // Try to submit empty form
    await user.click(screen.getByRole('button', { name: /send/i }))
    
    // Check for validation messages
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/message is required/i)).toBeInTheDocument()
  })

  it('validates message length', async () => {
    const user = userEvent.setup()
    render(<MessageForm />)
    
    // Enter a message longer than 280 characters
    const messageInput = screen.getByLabelText(/message/i)
    const longMessage = 'a'.repeat(281)
    await user.type(messageInput, longMessage)
    
    // Try to submit
    await user.click(screen.getByRole('button', { name: /send/i }))
    
    // Check for validation message
    expect(await screen.findByText(/message must be 280 characters or less/i)).toBeInTheDocument()
  })

  it('submits the form with valid data', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = jest.fn()
    render(<MessageForm onSubmit={mockOnSubmit} />)
    
    // Fill in the form
    await user.type(screen.getByLabelText(/name/i), 'Test User')
    await user.type(screen.getByLabelText(/message/i), 'Hello, World!')
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /send/i }))
    
    // Verify the form was submitted with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test User',
        content: 'Hello, World!'
      })
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)))
    render(<MessageForm onSubmit={mockOnSubmit} />)
    
    // Fill in the form
    await user.type(screen.getByLabelText(/name/i), 'Test User')
    await user.type(screen.getByLabelText(/message/i), 'Hello, World!')
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /send/i }))
    
    // Check for loading state
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
    expect(screen.getByText(/sending/i)).toBeInTheDocument()
    
    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /send/i })).not.toBeDisabled()
    })
  })

  it('clears the form after successful submission', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = jest.fn()
    render(<MessageForm onSubmit={mockOnSubmit} />)
    
    // Fill in the form
    const nameInput = screen.getByLabelText(/name/i)
    const messageInput = screen.getByLabelText(/message/i)
    await user.type(nameInput, 'Test User')
    await user.type(messageInput, 'Hello, World!')
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /send/i }))
    
    // Wait for submission and check form is cleared
    await waitFor(() => {
      expect(nameInput).toHaveValue('')
      expect(messageInput).toHaveValue('')
    })
  })
}) 