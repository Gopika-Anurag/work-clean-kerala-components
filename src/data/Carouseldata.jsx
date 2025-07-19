// Carouseldata.jsx
// NOTE: Make sure these image URLs are publicly accessible on your server or hosting service.

export const activitiesAtGlanceSettings = {
  slideWidth: 500,
  slideHeight: 250,
  minimumSlidesToShow: 2.6,
  scrollSpeed: 1,
  dragSpeed: 2,
  touchpadScrollSpeed: 0.25,     // Keep this high for smooth 2-finger scroll
  wheelScrollMultiplier: 1,  // Controls scroll sensitivity
  mouseScrollSpeed: 0.3        // 🔧 REDUCE this to slow mouse wheel scrolling
};

export const activitiesAtGlance = [
  {
    type: "chart",
    bgColor: "#E6F4EA",
    topRightText: "Activity Stats",
    topRightDotColor: "#2563EB",
    topRightTextColor: "#1e3a8a",
    items: [
          {
        year: "2023–2024",
        value: 30,
        color: "#EF4444"
      },
      {
        year: "2024–2025",
        value: 50,
        color: "#10B981"
      },
      {
        year: "2025–2026",
        value: 100,
        color: "#3B82F6"
      }
    ]
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
    minimumSlidesToShow: 3.8, 
    scrollSpeed: 0.2, 
    dragSpeed: 1,
    wheelScrollSpeed: 0.1, 
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
    {
        title: "Segregated Plastic Collection",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_00_44-AM.png", // Direct URL
        bgColor: "#F0FFF0",
        titleColor: "#FFFFFF",
        textPosition: "top", // IMPORTANT: Add this property. "top" or "bottom"
    },
    {
        title: "E-Waste Management",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_10_06-AM.png", // Direct URL
        bgColor: "#FFF3E0",
        titleColor: "#FFFFFF",
        textPosition: "bottom", // IMPORTANT: Add this property. "top" or "bottom"
    },
    {
        title: "Glass Waste Collection",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_10_06-AM.png", // Direct URL
        bgColor: "#F0F8FF",
        titleColor: "#FFFFFF",
        textPosition: "top", // IMPORTANT: Add this property. "top" or "bottom"
    },
    {
        title: "Organic Waste Composting",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_00_44-AM.png", // Direct URL
        bgColor: "#FFF8E1",
        titleColor: "#FFFFFF",
        textPosition: "bottom", // IMPORTANT: Add this property. "top" or "bottom"
    },
    {
        title: "Awareness & Education Drives",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_12_54-AM.png", // Direct URL
        bgColor: "#F3E5F5",
        titleColor: "#FFFFFF",
        textPosition: "top", // IMPORTANT: Add this property. "top" or "bottom"
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
    dragSpeed: 2.5,
    touchpadScrollSpeed: .5,  // 💨 Increase this for faster two-finger scroll
    wheelScrollSpeed: 4 
};




export const aboutUsData = {
  title: "About Us",
  description : `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl lacinia mi, nec iaculis nunc nisl sit amet lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
  `.repeat(25)
};



export const aboutUsDatabg = {
  title: "About Us",
  image: "https://static.vecteezy.com/system/resources/thumbnails/053/730/005/small_2x/serene-spring-valley-misty-meadow-lush-green-trees-mountain-landscape-photo.jpeg",
  description : `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl lacinia mi, nec iaculis nunc nisl sit amet lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
  `.repeat(15)
};





export const carouselData = {
  image: "https://static.vecteezy.com/system/resources/thumbnails/049/139/500/small_2x/serene-rainforest-scene-with-lush-green-foliage-and-gentle-rainfall-natural-background-for-relaxation-photo.jpg",
};

export const aboutUsHomepage = {
    mainTitle: "ABOUT US",
  title: "Committed to a Cleaner, Greener Korea",
  description:"Creating a sustainable environment is essential. Our recycling and waste management programs are designed to reduce pollution and encourage eco-friendly practicesCreating a sustainable environment is essential.",

//   description : `
//   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl lacinia mi, nec iaculis nunc nisl sit amet lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
//   `.repeat(20)
};


export const aboutUsHomepagemore = {
    mainTitle: "ABOUT US",
  title: "Committed to a Cleaner, Greener Korea",
  description : `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl lacinia mi, nec iaculis nunc nisl sit amet lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
  `.repeat(15),
    // description:" Creating a sustainable environment is essential. Our recycling and waste management programs are designed to reduce pollution and encourage eco-friendly practicesCreating a sustainable environment is essential.",

};