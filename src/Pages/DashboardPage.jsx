import React, { useState } from "react";
import { sidebarConfig, Icon } from "../data/logindata"; // adjust path
import { users } from "../data/logindata"; // if needed

const DashboardContent = ({ title }) => (
  <div>
    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>
    <p className="text-gray-500 mt-2 text-sm md:text-base">
      {`Content for ${title} goes here.`}
    </p>
    <div className="mt-6 md:mt-8 bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm text-sm md:text-base">
      This is a placeholder page. The actual implementation would be here.
    </div>
  </div>
);

// --- Sidebar Component ---
const Sidebar = ({ currentUser, activePage, setActivePage, isOpen, onClose }) => {
  const navItems = sidebarConfig[currentUser.role] || [];
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-20 transition-opacity md:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-800 text-white z-30 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:z-0 flex flex-col`}
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <span className="text-2xl font-bold">ProvoHeal</span>
          {/* Close button on mobile */}
          <button
            className="md:hidden text-white hover:text-indigo-400"
            onClick={onClose}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-grow p-4 overflow-y-auto">
          <ul>
  {navItems.map((item) => (
    <li key={item} className="mb-1">
      <button
        onClick={() => {
          setActivePage(item);
          onClose(); // ✅ use onClose prop instead of setSidebarOpen
        }}
        className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium text-left ${
          activePage === item
            ? "bg-indigo-600 text-white"
            : "text-slate-400 hover:bg-slate-700 hover:text-white"
        }`}
      >
        <Icon name={item} size={20} />
        <span className="truncate">{item}</span>
      </button>
    </li>
  ))}
</ul>


        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="bg-slate-700 p-4 rounded-lg text-center">
            <h4 className="font-semibold text-sm md:text-base">Help Center</h4>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Get support or ask a question.
            </p>
            <button className="mt-3 w-full bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-lg text-xs md:text-sm font-semibold">
              Contact Us
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

// --- Dashboard Main Component ---
const DashboardPage = ({ currentUser, onLogout }) => {
  const initialPage = (sidebarConfig[currentUser.role] || [""])[0];
  const [activePage, setActivePage] = useState(initialPage);

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen font-sans bg-gray-100">
      <Sidebar
  currentUser={currentUser}
  activePage={activePage}
  setActivePage={setActivePage}
  isOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
/>


      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 md:p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Hamburger for mobile */}
            <button
              className="md:hidden text-gray-700 hover:text-indigo-600"
              onClick={() => setSidebarOpen(true)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-gray-700">
              Welcome back, {currentUser.name}
            </h1>
          </div>
          <button
            onClick={onLogout}
            className="text-sm md:text-base font-semibold text-slate-600 hover:text-indigo-600"
          >
            Log Out
          </button>
        </header>

        {/* Main content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <DashboardContent title={activePage} />
        </div>
      </main>
    </div>
  );
};


export { users, sidebarConfig, Icon }; // named exports
export default DashboardPage;