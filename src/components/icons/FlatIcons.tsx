import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
  size?: number;
}

// Navigation Icons
export function HomeIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15V15C15 14.4477 14.5523 14 14 14H10C9.44772 14 9 14.4477 9 15V21H4C3.44772 21 3 20.5523 3 20V10.5Z" fill="#5B8DEF"/>
      <path d="M9 21V15C9 14.4477 9.44772 14 10 14H14C14.5523 14 15 14.4477 15 15V21H9Z" fill="#FFD166"/>
      <path d="M12 3L21 10.5V12H3V10.5L12 3Z" fill="#EF6C6C"/>
    </svg>
  );
}

export function AnalyticsIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="12" width="4" height="9" rx="1" fill="#5B8DEF"/>
      <rect x="10" y="8" width="4" height="13" rx="1" fill="#6FCF97"/>
      <rect x="17" y="4" width="4" height="17" rx="1" fill="#F2994A"/>
    </svg>
  );
}

export function CalendarManageIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" fill="#9B51E0"/>
      <rect x="3" y="5" width="18" height="4" rx="1" fill="#6FCF97"/>
      <rect x="6" y="12" width="3" height="3" rx="0.5" fill="#FFD166"/>
      <rect x="10.5" y="12" width="3" height="3" rx="0.5" fill="#FFD166"/>
      <rect x="15" y="12" width="3" height="3" rx="0.5" fill="#FFD166"/>
      <rect x="6" y="16" width="3" height="2" rx="0.5" fill="white" fillOpacity="0.5"/>
      <rect x="10.5" y="16" width="3" height="2" rx="0.5" fill="white" fillOpacity="0.5"/>
      <circle cx="7" cy="5" r="1.5" fill="white"/>
      <circle cx="17" cy="5" r="1.5" fill="white"/>
    </svg>
  );
}

export function ProfileIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="4" fill="#5B8DEF"/>
      <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V21H4V20Z" fill="#6FCF97"/>
    </svg>
  );
}

export function HistoryIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" fill="#5B8DEF"/>
      <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="2" fill="#FFD166"/>
    </svg>
  );
}

// Dashboard Stat Icons
export function UsersIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="9" cy="7" r="3" fill="#5B8DEF"/>
      <circle cx="16" cy="8" r="2.5" fill="#9B51E0"/>
      <path d="M2 18C2 15.2386 4.23858 13 7 13H11C13.7614 13 16 15.2386 16 18V19H2V18Z" fill="#5B8DEF"/>
      <path d="M14 19V17.5C14 16.0287 14.8407 14.7494 16.0645 14.1332C16.7159 14.545 17.4823 14.7857 18.3077 14.7857C19.4497 14.7857 20.4783 14.3251 21.2308 13.5874C22.3027 14.1932 23 15.3316 23 16.6429V19H14Z" fill="#9B51E0"/>
    </svg>
  );
}

export function PresentIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="#6FCF97"/>
      <path d="M8 12L11 15L17 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function LateIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="#F2994A"/>
      <path d="M12 6V12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="1.5" fill="white"/>
    </svg>
  );
}

export function AbsentIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="#EB5757"/>
      <path d="M8 8L16 16M16 8L8 16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

// Feature Icons
export function BookIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 4C4 3.44772 4.44772 3 5 3H11V21H5C4.44772 21 4 20.5523 4 20V4Z" fill="#5B8DEF"/>
      <path d="M13 3H19C19.5523 3 20 3.44772 20 4V20C20 20.5523 19.5523 21 19 21H13V3Z" fill="#9B51E0"/>
      <rect x="6" y="6" width="3" height="1.5" rx="0.5" fill="white" fillOpacity="0.7"/>
      <rect x="6" y="9" width="4" height="1.5" rx="0.5" fill="white" fillOpacity="0.5"/>
      <rect x="15" y="6" width="3" height="1.5" rx="0.5" fill="white" fillOpacity="0.7"/>
      <rect x="15" y="9" width="4" height="1.5" rx="0.5" fill="white" fillOpacity="0.5"/>
    </svg>
  );
}

export function DocumentIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 3C5.44772 3 5 3.44772 5 4V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V8L14 3H6Z" fill="#F2994A"/>
      <path d="M14 3V7C14 7.55228 14.4477 8 15 8H19L14 3Z" fill="#FFD166"/>
      <rect x="7" y="11" width="8" height="1.5" rx="0.5" fill="white" fillOpacity="0.7"/>
      <rect x="7" y="14" width="10" height="1.5" rx="0.5" fill="white" fillOpacity="0.5"/>
      <rect x="7" y="17" width="6" height="1.5" rx="0.5" fill="white" fillOpacity="0.5"/>
    </svg>
  );
}

