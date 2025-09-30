import React, { useEffect, useState } from 'react';
import { faqData } from '../data/faqpopup';

const FaqPopup = () => {
    const [openAccordion, setOpenAccordion] = useState(null);
    const [openSubAccordion, setOpenSubAccordion] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', content: '' });

    const [currentPage, setCurrentPage] = useState('faq'); // 'faq' or 'detail'
    const [pageContent, setPageContent] = useState({ title: '', content: '' });

    useEffect(() => {
        // Prevent body from scrolling when the detail page is open
        if (currentPage === 'detail') {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        // Cleanup function to reset the style when the component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [currentPage]);


    const handleAccordionClick = (id) => {
        setOpenAccordion(openAccordion === id ? null : id);
        setOpenSubAccordion(null); 
    };
    
    const handleSubAccordionClick = (id) => {
        setOpenSubAccordion(openSubAccordion === id ? null : id);
    };

    const handleLinkClick = (e, link) => {
        e.preventDefault();
        const content = link.content || 'Detailed information for this topic is not available yet.';
        if (link.type === 'popup') {
            setModalContent({ title: link.text, content: content });
            setIsModalOpen(true);
        } else { // Defaults to 'page'
            setPageContent({ title: link.text, content: content });
            setCurrentPage('detail');
        }
    };

    const closeModal = () => setIsModalOpen(false);

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
                        <svg className={`w-5 h-5 text-gray-500 transform transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </div>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <div className="px-6 pb-6 pt-2 space-y-2">
                        {item.subheadings.map((subheading) => {
                            const isSubOpen = openSubAccordion === subheading.id;
                            return (
                                <div key={subheading.id} className="border-t border-gray-100">
                                    <button onClick={() => handleSubAccordionClick(subheading.id)} className="w-full flex justify-between items-center text-left py-4">
                                         <h4 className="font-semibold text-gray-700">{subheading.title}</h4>
                                         <svg className={`w-5 h-5 text-gray-500 transform transition-transform duration-500 ${isSubOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" ><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${ isSubOpen ? 'max-h-96' : 'max-h-0'}`}>
                                        <div className="pb-4 space-y-3">
                                            {subheading.links.map((link, index) => (
                                                <a key={index} href={link.href} onClick={(e) => handleLinkClick(e, link)} className="flex items-center text-gray-600 hover:text-pink-500 group">
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

    const Modal = ({ isOpen, onClose, title, children }) => {
        if (!isOpen) return null;
        return (
            <div className="fixed inset-0 z-50 flex justify-center items-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>
                <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-lg w-full relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                    <div className="flex justify-between items-center mb-4 border-b pb-3">
                        <h2 id="modal-title" className="text-xl font-bold text-gray-800">{title}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-800 text-3xl">&times;</button>
                    </div>
                    <div className="text-gray-600">{children}</div>
                </div>
            </div>
        );
    };
    
    const DetailPage = () => (
        <div className="fixed inset-0 z-40 bg-gray-50 overflow-y-auto animate-fade-in-scale">
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                    <button onClick={() => setCurrentPage('faq')} className="mb-8 flex items-center text-pink-500 font-semibold hover:underline">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Back to FAQ
                    </button>
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <h1 className="text-3xl font-bold mb-4">{pageContent.title}</h1>
                        <p className="text-gray-700 leading-relaxed">{pageContent.content}</p>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const FaqPage = () => (
        <>
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Frequently asked questions
                </h1>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 max-w-6xl mx-auto">
                <div className="space-y-4">{leftColumnData.map((item) => <AccordionItem key={item.id} item={item} />)}</div>
                <div className="space-y-4">{rightColumnData.map((item) => <AccordionItem key={item.id} item={item} />)}</div>
            </main>
            
            <footer className="text-center mt-16">
                <p className="text-gray-600">Can't find the answer you're looking for?</p>
                <a href="#" className="mt-2 inline-block text-pink-500 font-semibold hover:underline">
                    Contact our support team
                </a>
            </footer>
        </>
    );

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
             <style>{`
                @keyframes fade-in-scale { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in-scale { animation: fade-in-scale 0.3s ease-out forwards; }
            `}</style>
            <div className="container mx-auto px-4 py-12 md:py-20">
                <FaqPage />
            </div>

            {currentPage === 'detail' && <DetailPage />}
            
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalContent.title}>
                <p>{modalContent.content}</p>
            </Modal>
        </div>
    );
};

export default FaqPopup;