"use client";
import React, { useMemo, useState } from "react";
import {
  FiCamera,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiChevronLeft,
  FiX,
} from "react-icons/fi";
import { LiaToolsSolid } from "react-icons/lia";
import { MdWork } from "react-icons/md";
import Image, { StaticImageData } from "next/image";
import { AutoComplete, Button } from "antd";
import CleaningImage from "../../../assets/cleaning.jpg";
import PortfolioCard from "../../../components/ProviderPortfolioCard";
import ServiceCard from "../../../components/ProviderServiceCard";
import EditProfileModal from "../../../components/EditProviderProfileModal";

interface ProviderProfile {
  displayName?: string;
  bio?: string;
  skills?: string[];
  profilePictureUrl?: StaticImageData;
}

interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl: StaticImageData;
}

interface Portfolio {
  id: string;
  title: string;
  description: string;
  imageUrl: StaticImageData;
}

const ProfilePage = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState<string>("");
  const [focused, setFocused] = useState(false);
  const [allSkills] = useState<string[]>([
    "Cleaning",
    "Gardening",
    "Plumbing",
    "Electrical",
    "Painting",
    "Landscaping",
    "Home Repair",
    "Carpentry",
    "HVAC",
    "Roofing",
  ]);

  const [profile, setProfile] = useState<ProviderProfile>({
    displayName: "John Doe",
    bio: "Experienced service provider with expertise in multiple areas",
    skills: ["Cleaning", "Gardening"],
    profilePictureUrl: CleaningImage,
  });

  const [editForm, setEditForm] = useState<ProviderProfile>({
    displayName: profile.displayName,
    bio: profile.bio,
    skills: profile.skills,
  });

  const filteredSkills = useMemo(() => {
    return allSkills.filter(
      (skill) =>
        skill.toLowerCase().includes(skillInput.toLowerCase()) &&
        !editForm.skills?.includes(skill)
    );
  }, [skillInput, editForm.skills]);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<"service" | "portfolio">(
    "service"
  );

  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Cleaning",
      description:
        "Professional cleaning services for homes and offices. We provide top-quality cleaning solutions with attention to detail.",
      imageUrl: CleaningImage,
    },
    {
      id: "2",
      name: "Gardening",
      description:
        "Expert gardening services including lawn care, planting, and landscape design for beautiful outdoor spaces.",
      imageUrl: CleaningImage,
    },
  ]);

  const [portfolioItems, setPortfolioItems] = useState<Portfolio[]>([
    {
      id: "1",
      title: "Garden Setup",
      description:
        "A beautiful garden setup for a luxury home in downtown area. Complete landscape transformation with sustainable plants.",
      imageUrl: CleaningImage,
    },
    {
      id: "2",
      title: "Home Cleaning",
      description:
        "Complete home cleaning services for a 4000 sq ft property. Deep cleaning and organization included.",
      imageUrl: CleaningImage,
    },
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleEditService = (service: Service) => {
    console.log("Edit service:", service);
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter((service) => service.id !== id));
  };

  const handleEditPortfolio = (item: Portfolio) => {
    console.log("Edit portfolio:", item);
  };

  const handleDeletePortfolio = (id: string) => {
    setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
  };

  const handleAddSkill = (skill: string) => {
    if (skill && !editForm.skills?.includes(skill)) {
      setEditForm((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), skill],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditForm((prev) => ({
      ...prev,
      skills: prev.skills?.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSaveProfile = () => {
    setProfile(editForm);
    setActiveModal(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-50 p-6">
      {/* Profile Picture Section */}
      <div className="flex flex-col items-center py-6 bg-white rounded-lg shadow-sm mb-6">
        <div className="relative">
          <Image
            src={
              profileImage
                ? URL.createObjectURL(profileImage)
                : profile.profilePictureUrl || CleaningImage
            }
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="profile-image-upload"
          />
          <label
            htmlFor="profile-image-upload"
            className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white shadow-lg hover:bg-blue-600 cursor-pointer"
          >
            <FiCamera className="h-5 w-5" />
          </label>
        </div>
        <h2 className="mt-4 text-xl font-semibold">{profile.displayName}</h2>
      </div>

      {/* Profile Details Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Profile Details
          </h2>
          <button
            onClick={() => setActiveModal("profile")}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <FiCamera className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700">{profile.displayName}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-gray-700">{profile.bio}</span>
          </div>
          <div className="flex items-center flex-wrap gap-2 mt-2">
            <LiaToolsSolid className="h-5 w-5 text-gray-500" />
            {profile.skills?.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs for Service and Portfolio */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("service")}
            className={`flex-1 text-center py-2 ${
              activeTab === "service" ? "border-b-2 border-blue-500" : ""
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`flex-1 text-center py-2 ${
              activeTab === "portfolio" ? "border-b-2 border-blue-500" : ""
            }`}
          >
            Portfolio
          </button>
        </div>

        {activeTab === "service" && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
              />
            ))}
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <PortfolioCard
                key={item.id}
                item={item}
                onEdit={handleEditPortfolio}
                onDelete={handleDeletePortfolio}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {activeModal === "profile" && (
        <EditProfileModal
          editForm={editForm}
          setEditForm={setEditForm}
          setActiveModal={setActiveModal}
          allSkills={allSkills}
          handleSaveProfile={handleSaveProfile}
          handleRemoveSkill={handleRemoveSkill}
          handleAddSkill={handleAddSkill}
          skillInput={skillInput}
          setSkillInput={setSkillInput}
          filteredSkills={filteredSkills}
        />
      )}
    </div>
  );
};

export default ProfilePage;
