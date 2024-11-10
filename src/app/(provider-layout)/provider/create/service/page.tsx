"use client";
import React, { useState } from "react";
import { Input, Button, Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
  });

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
      // Add your API call here to save the service
      message.success("Service created successfully!");
    } catch (error) {
      message.error("Failed to create service");
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
            action="/api/upload" // Add your upload endpoint
            onChange={(info) => {
              if (info.file.status === "done") {
                setImageUrl(info.file.response.url);
              }
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="avatar"
                className="w-full h-full object-cover"
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
