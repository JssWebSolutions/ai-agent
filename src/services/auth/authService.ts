import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import { createUserDocument, getUserDocument } from './userService';
import { User } from '../../types/auth';
import { createAgent } from '../firestore/agents';
import { defaultAgent } from '../../components/Agent/DefaultAgent';
import { PLANS, PlanTier } from '../subscription/plans';
import { validateEmail, validatePassword, validateName } from './validation';
import { AuthError, handleAuthError } from './errors';
import { sendVerificationEmail } from './emailVerification';
import { sendPasswordReset } from './passwordReset';

export async function signUpWithEmail(email: string, password: string, name: string): Promise<User> {
  // Validate inputs
  const emailValidation = validateEmail(email);
  if (!emailValidation.success) {
    throw new AuthError(emailValidation.error!, 'validation/invalid-email', 'email');
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.success) {
    throw new AuthError(passwordValidation.error!, 'validation/invalid-password', 'password');
  }

  const nameValidation = validateName(name);
  if (!nameValidation.success) {
    throw new AuthError(nameValidation.error!, 'validation/invalid-name', 'name');
  }

  try {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(firebaseUser, { displayName: name });
    
    const userData: Omit<User, 'id'> = {
      email: email.toLowerCase().trim(),
      name,
      role: 'user',
      createdAt: new Date(),
      agentCount: 0,
      lastLogin: new Date(),
      emailVerified: false,
      updatedAt: new Date(),
      subscription: {
        planId: PLANS.free.id as PlanTier,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };

    await createUserDocument(firebaseUser.uid, userData);
    
    // Create default agent
    const agentData = {
      ...defaultAgent,
      userId: firebaseUser.uid,
      name: "My First Assistant"
    };
    await createAgent(agentData);
    
    await sendVerificationEmail(firebaseUser);

    return { ...userData, id: firebaseUser.uid };
  } catch (error) {
    throw handleAuthError(error);
  }
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.success) {
    throw new AuthError(emailValidation.error!, 'validation/invalid-email', 'email');
  }

  try {
    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
    const userData = await getUserDocument(firebaseUser.uid);
    
    if (!userData) {
      // Create user document if it doesn't exist (for migrated users)
      const newUserData: Omit<User, 'id'> = {
        email: firebaseUser.email!,
        name: firebaseUser.displayName || 'User',
        role: 'user',
        createdAt: new Date(),
        agentCount: 0,
        lastLogin: new Date(),
        emailVerified: firebaseUser.emailVerified,
        updatedAt: new Date()
      };
      await createUserDocument(firebaseUser.uid, newUserData);
      return { ...newUserData, id: firebaseUser.uid };
    }

    // Update last login
    const updatedUserData = {
      ...userData,
      emailVerified: firebaseUser.emailVerified,
      lastLogin: new Date()
    };

    return updatedUserData;
  } catch (error) {
    throw handleAuthError(error);
  }
}

export { sendPasswordReset, sendVerificationEmail };