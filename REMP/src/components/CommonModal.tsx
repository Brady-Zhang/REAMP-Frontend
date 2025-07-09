import React from "react";
import { FaTimes } from 'react-icons/fa';
import { createPortal } from "react-dom";

const widthClass = {
  md: "max-w-md",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
};

type ModalSize = keyof typeof widthClass;

type CommonModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  size?: ModalSize;
};

export default function CommonModal({
  isOpen,
  onClose,
  title = "Modal Title",
  subtitle,
  children,
  size = "md",
}: CommonModalProps) {
  if (!isOpen) return null;

  const selectedWidthClass = widthClass[size];

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 overflow-y-auto">
      <div className={`w-full bg-white rounded-lg shadow relative ${selectedWidthClass} flex flex-col max-h-[90vh]`}>

        {/* Header */}
        <div className="relative p-5 border-b border-gray-200">
          <button onClick={onClose} aria-label="Close modal" className="absolute top-4 right-4 w-6 h-6 text-gray-500 hover:text-gray-800 transition">
            <FaTimes className="w-6 h-6" />
          </button>
          <div className="pr-10">
            <h3 className="text-[24px] font-bold text-gray-800">{title}</h3>
            {subtitle && <p className="text-[18px] text-gray-600">{subtitle}</p>}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 bg-white">{children}</div>

      </div>
    </div>
    ,
    document.body
  );
}