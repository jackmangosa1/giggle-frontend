"use client";
import React, { useState, useEffect } from "react";
import { Input, Button, Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import type { RcFile } from "antd/es/upload/interface";
import apiRoutes from "@/app/config/apiRoutes";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceId = searchParams.get("id");
  const bookingId = parseInt(params.id as string);

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<RcFile | null>(null);
  const [imagePreview, setImagePreview] = useState<string>();
  const [form, setForm] = useState({
    description: "",
  });

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      const response = await fetch(
        `${apiRoutes.getCompletedService}/${serviceId}`
      );
      const data = await response.json();

      if (response.ok) {
        setForm({
          description: data.description || "",
        });
        if (data.mediaUrl) {
          // Add a timestamp or random query parameter to force image refresh
          setImagePreview(`${data.mediaUrl}?t=${Date.now()}`);
          setImageFile(null);
        }
      } else {
        throw new Error("Failed to fetch service details");
      }
    } catch (error) {
      console.error("Error fetching service details:", error);
      message.error("Failed to fetch service details");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("bookingId", bookingId.toString());
      formData.append("description", form.description);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const method = serviceId ? "PUT" : "POST";
      const url = serviceId
        ? `${apiRoutes.updateCompletedService}/${serviceId}`
        : apiRoutes.addCompletedService;

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          serviceId ? "Failed to update service" : "Failed to create service"
        );
      }

      message.success(
        serviceId
          ? "Portfolio item updated successfully!"
          : "Portfolio item created successfully!"
      );

      // Refetch the service details after successful update
      if (serviceId) {
        await fetchServiceDetails();
      }
    } catch (error) {
      console.error("Error in service operation:", error);
      message.error(
        serviceId
          ? "Failed to update portfolio item"
          : "Failed to create portfolio item"
      );
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
      return false;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    return false;
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
        {serviceId ? "Edit Portfolio Item" : "Create Portfolio Item"}
      </h1>

      <div className="space-y-6">
        <div>
          <Upload
            name="image"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="preview"
                className="w-full h-full object-cover"
                key={imagePreview} // Add key prop to force re-render
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <TextArea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the completed service"
            rows={6}
            className="w-full"
          />
        </div>

        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {serviceId ? "Update Portfolio Item" : "Create Portfolio Item"}
        </Button>
      </div>
    </div>
  );
}
