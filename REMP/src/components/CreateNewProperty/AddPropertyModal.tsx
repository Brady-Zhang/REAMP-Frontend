import React from 'react';
import CommonModal from '../CommonModal';
import PropertyForm from './AddPropertyForm';

interface PropertyModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PropertyModalContainer: React.FC<PropertyModalContainerProps> = ({ isOpen, onClose }) => {
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title="Property details"
      subtitle="Please take a moment to review and complete property details"
      size="lg"
    >
      <PropertyForm onClose={onClose} />
    </CommonModal>
  );
};

export default PropertyModalContainer;
