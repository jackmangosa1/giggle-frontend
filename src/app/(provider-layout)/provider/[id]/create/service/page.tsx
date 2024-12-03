"use client";
import React, { useState, useEffect } from "react";
import { Input, Button, Upload, message, Select } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import apiRoutes from "../../../../../config/apiRoutes";

const { Option } = Select;

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    categoryName: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(apiRoutes.getProviderProfile);
        if (response.ok) {
          const data = await response.json();
          const categories = data.services.map(
            (service: { categoryName: string }) => service.categoryName
          );

          setCategories(categories);
        } else {
          message.error("Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        message.error(
          "An unexpected error occurred while fetching categories."
        );
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      categoryName: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const userId =
        localStorage.getItem("userId") || sessionStorage.getItem("userId");
      if (!userId) {
        message.error("User not authenticated.");
        return;
      }
      if (
        !form.title ||
        !form.price ||
        !form.categoryName ||
        !form.description
      ) {
        message.error("Please fill in all required fields.");
        return;
      }

      const formData = new FormData();
      formData.append("Name", form.title);
      formData.append("Price", form.price);
      formData.append("Description", form.description);
      formData.append("CategoryName", form.categoryName);
      formData.append("PriceType", "1");

      if (imageFile) {
        formData.append("ImageFile", imageFile, imageFile.name);
      }
      const response = await fetch(apiRoutes.createService, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        message.success("Service created successfully!");
        setForm({
          title: "",
          price: "",
          description: "",
          categoryName: "",
        });
        setImageFile(null);
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        message.error(errorText || "Failed to create service.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      message.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="mt-2">Upload Image</div>
    </div>
  );

  return (
    <div className="p-6 w-full max-w-2xl mx-auto bg-gray-50 flex-1 ml-16 md:ml-96">
      <h1 className="text-2xl font-bold mb-6">Create New Service</h1>

      <div className="space-y-6">
        <div>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={(file) => {
              setImageFile(file);
              return false;
            }}
          >
            {imageFile ? (
              <div className="text-center">
                <p>{imageFile.name}</p>
              </div>
            ) : (
              uploadButton
            )}
          </Upload>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter service title"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select a category"
            value={form.categoryName}
            onChange={handleCategoryChange}
          >
            {categories.map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price</label>
          <Input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Enter price"
            type="number"
            prefix="$"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <TextArea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your service"
            rows={4}
            className="w-full"
          />
        </div>

        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Create Service
        </Button>
      </div>
    </div>
  );
};

export default Page;
