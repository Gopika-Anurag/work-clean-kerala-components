// Carouseldata.jsx
// NOTE: Make sure these image URLs are publicly accessible on your server or hosting service.

export const activitiesAtGlanceSettings = {
    slideWidth: 500, // Updated to 500px as requested for base calculation
    slideHeight: 250, // Updated to 250px as requested for base calculation
    minimumSlidesToShow: 3.2,
    scrollSpeed: 5,
    dragSpeed: 0.85
}

export const activitiesAtGlance = [
    {
        // 1. 2025-2026 Card (image_b1e41b.png)
        type: "circle-icon",
        image: "https://png.pngtree.com/png-vector/20190505/ourmid/pngtree-vector-hole-icon-png-image_1023130.jpg", // Direct URL
        topRightText: "2025-2026", // Special text for this card
        topRightTextColor: "#374151",
        topRightDotColor: "#2563EB",
        value: "", // No value for this card
        label: "", // No label for this card
        bgColor: "#E6F4EA", // Consistent light background
        circleColor: "transparent",
        circleBgColor: "transparent",
        showKnowMoreButton: false,
    },
    {
        // 2. MT of Segregated Plastic Collected (image_c0fe86.jpg)
        type: "circle-icon",
        label: "MT of Segregated Plastic Collected",
        value: "38,406",
        image: "https://i.pinimg.com/736x/bc/0c/91/bc0c9132a101d19b4a48595431cad174.jpg", // Direct URL
        bgColor: "#E6F4EA",
        valueColor: "#374151", // Dark text for value
        labelColor: "#374151", // Dark text for label
        circleColor: "transparent",
        circleBgColor: "transparent",
        showKnowMoreButton: true,
    },
    {
        // 3. Kg. Waste Collected (Total) (image_b3c4f8.jpg)
        type: "circle-icon",
        label: "Kg. Waste Collected (Total)",
        value: "278,924",
        image: "https://i.pinimg.com/736x/bc/0c/91/bc0c9132a101d19b4a48595431cad174.jpg", // Direct URL
        bgColor: "#E6F4EA",
        valueColor: "#374151",
        labelColor: "#374151",
        circleColor: "transparent",
        circleBgColor: "transparent",
        showKnowMoreButton: true,
    },
    {
        // 4. Rs Roi From Waste (image_b2e059.jpg)
        type: "circle-icon",
        label: "Rs Roi From Waste",
        value: "278,",
        image: "https://i.pinimg.com/736x/bc/0c/91/bc0c9132a101d19b4a48595431cad174.jpg", // Direct URL
        bgColor: "#E6F4EA",
        valueColor: "#374151",
        labelColor: "#374151",
        circleColor: "transparent",
        circleBgColor: "transparent",
        showKnowMoreButton: true,
    },
    {
        // 5. OTPs Issued (image_b350d7.png)
        type: "circle-icon",
        label: "OTPs Issued",
        value: "278k+",
        image: "https://i.pinimg.com/736x/bc/0c/91/bc0c9132a101d19b4a48595431cad174.jpg", // Direct URL
        bgColor: "#E6F4EA",
        valueColor: "#005A3C", // Specific color for this card's text
        labelColor: "#666B8A", // Specific color for this card's text
        circleColor: "transparent",
        circleBgColor: "transparent",
        showKnowMoreButton: true,
    },
    {
        // 6. Active Volunteers (image_b2d8f5.png)
        type: "circle-icon",
        label: "Active Volunteers",
        value: "1200+",
        image: "https://i.pinimg.com/736x/bc/0c/91/bc0c9132a101d19b4a48595431cad174.jpg", // Direct URL
        bgColor: "#E6F4EA",
        circleColor: "#D7BDE2",
        valueColor: "#005A3C",
        labelColor: "#666B8A",
        circleBgColor: "#fff",
        showKnowMoreButton: true,
    },
    {
        // 7. Total Engagements (Using placeholder image)
        type: "circle-icon",
        label: "Total Engagements",
        value: "38,406",
        image: "https://i.pinimg.com/736x/bc/0c/91/bc0c9132a101d19b4a48595431cad174.jpg", // Direct URL (Placeholder)
        bgColor: "#E6F4EA",
        valueColor: "#374151",
        labelColor: "#374151",
        circleColor: "transparent",
        circleBgColor: "transparent",
        showKnowMoreButton: true,
    },
]

export const ourProjectsCarouselSettings = {
    
    slideWidth: 400, 
    slideHeight: 600, 
    minimumSlidesToShow: 1.1, 
    scrollSpeed: 0.2, 
    dragSpeed: 1.5,
    wheelScrollSpeed: 0.8, 
}