export function LibraryIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="5" width="5" height="16" rx="1" fill="#6FCF97"/>
      <rect x="8" y="3" width="5" height="18" rx="1" fill="#5B8DEF"/>
      <rect x="14" y="6" width="5" height="15" rx="1" fill="#9B51E0"/>
      <rect x="20" y="8" width="2" height="13" rx="0.5" fill="#F2994A"/>
    </svg>
  );
}

export function BellIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3C8.68629 3 6 5.68629 6 9V14L4 17H20L18 14V9C18 5.68629 15.3137 3 12 3Z" fill="#EB5757"/>
      <path d="M10 20C10 21.1046 10.8954 22 12 22C13.1046 22 14 21.1046 14 20H10Z" fill="#FFD166"/>
      <circle cx="17" cy="5" r="3" fill="#5B8DEF"/>
    </svg>
  );
}

export function ClipboardIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="5" y="4" width="14" height="17" rx="2" fill="#56CCF2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" fill="#9B51E0"/>
      <rect x="7" y="9" width="6" height="1.5" rx="0.5" fill="white" fillOpacity="0.7"/>
      <rect x="7" y="12" width="10" height="1.5" rx="0.5" fill="white" fillOpacity="0.5"/>
      <rect x="7" y="15" width="8" height="1.5" rx="0.5" fill="white" fillOpacity="0.5"/>
      <circle cx="16" cy="17" r="4" fill="#6FCF97"/>
      <path d="M14.5 17L15.5 18L17.5 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function StudentListIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2" fill="#5B8DEF"/>
      <circle cx="8" cy="9" r="2" fill="#FFD166"/>
      <circle cx="8" cy="15" r="2" fill="#6FCF97"/>
      <rect x="12" y="8" width="6" height="2" rx="0.5" fill="white" fillOpacity="0.7"/>
      <rect x="12" y="14" width="6" height="2" rx="0.5" fill="white" fillOpacity="0.7"/>
    </svg>
  );
}

export function ScheduleIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" fill="#9B51E0"/>
      <rect x="3" y="5" width="18" height="4" fill="#EB5757"/>
      <circle cx="7" cy="5" r="2" fill="#5B8DEF"/>
      <circle cx="17" cy="5" r="2" fill="#5B8DEF"/>
      <rect x="6" y="12" width="3" height="2" rx="0.5" fill="#FFD166"/>
      <rect x="10.5" y="12" width="3" height="2" rx="0.5" fill="#6FCF97"/>
      <rect x="15" y="12" width="3" height="2" rx="0.5" fill="#56CCF2"/>
      <rect x="6" y="16" width="3" height="2" rx="0.5" fill="white" fillOpacity="0.5"/>
      <rect x="10.5" y="16" width="3" height="2" rx="0.5" fill="white" fillOpacity="0.5"/>
    </svg>
  );
}

export function TrendUpIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#6FCF97"/>
      <path d="M6 15L10 11L13 14L18 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 8H18V11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ClockIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="#F2994A"/>
      <circle cx="12" cy="12" r="7" fill="#FFD166"/>
      <path d="M12 7V12L15 14" stroke="#F2994A" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="1.5" fill="#EB5757"/>
    </svg>
  );
}

export function CalendarDaysIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" fill="#EB5757"/>
      <rect x="3" y="5" width="18" height="4" fill="#5B8DEF"/>
      <circle cx="7" cy="5" r="2" fill="#FFD166"/>
      <circle cx="17" cy="5" r="2" fill="#FFD166"/>
      <rect x="6" y="12" width="3" height="3" rx="0.5" fill="white" fillOpacity="0.3"/>
      <rect x="10.5" y="12" width="3" height="3" rx="0.5" fill="white" fillOpacity="0.3"/>
      <rect x="15" y="12" width="3" height="3" rx="0.5" fill="white"/>
      <rect x="6" y="16" width="3" height="2" rx="0.5" fill="white" fillOpacity="0.3"/>
    </svg>
  );
}

export function DownloadIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="3" width="16" height="18" rx="2" fill="#5B8DEF"/>
      <path d="M12 8V15M12 15L9 12M12 15L15 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="8" y="17" width="8" height="2" rx="0.5" fill="white" fillOpacity="0.5"/>
    </svg>
  );
}

export function SearchIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="10" cy="10" r="7" fill="#9B51E0"/>
      <circle cx="10" cy="10" r="4" fill="#E0D4F7"/>
      <path d="M15 15L20 20" stroke="#9B51E0" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

