import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getListingCases } from "../../api/listingcase/listing-api";
import { ListingCase } from "../../interfaces/listing-case";
import PropertyModalContainer from "../CreateNewProperty/AddPropertyModal"


import PropertyDetail from "../PropertyEdit/PropertyDetails";
import DeleteListingButton from "./DeleteListing";
import ListingUpdateDialog from "./ListingUpdate";


interface ListingDashboardProps {
    scope?: 'company' | 'admin';
}

// Map backend enum values to readable labels
const getPropertyTypeLabel = (type: number): string => {
    switch (type) {
        case 1: return "House";
        case 2: return "Unit";
        case 3: return "Townhouse";
        case 4: return "Villa";
        case 5: return "Others";
        default: return "Unknown";
    }
};
const getStatusLabel = (status: number): string => {
    switch (status) {
        case 1: return "Created";
        case 2: return "Pending";
        case 3: return "Delivered";
        default: return "Unknown";
    }
};


const ListingDashboard = ({ scope }: ListingDashboardProps) => {
    const [listings, setListings] = useState<ListingCase[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [editingListing, setEditingListing] = useState<ListingCase | null>(null);
    const navigate = useNavigate();
    const [viewDetailListingId, setViewDetailListingId] = useState<number | null>(null);




    const fetchListings = () => {
        getListingCases()
            .then(setListings)
            .catch((err) => {
                console.error("Failed to fetch listing cases:", err);
            });
    };

    useEffect(() => {
        fetchListings();
    }, []);

    return viewDetailListingId ? (
        <div className="w-full min-h-screen bg-white overflow-auto p-6">
            <button
                className="mb-4 text-gray-500 hover:text-gray-800 text-lg"
                onClick={() => setViewDetailListingId(null)}
            >
                ← Back to Dashboard
            </button>
            <PropertyDetail id={viewDetailListingId} />
        </div>
    ) : (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Display all ListingCases in dashboard</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    + Create New Property
                </button>
            </div>
            <table className="w-full text-left border-collapse shadow-sm rounded-lg text-gray-700 font-medium">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                    <tr>
                        <th className="px-4 py-2">PROPERTY#</th>
                        <th className="px-4 py-2">PROPERTY TYPE</th>
                        <th className="px-4 py-2">PROPERTY ADDRESS</th>
                        <th className="px-4 py-2">CREATED AT</th>
                        <th className="px-4 py-2">STATUS</th>
                        <th className="px-4 py-2">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {listings.map((item) => (
                        <tr key={item.id} className="border-b border-gray-300 relative">
                            <td className="px-4 py-2 font-bold">#{item.id}</td>
                            <td className="px-4 py-2">{getPropertyTypeLabel(item.propertyType)}</td>
                            <td className="px-4 py-2">
                                {item.street
                                    ? `${item.street}, ${item.city ?? ""}, ${item.state ?? ""}, ${item.postcode ?? ""}`
                                    : "Address not provided"}
                            </td>
                            <td className="px-4 py-2">{new Date(item.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-2">
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                                    {getStatusLabel(item.listcaseStatus)}
                                </span>
                            </td>
                            <td className="px-4 py-2">
                                <button

                                    onClick={() => {
                                        setEditingListing(item);
                                        setOpenMenuId(null);
                                    }}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                >
                                    View Details
                                </button>
                            </td>
                            <td className="px-4 py-2 relative">
                                <button onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}>
                                    ⋯
                                </button>
                                {openMenuId === item.id && (
                                    <div className="absolute right-0 top-full z-10 bg-white border rounded shadow-md text-left">
                                        <button
                                            className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                            onClick={() => {
                                                setViewDetailListingId(item.id);
                                                setOpenMenuId(null);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <DeleteListingButton
                                            listingId={item.id}
                                            onDelete={async () => {
                                                const allListings = await getListingCases();
                                                setListings(allListings);
                                                setOpenMenuId(null)
                                            }}
                                        />
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="mt-6 text-gray-500 italic">
                Showing all current property listings...
            </p>
            <PropertyModalContainer
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    fetchListings();
                }}
            />

            {editingListing && (
                <ListingUpdateDialog
                    listing={editingListing}
                    onClose={() => setEditingListing(null)}
                    onUpdated={fetchListings}
                />
            )}

        </div>
    );
};

export default ListingDashboard;
