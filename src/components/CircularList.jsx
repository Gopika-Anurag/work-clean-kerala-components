import React, { useState } from "react";
import { attributes } from "../data/circularsData";

const CircularList = () => {
    const {
        backgroundColor,
        themeColor,
        themeTextColor,
        tabsBarColor,
        tabs,
    } = attributes;

    const [activeTab, setActiveTab] = useState(tabs[0].title);
    const [showModal, setShowModal] = useState(false);
    const [downloadLink, setDownloadLink] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [successMessage, setSuccessMessage] = useState('');

    const activeTabData = tabs.find((tab) => tab.title === activeTab);
    const items = activeTabData?.items || [];

    const handleDownloadClick = (link) => {
        setDownloadLink(link);
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowModal(false);
        setSuccessMessage("Download data has been sent to your email");

        // Simulate sending formData and download link (replace with real request if needed)
        console.log("Send this to backend: ", formData, downloadLink);

        // Clear form
        setFormData({ name: '', email: '', phone: '' });

        // Optionally: Trigger download automatically or email it from server
       setTimeout(() => {
  setSuccessMessage('');
}, 3000);
    };

    return (
        <div className="min-h-screen p-4 flex justify-center" style={{ backgroundColor }}>
            <div className="w-full max-w-4xl">
                {/* Tabs */}
                <div className="grid grid-cols-4 text-center mb-4">
                    {tabs.slice(0, 5).map((tab) => (
                        <button
                            key={tab.title}
                            onClick={() => setActiveTab(tab.title)}
className="pb-2 text-sm sm:text-base md:text-lg font-medium border-b-2"
                            style={{
                                color: activeTab === tab.title ? themeTextColor : "#6B7280",
                                borderColor: activeTab === tab.title ? themeColor : "transparent",
                            }}
                        >
                            {tab.title}
                        </button>
                    ))}
                </div>

                {/* Cards */}
                <div className="space-y-4">
                    {items.length > 0 ? (
                        items.map((item, index) => (
                            <div
                                key={index}
                                className="border rounded-xl px-6 py-5 shadow-md"
                            >
                                {/* Title & Badge */}
                                <div className="flex items-center space-x-2 mb-1">
                                    {item.badge === "true" && (
                                        <span
                                            className="text-sm font-medium px-3 py-1 rounded-full"
                                            style={{
                                                backgroundColor: activeTabData.badgeColor,
                                                color: activeTabData.badgeTextColor,
                                            }}
                                        >
                                            NEW
                                        </span>
                                    )}
<h3 className="text-lg sm:text-xl md:text-2xl font-semibold" style={{ color: item.titleColor }}>
                                        {item.title}
                                    </h3>
                                </div>

                                {/* Description */}
<p className="text-sm sm:text-base md:text-lg mb-9" style={{ color: item.descriptionColor }}>
                                    {item.description}
                                </p>

                                {/* Date and Download */}
                                <div className="flex justify-between items-center">
<p className="text-xs sm:text-sm md:text-base" style={{ color: item.dateTimeColor }}>
                                        {item.date} – {item.time}
                                    </p>
                                    {item.downlaodLink && (
                                        <button
                                            onClick={() => handleDownloadClick(item.downlaodLink)}
className="text-xs sm:text-sm md:text-base flex items-center gap-1 hover:underline"
                                            style={{ color: themeTextColor }}
                                        >
                                            <span className="text-lg">⬇</span> Download
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No items available.</p>
                    )}
                </div>

                {/* Success Message */}
               {successMessage && (
<div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 sm:px-6 py-2 sm:py-3 rounded-md shadow-lg z-50 text-xs sm:text-sm md:text-base font-medium text-center max-w-[90%] sm:max-w-[500px] break-words">
    {successMessage}
  </div>
)}


                {/* Modal */}
                {showModal && (
<div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-black/30">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Enter your details</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                <input
  type="tel"
  name="phone"
  placeholder="Phone Number"
  value={formData.phone}
  onChange={handleInputChange}
  required
  pattern="[0-9]{10}"
  maxLength={10}
  className="w-full p-2 border border-gray-300 rounded"
/>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="text-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-green-700"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CircularList;
