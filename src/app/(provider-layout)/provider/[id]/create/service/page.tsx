"use client";
import React, { useState, useEffect } from "react";
import { Input, Button, Upload, message, AutoComplete } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useRouter, useSearchParams } from "next/navigation";
import apiRoutes from "../../../../../config/apiRoutes";

interface ServiceCategory {
  id: number;
  name: string;
}

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("id");
  const isEditMode = !!serviceId;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    categoryName: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string }[]>(
    []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(apiRoutes.getServiceCategories);
        if (response.ok) {
          const data = await response.json();
          const categories = data.map(
            (category: ServiceCategory) => category.name
          );
          const options = categories.map((category: ServiceCategory) => ({
            value: category,
          }));
          setCategoryOptions(options);
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

    if (isEditMode) {
      const fetchServiceDetails = async () => {
        try {
          const response = await fetch(`${apiRoutes.getService}/${serviceId}`);
          if (response.ok) {
            const serviceData = await response.json();
            setForm({
              title: serviceData.name,
              price: serviceData.price.toString(),
              description: serviceData.description,
              categoryName: serviceData.categoryName,
            });
            setExistingImageUrl(serviceData.mediaUrl);
          } else {
            message.error("Failed to fetch service details.");
          }
        } catch (error) {
          console.error("Error fetching service details:", error);
          message.error("An unexpected error occurred.");
        }
      };

      fetchServiceDetails();
    }
  }, [isEditMode, serviceId]);

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

  const filterOptions = (inputValue: string) => {
    return categoryOptions.filter(
      (option) =>
        option.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
    );
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

      const url = isEditMode
        ? `${apiRoutes.updateService}/${serviceId}`
        : apiRoutes.createService;
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (response.ok) {
        const successMessage = isEditMode
          ? "Service updated successfully!"
          : "Service created successfully!";
        message.success(successMessage);
        router.push(`/provider/${userId}/profile`);
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        message.error(errorText || "Failed to save service.");
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
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Service" : "Create New Service"}
      </h1>

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
              <div
                className="text-center truncate w-full"
                style={{ maxWidth: "100%" }}
              >
                <p className="truncate">{imageFile.name}</p>
              </div>
            ) : existingImageUrl ? (
              <img
                src={existingImageUrl}
                alt="Service"
                className="w-full h-full object-cover rounded-lg"
              />
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
          <AutoComplete
            style={{ width: "100%" }}
            placeholder="Select or enter a category"
            value={form.categoryName}
            onChange={handleCategoryChange}
            options={categoryOptions}
            filterOption={(inputValue, option) =>
              option!.value.toLowerCase().indexOf(inputValue.toLowerCase()) !==
              -1
            }
          />
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
          {isEditMode ? "Update Service" : "Create Service"}
        </Button>
      </div>
    </div>
  );
};

export default Page;