export function CheckCircleIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="#6FCF97"/>
      <path d="M7 12L10.5 15.5L17 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function AlertIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3L22 20H2L12 3Z" fill="#F2994A"/>
      <path d="M12 10V14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="17" r="1" fill="white"/>
    </svg>
  );
}

export function ArrowLeftIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="#5B8DEF"/>
      <path d="M14 8L10 12L14 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ChevronRightIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="8" fill="#E0E0E0"/>
      <path d="M10 8L14 12L10 16" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function MailIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" fill="#5B8DEF"/>
      <path d="M3 7L12 13L21 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function PhoneIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 4C5 3.44772 5.44772 3 6 3H9L11 8L8.5 9.5C9.57096 11.6715 11.3285 13.429 13.5 14.5L15 12L20 14V18C20 18.5523 19.5523 19 19 19C10.7157 19 4 12.2843 4 4C4 3.44772 4.44772 3 5 3H6H5Z" fill="#6FCF97"/>
    </svg>
  );
}

export function MapPinIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2C8.13401 2 5 5.13401 5 9C5 14 12 22 12 22C12 22 19 14 19 9C19 5.13401 15.866 2 12 2Z" fill="#EB5757"/>
      <circle cx="12" cy="9" r="3" fill="white"/>
    </svg>
  );
}

export function EditIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 20H20" stroke="#5B8DEF" strokeWidth="2" strokeLinecap="round"/>
      <path d="M4 20L8 16L17.5 6.5C18.3284 5.67157 19.6716 5.67157 20.5 6.5C21.3284 7.32843 21.3284 8.67157 20.5 9.5L11 19L4 20Z" fill="#FFD166"/>
      <path d="M15 9L18 12" stroke="white" strokeWidth="1.5"/>
    </svg>
  );
}

export function SaveIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 3C4.44772 3 4 3.44772 4 4V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V8L15 3H5Z" fill="#6FCF97"/>
      <rect x="7" y="3" width="8" height="5" rx="1" fill="#5B8DEF"/>
      <rect x="8" y="13" width="8" height="8" rx="1" fill="white"/>
    </svg>
  );
}

export function LogOutIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H9" stroke="#EB5757" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 17L21 12L16 7" stroke="#EB5757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12H9" stroke="#EB5757" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function GraduationCapIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3L2 8L12 13L22 8L12 3Z" fill="#5B8DEF"/>
      <path d="M6 10V16C6 16 8 19 12 19C16 19 18 16 18 16V10" stroke="#9B51E0" strokeWidth="2"/>
      <path d="M20 8V14" stroke="#FFD166" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="20" cy="16" r="2" fill="#FFD166"/>
    </svg>
  );
}

export function UserCircleIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="#E0E7FF"/>
      <circle cx="12" cy="9" r="3" fill="#5B8DEF"/>
      <path d="M6 19C6 16.2386 8.68629 14 12 14C15.3137 14 18 16.2386 18 19" stroke="#5B8DEF" strokeWidth="2"/>
    </svg>
  );
}

export function FilterIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 6H20" stroke="#5B8DEF" strokeWidth="2" strokeLinecap="round"/>
      <path d="M7 12H17" stroke="#9B51E0" strokeWidth="2" strokeLinecap="round"/>
      <path d="M10 18H14" stroke="#6FCF97" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function PlusCircleIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="#6FCF97"/>
      <path d="M12 7V17M7 12H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function RefreshIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 12C4 7.58172 7.58172 4 12 4C15.0736 4 17.7441 5.70416 19.2131 8.2" stroke="#5B8DEF" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 12C20 16.4183 16.4183 20 12 20C8.92642 20 6.25587 18.2958 4.78687 15.8" stroke="#9B51E0" strokeWidth="2" strokeLinecap="round"/>
      <path d="M15 8H20V3" stroke="#5B8DEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 16H4V21" stroke="#9B51E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function EyeIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" fill="#5B8DEF"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
      <circle cx="12" cy="12" r="2" fill="#333"/>
    </svg>
  );
}

export function XIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="#EB5757"/>
      <path d="M8 8L16 16M16 8L8 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function InfoIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="#5B8DEF"/>
      <path d="M12 16V12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="8" r="1" fill="white"/>
    </svg>
  );
}

export function StarIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2L14.9 8.6L22 9.3L16.9 14L18.2 21L12 17.5L5.8 21L7.1 14L2 9.3L9.1 8.6L12 2Z" fill="#FFD166"/>
    </svg>
  );
}

