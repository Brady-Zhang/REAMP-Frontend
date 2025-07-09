// src/components/PreviewPageFooter.tsx
import React, { useEffect, useState } from 'react';
import { getCaseContactsByListing } from '../../api/caseContactApi';
import { CaseContactResponseDto } from '../../interfaces/CaseContact';
import { HiPencil, HiTrash } from 'react-icons/hi';
import AgentContact from '../AgentContact/AgentContact';
import default_avatar from '../../assets/default-avatar.jpg'

interface PreviewPageFooterProps {
  listingId?: number;
}


const PreviewPageFooter: React.FC<PreviewPageFooterProps> = ({ listingId }) => {
  const [contacts, setContacts] = useState<CaseContactResponseDto[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (listingId && listingId > 0) {
      getCaseContactsByListing(listingId)
        .then(setContacts)
        .catch(err => {
          console.error('拉联系人失败', err);
          setContacts([]);
        });
    }
  }, [listingId]);

  const handleAdd = () => {
    if (listingId && listingId > 0) {
      setShowModal(true);
    }
  };
  const handleCancel = () => setShowModal(false);
  const handleSuccess = () => {
    if (listingId) {
      getCaseContactsByListing(listingId).then(setContacts);
    }
    setShowModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h2 className="text-2xl font-bold font-serif mb-2 text-center">Contact</h2>

        {contacts.length === 0 ? (
          <p className="text-sm text-gray-500 mb-4">Please add agents contact</p>
        ) : (
          <div className="space-y-6 mb-4 max-w-xl mx-auto mt-6">
            {contacts.map((c, idx) => (
              <div
                key={`${c.email ?? ''}-${idx}`}
                className="flex items-center justify-between bg-gray-100 rounded-lg p-4"
              >
                <div className="flex items-center">
                  <img
                    src={c.profileUrl || default_avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="font-medium">
                      {c.firstName} {c.lastName}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{c.companyName}</div>
                  </div>
                </div>
                <div className="flex-1 text-right mr-5">
                  <div className="text-sm text-gray-700">{c.phoneNumber}</div>
                  <div className="text-xs text-gray-500 mt-1">{c.email}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 mr-5 bg-blue-100 rounded-full hover:bg-blue-300 transition">
                    <HiPencil className="text-blue-600" />
                  </button>
                  <button className="p-2 mr-5 bg-red-100 rounded-full hover:bg-red-300 transition">
                    <HiTrash className="text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handleAdd}
            disabled={!listingId}
            className={`
              underline text-sm font-semibold
              ${!listingId ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-blue-800'}
            `}
          >
            Click to add
          </button>
        </div>
      </div>

      {showModal && listingId && (
        <AgentContact
          listingId={listingId}
          defaultAvatar={default_avatar}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
};

export default PreviewPageFooter;
