import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ListingAssetStatus } from '../interfaces/litsting-assets';
import { BsCamera, BsCameraVideo, BsHouse } from 'react-icons/bs';
import { FaVrCardboard } from 'react-icons/fa';
import { HiOutlineDocumentSearch } from 'react-icons/hi';

import { MediaAssetResponseDto } from '../interfaces/MediaAssetResponseDto';
import { getListingCaseDetail } from '../api/listingcase/listing-api';

import CommonModal from '../components/CommonModal';
import PhotographyUploadForm from '../components/PhotographyUploadForm';

import { ListingCase } from '../interfaces/listing-case';
import ListingUpdateDialog from './ListingDashBoard/ListingUpdate';

import { ListingCaseDetail  } from '../interfaces/listing-case';
import { MediaType } from '../enums/mediaType';
import MediaUploadForm from './MediaUploadForm';
import { Agent } from '../interfaces/agent-response';
import { getAllAgents } from '../api/agent/get-all-agents';
import AssignAgentPopupContent from './AssignAgentPopupContent';


interface PropertyDetailProps {
  id?: number;
}

const PropertyDetail = ({ id }: PropertyDetailProps) => {
  const { listingId: paramId } = useParams();
  const cleanId = paramId?.startsWith(':') ? paramId.slice(1) : paramId;
  const listingId = id ?? (cleanId && !isNaN(Number(cleanId)) ? Number(cleanId) : undefined);

  const [assets, setAssets] = useState<ListingAssetStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [pictureCount, setPictureCount] = useState(0);

  const [isPhotographyModalOpen, setPhotographyModalOpen] = useState(false);
  const [uploadPhotographyType, setUploadPhotographyType] = useState<'W' | 'P'>('W');

  const [isEditing, setIsEditing] = useState(false);
  const [currentListing, setCurrentListing] = useState<ListingCaseDetail  | null>(null);

  const [mediaUploadType, setMediaUploadType] = useState<MediaType | null>(null);
  const [isMediaModalOpen, setMediaModalOpen] = useState(false);

  const [isAssignAgentOpen, setAssignAgentOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);

  const [allMediaAssets, setAllMediaAssets] = useState<MediaAssetResponseDto[]>([]);

  useEffect(() => {
    if (!listingId) return;
    fetchAssets(Number(listingId));
  }, [listingId]);

  useEffect(() => {
    if (isAssignAgentOpen) {
      getAllAgents()
        .then((res) => setAgents(res))
        .catch((err) => console.error('Failed to load agents', err));
    }
  }, [isAssignAgentOpen]);

  const fetchAssets = async (id: number) => {
    try {
      const listing = await getListingCaseDetail(id);
      const data = flattenMediaAssets(listing.mediaAssets);
      setAllMediaAssets(data);
      const { status, pictureCount } = calculateMediaStatus(data);

      setCurrentListing(listing);
      setAssets(status);
      setPictureCount(pictureCount);
    } catch (err) {
      console.error('Failed to fetch listing case or assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const flattenMediaAssets = (categorized: any): MediaAssetResponseDto[] => {
    return [
      ...(categorized?.picture || []),
      ...(categorized?.video || []),
      ...(categorized?.floorPlan || []),
      ...(categorized?.vrTour || [])
    ];
  };

  const calculateMediaStatus = (assets: MediaAssetResponseDto[]) => {
    const status: ListingAssetStatus = {
      photographyW: false,
      assignAgent: false,
      floorPlan: false,
      videography: false,
      vrTour: false,
    };

    let pictureCount = 0;

    for (const asset of assets) {
      switch (asset.mediaType) {
        case 1: // Picture
          pictureCount++;
          if (pictureCount === 1) {
            status.photographyW = true;
          }
          break;
        case 2: // Video
          status.videography = true;
          break;
        case 3: // FloorPlan
          status.floorPlan = true;
          break;
        case 4: // VR Tour
          status.vrTour = true;
          break;
      }
    }
    return { status, pictureCount };
  };

  const assetBlocks = [
    { label: 'Photography-W', key: 'photographyW', icon: <BsCamera className="text-blue-600 text-2xl" />, showCount: true },
    { label: 'Assign Agent', key: 'assignAgent', icon: <BsCamera className="text-orange-500 text-2xl" />, alwaysOn: true },
    { label: 'Floor Plan', key: 'floorPlan', icon: <HiOutlineDocumentSearch className="text-green-600 text-2xl" /> },
    { label: 'Videography', key: 'videography', icon: <BsCameraVideo className="text-gray-400 text-2xl" /> },
    { label: 'VR Tour', key: 'vrTour', icon: <FaVrCardboard className="text-gray-400 text-2xl" /> },
    { label: 'Property details', key: 'propertyDetails', icon: <BsHouse className="text-purple-500 text-2xl" />, alwaysOn: true, },
  ];

  if (!assets) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Property Assets</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
        {assetBlocks.map((asset) => {
          const isAvailable = asset.alwaysOn || assets[asset.key as keyof ListingAssetStatus];
          return (
            <div
              key={asset.key}
              className={`relative w-40 h-40 flex flex-col items-center justify-center rounded-2xl transition-all
              ${isAvailable ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}
              hover:shadow-md cursor-pointer`}
              onClick={() => {
                if (asset.key === 'photographyW') {
                  setUploadPhotographyType('W');
                  setPhotographyModalOpen(true);
                } else if (asset.key === 'photographyP') {
                  setUploadPhotographyType('P');
                  setPhotographyModalOpen(true);
                } else if (asset.key === 'floorPlan') {
                  setMediaUploadType(MediaType.FloorPlan);
                  setMediaModalOpen(true);
                } else if (asset.key === 'videography') {
                  setMediaUploadType(MediaType.Video);
                  setMediaModalOpen(true);
                } else if (asset.key === 'vrTour') {
                  setMediaUploadType(MediaType.VRTour);
                  setMediaModalOpen(true);
                } else if (asset.key === 'assignAgent') {
                  setAssignAgentOpen(true);
                } else if (asset.key === 'propertyDetails') {
                  setIsEditing(true);
                }
              }}

            >
              {asset.showCount && pictureCount > 0 && (
                <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                  {pictureCount}
                </span>
              )}

              <div className="text-3xl mb-2">{asset.icon}</div>
              <span className="text-lg font-semibold text-center">{asset.label}</span>
            </div>
          );
        })}
      </div>

      {/* Photography Upload Modal */}
      <CommonModal
        isOpen={isPhotographyModalOpen}
        onClose={() => setPhotographyModalOpen(false)}
        title={`Upload photography - ${uploadPhotographyType}`}
        size="lg"
      >
        <PhotographyUploadForm
          listingId={Number(listingId)}
          existingAssets={allMediaAssets.filter(a => Number(a.mediaType) === MediaType.Picture)}
          onUploadSuccess={() => {
            setPhotographyModalOpen(false);
            fetchAssets(Number(listingId));
          }}
        />
      </CommonModal>

      <CommonModal
        isOpen={isMediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        title={`Upload ${MediaType[mediaUploadType!]}`}
        size="lg"
      >
        {mediaUploadType && (
          <MediaUploadForm
            listingId={Number(listingId)}
            mediaType={mediaUploadType}
            existingAssets={allMediaAssets}
            onUploadSuccess={() => {
              setMediaModalOpen(false);
              fetchAssets(Number(listingId));
            }}
          />
        )}
      </CommonModal>


      <CommonModal
        isOpen={isAssignAgentOpen}
        onClose={() => setAssignAgentOpen(false)}
        title="Assign Agent"
        size="lg"
      >
        <AssignAgentPopupContent
          listingCaseId={Number(listingId)}
        />
      </CommonModal>

      {isEditing && currentListing && (
        <ListingUpdateDialog
          listing={currentListing}
          onClose={() => setIsEditing(false)}
          onUpdated={() => {
            setIsEditing(false);
            fetchAssets(currentListing?.id);
          }}
        />
      )}
    </div>
  );
};

export default PropertyDetail;