export function HeartIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 21C12 21 4 14.5 4 9C4 5.5 6.5 3 10 3C11.5 3 12 4 12 4C12 4 12.5 3 14 3C17.5 3 20 5.5 20 9C20 14.5 12 21 12 21Z" fill="#EB5757"/>
    </svg>
  );
}

export function PinIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2L14.5 8L21 9L16 14L17.5 21L12 18L6.5 21L8 14L3 9L9.5 8L12 2Z" fill="#F2994A"/>
      <circle cx="12" cy="12" r="3" fill="#FFD166"/>
    </svg>
  );
}

export function MegaphoneIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M19 3L5 9H3C2.44772 9 2 9.44772 2 10V14C2 14.5523 2.44772 15 3 15H5L19 21V3Z" fill="#5B8DEF"/>
      <path d="M5 9L5 15L8 19H10L8.5 15H5L5 9Z" fill="#9B51E0"/>
      <circle cx="19" cy="12" r="2" fill="#FFD166"/>
    </svg>
  );
}

export function PartyIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 21L8 7L14 13L4 21Z" fill="#9B51E0"/>
      <circle cx="18" cy="4" r="2" fill="#FFD166"/>
      <circle cx="20" cy="10" r="1.5" fill="#6FCF97"/>
      <circle cx="14" cy="5" r="1.5" fill="#EB5757"/>
      <path d="M10 4L11 6L13 5L12 7L14 8L12 9L13 11L11 10L10 12L9 10L7 11L8 9L6 8L8 7L7 5L9 6L10 4Z" fill="#56CCF2"/>
    </svg>
  );
}

export function PlusIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="#6FCF97"/>
      <path d="M12 7V17M7 12H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function PencilIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 20H20" stroke="#5B8DEF" strokeWidth="2" strokeLinecap="round"/>
      <path d="M4 20L8 16L17.5 6.5C18.3284 5.67157 19.6716 5.67157 20.5 6.5C21.3284 7.32843 21.3284 8.67157 20.5 9.5L11 19L4 20Z" fill="#FFD166"/>
      <path d="M15 9L18 12" stroke="white" strokeWidth="1.5"/>
    </svg>
  );
}

export function TrashIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 6H18V20C18 20.5523 17.5523 21 17 21H7C6.44772 21 6 20.5523 6 20V6Z" fill="#EB5757"/>
      <path d="M4 6H20" stroke="#EB5757" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 3H15V6H9V3Z" fill="#FFD166"/>
      <path d="M10 10V17M14 10V17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function MessageIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 4H20C20.5523 4 21 4.44772 21 5V16C21 16.5523 20.5523 17 20 17H8L4 21V5C4 4.44772 4.44772 4 5 4H4Z" fill="#5B8DEF"/>
      <rect x="7" y="8" width="10" height="2" rx="1" fill="white" fillOpacity="0.7"/>
      <rect x="7" y="12" width="6" height="2" rx="1" fill="white" fillOpacity="0.5"/>
    </svg>
  );
}

// Export all icon components
export const FlatIcons = {
  Home: HomeIcon,
  Analytics: AnalyticsIcon,
  CalendarManage: CalendarManageIcon,
  Profile: ProfileIcon,
  History: HistoryIcon,
  Users: UsersIcon,
  Present: PresentIcon,
  Late: LateIcon,
  Absent: AbsentIcon,
  Book: BookIcon,
  Document: DocumentIcon,
  Library: LibraryIcon,
  Bell: BellIcon,
  Clipboard: ClipboardIcon,
  StudentList: StudentListIcon,
  Schedule: ScheduleIcon,
  TrendUp: TrendUpIcon,
  Clock: ClockIcon,
  CalendarDays: CalendarDaysIcon,
  Download: DownloadIcon,
  Search: SearchIcon,
  CheckCircle: CheckCircleIcon,
  Alert: AlertIcon,
  ArrowLeft: ArrowLeftIcon,
  ChevronRight: ChevronRightIcon,
  Mail: MailIcon,
  Phone: PhoneIcon,
  MapPin: MapPinIcon,
  Edit: EditIcon,
  Save: SaveIcon,
  LogOut: LogOutIcon,
  GraduationCap: GraduationCapIcon,
  UserCircle: UserCircleIcon,
  Filter: FilterIcon,
  PlusCircle: PlusCircleIcon,
  Refresh: RefreshIcon,
  Eye: EyeIcon,
  X: XIcon,
  Info: InfoIcon,
  Star: StarIcon,
  Heart: HeartIcon,
  Pin: PinIcon,
  Megaphone: MegaphoneIcon,
  Party: PartyIcon,
  Plus: PlusIcon,
  Pencil: PencilIcon,
  Trash: TrashIcon,
  Message: MessageIcon,
};
