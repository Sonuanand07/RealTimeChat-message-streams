
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MessageInput } from '../../components/MessageInput';

describe('MessageInput Component', () => {
  const mockSendMessage = vi.fn();

  beforeEach(() => {
    mockSendMessage.mockClear();
  });

  it('renders correctly', () => {
    render(<MessageInput onSendMessage={mockSendMessage} />);
    
    // Check if input exists
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    
    // Check if send button exists
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('calls onSendMessage when form is submitted', () => {
    render(<MessageInput onSendMessage={mockSendMessage} />);
    
    // Type in the input
    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'Hello, World!' } });
    
    // Submit the form
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    // Check if onSendMessage was called with the correct message
    expect(mockSendMessage).toHaveBeenCalledWith('Hello, World!');
    
    // Check if input was cleared
    expect(input).toHaveValue('');
  });

  it('does not submit empty messages', () => {
    render(<MessageInput onSendMessage={mockSendMessage} />);
    
    // Submit the form without typing anything
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    // Check if onSendMessage was not called
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it('handles Enter key to submit', () => {
    render(<MessageInput onSendMessage={mockSendMessage} />);
    
    // Type in the input
    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'Hello, World!' } });
    
    // Press Enter key
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    // Check if onSendMessage was called
    expect(mockSendMessage).toHaveBeenCalledWith('Hello, World!');
  });

  it('disables input and button when disabled prop is true', () => {
    render(<MessageInput onSendMessage={mockSendMessage} disabled={true} />);
    
    // Check if input is disabled
    const input = screen.getByPlaceholderText('Type a message...');
    expect(input).toBeDisabled();
    
    // Check if button is disabled
    const button = screen.getByRole('button', { name: /send message/i });
    expect(button).toBeDisabled();
  });
});
