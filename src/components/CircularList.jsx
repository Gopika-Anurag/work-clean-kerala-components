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
    const activeTabData = tabs.find((tab) => tab.title === activeTab);
    const items = activeTabData?.items || [];

    return (
        <div
            className="min-h-screen p-4 flex justify-center"
            style={{ backgroundColor }}
        >
            <div className="w-full max-w-4xl">
                {/* Tabs */}
                <div className="grid grid-cols-4 text-center mb-4">
                    {tabs.slice(0, 5).map((tab) => (
                        <button
                            key={tab.title}
                            onClick={() => setActiveTab(tab.title)}
                            className={`pb-2 text-sm sm:text-base font-medium border-b-2`}
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
                                {/* TITLE & BADGE */}
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

                                {/* DESCRIPTION */}
                                <p className="text-base mb-9" style={{ color: item.descriptionColor }}>
                                    {item.description}
                                </p>

                                {/* DATE + DOWNLOAD */}
                                <div className="flex justify-between items-center">
                                    <p className="text-sm" style={{ color: item.dateTimeColor }}>
                                        {item.date} – {item.time}
                                    </p>
                                    {item.downlaodLink && (
                                        <a
                                            href={item.downlaodLink}
                                            download
                                            className="text-sm flex items-center gap-1 hover:underline"
                                            style={{ color: themeTextColor }}
                                        >
                                            <span className="text-lg">⬇</span> Download
                                        </a>
                                    )}
                                </div>
                            </div>

                        ))
                    ) : (
                        <p className="text-gray-400">No items available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CircularList;
