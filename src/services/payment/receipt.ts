import { Plan } from '../../types/subscription';

export async function generateReceipt(transactionId: string, plan: Plan): Promise<void> {
  try {
    await fetch('/api/receipts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId, plan })
    });
  } catch (error) {
    console.error('Error generating receipt:', error);
    throw new Error('Failed to generate receipt');
  }
}

export async function sendReceiptEmail(email: string, transactionId: string): Promise<void> {
  try {
    await fetch('/api/send-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, transactionId })
    });
  } catch (error) {
    console.error('Error sending receipt email:', error);
    throw new Error('Failed to send receipt email');
  }
}