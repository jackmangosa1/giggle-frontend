"use client";

import React from "react";
import { FiChevronLeft, FiX } from "react-icons/fi";
import { AutoComplete, Button } from "antd";

interface ProviderProfile {
  displayName?: string;
  bio?: string;
  skills?: string[];
}

interface EditProfileModalProps {
  editForm: ProviderProfile;
  setEditForm: React.Dispatch<React.SetStateAction<ProviderProfile>>;
  setActiveModal: React.Dispatch<React.SetStateAction<string | null>>;
  allSkills: string[];
  handleSaveProfile: () => void;
  handleRemoveSkill: (skillToRemove: string) => void;
  handleAddSkill: (skill: string) => void;
  skillInput: string;
  setSkillInput: React.Dispatch<React.SetStateAction<string>>;
  filteredSkills: string[];
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  editForm,
  setEditForm,
  setActiveModal,
  allSkills,
  handleSaveProfile,
  handleRemoveSkill,
  handleAddSkill,
  skillInput,
  setSkillInput,
  filteredSkills,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveModal(null)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <FiChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h2 className="text-lg font-semibold">Edit Profile</h2>
          </div>
          <button
            onClick={handleSaveProfile}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Save
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={editForm.displayName || ""}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  displayName: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={editForm.bio || ""}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, bio: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Tell us about yourself"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {editForm.skills?.map((skill, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <AutoComplete
              value={skillInput}
              onChange={setSkillInput}
              options={filteredSkills.map((skill) => ({ value: skill }))}
              style={{ width: "100%", marginTop: 10 }}
              onSelect={handleAddSkill}
            >
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a skill"
              />
            </AutoComplete>
            <Button
              onClick={() => handleAddSkill(skillInput)}
              type="primary"
              className="mt-4"
              block
            >
              Add Skill
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
