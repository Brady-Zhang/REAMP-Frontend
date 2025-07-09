import React, { useEffect, useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';

import { createAgentForm } from '../../interfaces/agent-request';
import { createAgentAccount } from '../../api/agent/create-agent-api';

interface CreateAgentModelProps {
  isVisible: boolean;
  onClose: () => void;
  onCreateSuccess: () => void; 
}


export default function CreateAgentModel({ isVisible, onClose, onCreateSuccess }: CreateAgentModelProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    agentFirstName: '',
    agentLastName: '',
    companyName: '',
    phoneNumber: ''
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  useEffect(() => {
  if (error || success) {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 5000);
    return () => clearTimeout(timer);
  }
}, [error, success]);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const agentForm: createAgentForm = {
      email: formData.email,
      agentFirstName: formData.agentFirstName,
      agentLastName: formData.agentLastName,
      phoneNumber: formData.phoneNumber,
      companyName: formData.companyName,
      avatarImage: selectedImage
    };

    try {
      await createAgentAccount(agentForm);
      setSuccess('Agent created successfully!');
      onCreateSuccess();
      onClose(); // 可选：提交成功后关闭弹窗
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          setError(err.response.data.message || 'Email already exists.');
        } else {
          setError(err.response?.data?.message || 'Failed to create agent.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[100] bg-black bg-opacity-30"
      onClick={onClose}
    >
      <div 
        className="relative w-[700px] max-w-[80vw] h-[1000px] max-h-[96vh] border border-gray-200 rounded-md bg-white overflow-auto px-6 py-3"
        onClick={(e) => e.stopPropagation()}
      >
        <RxCross2 className='absolute w-6 h-6 top-6 right-6 text-gray-600 cursor-pointer hover:text-gray-900'
          onClick={onClose}
        />
        <form className='h-full' onSubmit={handleSubmit}>
          {/* Header */}
          <div className='h-[12%] p-3 pt-2 border-b-2 border-b-gray-100'>
            <h3 className="text-[1.15rem] font-bold">Create a new Agent</h3>
            <div className="text-sm text-gray-600">Please complete below information</div>
          </div>

          {/* Content */}
          <div className='h-[78%] border-b-2 border-b-gray-100 flex items-center justify-center'>
            <div className='w-[50%] h-full'>
              {/* 图片上传 */}
              <div className="flex flex-col items-center mt-4">
                <div 
                  className="w-16 h-16 relative cursor-pointer mb-3"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <img src={previewUrl} alt="Preview" className="w-full h-full rounded-full object-cover border-2" />
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-80 transition-opacity">
                        <span className="text-white text-sm font-medium">Edit</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-600">Photo</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* 表单字段 */}
              <div className="w-full space-y-2 text-sm">
                {[
                  { label: 'First Name', name: 'agentFirstName' },
                  { label: 'Last Name', name: 'agentLastName' },
                  { label: 'Email', name: 'email', type: 'email' },
                  { label: 'Phone Number', name: 'phoneNumber' },
                  { label: 'Team or Office Name', name: 'companyName' }
                ].map(({ label, name, type = 'text' }) => (
                  <div key={name}>
                    <label className="block font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={(formData as any)[name]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='h-[10%] flex flex-col justify-between'>
            {/* 错误或成功提示 */}
            {(error || success) && (
              <div className="text-center text-sm">
                {error && <div className="text-red-600">{error}</div>}
                {success && <div className="text-green-600">{success}</div>}
              </div>
            )}

            {/* 按钮组 */}
            <div className="flex justify-end items-center space-x-4 mt-2">
              <button 
                type="button"
                className="rounded-3xl bg-white border-2 border-black text-black px-4 py-1.25 font-semibold hover:bg-gray-100"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="ml-5 rounded-3xl font-semibold text-white px-4 py-1.25"
                style={{ background: 'linear-gradient(to right, #1cadf8, #1099e1)' }}
              >
                {isSubmitting ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
