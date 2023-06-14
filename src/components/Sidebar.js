import React from 'react';

const Sidebar = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
                <div className="h-full py-6 px-4 bg-gray-800 text-gray-100">
                    {/* Sidebar content goes here */}
                </div>
            </div>

            {/* Main content area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <header className="w-full h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200">
                    {/* Header content goes here */}
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Main content goes here */}
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Sidebar;