const ChromeWebStoreSVG = () => (
    <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
        <rect width="80" height="80" rx="18" fill="#FFFFFF" />
        <rect x="8" y="30" width="20" height="35" rx="5" fill="#2E7D32" />
        <rect x="50" y="10" width="20" height="30" rx="5" fill="#1565C0" />
        <rect x="25" y="50" width="40" height="20" rx="5" fill="#F9A825" />
        <rect x="25" y="10" width="20" height="20" rx="5" fill="#EF6C00" />
    </svg>
);

const AiInActionSVG = () => (
    <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#FFFFFF" />
        <rect x="20" y="30" width="40" height="24" rx="6" fill="#2196F3" />
        <rect x="48" y="38" width="10" height="4" rx="2" fill="#EF6C00" />
        <rect x="30" y="38" width="8" height="4" rx="2" fill="#43A047" />
    </svg>
);

const LighthouseSVG = () => (
    <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" fill="#FFFFFF" />
        <rect x="37" y="25" width="6" height="25" rx="2" fill="#FF7043" />
        <rect x="33" y="50" width="14" height="10" rx="3" fill="#FFD600" />
        <circle cx="40" cy="27" r="5" fill="#1976D2" />
    </svg>
);

// --- CATEGORY MAP (New Data Structure) ---
// Defines colors for all possible tags (Categories and Subcategories)
export const categoryMap = {
    // Primary Categories
    "Blog": { color: "#E0F7FA", textColor: "#00838F" },
    "AI & Machine Learning": { color: "#C8E6C9", textColor: "#2E7D32" },
    "Performance": { color: "#F0F4C3", textColor: "#9E9D24" },
    "Development": { color: "#FFECB3", textColor: "#FF8F00" },

    // Subcategories (Mapped from old tags)
    "JavaScript": { color: "#FFF9C4", textColor: "#FBC02D" },
    "Chrome": { color: "#BBDEFB", textColor: "#1976D2" },
    "Chrome Extensions": { color: "#E1BEE7", textColor: "#8E24AA" },
    "Insights Audits": { color: "#FFCDD2", textColor: "#C62828" },
    "News": { color: "#CFD8DC", textColor: "#455A64" },
};

// --- Blog Data (Updated to use Categories and Subcategories) ---

export const blogData = [
    {
        id: 1,
        headerText: "New Chrome Web Store API",
        title: "Introducing a new Chrome Web Store API",
        description: "We're launching a new version of the Chrome Web Store API.",
        categories: ["Blog", "Development"],
        subCategories: ["JavaScript", "Chrome", "Chrome Extensions"],
        author: "Oliver Dunk",
        date: "October 15, 2025",
        svg: <ChromeWebStoreSVG />,
        headerBG: "linear-gradient(90deg, #FFFFFF 65%, #FFFFFF 100%)", 
        cardType: "chrome", // Mapped to Vibrant Blue
    },
    {
        id: 2,
        headerText: "Highlights from our AI in Action workshop",
        title: "Highlights from our AI in Action workshop",
        description:
            "In partnership with startups in NYC, we demonstrated how built-in AI APIs can be integrated into products for better speed, privacy, and user experience.",
        categories: ["AI & Machine Learning", "Blog"],
        subCategories: ["Chrome"],
        author: "Damani Brown and Melissa Mitchell",
        date: "October 14, 2025",
        svg: <AiInActionSVG />,
        headerBG: "linear-gradient(90deg, #FFFFFF 65%, #FFFFFF 100%)",
        cardType: "ai", // Mapped to Vibrant Green
    },
    {
        id: 3,
        headerText: "What's new in Lighthouse 13",
        title: "What's new in Lighthouse 13",
        description: "Lighthouse 13 is here with the move to Insights audits.",
        categories: ["Blog", "Performance", "News"],
        subCategories: ["Chrome", "Insights Audits"],
        author: "Barry Pollard and Connor Clark",
        date: "October 10, 2025",
        svg: <LighthouseSVG />,
        headerBG: "linear-gradient(90deg, #FFFFFF 65%, #FFFFFF 100%)",
        cardType: "lighthouse", // Mapped to Vibrant Yellow/Orange
    },
    {
        id: 4,
        headerText: "New Chrome Web Store API",
        title: "Introducing a new Chrome Web Store API",
        description: "We're launching a new version of the Chrome Web Store API.",
        categories: ["Blog", "Development"],
        subCategories: ["JavaScript", "Chrome", "Chrome Extensions"],
        author: "Oliver Dunk",
        date: "October 15, 2025",
        svg: <ChromeWebStoreSVG />,
        headerBG: "linear-gradient(90deg, #FFFFFF 65%, #FFFFFF 100%)", 
        cardType: "chrome", // Mapped to Vibrant Blue
    },
    {
        id: 5,
        headerText: "Highlights from our AI in Action workshop",
        title: "Highlights from our AI in Action workshop",
        description:
            "In partnership with startups in NYC, we demonstrated how built-in AI APIs can be integrated into products for better speed, privacy, and user experience.",
        categories: ["AI & Machine Learning", "Blog"],
        subCategories: ["Chrome"],
        author: "Damani Brown and Melissa Mitchell",
        date: "October 14, 2025",
        svg: <AiInActionSVG />,
        headerBG: "linear-gradient(90deg, #FFFFFF 65%, #FFFFFF 100%)",
        cardType: "ai", // Mapped to Vibrant Green
    },
    {
        id: 6,
        headerText: "What's new in Lighthouse 13",
        title: "What's new in Lighthouse 13",
        description: "Lighthouse 13 is here with the move to Insights audits.",
        categories: ["Blog", "Performance", "News"],
        subCategories: ["Chrome", "Insights Audits"],
        author: "Barry Pollard and Connor Clark",
        date: "October 10, 2025",
        svg: <LighthouseSVG />,
        headerBG: "linear-gradient(90deg, #FFFFFF 65%, #FFFFFF 100%)",
        cardType: "lighthouse", // Mapped to Vibrant Yellow/Orange
    },
];