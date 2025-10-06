import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

// Helper Icon Components to keep it self-contained
const Icon = ({ className }) => <i className={className}></i>;

// Chart Component for the small summary cards
const SummaryChart = ({ data, borderColor }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        const myChartRef = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(myChartRef, {
            type: 'line',
            data: {
                labels: Array(10).fill(''),
                datasets: [{
                    data: data,
                    borderColor: borderColor,
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0,
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { display: false } },
                elements: { line: { tension: 0.4 } },
                maintainAspectRatio: false,
                tooltips: { enabled: false }
            }
        });
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, borderColor]);

    return <canvas ref={chartRef} className="w-24 h-12" />;
};

// Chart component for the main patient visit statistics
const VisitorStatsChart = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        const myChartRef = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(myChartRef, {
            type: 'line',
            data: {
                labels: ['Jul 1', 'Jul 5', 'Jul 10', 'Jul 15', 'Jul 20', 'Jul 25', 'Jul 31'],
                datasets: [
                    {
                        label: 'Total Visitors',
                        data: [120, 190, 150, 250, 220, 300, 280],
                        borderColor: 'rgb(99, 102, 241)',
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                    },
                    {
                        label: 'Total Patients',
                        data: [80, 120, 100, 180, 160, 210, 200],
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', align: 'end', labels: { color: '#9CA3AF' } }
                },
                scales: {
                    x: { ticks: { color: '#9CA3AF' }, grid: { color: '#374151' } },
                    y: { ticks: { color: '#9CA3AF' }, grid: { color: '#374151' } }
                }
            }
        });
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return <canvas ref={chartRef}></canvas>;
};


// --- Data Page Components ---

