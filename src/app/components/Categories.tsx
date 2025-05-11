import React from "react";

const Categories = () => {
  const categories = [
    { id: 1, name: "Barber" },
    { id: 2, name: "Car Repair" },
    { id: 3, name: "Massage" },
    { id: 4, name: "Cleaning" },
    { id: 5, name: "Electrician" },
    { id: 6, name: "Dressmaker" },
    { id: 7, name: "Shoe Repair" },
    { id: 8, name: "Painter" },
    { id: 9, name: "Plumber" },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16 px-4 sm:px-6 md:px-8 lg:py-24">
      <div className="max-w-6xl mx-auto text-center">
        <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium inline-block mb-4">
          Our Services
        </span>
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          Popular Categories
        </h2>
        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
          Discover our most requested services and book with ease.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {categories.map((category) => (
          <div
            key={category.id}
            className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm">
                  <span className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                    {category.name.charAt(0)}
                  </span>
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-center">
                    <span className="px-4 py-1.5 text-sm font-medium rounded-lg bg-gray-50 text-gray-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      Explore →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
