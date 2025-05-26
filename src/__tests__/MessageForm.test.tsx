import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MessageForm from '../components/MessageForm';

describe('MessageForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form with name and content inputs', () => {
    render(<MessageForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /post/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<MessageForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /post/i });
    await userEvent.click(submitButton);

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates message length', async () => {
    render(<MessageForm onSubmit={mockOnSubmit} />);
    
    const messageInput = screen.getByLabelText(/message/i);
    const longMessage = 'a'.repeat(281);
    
    await userEvent.type(messageInput, longMessage);
    await userEvent.click(screen.getByRole('button', { name: /post/i }));

    expect(screen.getByText(/message must be 280 characters or less/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<MessageForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const messageInput = screen.getByLabelText(/message/i);
    
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(messageInput, 'Hello, world!');
    await userEvent.click(screen.getByRole('button', { name: /post/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      content: 'Hello, world!'
    });
  });
}); 