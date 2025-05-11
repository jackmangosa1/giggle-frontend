"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  FiChevronLeft,
  FiUser,
  FiCamera,
  FiMapPin,
  FiPhone,
  FiMail,
  FiLock,
  FiChevronRight,
} from "react-icons/fi";
import Image from "next/image";
import CleaningImage from "@/app/assets/cleaning.jpg";
import apiRoutes from "@/app/config/apiRoutes";
import { Avatar } from "antd";

interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  profilePictureUrl: string;
  username: string;
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(apiRoutes.getCustomerProfile);
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    // Create a temporary URL for optimistic update
    const tempUrl = URL.createObjectURL(file);
    const originalPictureUrl = profile.profilePictureUrl;

    // Optimistic Update
    setProfile({ ...profile, profilePictureUrl: tempUrl });
    setUploadLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(apiRoutes.updateCustomerProfile, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload profile picture");

      const data = await response.json();
      setProfile((prev) =>
        prev ? { ...prev, profilePictureUrl: data.profilePictureUrl } : null
      );
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setProfile((prev) =>
        prev ? { ...prev, profilePictureUrl: originalPictureUrl } : prev
      );
    } finally {
      setUploadLoading(false);
      URL.revokeObjectURL(tempUrl);
    }
  };

  const handleEditProfile = () => {
    if (profile) {
      setEditForm({
        fullName: profile.fullName,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
      });
    }
    setActiveModal("profile");
  };

  const handleEditAddress = () => {
    if (profile) {
      setEditForm({
        address: profile.address,
      });
    }
    setActiveModal("address");
  };

  const handleEditSecurity = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setActiveModal("security");
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    const originalProfile = { ...profile };
    const updatedProfile = { ...profile, ...editForm };
    setProfile(updatedProfile);

    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const response = await fetch(apiRoutes.updateCustomerProfile, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedData = await response.json();
      setProfile((prev) => (prev ? { ...prev, ...updatedData } : null));
    } catch (error) {
      console.error("Error updating profile:", error);
      setProfile(originalProfile);
    } finally {
      setActiveModal(null);
    }
  };

  const handleSavePassword = async () => {
    // try {
    //   const formData = new FormData();
    //   formData.append('currentPassword', currentPassword);
    //   formData.append('newPassword', newPassword);
    //   formData.append('confirmPassword', confirmPassword);
    //   const response = await fetch(apiRoutes.updatePassword, {
    //     method: "PUT",
    //     body: formData,
    //   });
    //   if (!response.ok) throw new Error("Failed to update password");
    //   setActiveModal(null);
    // } catch (error) {
    //   console.error("Error updating password:", error);
    // }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-50 flex-1 ml-16 md:ml-96">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex flex-col items-center py-6 bg-white rounded-lg shadow-sm">
          <div className="relative">
            {profile.profilePictureUrl ? (
              <Image
                src={profile.profilePictureUrl}
                alt="Profile"
                width={96}
                height={96}
                className={`w-24 h-24 rounded-full object-cover ${
                  uploadLoading ? "opacity-50" : ""
                }`}
              />
            ) : (
              <Avatar size={96} className="bg-blue-500 text-white">
                {profile.username?.charAt(0).toUpperCase()}
              </Avatar>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <button
              onClick={handleProfilePictureClick}
              disabled={uploadLoading}
              className={`absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white shadow-lg 
                ${
                  uploadLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
            >
              <FiCamera className="h-5 w-5" />
            </button>
            {uploadLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          <h2 className="mt-4 text-xl font-semibold">{profile.fullName}</h2>
          <p className="text-gray-500">{profile.email}</p>
        </div>

        <ProfileSection title="Personal Information" onEdit={handleEditProfile}>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <FiUser className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{profile.fullName}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FiPhone className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{profile.phoneNumber}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FiMail className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{profile.email}</span>
            </div>
          </div>
        </ProfileSection>

        <ProfileSection title="Address" onEdit={handleEditAddress}>
          <div className="flex items-start space-x-3">
            <FiMapPin className="h-5 w-5 text-gray-400 mt-1" />
            <div className="text-gray-600">
              <p>{profile.address}</p>
            </div>
          </div>
        </ProfileSection>

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
                value={editForm.fullName || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, fullName: e.target.value })
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
                value={editForm.phoneNumber || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, phoneNumber: e.target.value })
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
                value={editForm.email || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </EditModal>
      )}

      {activeModal === "address" && (
        <EditModal
          title="Edit Address"
          onClose={() => setActiveModal(null)}
          onSave={handleSaveProfile}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={editForm.address || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </EditModal>
      )}

      {activeModal === "security" && (
        <EditModal
          title="Change Password"
          onClose={() => setActiveModal(null)}
          onSave={handleSavePassword}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
