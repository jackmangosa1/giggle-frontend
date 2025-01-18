"use client";
import React, { useEffect, useMemo, useState } from "react";
import { FiCamera } from "react-icons/fi";
import { LiaToolsSolid } from "react-icons/lia";
import Image from "next/image";
import { message, Modal } from "antd";
import DefaultProfileImage from "../../../../assets/cleaning.jpg";
import PortfolioCard from "../../../../components/ProviderPortfolioCard";
import ServiceCard from "../../../../components/ProviderServiceCard";
import EditProfileModal from "../../../../components/EditProviderProfileModal";
import apiRoutes from "@/app/config/apiRoutes";
import { useRouter } from "next/navigation";

export enum PriceType {
  fixed = 1,
}
interface ProviderProfile {
  id: number;
  displayName: string;
  bio: string;
  skills: string[];
  profilePictureUrl?: string;
  userName: string;
  email: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  mediaUrl?: string;
  categoryName: string;
  price: number;
  priceType: PriceType;
}

export interface CompletedService {
  id: number;
  title: string;
  description: string;
  mediaUrl?: string;
  completedAt: string;
  reviews: Review[];
}

interface Review {
  id: number;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
}

interface Skill {
  id: number;
  name: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userId =
    localStorage.getItem("userId") || sessionStorage.getItem("userId");

  const [profile, setProfile] = useState<ProviderProfile>({
    id: 0,
    displayName: "",
    bio: "",
    skills: [],
    userName: "",
    email: "",
  });

  const [services, setServices] = useState<Service[]>([]);
  const [completedServices, setCompletedServices] = useState<
    CompletedService[]
  >([]);

  const [editForm, setEditForm] = useState<Partial<ProviderProfile>>({
    displayName: "",
    bio: "",
    skills: [],
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<"service" | "portfolio">(
    "service"
  );

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(apiRoutes.getSkills, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch skills");
        }

        const data = await response.json();
        setAllSkills(data || []); // Update allSkills with the response data
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    };

    fetchSkills();
  }, []);

  const filteredSkills = useMemo(() => {
    return allSkills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(skillInput.toLowerCase()) &&
        !editForm.skills?.includes(skill.name)
    );
  }, [skillInput, editForm.skills]);

  useEffect(() => {
    const fetchProviderProfile = async () => {
      try {
        const response = await fetch(apiRoutes.getProviderProfile, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add authentication headers if required
            // 'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch provider profile");
        }

        const data = await response.json();

        setProfile({
          id: data.id,
          displayName: data.displayName,
          bio: data.bio,
          skills: data.skills,
          profilePictureUrl: data.profilePictureUrl,
          userName: data.userName,
          email: data.email,
        });

        setServices(data.services || []);
        setCompletedServices(data.completedServices || []);

        setEditForm({
          displayName: data.displayName,
          bio: data.bio,
          skills: data.skills,
        });

        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setIsLoading(false);
      }
    };

    fetchProviderProfile();
  }, []);

  useEffect(() => {
    const fetchCompletedServices = async () => {
      try {
        const response = await fetch(apiRoutes.getAllCompletedServices, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add authentication headers if necessary
            // 'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch completed services.");
        }

        const data = await response.json();
        setCompletedServices(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      }
    };

    if (activeTab === "portfolio") {
      fetchCompletedServices();
    }
  }, [activeTab]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("DisplayName", editForm.displayName || "");
      formData.append("Bio", editForm.bio || "");

      editForm.skills?.forEach((skill, index) => {
        formData.append(`SkillNames[${index}]`, skill);
      });

      if (profileImage) {
        formData.append("imageFile", profileImage);
      }

      const response = await fetch(apiRoutes.updateProviderProfile, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile. Status: ${response.status}`);
      }

      const updatedProfile = await response.json();
      setProfile((prev) => ({
        ...prev,
        ...updatedProfile,
        profilePictureUrl: profileImage
          ? URL.createObjectURL(profileImage)
          : prev.profilePictureUrl,
      }));

      setActiveModal(null);
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  const handleEditService = (service: Service) => {
    router.push(
      `/provider/${userId}/create/service?id=${service.id.toString()}`
    );
  };

  const handleDeleteService = async (id: number) => {
    Modal.confirm({
      title: "Are you sure?",
      icon: null,
      content:
        "Do you really want to delete this service? This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await fetch(`${apiRoutes.deleteService}/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Failed to delete service");
          }

          setServices(services.filter((service) => service.id !== id));
          message.success("Service deleted successfully.");
        } catch (err) {
          console.error("Service deletion failed:", err);
          message.error("Failed to delete service.");
        }
      },
    });
  };

  const handleEditPortfolio = (item: CompletedService) => {
    router.push(`/provider/${userId}/create/portfolio?id=${item.id}`);
  };

  const handleDeletePortfolio = (id: number) => {
    Modal.confirm({
      title: "Are you sure?",
      content:
        "Do you really want to delete this portfolio item? This action cannot be undone.",
      okText: "Yes, Delete",
      icon: null,
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await fetch(
            `${apiRoutes.deleteCompletedService}/${id}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to delete portfolio item");
          }

          setCompletedServices(
            completedServices.filter((item) => item.id !== id)
          );
          message.success("Portfolio item deleted successfully.");
        } catch (err) {
          console.error("Portfolio item deletion failed:", err);
          message.error("Failed to delete portfolio item.");
        }
      },
    });
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

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-50 p-6">
      <div className="flex flex-col items-center py-6 bg-white rounded-lg shadow-sm mb-6">
        <div className="relative">
          <Image
            src={
              profileImage
                ? URL.createObjectURL(profileImage)
                : profile.profilePictureUrl || DefaultProfileImage
            }
            alt="Profile"
            width={96}
            height={96}
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
            {completedServices.length > 0 ? (
              completedServices.map((service) => (
                <PortfolioCard
                  key={service.id}
                  item={service}
                  onEdit={handleEditPortfolio}
                  onDelete={handleDeletePortfolio}
                />
              ))
            ) : (
              <p className="text-gray-500">No completed services available.</p>
            )}
          </div>
        )}
      </div>

      {activeModal === "profile" && (
        <EditProfileModal
          editForm={editForm}
          setEditForm={setEditForm}
          setActiveModal={setActiveModal}
          allSkills={allSkills.map((skill: Skill) => skill.name)}
          handleSaveProfile={handleSaveProfile}
          handleRemoveSkill={handleRemoveSkill}
          handleAddSkill={handleAddSkill}
          skillInput={skillInput}
          setSkillInput={setSkillInput}
          filteredSkills={filteredSkills.map((skill: Skill) => skill.name)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
