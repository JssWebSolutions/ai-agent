
import { MapPin } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

export function AddressSection() {
  const { user, updateUser } = useAuth();

  if (!user) return null;

  const handleAddressChange = (field: keyof typeof user.address, value: string) => {
    updateUser({
      address: {
        ...user.address,
        [field]: value
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold">Address Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Street Address</label>
          <input
            type="text"
            value={user.address?.street || ''}
            onChange={(e) => handleAddressChange('street', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter street address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={user.address?.city || ''}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter city"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">State/Province</label>
          <input
            type="text"
            value={user.address?.state || ''}
            onChange={(e) => handleAddressChange('state', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter state or province"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Postal Code</label>
          <input
            type="text"
            value={user.address?.postalCode || ''}
            onChange={(e) => handleAddressChange('postalCode', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter postal code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input
            type="text"
            value={user.address?.country || ''}
            onChange={(e) => handleAddressChange('country', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter country"
          />
        </div>
      </div>
    </div>
  );
}
