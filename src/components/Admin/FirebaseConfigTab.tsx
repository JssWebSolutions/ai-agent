
import { Database} from 'lucide-react';
import { FirebaseAuthConfig } from './FirebaseConfig/FirebaseAuthConfig';
import { FirestoreConfig } from './FirebaseConfig/FirestoreConfig';
import { StorageConfig } from './FirebaseConfig/StorageConfig';
import { SecurityRules } from './FirebaseConfig/SecurityRules';

export function FirebaseConfigTab() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Database className="w-6 h-6" />
          Firebase Configuration
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <FirebaseAuthConfig />
        <FirestoreConfig />
        <StorageConfig />
        <SecurityRules />
      </div>
    </div>
  );
}
