import React from "react";

type GalleryProps = {
  actionText: string;
  actionIcon: React.ReactNode;
};

const Gallery: React.FC<GalleryProps> = ({ actionText, actionIcon }) => {
  const images = [
    // Array of image URLs
    "/path/to/image1.jpg",
    "/path/to/image2.jpg",
    "/path/to/image3.jpg",
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative group">
          <img
            src={image}
            alt={`Service ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
          {/* Overlay Action */}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md">
              {actionText}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
