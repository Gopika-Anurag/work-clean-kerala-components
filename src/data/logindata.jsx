// --- SECTION 1: Shared Data (data.jsx) ---
import { 
  Home, Calendar, User, FileText, MessageSquare, ClipboardList,
  UserCircle, CalendarPlus, CalendarCheck, Video, CreditCard, Beaker, Bell,
  CalendarClock, Database, PenSquare, BarChart2, CalendarCog, UserPlus, LogIn,
  DollarSign, Users, Archive, Clipboard, ClipboardCheck, Landmark, TrendingUp,
  ScrollText, FileBarChart, Download, ShieldCheck
} from "lucide-react";

export const users = {
  Patient: { name: 'Richard Miller', role: 'Patient' },
  Doctor: { name: 'Dr. Evelyn Reed', role: 'Doctor' },
  Receptionist: { name: 'Carlos Santos', role: 'Receptionist' },
  OfficeStaff: { name: 'Aisha Khan', role: 'Office Staff' },
  AuditingStaff: { name: 'Ben Carter', role: 'Auditing Staff' },
};

export const sidebarConfig = {
  Patient: ['Profile & Medical History', 'Book Appointment', 'My Appointments', 'Online Consultation', 'Billing / Payments', 'Lab Reports', 'Reminders'],
  Doctor: ['Today’s Appointments', 'Patient Records', 'Prescription Writer', 'Video Consult', 'Analytics'],
  Receptionist: ['Appointment Management', 'Patient Registration', 'Check-In / Out', 'Payment Collection', 'Doctor Schedule Management'],
  'Office Staff': ['Inventory', 'Expense Management', 'Staff Attendance', 'Payroll'],
  'Auditing Staff': ['Finance Reports', 'Transaction Logs', 'Doctor Fee Reports', 'Data Export', 'Compliance Logs']
};

// Universal icon resolver
export const Icon = ({ name, ...props }) => {
  const icons = {
    'Overview': <Home {...props} />, 'Appointments': <Calendar {...props} />, 'Doctors': <User {...props} />, 
    'Reports': <FileText {...props} />, 'Messages': <MessageSquare {...props} />, 'Prescriptions': <ClipboardList {...props} />,
    'Profile & Medical History': <UserCircle {...props} />, 'Book Appointment': <CalendarPlus {...props} />, 
    'My Appointments': <CalendarCheck {...props} />, 'Online Consultation': <Video {...props} />,
    'Billing / Payments': <CreditCard {...props} />, 'Lab Reports': <Beaker {...props} />, 'Reminders': <Bell {...props} />,
    'Today’s Appointments': <CalendarClock {...props} />, 'Patient Records': <Database {...props} />,
    'Prescription Writer': <PenSquare {...props} />, 'Video Consult': <Video {...props} />, 'Analytics': <BarChart2 {...props} />,
    'Appointment Management': <CalendarCog {...props} />, 'Patient Registration': <UserPlus {...props} />,
    'Check-In / Out': <LogIn {...props} />, 'Payment Collection': <DollarSign {...props} />,
    'Doctor Schedule Management': <Users {...props} />, 'Inventory': <Archive {...props} />,
    'Expense Management': <Clipboard {...props} />, 'Staff Attendance': <ClipboardCheck {...props} />,
    'Payroll': <Landmark {...props} />, 'Finance Reports': <TrendingUp {...props} />,
    'Transaction Logs': <ScrollText {...props} />, 'Doctor Fee Reports': <FileBarChart {...props} />,
    'Data Export': <Download {...props} />, 'Compliance Logs': <ShieldCheck {...props} />,
  };
  return icons[name] || <Home {...props} />;
};
