// src/components/CreateAgentContactForm.tsx
import React, { useMemo, useState } from 'react';
import { CaseContactRequestDto } from '../../interfaces/CaseContact';
import { addCaseContact } from '../../api/caseContactApi';

interface CreateAgentContactFormProps {
  listingId: number;
  defaultAvatar: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateAgentContactForm: React.FC<CreateAgentContactFormProps> = ({
  listingId,
  defaultAvatar,
  onSuccess,
}) => {
  // 表单状态
  const [firstName, setFirstName]     = useState('');
  const [lastName, setLastName]       = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail]             = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  // const [avatarFile, setAvatarFile]   = useState<File | null>(null);
  const [previewUrl, setPreviewUrl]   = useState('');

  // 错误提示
  const [companyError, setCompanyError] = useState('');
  const [emailError, setEmailError]     = useState('');
  const [phoneError, setPhoneError]     = useState('');

  // 校验函数
  const validateCompany = (v: string) =>
    v.trim() ? '' : '公司名称不能为空';
  const validateEmail = (v: string) => {
    if (!v.trim()) return '邮箱不能为空';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(v) ? '' : '邮箱格式不正确';
  };
  const validatePhone = (v: string) => {
    if (!v.trim()) return '手机号不能为空';
    const re = /^(?:\+?61|0)4\d{8}$/;
    return re.test(v)
      ? ''
      : '手机号格式不正确，应为澳洲手机（04XXXXXXXX）';
  };


  const isFormValid = useMemo(() => (
    firstName.trim() &&
    lastName.trim() &&
    companyName.trim() &&
    email.trim() &&
    phoneNumber.trim() &&
    !companyError &&
    !emailError &&
    !phoneError
  ), [firstName, lastName, companyName, email, phoneNumber, companyError, emailError, phoneError]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    // setAvatarFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  // 重置表单方法
  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setCompanyName('');
    setEmail('');
    setPhoneNumber('');
    // setAvatarFile(null);
    setPreviewUrl('');
    setCompanyError('');
    setEmailError('');
    setPhoneError('');
  };

  // 提交
  const handleSubmit = async () => {
    if (!isFormValid) return;

    const payload: CaseContactRequestDto = {
      firstName:     firstName.trim(),
      lastName:      lastName.trim(),
      companyName:   companyName.trim(),
      email:         email.trim(),
      phoneNumber:   phoneNumber.trim(),
      profileUrl:    previewUrl || defaultAvatar,
      listingCaseId: listingId,
    };

    try {
      await addCaseContact(payload);
      onSuccess();
      resetForm();
    } catch (err: any) {
      const msg = err.response?.data?.message ?? err.message;
      alert(`关联联系人失败：${msg}`);
    }
  };

  return (
    <div className="relative">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Create a new agent
      </h2>
      <hr className="mb-6" />

      <div className="flex flex-col items-center mb-6">
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="avatar-upload"
          className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2 cursor-pointer overflow-hidden"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="预览"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 text-2xl">＋</span>
          )}
        </label>
        <span className="text-gray-600">Photo</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">First name *</label>
          <input
            required
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="w-full h-12 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring focus:ring-blue-200 transition"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Last name *</label>
          <input
            required
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="w-full h-12 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring focus:ring-blue-200 transition"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Company name *</label>
          <input
            required
            type="text"
            value={companyName}
            onChange={e => {
              const v = e.target.value;
              setCompanyName(v);
              setCompanyError(validateCompany(v));
            }}
            onBlur={e => setCompanyError(validateCompany(e.target.value))}
            className={`
              w-full h-12 rounded-lg px-4 transition focus:outline-none
              border ${companyError ? 'border-red-500 focus:border-red-500 focus:ring-0' : 'border-gray-300 focus:border-blue-200 focus:ring focus:ring-blue-200'}
            `}
          />
          {companyError && (
            <p className="text-red-500 text-sm mt-1">{companyError}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Email *</label>
          <input
            required
            type="email"
            value={email}
            onChange={e => {
              const v = e.target.value;
              setEmail(v);
              setEmailError(validateEmail(v));
            }}
            onBlur={e => setEmailError(validateEmail(e.target.value))}
            className={`
              w-full h-12 rounded-lg px-4 transition focus:outline-none
              border ${emailError ? 'border-red-500 focus:border-red-500 focus:ring-0' : 'border-gray-300 focus:border-blue-200 focus:ring focus:ring-blue-200'}
            `}
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Phone number *</label>
          <input
            required
            type="tel"
            value={phoneNumber}
            onChange={e => {
              const v = e.target.value;
              setPhoneNumber(v);
              setPhoneError(validatePhone(v));
            }}
            onBlur={e => setPhoneError(validatePhone(e.target.value))}
            className={`
              w-full h-12 rounded-lg px-4 transition focus:outline-none
              border ${phoneError ? 'border-red-500 focus:border-red-500 focus:ring-0' : 'border-gray-300 focus:border-blue-200 focus:ring focus:ring-blue-200'}
            `}
          />
          {phoneError && (
            <p className="text-red-500 text-sm mt-1">{phoneError}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`
            w-full h-12 rounded-full text-white font-medium transition
            ${isFormValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}
          `}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateAgentContactForm;