const OverviewPage = () => {
    const chartData = [10, 20, 15, 30, 25, 40, 35, 50, 45, 60];
    const appointments = [
        { id: '#12345', date: 'Oct 06, 2025', name: 'John Doe', doctor: 'Dr. Emily Carter', room: 'Room 101', status: 'Completed', statusColor: 'green' },
        { id: '#12346', date: 'Oct 06, 2025', name: 'Jane Smith', doctor: 'Dr. Ben Hanson', room: 'Room 102', status: 'Pending', statusColor: 'yellow' },
        { id: '#12347', date: 'Oct 07, 2025', name: 'Mike Johnson', doctor: 'Dr. Emily Carter', room: 'Room 101', status: 'Confirmed', statusColor: 'blue' },
        { id: '#12348', date: 'Oct 07, 2025', name: 'Sarah Wilson', doctor: 'Dr. Sarah Lee', room: 'Room 103', status: 'Cancelled', statusColor: 'red' },
    ];

    const getStatusColorClasses = (color) => {
        switch(color) {
            case 'green': return 'bg-green-900 text-green-300';
            case 'yellow': return 'bg-yellow-900 text-yellow-300';
            case 'blue': return 'bg-blue-900 text-blue-300';
            case 'red': return 'bg-red-900 text-red-300';
            default: return 'bg-slate-700 text-slate-300';
        }
    }
    
    return (
        <div className="text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-800 p-6 rounded-lg">
                    <h3 className="text-slate-400">Total Patients</h3>
                    <div className="flex justify-between items-center">
                        <p className="text-3xl font-bold">2,420</p>
                        <SummaryChart data={chartData} borderColor="rgb(74, 222, 128)" />
                    </div>
                    <p className="text-sm text-green-400 mt-2"><Icon className="fas fa-arrow-up" /> 4.7% from last month</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg">
                    <h3 className="text-slate-400">New Appointments</h3>
                    <div className="flex justify-between items-center">
                        <p className="text-3xl font-bold">226</p>
                        <SummaryChart data={chartData.slice().reverse()} borderColor="rgb(248, 113, 113)" />
                    </div>
                    <p className="text-sm text-red-400 mt-2"><Icon className="fas fa-arrow-down" /> 10% from last month</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg">
                    <h3 className="text-slate-400">Pending Reports</h3>
                    <div className="flex justify-between items-center">
                        <p className="text-3xl font-bold">193</p>
                        <SummaryChart data={chartData} borderColor="rgb(74, 222, 128)" />
                    </div>
                    <p className="text-sm text-green-400 mt-2"><Icon className="fas fa-arrow-up" /> 2.5% from last month</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg h-80">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Patient Visit Statistics</h3>
                        <div className="text-sm text-slate-400">Last 30 days</div>
                    </div>
                    <VisitorStatsChart />
                </div>
                <div className="bg-slate-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Patient Conditions</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1"><span className="text-base font-medium text-blue-400">Low Back Pain</span><span className="text-sm font-medium text-blue-400">1060</span></div>
                            <div className="w-full bg-slate-700 rounded-full h-2.5"><div className="bg-blue-500 h-2.5 rounded-full" style={{width: '45%'}}></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1"><span className="text-base font-medium text-purple-400">Knee Osteoarthritis</span><span className="text-sm font-medium text-purple-400">3672</span></div>
                            <div className="w-full bg-slate-700 rounded-full h-2.5"><div className="bg-purple-500 h-2.5 rounded-full" style={{width: '72%'}}></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1"><span className="text-base font-medium text-green-400">Cervical Spondylosis</span><span className="text-sm font-medium text-green-400">1890</span></div>
                            <div className="w-full bg-slate-700 rounded-full h-2.5"><div className="bg-green-500 h-2.5 rounded-full" style={{width: '60%'}}></div></div>
                        </div>
                    </div>
                </div>
            </div>
            
             <div className="bg-slate-800 p-6 rounded-lg mt-6">
                <h3 className="text-lg font-semibold mb-4">Recent Patient Appointments</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 border-b border-slate-700">
                                <th className="py-2 px-2 hidden sm:table-cell">Serial Number</th>
                                <th className="py-2 px-2">Patient Name</th>
                                <th className="py-2 px-2 hidden md:table-cell">Assigned To Doctor</th>
                                <th className="py-2 px-2 hidden sm:table-cell">Date</th>
                                <th className="py-2 px-2">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {appointments.map((appt) => (
                                <tr key={appt.id}>
                                    <td className="py-3 px-2 hidden sm:table-cell">{appt.id}</td>
                                    <td className="py-3 px-2">{appt.name}</td>
                                    <td className="py-3 px-2 hidden md:table-cell">{appt.doctor}</td>
                                    <td className="py-3 px-2 hidden sm:table-cell">{appt.date}</td>
                                    <td className="py-3 px-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColorClasses(appt.statusColor)}`}>
                                            {appt.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const AppointmentsPage = () => (
    <div>
        <h2 className="text-2xl font-bold text-white mb-6">Appointments</h2>
        <div className="bg-slate-800 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h3 className="text-lg font-semibold mb-4 md:mb-0">Today's Schedule</h3>
                <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 w-full md:w-auto">
                    + New Appointment
                </button>
            </div>
            <p className="text-slate-400">
                Full calendar implementation would go here. Below is a list of upcoming appointments.
            </p>
            <div className="mt-6 space-y-4">
                <div className="bg-slate-700/50 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-4 sm:mb-0">
                        <p className="font-bold text-white">John Doe</p>
                        <p className="text-sm text-slate-400">10:00 AM - 10:45 AM</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-indigo-400">Dr. Emily Carter</span>
                        <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs">Confirmed</span>
                    </div>
                </div>
                 <div className="bg-slate-700/50 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-4 sm:mb-0">
                        <p className="font-bold text-white">Jane Smith</p>
                        <p className="text-sm text-slate-400">11:00 AM - 11:45 AM</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-indigo-400">Dr. Ben Hanson</span>
                        <span className="bg-yellow-900 text-yellow-300 px-2 py-1 rounded-full text-xs">Pending</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const PatientsPage = () => {
    const history = [
        { name: 'Brooklyn Simmons', email: 'olivia@untitledui.com', phone: '(480) 555-0103', date: '22 Jan 2022', doctor: 'DR. Savannah Nguyen', status: 'Completed' },
        { name: 'Cameron Williamson', email: 'olivia@untitledui.com', phone: '(316) 555-0116', date: '20 Jan 2022', doctor: 'DR. Savannah Nguyen', status: 'Completed' },
        { name: 'Brooklyn Simmons', email: 'olivia@untitledui.com', phone: '(808) 555-0111', date: '20 Jan 2022', doctor: 'DR. Savannah Nguyen', status: 'Appointed' },
        { name: 'Cameron Williamson', email: 'olivia@untitledui.com', phone: '(704) 555-0127', date: '20 Jan 2022', doctor: 'DR. Savannah Nguyen', status: 'Appointed' },
        { name: 'Darlene Robertson', email: 'olivia@untitledui.com', phone: '(406) 555-0120', date: '24 Jan 2022', doctor: 'DR. Savannah Nguyen', status: 'Waiting' },
        { name: 'Cameron Williamson', email: 'olivia@untitledui.com', phone: '(671) 555-0110', date: '26 Jan 2022', doctor: 'DR. Savannah Nguyen', status: 'Appointed' },
    ];
    
    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Appointed': return 'bg-blue-100 text-blue-800';
            case 'Waiting': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    return (
        <div className="text-slate-800">
            {/* Patient Info Card */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <img src="https://placehold.co/100x100/E2E8F0/475569?text=RR" alt="Ronald Richards" className="w-24 h-24 rounded-full flex-shrink-0" />
                    <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-2xl font-bold text-slate-900">Ronald Richards</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 mt-4 text-sm">
                            <div><span className="font-semibold">Email address:</span><br />michelle.rivera@example.com</div>
                            <div><span className="font-semibold">Phone number:</span><br />(451) 555-4759</div>
                            <div><span className="font-semibold">House location:</span><br />4517 Washington Ave. Manchester, Kentucky 39495</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                    <div>
                        <p className="text-slate-500">Total Completed Session</p>
                        <p className="text-2xl font-bold text-slate-900">120</p>
                    </div>
                    <Icon className="fas fa-check-circle text-green-500 text-2xl" />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                    <div>
                        <p className="text-slate-500">Upcoming Appointments</p>
                        <p className="text-2xl font-bold text-slate-900">02</p>
                    </div>
                    <Icon className="fas fa-calendar-alt text-blue-500 text-2xl" />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                    <div>
                        <p className="text-slate-500">Total Reports Available</p>
                        <p className="text-2xl font-bold text-slate-900">193</p>
                    </div>
                    <Icon className="fas fa-file-alt text-red-500 text-2xl" />
                </div>
            </div>

            {/* Patients History Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-bold text-slate-900">Patients History</h3>
                        <p className="text-sm text-slate-500">Keep track of patient data and others information.</p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-grow">
                            <input type="text" placeholder="Search order..." className="border rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-full" />
                            <Icon className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                        <button className="border rounded-md px-4 py-2 flex items-center gap-2 text-sm hover:bg-slate-50 flex-shrink-0"><Icon className="fas fa-filter" /> Filters</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-slate-500 font-semibold border-b">
                            <tr>
                                <th className="py-3 px-2">Patient Name</th>
                                <th className="py-3 px-2">Phone Number</th>
                                <th className="py-3 px-2">Appointment Date</th>
                                <th className="py-3 px-2">Appointment To Doctor</th>
                                <th className="py-3 px-2">Status</th>
                                <th className="py-3 px-2">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {history.map((item, index) => (
                                <tr key={index}>
                                    <td className="py-3 px-2">
                                        <div className="font-bold">{item.name}</div>
                                        <div className="text-slate-500">{item.email}</div>
                                    </td>
                                    <td className="py-3 px-2">{item.phone}</td>
                                    <td className="py-3 px-2">{item.date}</td>
                                    <td className="py-3 px-2">{item.doctor}</td>
                                    <td className="py-3 px-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-2"><button className="text-slate-500 hover:text-slate-800"><Icon className="fas fa-ellipsis-h" /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


const ReportsPage = () => (
    <div>
        <h2 className="text-2xl font-bold mb-6">Reports & Analytics</h2>
        <div className="bg-white p-6 rounded-lg shadow-md"><p className="text-slate-600">Detailed reports and analytics would be displayed here.</p></div>
    </div>
);

const MessagesPage = () => (
    <div>
        <h2 className="text-2xl font-bold mb-6">Messages</h2>
        <div className="bg-white p-6 rounded-lg shadow-md"><p className="text-slate-600">A messaging interface would be here.</p></div>
    </div>
);

const PrescriptionsPage = () => (
    <div>
        <h2 className="text-2xl font-bold mb-6">Exercise Prescriptions</h2>
        <div className="bg-white p-6 rounded-lg shadow-md"><p className="text-slate-600">This section would contain prescribed exercise plans for patients.</p></div>
    </div>
);

// --- Main Component Structure ---

const Sidebar = ({ isOpen, setActivePage, activePage }) => {
    const navItems = [
        { id: 'overview', icon: 'fa-chart-pie', label: 'Overview' },
        { id: 'appointments', icon: 'fa-calendar-alt', label: 'Appointments' },
        { id: 'patients', icon: 'fa-users', label: 'Patients' },
        { id: 'reports', icon: 'fa-file-alt', label: 'Reports' },
        { id: 'messages', icon: 'fa-envelope', label: 'Messages', badge: 5 },
        { id: 'prescriptions', icon: 'fa-prescription-bottle-alt', label: 'Prescriptions' },
    ];
    return (
        <aside className={`absolute inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out bg-slate-800 w-64 z-30 flex flex-col p-4 border-r border-slate-700 text-white`}>
            <div className="flex items-center mb-8 flex-shrink-0">
                 <svg className="h-8 w-auto text-indigo-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z"/></svg>
                <h1 className="text-xl font-bold ml-2">ProvoHeal</h1>
            </div>
            <nav className="flex-1 overflow-y-auto">
                <ul>
                    {navItems.map(item => (
                        <li key={item.id} className="mb-2">
                            <a href="#" onClick={(e) => { e.preventDefault(); setActivePage(item.id); }}
                               className={`flex items-center p-2 rounded-md transition-colors ${activePage === item.id ? 'bg-indigo-500 text-white' : 'hover:bg-slate-700 text-slate-300'}`}>
                                <Icon className={`fas ${item.icon} w-6 text-center`} />
                                <span className="ml-3">{item.label}</span>
                                {item.badge && <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{item.badge}</span>}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto flex-shrink-0">
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl mb-3 mx-auto"><Icon className="fas fa-question-circle" /></div>
                    <p className="font-semibold">Help Center</p>
                    <p className="text-sm text-slate-400 mt-1">Get support and help.</p>
                    <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">Go to Help</button>
                </div>
            </div>
        </aside>
    );
};

const MainContent = ({ activePage, onMenuClick }) => {
    const pageTitles = {
        overview: "Overview",
        appointments: "Appointments",
        patients: "Patient Informations",
        reports: "Reports",
        messages: "Messages",
        prescriptions: "Prescriptions"
    }
    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-100">
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                    <button onClick={onMenuClick} className="md:hidden p-2 mr-2 rounded-md hover:bg-slate-200">
                        <Icon className="fas fa-bars text-slate-600" />
                    </button>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{pageTitles[activePage]}</h2>
                        <p className="text-xs sm:text-sm text-slate-500">Track, manage and forecast your patient reports and data.</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <button className="hidden sm:block p-2 rounded-full hover:bg-slate-200"><Icon className="fas fa-comment-dots text-slate-500" /></button>
                    <button className="hidden sm:block p-2 rounded-full hover:bg-slate-200 ml-2"><Icon className="fas fa-bell text-slate-500" /></button>
                    <div className="w-10 h-10 rounded-full bg-gray-600 ml-4 flex-shrink-0">
                        <img src="https://placehold.co/40x40/A3BFFA/1E293B?text=P" alt="User" className="rounded-full" />
                    </div>
                </div>
            </header>
            
            {activePage === 'overview' && <OverviewPage />}
            {activePage === 'appointments' && <AppointmentsPage />}
            {activePage === 'patients' && <PatientsPage />}
            {activePage === 'reports' && <ReportsPage />}
            {activePage === 'messages' && <MessagesPage />}
            {activePage === 'prescriptions' && <PrescriptionsPage />}
        </main>
    );
};


// The main App component that ties everything together
export default function PatientComponent() {
    const [activePage, setActivePage] = useState('patients');
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(link);
        return () => {
            document.head.removeChild(link);
        };
    }, []);

    return (
        <div className="font-sans flex h-screen bg-gray-100 relative overflow-hidden">
             {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
            <Sidebar 
                isOpen={isSidebarOpen} 
                activePage={activePage} 
                setActivePage={(page) => {
                    setActivePage(page);
                    setSidebarOpen(false); // Close sidebar on navigation
                }} 
            />
            <MainContent 
                activePage={activePage} 
                onMenuClick={() => setSidebarOpen(true)} 
            />
        </div>
    );
}

