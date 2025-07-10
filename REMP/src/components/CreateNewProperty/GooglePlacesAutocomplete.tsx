import React, { useEffect, useRef, useState } from 'react';
import { Address } from '../types/Address';

declare global {
  interface Window {
    google?: {
      maps?: {
        importLibrary: (library: string) => Promise<{
          PlaceAutocompleteElement: new () => HTMLInputElement & {
            toPlace?: () => Promise<any>;
            componentRestrictions: { country: string };
            fields: string[];
            value: string;
          };
        }>;
      };
    };
  }
}

let loadPromise: Promise<void> | null = null;

interface GooglePlacesAutocompleteProps {
  country?: string;
  onPlaceSelect?: (address: Address) => void;
  value: string;
  setStreet: React.Dispatch<React.SetStateAction<string>>;
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  country = 'au',
  onPlaceSelect,
  value,
  setStreet,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

  const extractAddressComponent = (
    components: Array<{ longText: string; shortText: string; types: string[] }> | undefined,
    type: string
  ): string => {
    if (!components) return '';
    const comp = components.find((c) => Array.isArray(c.types) && c.types.includes(type));
    return comp ? comp.longText || comp.shortText || '' : '';
  };

  useEffect(() => {
    if (loadPromise) return;

    if (!apiKey) {
      setError('Google Maps API key is missing');
      return;
    }

    loadPromise = new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[src*="maps.googleapis.com/maps/api/js"]'
      );

      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=en&v=beta`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          if (typeof window.google?.maps?.importLibrary === 'function') {
            window.google.maps
              .importLibrary('places')
              .then(() => resolve())
              .catch((err) => reject(err));
          } else {
            reject(new Error('google.maps.importLibrary not found'));
          }
        };

        script.onerror = () => reject(new Error('Google Maps script load failed'));
        document.head.appendChild(script);
      } else {
        const checkInterval = setInterval(() => {
          if (typeof window.google?.maps?.importLibrary === 'function') {
            clearInterval(checkInterval);
            window.google.maps
              .importLibrary('places')
              .then(() => resolve())
              .catch((err) => reject(err));
          }
        }, 100);
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error('importLibrary timeout'));
        }, 10000);
      }
    });

    loadPromise.catch((err) => {
      setError(`Failed to load Google Maps: ${err.message}`);
      loadPromise = null;
    });
  }, [apiKey]);

  useEffect(() => {
    if (!loadPromise) return;

    let gaEl: any;
    let cleanupFn: (() => void) | null = null;

    loadPromise
      .then(async () => {
        if (!containerRef.current) return;

        try {
          const { PlaceAutocompleteElement } = await window.google!.maps!.importLibrary('places');

          gaEl = new PlaceAutocompleteElement() as any;
          gaEl.includedRegionCodes = [country.toLowerCase()];
          gaEl.fields = ['addressComponents', 'formattedAddress', 'location', 'displayName'];

          while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
          }
          containerRef.current.appendChild(gaEl);

          const handlePlaceSelect = async (evt: any) => {
            try {
              const placePrediction = evt.placePrediction || evt?.detail?.placePrediction;
              if (!placePrediction || typeof placePrediction.toPlace !== 'function') {
                console.warn('Invalid place prediction received');
                return;
              }

              const placeInstance = await placePrediction.toPlace();

              await placeInstance.fetchFields({
                fields: ['addressComponents', 'formattedAddress', 'location', 'displayName'],
              });

              const comps = placeInstance.addressComponents;
              const streetNumber = extractAddressComponent(comps, 'street_number');
              const streetName = extractAddressComponent(comps, 'route');
              const city = extractAddressComponent(comps, 'locality');
              const state = extractAddressComponent(comps, 'administrative_area_level_1');
              const postcode = extractAddressComponent(comps, 'postal_code');
              const formattedAddress = placeInstance.formattedAddress ?? '';

              const latitude =
                typeof placeInstance.location.lat === 'function'
                  ? placeInstance.location.lat()
                  : placeInstance.location.lat;
              const longitude =
                typeof placeInstance.location.lng === 'function'
                  ? placeInstance.location.lng()
                  : placeInstance.location.lng;

              const address: Address = {
                street: `${streetNumber} ${streetName}`.trim(),
                city,
                state,
                postcode,
                latitude,
                longitude,
                formattedAddress,
              };

              if (onPlaceSelect) onPlaceSelect(address);
              setStreet(formattedAddress);
              gaEl.setAttribute('data-user-selected', 'true');
            } catch (err) {
              console.error('handlePlaceSelect error:', err);
              setError('Failed to process selected address');
            }
          };

          gaEl.addEventListener('gmp-select', handlePlaceSelect);
          elementRef.current = gaEl;

          cleanupFn = () => {
            if (gaEl) {
              gaEl.removeEventListener('gmp-select', handlePlaceSelect);
              if (containerRef.current?.contains(gaEl)) {
                containerRef.current.removeChild(gaEl);
              }
            }
          };
        } catch (err) {
          console.error('Failed to initialize place autocomplete:', err);
          setError('Failed to initialize address search');
        }
      })
      .catch((err) => setError(err.message));

    return () => {
      if (cleanupFn) cleanupFn();
    };
  }, [country, onPlaceSelect, setStreet]);

  useEffect(() => {
    const el = elementRef.current as any;
    if (el && value && value !== el.value) {
      el.value = value;
    }
  }, [value]);

  return (
    <div className="w-full">
      <div className="mb-4">
        {error && (
          <div className="p-2 bg-red-50 text-red-600 rounded-md mb-2 text-sm">{error}</div>
        )}
        <div ref={containerRef} className="w-full" />
      </div>
    </div>
  );
};

export default GooglePlacesAutocomplete;
