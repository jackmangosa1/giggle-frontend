"use client";
import React, { useEffect, useMemo, useState } from "react";
import { FiCamera } from "react-icons/fi";
import { LiaToolsSolid } from "react-icons/lia";
import Image from "next/image";
import { message, Modal, Empty, Avatar } from "antd";
import PortfolioCard from "../../../../components/ProviderPortfolioCard";
import ServiceCard from "../../../../components/ProviderServiceCard";
import EditProfileModal from "../../../../components/EditProviderProfileModal";
import apiRoutes from "@/app/config/apiRoutes";
import { useRouter } from "next/navigation";
import AvailabilityStatusSelector from "@/app/components/AvailabilityStatusSelector";
import { useProviderStatus } from "@/app/hooks/useProviderStatus";
import {
  CompletedService,
  ProviderProfile,
  Service,
  Skill,
} from "@/app/types/types";

const ProfilePage = () => {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userId =
    localStorage.getItem("userId") || sessionStorage.getItem("userId");
  const { status, updateStatus, isConnected } = useProviderStatus();

  const [profile, setProfile] = useState<ProviderProfile>({
    id: 0,
    displayName: "",
    bio: "",
    skills: [],
    userName: "",
    email: "",
    phoneNumber: "",
  });

  const [services, setServices] = useState<Service[]>([]);
  const [completedServices, setCompletedServices] = useState<
    CompletedService[]
  >([]);

  const [editForm, setEditForm] = useState<Partial<ProviderProfile>>({
    displayName: "",
    bio: "",
    skills: [],
    phoneNumber: "",
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
        setAllSkills(data || []);
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
          phoneNumber: data.phoneNumber,
        });

        setServices(data.services || []);
        setCompletedServices(data.completedServices || []);

        setEditForm({
          displayName: data.displayName,
          bio: data.bio,
          skills: data.skills,
          phoneNumber: data.phoneNumber,
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
          const data = await response.json();

          // If it's the specific "No completed services found" message,
          // treat it as an empty array rather than an error
          if (data.message === "No completed services found") {
            setCompletedServices([]);
            return;
          }

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
    if (!editForm.phoneNumber || editForm.phoneNumber.trim() === "") {
      message.error("Phone number is required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("DisplayName", editForm.displayName || "");
      formData.append("Bio", editForm.bio || "");

      editForm.skills?.forEach((skill, index) => {
        formData.append(`SkillNames[${index}]`, skill);
      });

      formData.append("PhoneNumber", editForm.phoneNumber);

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
      message.error("An error occurred while updating the profile.");
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
          {profileImage || profile.profilePictureUrl ? (
            <Image
              src={
                profileImage
                  ? URL.createObjectURL(profileImage)
                  : profile.profilePictureUrl || ""
              }
              alt="Profile"
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <Avatar size={96} className="bg-blue-500">
              {profile.displayName
                ? profile.userName.charAt(0).toUpperCase()
                : "U"}
            </Avatar>
          )}
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

        <div className="w-full mt-6 px-6">
          <AvailabilityStatusSelector
            status={status}
            onStatusChange={updateStatus}
          />
          {!isConnected && (
            <div className="text-yellow-600 text-sm mt-2">
              Status updates unavailable. Check your connection.
            </div>
          )}
        </div>
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
            {services.length > 0 ? (
              services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={handleEditService}
                  onDelete={handleDeleteService}
                />
              ))
            ) : (
              <div className="col-span-full">
                <Empty description="No services found" />
              </div>
            )}
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
              <div className="col-span-full">
                <Empty description="No completed services found" />
              </div>
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
