export const healthcareData = {
    "blockId": "hospital-carousel-1",
    "caption": "Our Network",
    "captionFontSize": 18,
    "captionLineHeight": 1.2,
    "captionPadding": { "top": 0, "right": 20, "bottom": 12, "left": 20 },
    "captionAlign": "center",
    "captionBold": false,
    "captionItalics": false,
    "captionUnderline": false,
    "captionColor": "#6B7280", // Gray-500
    "titleOne": "Leading Healthcare Providers",
    "titleTwo": "Across Kerala",
    "titleFontSize": 38,
    "titleLineHeight": 1.3,
    "titlePadding": { "top": 0, "right": 20, "bottom": 48, "left": 20 }, // Increased bottom padding
    "titleAlign": "center",
    "titleBold": true,
    "titleItalics": false,
    "titleUnderline": false,
    "titleColor": "#111827", // Gray-900
    "backgroundColor": "#F9FAFB", // Light background
    "padding": { "top": 64, "right": 0, "bottom": 64, "left": 0 },
    "mobilePadding": { "top": 32, "right": 0, "bottom": 32, "left": 0 },
    "slideGap": 24, // Gap between slides
    "minSlidesToShow": 1.1, // Show a bit more than one slide to hint at more content
    
    // NEW & MODIFIED SLIDE-SPECIFIC ATTRIBUTES
    "slideWidth": 320, // Adjusted width to match the visual
    "slideImageHeight": 160, // Height for the image section
    "slideBackgroundColor": "#FFFFFF",
    "slideBorderRadius": {
        "topLeft": 16,
        "topRight": 16,
        "bottomRight": 16,
        "bottomLeft": 16
    },
    "slideContentPadding": { "top": 24, "right": 24, "bottom": 24, "left": 24 }, // Padding around content INSIDE the card
    "slideContentGap": 16, // Gap between main content blocks (image, title block, link block)
    "slideTextContentGap": 8, // Gap specifically between address lines and phone
    
    // NEW ATTRIBUTES FOR MODERN AESTHETICS/INTERACTIVITY
    "slideBoxShadow": "0 6px 16px rgba(0, 0, 0, 0.08)", // Subtle initial shadow
    "slideHoverBoxShadow": "0 12px 30px rgba(0, 0, 0, 0.15)", // Deeper shadow on hover
    "slideHoverScale": 1.03, // Slight zoom effect on hover (1.03 = 3% increase)
    "slideImageOverlayColor": "rgba(0, 0, 0, 0.05)", // Very subtle dark overlay on image
    
    "slideTitleColor": "#1F2937", // Gray-800
    "slideTitleFontSize": 22,
    "slideTitleLineHeight": 1.3,
    "slideTitleBold": true,

    "slideAddressColor": "#4B5563", // Gray-600
    "slideAddressFontSize": 16,
    "slideAddressLineHeight": 1.5,
    "slideAddressBold": false,

    "slidePhoneColor": "#1F2937", // Gray-800
    "slidePhoneFontSize": 18,
    "slidePhoneLineHeight": 1.5,
    "slidePhoneBold": true,

    "slideLinkColor": "#A020F0", // Purple-like
    "slideLinkHoverColor": "#8B008B", // Darker purple on hover
    "slideLinkFontSize": 16,
    "slideLinkBold": true,

    "scrollSpeed": 0.5, // Retaining this in attributes, but disabling auto-scroll for now
    "reviewedEntityType": "Hospital", // Updated for hospital
    "reviewedEntityName": "Caritas Matha Hospital", // Updated
    
    // NEW: User-facing option to enable/disable auto-scroll
    "enableAutoScroll": false,

    "slides": [
        {
            "image": "https://thumbs.dreamstime.com/b/hospital-building-modern-parking-lot-59693686.jpg", // Example image URL
            "imgAlt": "Caritas Matha Hospital building",
            "title": "Caritas Matha Hospital",
            "addressLine1": "MC Road, Thellakom (P.O),",
            "addressLine2": "Kottayam, Kerala – 686630",
            "phone": "0481 2792500",
            "link": "https://www.caritasindia.org/", // Example link
            "linkText": "Know More",
            "rating": 4.8 
        },
        {
            "image": "https://thumbs.dreamstime.com/b/hospital-building-modern-parking-lot-59693686.jpg",
            "imgAlt": "Medical Trust Hospital building",
            "title": "Medical Trust Hospital",
            "addressLine1": "M.G. Road, Near Shenoys,",
            "addressLine2": "Kochi, Kerala – 682016",
            "phone": "0484 2358000",
            "link": "https://www.medicaltrusthospital.org/",
            "linkText": "Know More",
            "rating": 4.7
        },
        {
            "image": "https://thumbs.dreamstime.com/b/hospital-building-modern-parking-lot-59693686.jpg",
            "imgAlt": "Aster Medcity Hospital building",
            "title": "Aster Medcity",
            "addressLine1": "Cheranalloor, South Chittoor,",
            "addressLine2": "Kochi, Kerala – 682021",
            "phone": "0484 6699999",
            "link": "https://www.astermedcity.com/",
            "linkText": "Know More",
            "rating": 4.9
        },
        {
            "image": "https://thumbs.dreamstime.com/b/hospital-building-modern-parking-lot-59693686.jpg",
            "imgAlt": "Lisie Hospital building",
            "title": "Lisie Hospital",
            "addressLine1": "Hospital Road, Ernakulam North,",
            "addressLine2": "Kochi, Kerala – 682018",
            "phone": "0484 2750000",
            "link": "https://lisiehospital.org/",
            "linkText": "Know More",
            "rating": 4.6
        },
        {
            "image": "https://thumbs.dreamstime.com/b/hospital-building-modern-parking-lot-59693686.jpg",
            "imgAlt": "Amrita Hospital building",
            "title": "Amrita Hospital",
            "addressLine1": "Ponekkara, Edappally,",
            "addressLine2": "Kochi, Kerala – 682041",
            "phone": "0484 2858000",
            "link": "https://www.amritahospitals.org/kochi",
            "linkText": "Know More",
            "rating": 4.8
        },
        {
            "image": "https://thumbs.dreamstime.com/b/hospital-building-modern-parking-lot-59693686.jpg", // Example image URL
            "imgAlt": "Caritas Matha Hospital building",
            "title": "Caritas Matha Hospital",
            "addressLine1": "MC Road, Thellakom (P.O),",
            "addressLine2": "Kottayam, Kerala – 686630",
            "phone": "0481 2792500",
            "link": "https://www.caritasindia.org/", // Example link
            "linkText": "Know More",
            "rating": 4.8 
        },
        {
            "image": "https://thumbs.dreamstime.com/b/hospital-building-modern-parking-lot-59693686.jpg",
            "imgAlt": "Medical Trust Hospital building",
            "title": "Medical Trust Hospital",
            "addressLine1": "M.G. Road, Near Shenoys,",
            "addressLine2": "Kochi, Kerala – 682016",
            "phone": "0484 2358000",
            "link": "https://www.medicaltrusthospital.org/",
            "linkText": "Know More",
            "rating": 4.7
        },
        {
            "image": "https://thumbs.dreamstime.com/b/hospital-building-modern-parking-lot-59693686.jpg",
            "imgAlt": "Aster Medcity Hospital building",
            "title": "Aster Medcity",
            "addressLine1": "Cheranalloor, South Chittoor,",
            "addressLine2": "Kochi, Kerala – 682021",
            "phone": "0484 6699999",
            "link": "https://www.astermedcity.com/",
            "linkText": "Know More",
            "rating": 4.9
        },
        {
            "image": "https://thumbs.dreamstime.com/b/hospital-building-modern-parking-lot-59693686.jpg",
            "imgAlt": "Lisie Hospital building",
            "title": "Lisie Hospital",
            "addressLine1": "Hospital Road, Ernakulam North,",
            "addressLine2": "Kochi, Kerala – 682018",
            "phone": "0484 2750000",
            "link": "https://lisiehospital.org/",
            "linkText": "Know More",
            "rating": 4.6
        },
        {
            "image": "https://thumbs.dreamstime.com/b/hospital-building-modern-parking-lot-59693686.jpg",
            "imgAlt": "Amrita Hospital building",
            "title": "Amrita Hospital",
            "addressLine1": "Ponekkara, Edappally,",
            "addressLine2": "Kochi, Kerala – 682041",
            "phone": "0484 2858000",
            "link": "https://www.amritahospitals.org/kochi",
            "linkText": "Know More",
            "rating": 4.8
        },
    ]
};

