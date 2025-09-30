import React, { useState } from 'react';
import { faqData } from '../data/faqData';

const FaqComponent = () => {
    const [openAccordion, setOpenAccordion] = useState(null);
    const [openSubAccordion, setOpenSubAccordion] = useState(null);

    const handleAccordionClick = (id) => {
        setOpenAccordion(openAccordion === id ? null : id);
        setOpenSubAccordion(null); // Close sub-accordion when main one changes
    };
    
    const handleSubAccordionClick = (id) => {
        setOpenSubAccordion(openSubAccordion === id ? null : id);
    };

    // Split data for two-column layout
    const midpoint = Math.ceil(faqData.length / 2);
    const leftColumnData = faqData.slice(0, midpoint);
    const rightColumnData = faqData.slice(midpoint);

    const AccordionItem = ({ item }) => {
        const isOpen = openAccordion === item.id;
        return (
            <div key={item.id} className="bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                <button
                    onClick={() => handleAccordionClick(item.id)}
                    className="w-full flex justify-between items-start text-left p-6"
                >
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 mt-1">
                            <img src={item.icon} alt={`${item.title} icon`} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>
                        </div>
                    </div>
                    <div className="flex-shrink-0 ml-4 mt-1">
                        <svg
                            className={`w-5 h-5 text-gray-500 transform transition-transform duration-500 ${
                                isOpen ? 'rotate-180' : ''
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </button>
                <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isOpen ? 'max-h-[1000px]' : 'max-h-0' // Increased max-h for nested content
                    }`}
                >
                    <div className="px-6 pb-6 pt-2 space-y-2">
                        {item.subheadings.map((subheading) => {
                            const isSubOpen = openSubAccordion === subheading.id;
                            return (
                                <div key={subheading.id} className="border-t border-gray-100">
                                    <button onClick={() => handleSubAccordionClick(subheading.id)} className="w-full flex justify-between items-center text-left py-4">
                                         <h4 className="font-semibold text-gray-700">{subheading.title}</h4>
                                         <svg
                                            className={`w-5 h-5 text-gray-500 transform transition-transform duration-500 ${
                                                isSubOpen ? 'rotate-180' : ''
                                            }`}
                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${ isSubOpen ? 'max-h-96' : 'max-h-0'}`}>
                                        <div className="pb-4 space-y-3">
                                            {subheading.links.map((link, index) => (
                                                <a key={index} href={link.href} className="flex items-center text-gray-600 hover:text-pink-500 group">
                                                    <span>{link.text}</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Frequently asked questions
                    </h1>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 max-w-6xl mx-auto">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {leftColumnData.map((item) => <AccordionItem key={item.id} item={item} />)}
                    </div>
                    {/* Right Column */}
                    <div className="space-y-4">
                        {rightColumnData.map((item) => <AccordionItem key={item.id} item={item} />)}
                    </div>
                </main>
                
                <footer className="text-center mt-16">
                    <p className="text-gray-600">Can't find the answer you're looking for?</p>
                    <a href="#" className="mt-2 inline-block text-pink-500 font-semibold hover:underline">
                        Contact our support team
                    </a>
                </footer>
            </div>
        </div>
    );
};

export default FaqComponent;
