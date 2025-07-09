import React, { useState } from 'react';
import { PropertyData } from '../types/Property';
import { createListing } from '../services/PropertyService';
import { PropertyTypeOptions } from '../enums/propertyType';
import { SaleCategoryOptions } from '../enums/saleCategory';
import { FaBed, FaBath, FaCar, FaRulerCombined } from 'react-icons/fa';
import { FiPlus, FiMinus } from 'react-icons/fi';
import GooglePlacesAutocomplete from './GooglePlacesAutocomplete';

type PropertyFormProps = {
  onClose: () => void;
};

interface FormErrors {
  title?: string;
  price?: string;
  address?: string;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<PropertyData>({
    title: '',
    propertyType: 1,
    saleCategory: 1,
    street: '',
    city: '',
    state: '',
    postcode: 0,
    longitude: 0,
    latitude: 0,
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    floorArea: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = <K extends keyof PropertyData>(
    key: K,
    value: PropertyData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when field is modified
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const [streetInput, setStreetInput] = useState('');

  const handlePlaceSelect = (address: {
    street: string;
    city: string;
    state: string;
    postcode: string;
    latitude: number;
    longitude: number;
    formattedAddress?: string;
  }) => {
    const display = address.formattedAddress || address.street;
    setStreetInput(display);
    handleChange('street', display);
    handleChange('city', address.city);
    handleChange('state', address.state);
    handleChange('postcode', Number(address.postcode));
    handleChange('latitude', address.latitude);
    handleChange('longitude', address.longitude);

    if (errors.address) {
      setErrors((prev) => ({ ...prev, address: undefined }));
    }
  };

  type NumericKeys = 'bedrooms' | 'bathrooms' | 'garages' | 'floorArea';
  type BasicItem = {
    key: NumericKeys;
    label: string;
    icon: React.ReactNode;
  };

  const basicItems: BasicItem[] = [
    { key: 'bedrooms', label: 'Bed', icon: <FaBed /> },
    { key: 'bathrooms', label: 'Bath', icon: <FaBath /> },
    { key: 'garages', label: 'Car', icon: <FaCar /> },
    { key: 'floorArea', label: 'Area', icon: <FaRulerCombined /> },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Property title is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.street.trim()) {
      newErrors.address = 'Property address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (isSubmitting) return;
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: PropertyData = {
        ...formData,
        postcode: Number(formData.postcode),
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        garages: Number(formData.garages),
        floorArea: Number(formData.floorArea),
      };
      await createListing(payload);
      onClose();
    } catch (error) {
      console.error('Failed to create listing:', error);
      setSubmitError('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6 text-gray-800" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="block font-semibold mb-4">Property Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter property title"
          className={`w-full h-12 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring focus:ring-blue-300 transition ${errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div className="border-b border-gray-200 pb-2 mb-8" />

      <div>
        <label className="block font-semibold mb-4">Property Status</label>
        <div className="flex flex-wrap gap-6 md:gap-12">
          {SaleCategoryOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="saleCategory"
                value={option.value}
                checked={formData.saleCategory === option.value}
                onChange={(e) => handleChange('saleCategory', Number(e.target.value))}
                className={`
                appearance-none w-6 h-6 bg-white rounded-[2px]
                border border-gray-300 bg-white
                shadow-[0_2px_4px_rgba(0,0,0,0.2)] relative transition
                checked:bg-green-500 checked:border-green-500
                checked:before:content-['✔']
                checked:before:absolute
                checked:before:inset-0
                checked:before:flex
                checked:before:justify-center
                checked:before:text-white
              `}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-b border-gray-200 pb-2 mb-8" />

      <div>
        <label className="block font-semibold mb-4">Property Type</label>
        <div className="flex flex-wrap gap-6 md:gap-12">
          {PropertyTypeOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="propertyType"
                value={option.value}
                checked={formData.propertyType === option.value}
                onChange={(e) => handleChange('propertyType', Number(e.target.value))}
                className={`
                appearance-none w-6 h-6 bg-white rounded-[2px]
                border border-gray-300 bg-white
                shadow-[0_2px_4px_rgba(0,0,0,0.2)] relative transition
                checked:bg-green-500 checked:border-green-500
                checked:before:content-['✔']
                checked:before:absolute
                checked:before:inset-0
                checked:before:flex
                checked:before:justify-center
                checked:before:text-white
              `}
              />
              <span>{option.label}</span>
            </label>
          ))}

        </div>
      </div>

      <div className="border-b border-gray-200 pb-2 mb-8" />

      <div className="mb-6">
        <label className="block font-semibold mb-4">Address</label>
        <GooglePlacesAutocomplete
          value={streetInput}
          setStreet={setStreetInput}
          onPlaceSelect={handlePlaceSelect}
          country="AU"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-500">{errors.address}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1 text-gray-600">Street</label>
        <input
          type="text"
          value={formData.street}
          readOnly
          placeholder="Street will be automatically filled"
          className="w-full h-12 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring focus:ring-blue-300 transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-semibold mb-1 text-gray-600">City</label>
          <input
            type="text"
            value={formData.city}
            readOnly
            placeholder="City will be automatically filled"
            className="w-full h-12 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring focus:ring-blue-300 transition"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-600">State</label>
          <input
            type="text"
            value={formData.state}
            readOnly
            placeholder="State will be automatically filled"
            className="w-full h-12 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring focus:ring-blue-300 transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-semibold mb-1 text-gray-600">Postcode</label>
          <input
            type="text"
            value={formData.postcode === 0 ? '' : formData.postcode}
            readOnly
            placeholder="Postcode will be automatically filled"
            className="w-full h-12 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring focus:ring-blue-300 transition"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-600">Price</label>
          <input
            type="number"
            value={formData.price === 0 ? '' : formData.price}
            onChange={(e) => handleChange('price', Number(e.target.value))}
            placeholder="Enter price"
            className={`w-full h-12 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring focus:ring-blue-300 transition ${errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price}</p>
          )}
        </div>
      </div>

      <div className="border-b border-gray-200 pb-2 mb-8" />

      <div>
        <label className="block font-semibold mb-4">Basic Information</label>
        <div className="flex flex-wrap gap-4">
          {basicItems.map((item) => (
            <div
              key={item.key}
              className="bg-gray-100 rounded p-3 flex items-center justify-between"
              style={{ width: '250px', height: '80px' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-400">
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </div>

              {item.key === 'floorArea' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={formData[item.key] as number}
                    onChange={(e) =>
                      handleChange(item.key, Number(e.target.value))
                    }
                    className="w-20 h-8 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring focus:ring-blue-300 transition"
                  />
                  <span>m²</span>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-200"
                    onClick={() =>
                      handleChange(
                        item.key,
                        Math.max(0, (formData[item.key] as number) - 1)
                      )
                    }
                  >
                    <FiMinus />
                  </button>

                  <span className="min-w-[20px] text-center">
                    {formData[item.key]}
                  </span>

                  <button
                    type="button"
                    className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-200"
                    onClick={() =>
                      handleChange(
                        item.key,
                        (formData[item.key] as number) + 1
                      )
                    }
                  >
                    <FiPlus />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {submitError && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg">{submitError}</div>
      )}

      <div className="flex justify-end gap-4 p-5 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center h-[44px] py-[14px] px-[36px] rounded-full border border-gray-500 text-gray-700 hover:bg-gray-100 gap-[10px] disabled:opacity-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center justify-center h-[44px] py-[14px] px-[36px] rounded-full bg-blue-500 text-white hover:bg-blue-600 gap-[10px] disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;
