import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Fish, Shrimp, Leaf } from "lucide-react";

export default function AquacultureUI() {
  const farmingTypes = [
    { title: "Fish Farming", icon: <Fish size={40} />, desc: "Efficient fish breeding techniques." },
    { title: "Shrimp Farming", icon: <Shrimp size={40} />, desc: "Sustainable shrimp cultivation methods." },
    { title: "Seaweed Farming", icon: <Leaf size={40} />, desc: "Harnessing the power of aquatic plants." },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Hero Section - Carousel */}
      <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} className="rounded-2xl shadow-lg">
        <div>
          <img src="/fish-farm.jpg" alt="Fish Farming" className="rounded-2xl" />
        </div>
        <div>
          <img src="/shrimp-farm.jpg" alt="Shrimp Farming" className="rounded-2xl" />
        </div>
        <div>
          <img src="/seaweed-farm.jpg" alt="Seaweed Farming" className="rounded-2xl" />
        </div>
      </Carousel>
      
      {/* Farming Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        {farmingTypes.map((item, index) => (
          <div key={index} className="p-4 text-center shadow-lg hover:shadow-xl transition bg-white rounded-lg">
            <div className="flex justify-center mb-4">{item.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
      
      {/* Informative Section */}
      <div className="mt-10 p-6 bg-blue-50 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">The Future of Aquaculture</h2>
        <p className="text-gray-700">Aquaculture is revolutionizing the way we produce seafood, ensuring sustainability and efficiency. With the right techniques and technology, we can provide a stable source of food while preserving marine ecosystems.</p>
      </div>
    </div>
  );
}