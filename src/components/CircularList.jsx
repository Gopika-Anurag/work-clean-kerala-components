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
    setShowPopup(false); // Optional: also close the popup
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
                            className="pb-2 text-sm sm:text-base font-medium border-b-2"
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
                                    <h3 className="text-xl font-semibold" style={{ color: item.titleColor }}>
                                        {item.title}
                                    </h3>
                                </div>

                                {/* Description */}
                                <p className="text-base mb-9" style={{ color: item.descriptionColor }}>
                                    {item.description}
                                </p>

                                {/* Date and Download */}
                                <div className="flex justify-between items-center">
                                    <p className="text-sm" style={{ color: item.dateTimeColor }}>
                                        {item.date} – {item.time}
                                    </p>
                                    {item.downlaodLink && (
                                        <button
                                            onClick={() => handleDownloadClick(item.downlaodLink)}
                                            className="text-sm flex items-center gap-1 hover:underline"
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
                    <div className="mt-6 text-green-600 font-semibold text-center">
                        {successMessage}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h2 className="text-xl font-semibold mb-4">Enter your details</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded"
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
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
