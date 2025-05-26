'use client';

import { useState } from 'react';
import MessageForm from './MessageForm';
import { supabase } from '@/lib/supabase';

export default function MessageFormWrapper() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: { name: string; content: string }) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const { error: insertError } = await supabase
        .from('messages')
        .insert([data]);

      if (insertError) {
        throw insertError;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <MessageForm onSubmit={handleSubmit} disabled={isSubmitting} />
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
} 