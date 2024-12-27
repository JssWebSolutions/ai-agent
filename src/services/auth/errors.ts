export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public field?: 'email' | 'password' | 'name'
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export function handleAuthError(error: unknown): AuthError {
  if (error instanceof AuthError) {
    return error;
  }

  const firebaseError = error as { code?: string; message?: string };
  const code = firebaseError.code || 'auth/unknown';
  let message = 'An unexpected error occurred';
  let field: 'email' | 'password' | undefined;

  switch (code) {
    case 'auth/invalid-email':
      message = 'Invalid email address';
      field = 'email';
      break;
    case 'auth/user-not-found':
      message = 'No account found with this email';
      field = 'email';
      break;
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      message = 'Invalid email or password';
      field = 'password';
      break;
    case 'auth/email-already-in-use':
      message = 'An account with this email already exists';
      field = 'email';
      break;
    case 'auth/weak-password':
      message = 'Password is too weak';
      field = 'password';
      break;
    case 'auth/network-request-failed':
      message = 'Network error. Please check your connection';
      break;
    case 'auth/too-many-requests':
      message = 'Too many attempts. Please try again later';
      break;
    default:
      message = firebaseError.message || message;
  }

  return new AuthError(message, code, field);
}