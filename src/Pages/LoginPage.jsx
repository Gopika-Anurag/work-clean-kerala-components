// src/components/LoginPage.jsx
import React from "react";
import { users, sidebarConfig, Icon } from "../Pages/DashboardPage";

const LoginPage = ({ onLogin }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
    <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center">
        ProvoHeal Dashboard
      </h1>
      <p className="text-sm sm:text-base text-slate-500 mt-2 mb-6 text-center">
        Please select a role to log in
      </p>

      <div className="flex flex-col space-y-3">
        {Object.values(users).map((user) => {
          const firstItem = sidebarConfig[user.role][0];
          return (
            <button
              key={user.role}
              onClick={() => onLogin(user)}
              className="w-full flex items-center gap-3 sm:gap-4 text-left bg-slate-50 font-bold py-3 px-3 sm:px-4 rounded-lg hover:bg-indigo-100 transition-all duration-200 border border-slate-200"
            >
              <div className="bg-white p-2 rounded-md border border-slate-200 flex-shrink-0">
                <Icon name={firstItem} size={24} className="text-indigo-600" />
              </div>
              <div>
                <span className="text-slate-800 text-sm sm:text-base">
                  Log In as {user.role}
                </span>
                <p className="text-xs sm:text-sm font-normal text-slate-500">
                  {user.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

export default LoginPage;
