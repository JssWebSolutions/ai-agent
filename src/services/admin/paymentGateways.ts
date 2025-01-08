import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { encrypt, decrypt } from '../encryption';

const SETTINGS_DOC = 'payment-settings';

interface PaymentGatewaySettings {
  stripe?: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
    enabled: boolean;
  };
  paypal?: {
    clientId: string;
    clientSecret: string;
    mode: 'sandbox' | 'live';
    enabled: boolean;
  };
  razorpay?: {
    keyId: string;
    keySecret: string;
    webhookSecret: string;
    enabled: boolean;
  };
  updatedAt: Date;
  updatedBy: string;
}

export async function getPaymentSettings(): Promise<PaymentGatewaySettings | null> {
  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    return {
      stripe: data.stripe ? {
        publishableKey: await decrypt(data.stripe.publishableKey),
        secretKey: await decrypt(data.stripe.secretKey),
        webhookSecret: await decrypt(data.stripe.webhookSecret),
        enabled: data.stripe.enabled
      } : undefined,
      paypal: data.paypal ? {
        clientId: await decrypt(data.paypal.clientId),
        clientSecret: await decrypt(data.paypal.clientSecret),
        mode: data.paypal.mode,
        enabled: data.paypal.enabled
      } : undefined,
      razorpay: data.razorpay ? {
        keyId: await decrypt(data.razorpay.keyId),
        keySecret: await decrypt(data.razorpay.keySecret),
        webhookSecret: await decrypt(data.razorpay.webhookSecret),
        enabled: data.razorpay.enabled
      } : undefined,
      updatedAt: data.updatedAt.toDate(),
      updatedBy: data.updatedBy
    };
  } catch (error) {
    console.error('Error getting payment settings:', error);
    throw new Error('Failed to retrieve payment settings');
  }
}

export async function updatePaymentSettings(
  settings: Partial<PaymentGatewaySettings>,
  adminId: string
): Promise<void> {
  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC);
    const docSnap = await getDoc(docRef);
    
    const encryptedSettings: any = {
      updatedAt: new Date(),
      updatedBy: adminId
    };

    if (settings.stripe) {
      encryptedSettings.stripe = {
        publishableKey: await encrypt(settings.stripe.publishableKey),
        secretKey: await encrypt(settings.stripe.secretKey),
        webhookSecret: await encrypt(settings.stripe.webhookSecret),
        enabled: settings.stripe.enabled
      };
    }

    if (settings.paypal) {
      encryptedSettings.paypal = {
        clientId: await encrypt(settings.paypal.clientId),
        clientSecret: await encrypt(settings.paypal.clientSecret),
        mode: settings.paypal.mode,
        enabled: settings.paypal.enabled
      };
    }

    if (settings.razorpay) {
      encryptedSettings.razorpay = {
        keyId: await encrypt(settings.razorpay.keyId),
        keySecret: await encrypt(settings.razorpay.keySecret),
        webhookSecret: await encrypt(settings.razorpay.webhookSecret),
        enabled: settings.razorpay.enabled
      };
    }

    if (docSnap.exists()) {
      await updateDoc(docRef, encryptedSettings);
    } else {
      await setDoc(docRef, encryptedSettings);
    }
  } catch (error) {
    console.error('Error updating payment settings:', error);
    throw new Error('Failed to update payment settings');
  }
}