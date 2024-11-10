"use client";
import React, { useState } from "react";
import {
  FiChevronLeft,
  FiUser,
  FiCamera,
  FiEdit2,
  FiMapPin,
  FiPhone,
  FiMail,
  FiLock,
  FiChevronRight,
  FiCheck,
} from "react-icons/fi";
import Image from "next/image";
import CleaningImage from "../../../assets/cleaning.jpg";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: Address;
  profilePicture: string;
}

const ProfileSection = ({
  title,
  children,
  onEdit,
}: {
  title: string;
  children: React.ReactNode;
  onEdit?: () => void;
}) => (
  <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {onEdit && (
        <button
          onClick={onEdit}
          className="text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          Edit
        </button>
      )}
    </div>
    {children}
  </div>
);

const EditModal = ({
  title,
  onClose,
  onSave,
  children,
}: {
  title: string;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg w-full max-w-md mx-4">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <button
          onClick={onSave}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Save
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  </div>
);

const Page = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    profilePicture: "/path/to/profile.jpg",
  });

  const [editForm, setEditForm] = useState<Partial<UserProfile>>(profile);
  const [editAddress, setEditAddress] = useState<Address>(profile.address);

  const handleEditProfile = () => {
    setEditForm(profile);
    setActiveModal("profile");
  };

  const handleEditAddress = () => {
    setEditAddress(profile.address);
    setActiveModal("address");
  };

  const handleEditSecurity = () => {
    setActiveModal("security");
  };

  const handleSaveProfile = () => {
    setProfile({ ...profile, ...editForm });
    setActiveModal(null);
  };

  const handleSaveAddress = () => {
    setProfile({ ...profile, address: editAddress });
    setActiveModal(null);
  };

  const handleSaveSecurity = () => {
    // Handle password update logic here
    setActiveModal(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-50 flex-1 ml-16 md:ml-96">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center py-6 bg-white rounded-lg shadow-sm">
          <div className="relative">
            <Image
              src={CleaningImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white shadow-lg hover:bg-blue-600">
              <FiCamera className="h-5 w-5" />
            </button>
          </div>
          <h2 className="mt-4 text-xl font-semibold">{profile.name}</h2>
          <p className="text-gray-500">{profile.email}</p>
        </div>

        {/* Personal Information */}
        <ProfileSection title="Personal Information" onEdit={handleEditProfile}>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <FiUser className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{profile.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FiPhone className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{profile.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FiMail className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{profile.email}</span>
            </div>
          </div>
        </ProfileSection>

        {/* Address */}
        <ProfileSection title="Address" onEdit={handleEditAddress}>
          <div className="flex items-start space-x-3">
            <FiMapPin className="h-5 w-5 text-gray-400 mt-1" />
            <div className="text-gray-600">
              <p>{profile.address.street}</p>
              <p>
                {profile.address.city}, {profile.address.state}{" "}
                {profile.address.zipCode}
              </p>
              <p>{profile.address.country}</p>
            </div>
          </div>
        </ProfileSection>

        {/* Security */}
        <ProfileSection title="Security" onEdit={handleEditSecurity}>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <FiLock className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">Change Password</span>
            </div>
            <FiChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </ProfileSection>
      </div>

      {/* Edit Profile Modal */}
      {activeModal === "profile" && (
        <EditModal
          title="Edit Profile"
          onClose={() => setActiveModal(null)}
          onSave={handleSaveProfile}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </EditModal>
      )}

      {/* Edit Address Modal */}
      {activeModal === "address" && (
        <EditModal
          title="Edit Address"
          onClose={() => setActiveModal(null)}
          onSave={handleSaveAddress}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street
              </label>
              <input
                type="text"
                value={editAddress.street}
                onChange={(e) =>
                  setEditAddress({ ...editAddress, street: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={editAddress.city}
                  onChange={(e) =>
                    setEditAddress({ ...editAddress, city: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={editAddress.state}
                  onChange={(e) =>
                    setEditAddress({ ...editAddress, state: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={editAddress.zipCode}
                  onChange={(e) =>
                    setEditAddress({ ...editAddress, zipCode: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={editAddress.country}
                  onChange={(e) =>
                    setEditAddress({ ...editAddress, country: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </EditModal>
      )}

      {/* Security Modal */}
      {activeModal === "security" && (
        <EditModal
          title="Change Password"
          onClose={() => setActiveModal(null)}
          onSave={handleSaveSecurity}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </EditModal>
      )}
    </div>
  );
};

export default Page;
