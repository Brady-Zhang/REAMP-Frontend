import PropertyBanner from './PropertyBanner'
import PreviewInfo from './PreviewInfo'
import PreviewPhoto from './PreviewPhotograph'
import PreviewMap from './PreviewMap'
import PreviewPageHeader from './PreviewPageHeader'
import PreviewPageFooter from './PreviewPageFooter'
import { useEffect, useState } from 'react'
import { ListingCaseDetail } from '../../interfaces/listing-case'
import { useParams } from 'react-router-dom'
import { getListingCaseById } from '../../api/listingcase/listing-by-id'
import PreviewSingleMedia from './PreviewSinglePhoto'

const PreviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<ListingCaseDetail | null>(null);
  const cleanIdStr = id?.startsWith(':') ? id.slice(1) : id;

  const listingId = cleanIdStr && !isNaN(Number(cleanIdStr))
    ? Number(cleanIdStr)
    : undefined;


  useEffect(() => {
    if (listingId !== undefined) {
      getListingCaseById(listingId).then((res) => {
        setListing(res);
        console.log('Fetched listing:', res);
      });
    }
  }, [listingId]);
  return (
    <div className="flex flex-col">
      <PreviewPageHeader />
      {listing && <PropertyBanner listing={listing} />}
      {listing && <PreviewInfo description={listing.description} />}
      {listing && <PreviewPhoto title="Preview Photo" imageUrls={listing.mediaAssets.picture.map((p) => p.mediaUrl)} />}
      {listing && <PreviewSingleMedia
        title="Floor Plan"
        mediaUrl={listing.mediaAssets.floorPlan[0]?.mediaUrl || ''}
        mediaType="image"
      />}
      {listing && <PreviewSingleMedia
        title="Videography"
        mediaUrl={listing.mediaAssets.video[0]?.mediaUrl || ''}
        mediaType="video"
      />}
      <PreviewMap title="Location" lat={-33.8568} lon={151.2153} />
      <PreviewPageFooter listingId={Number(listingId)}/>
    </div>
  );
};


export default PreviewPage