export const ourProjects = [
    {
        title: "Segregated Plastic Collection",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_00_44-AM.png", // Direct URL
        bgColor: "#F0FFF0",
        titleColor: "#FFFFFF",
        textPosition: "bottom", // IMPORTANT: Add this property. "top" or "bottom"
    },
    {
        title: "E-Waste Management",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_10_06-AM.png", // Direct URL
        bgColor: "#FFF3E0",
        titleColor: "#FFFFFF",
        textPosition: "top", // IMPORTANT: Add this property. "top" or "bottom"
    },
    {
        title: "Glass Waste Collection",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_10_06-AM.png", // Direct URL
        bgColor: "#F0F8FF",
        titleColor: "#FFFFFF",
        textPosition: "bottom", // IMPORTANT: Add this property. "top" or "bottom"
    },
    {
        title: "Organic Waste Composting",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_00_44-AM.png", // Direct URL
        bgColor: "#FFF8E1",
        titleColor: "#FFFFFF",
        textPosition: "top", // IMPORTANT: Add this property. "top" or "bottom"
    },
    {
        title: "Awareness & Education Drives",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_12_54-AM.png", // Direct URL
        bgColor: "#F3E5F5",
        titleColor: "#FFFFFF",
        textPosition: "bottom", // IMPORTANT: Add this property. "top" or "bottom"
    },
]
export const steps = [
    {
        step: 1,
        title: "Submit Required Documents",
        description: "We need any one of the following:",
        checklist: [
            "Iqama Copy",
            "OR Iqama Number",
            "OR First Saudi Visa copy from your passport",
            "Bio page of your passport",
        ],
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_00_44-AM.png", // Direct URL
        titleColor: "#0E0E52",
        descriptionColor: "#666B8A",
        checklistColor: "#0082F4",
        slideBackgroundColor: "#F8F9FC",
    },
    {
        step: 2,
        title: "Record Check & Verification",
        description: "We access Saudi police records to:",
        checklist: ["Confirm your file", "Retrieve fingerprint & photo records"],
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_10_06-AM.png", // Direct URL
        titleColor: "#0E0E52",
        descriptionColor: "#666B8A",
        checklistColor: "#0082F4",
        slideBackgroundColor: "#F8F9FC",
    },
    {
        step: 3,
        title: "Issuance of Saudi PCC",
        description: "Final Saudi PCC issued with the official seal.",
        checklist: ["Attestation by MOFA (if requested)", "Courier or soft copy delivery"],
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_12_54-AM.png", // Direct URL
        titleColor: "#0E0E52",
        descriptionColor: "#666B8A",
        checklistColor: "#0082F4",
        slideBackgroundColor: "#F8F9FC",
    },
    {
        step: 4,
        title: "Translation Services (if required)",
        description: "We offer translation for official use:",
        checklist: ["Arabic to English translation", "Certified translator approval"],
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_15_46-AM.png", // Direct URL
        titleColor: "#0E0E52",
        descriptionColor: "#666B8A",
        checklistColor: "#0082F4",
        slideBackgroundColor: "#F8F9FC",
    },
    {
        step: 5,
        title: "MOFA Attestation",
        description: "We help with Ministry of Foreign Affairs Attestation:",
        checklist: ["Document submission to MOFA", "Collection and confirmation"],
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_00_44-AM.png", // Direct URL
        titleColor: "#0E0E52",
        descriptionColor: "#666B8A",
        checklistColor: "#0082F4",
        slideBackgroundColor: "#F8F9FC",
    },
    {
        step: 6,
        title: "Courier Service Setup",
        description: "Secure delivery of your documents via trusted courier partners.",
        checklist: ["Domestic & international shipping", "Tracking details shared"],
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_10_06-AM.png", // Direct URL
        titleColor: "#0E0E52",
        descriptionColor: "#666B8A",
        checklistColor: "#0082F4",
        slideBackgroundColor: "#F8F9FC",
    },
    {
        step: 7,
        title: "Customer Support",
        description: "Dedicated help for every stage of the process.",
        checklist: ["Phone, Email & WhatsApp assistance", "Real-time status updates"],
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_12_54-AM.png", // Direct URL
        titleColor: "#0E0E52",
        descriptionColor: "#666B8A",
        checklistColor: "#0082F4",
        slideBackgroundColor: "#F8F9FC",
    },
    {
        step: 8,
        title: "Data Security Assurance",
        description: "Your data is safe with us.",
        checklist: ["End-to-end encryption", "No third-party access"],
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_15_46-AM.png", // Direct URL
        titleColor: "#0E0E52",
        descriptionColor: "#666B8A",
        checklistColor: "#0082F4",
        slideBackgroundColor: "#F8F9FC",
    },
    {
        step: 9,
        title: "Soft Copy Archival",
        description: "We provide you with soft copies for your records.",
        checklist: ["PDF & image format", "Secure cloud storage link (optional)"],
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_00_44-AM.png", // Direct URL
        titleColor: "#0E0E52",
        descriptionColor: "#666B8A",
        checklistColor: "#0082F4",
        slideBackgroundColor: "#F8F9FC",
    },
    {
        step: 10,
        title: "Completion & Feedback",
        description: "Once complete, we welcome your feedback.",
        checklist: ["Quick rating system", "Optional testimonial submission"],
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_10_06-AM.png", // Direct URL
        titleColor: "#0E0E52",
        descriptionColor: "#666B8A",
        checklistColor: "#0082F4",
        slideBackgroundColor: "#F8F9FC",
    },
];

export const stepByStepCarouselSettings = {
    slideWidth: 640,
    slideHeight: 290,
    minimumSlidesToShow: 1.3,
    scrollSpeed: 200,
    keyScrollSpeed: 900,
    dragSpeed: 0.75,
};