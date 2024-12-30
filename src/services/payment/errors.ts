export class PaymentError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

export function handlePaymentError(error: unknown): PaymentError {
  if (error instanceof PaymentError) {
    return error;
  }

  if (error instanceof Error) {
    return new PaymentError(
      error.message,
      'payment_error'
    );
  }

  return new PaymentError(
    'An unexpected error occurred',
    'unknown_error'
  );
}