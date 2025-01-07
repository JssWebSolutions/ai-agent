import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { encrypt, decrypt } from '../encryption';

const SETTINGS_DOC = 'payment-gateways';

interface StripeSettings {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  enabled: boolean;
}

interface PayPalSettings {
  clientId: string;
  clientSecret: string;
  mode: 'sandbox' | 'live';
  enabled: boolean;
}

interface RazorpaySettings {
  keyId: string;
  keySecret: string;
  webhookSecret: string;
  enabled: boolean;
}

export async function getStripeSettings(): Promise<StripeSettings | null> {
  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists() || !docSnap.data().stripe) return null;
    
    const data = docSnap.data().stripe;
    return {
      publishableKey: await decrypt(data.publishableKey),
      secretKey: await decrypt(data.secretKey),
      webhookSecret: await decrypt(data.webhookSecret),
      enabled: data.enabled
    };
  } catch (error) {
    console.error('Error getting Stripe settings:', error);
    throw new Error('Failed to retrieve Stripe settings');
  }
}

export async function updateStripeSettings(settings: StripeSettings): Promise<void> {
  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC);
    const docSnap = await getDoc(docRef);
    
    const encryptedSettings = {
      stripe: {
        publishableKey: await encrypt(settings.publishableKey),
        secretKey: await encrypt(settings.secretKey),
        webhookSecret: await encrypt(settings.webhookSecret),
        enabled: settings.enabled,
        updatedAt: new Date()
      }
    };

    if (docSnap.exists()) {
      await updateDoc(docRef, encryptedSettings);
    } else {
      await setDoc(docRef, encryptedSettings);
    }
  } catch (error) {
    console.error('Error updating Stripe settings:', error);
    throw new Error('Failed to update Stripe settings');
  }
}

export async function getPayPalSettings(): Promise<PayPalSettings | null> {
  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists() || !docSnap.data().paypal) return null;
    
    const data = docSnap.data().paypal;
    return {
      clientId: await decrypt(data.clientId),
      clientSecret: await decrypt(data.clientSecret),
      mode: data.mode,
      enabled: data.enabled
    };
  } catch (error) {
    console.error('Error getting PayPal settings:', error);
    throw new Error('Failed to retrieve PayPal settings');
  }
}

export async function updatePayPalSettings(settings: PayPalSettings): Promise<void> {
  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC);
    const docSnap = await getDoc(docRef);
    
    const encryptedSettings = {
      paypal: {
        clientId: await encrypt(settings.clientId),
        clientSecret: await encrypt(settings.clientSecret),
        mode: settings.mode,
        enabled: settings.enabled,
        updatedAt: new Date()
      }
    };

    if (docSnap.exists()) {
      await updateDoc(docRef, encryptedSettings);
    } else {
      await setDoc(docRef, encryptedSettings);
    }
  } catch (error) {
    console.error('Error updating PayPal settings:', error);
    throw new Error('Failed to update PayPal settings');
  }
}

export async function getRazorpaySettings(): Promise<RazorpaySettings | null> {
  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists() || !docSnap.data().razorpay) return null;
    
    const data = docSnap.data().razorpay;
    return {
      keyId: await decrypt(data.keyId),
      keySecret: await decrypt(data.keySecret),
      webhookSecret: await decrypt(data.webhookSecret),
      enabled: data.enabled
    };
  } catch (error) {
    console.error('Error getting Razorpay settings:', error);
    throw new Error('Failed to retrieve Razorpay settings');
  }
}

export async function updateRazorpaySettings(settings: RazorpaySettings): Promise<void> {
  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC);
    const docSnap = await getDoc(docRef);
    
    const encryptedSettings = {
      razorpay: {
        keyId: await encrypt(settings.keyId),
        keySecret: await encrypt(settings.keySecret),
        webhookSecret: await encrypt(settings.webhookSecret),
        enabled: settings.enabled,
        updatedAt: new Date()
      }
    };

    if (docSnap.exists()) {
      await updateDoc(docRef, encryptedSettings);
    } else {
      await setDoc(docRef, encryptedSettings);
    }
  } catch (error) {
    console.error('Error updating Razorpay settings:', error);
    throw new Error('Failed to update Razorpay settings');
  }
}