import { z } from 'zod';

const emailSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1)
});

export async function sendEmail(data) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Validate data using Zod schema
  const validated = emailSchema.parse(data);
  
  // Send the validated data to the server
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validated),
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }

  return response.json();
}
