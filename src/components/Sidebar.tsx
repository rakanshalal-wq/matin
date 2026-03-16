'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/* ═══════════════════════════════════════════════════════════
   SIDEBAR — متين | قوائم 7 أدوار وفق الدستور السيادي v5
   ألوان: #0B0B16 خلفية، #C9A84C ذهبي، #EEEEF5 نص
═══════════════════════════════════════════════════════════ */

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  screenSize: 'mobile' | 'tablet' | 'desktop';
  userRole?: string;
}

interface MenuItem { label: string; icon: React.ReactNode; href: string; }
interface MenuGroup { title: string; items: MenuItem[]; }

// ─── SVG Icons ────────────────────────────────────────────
const Icon = ({ d, size = 16 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icons = {
  dashboard:    <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />,
  analytics:    <Icon d="M18 20V10 M12 20V4 M6 20v-6" />,
  finance:      <Icon d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  tax:          <Icon d="M3 3h18v18H3z M9 9h6 M9 12h6 M9 15h4" />,
  subscription: <Icon d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />,
  coupon:       <Icon d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01" />,
  commission:   <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  schools:      <Icon d="M2 20h20 M6 20V10 M18 20V10 M12 20v-5 M2 10l10-7 10 7" />,
  joinReq:      <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M12 18v-6 M9 15h6" />,
  partners:     <Icon d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />,
  ads:          <Icon d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  notification: <Icon d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" />,
  library:      <Icon d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />,
  ai:           <Icon d="M12 2a10 10 0 1 0 10 10 M12 8v4l3 3 M2 12h2 M20 12h2 M12 2v2 M12 20v2" />,
  security:     <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  api:          <Icon d="M10 20l4-16 M14 8l4 4-4 4 M10 16l-4-4 4-4" />,
  support:      <Icon d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  backup:       <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" />,
  settings:     <Icon d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />,
  schoolPage:   <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  students:     <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  teachers:     <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
  classes:      <Icon d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />,
  schedule:     <Icon d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z" />,
  curriculum:   <Icon d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z M8 7h8 M8 11h5" />,
  attendance:   <Icon d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />,
  grades:       <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />,
  homework:     <Icon d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />,
  exams:        <Icon d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 M12 12h3 M12 16h3 M9 12h.01 M9 16h.01" />,
  questionBank: <Icon d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />,
  examSchedule: <Icon d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z M9 16l2 2 4-4" />,
  examRooms:    <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />,
  proctoring:   <Icon d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />,
  lectures:     <Icon d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.899L15 14 M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  liveStream:   <Icon d="M23 7l-7 5 7 5V7z M1 5h15v14H1z" />,
  activities:   <Icon d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  employees:    <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  salaries:     <Icon d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  leaves:       <Icon d="M17 8C8 10 5.9 16.17 3.82 22 M9.5 9.5c1 2.5 3.5 4 6.5 4 M14 14c-1 2.5-4 4-7 4" />,
  permissions:  <Icon d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />,
  transport:    <Icon d="M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
  cafeteria:    <Icon d="M18 8h1a4 4 0 0 1 0 8h-1 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z M6 1v3 M10 1v3 M14 1v3" />,
  health:       <Icon d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  store:        <Icon d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0" />,
  community:    <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  messages:     <Icon d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  announcements:<Icon d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  parents:      <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  reports:      <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />,
  portfolio:    <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  certificates: <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  payments:     <Icon d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M1 13h22" />,
  tracking:     <Icon d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />,
  driverApp:    <Icon d="M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
  logout:       <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" />,
  structure:    <Icon d="M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z" />,
  weekSched:    <Icon d="M8 2v4 M16 2v4 M3 10h18 M8 14h.01 M12 14h.01 M16 14h.01 M8 18h.01 M12 18h.01 M16 18h.01 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z" />,
  admission:    <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M12 11v6 M9 14h6" />,
  behavior:     <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4" />,
  survey:       <Icon d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 M9 14l2 2 4-4" />,
  calendar:     <Icon d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z" />,
  gifted:       <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  special:      <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  payroll:      <Icon d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6 M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />,
  contracts:    <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8" />,
  training:     <Icon d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z M6 8h2 M6 12h2" />,
  invoice:      <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M9 13h6 M9 17h3" />,
  scholarship:  <Icon d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5" />,
  complaint:    <Icon d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z M12 8v4 M12 16h.01" />,
  news:         <Icon d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z M2 7h2 M2 12h2 M2 17h2" />,
  gallery:      <Icon d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5L5 21" />,
  tasks:        <Icon d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />,
  meetings:     <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  parentsCouncil: <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 M15 11h6 M18 8v6" />,
  appearance:   <Icon d="M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />,
  integrations: <Icon d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />,
  errorLog:     <Icon d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01" />,
  vaccination:  <Icon d="M18 2l4 4-14 14H4v-4L18 2z M14.5 5.5l4 4" />,
  counseling:   <Icon d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z M8 10h8 M8 14h5" />,
  recording:    <Icon d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.899L15 14 M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 12h.01" />,
  visitors:     <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  facilities:   <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />,
};

const getMenuByRole = (role: string): MenuGroup[] => {
  if (role === 'super_admin') {
    return [
      { title: 'النظرة العامة', items: [
        { label: 'لوحة التحكم', icon: Icons.dashboard, href: '/owner' },
        { label: 'الإحصائيات الشاملة', icon: Icons.analytics, href: '/dashboard/platform-analytics' },
      ]},
      { title: 'المالية السيادية', items: [
        { label: 'الإيرادات والمالية', icon: Icons.finance, href: '/dashboard/finance' },
        { label: 'الضرائب السيادية', icon: Icons.tax, href: '/dashboard/taxes' },
        { label: 'الاشتراكات والباقات', icon: Icons.subscription, href: '/dashboard/subscriptions' },
        { label: 'الكوبونات', icon: Icons.coupon, href: '/dashboard/coupons' },
        { label: 'العمولات والإحالات', icon: Icons.commission, href: '/dashboard/commissions' },
      ]},
      { title: 'إدارة المؤسسات', items: [
        { label: 'المؤسسات التعليمية', icon: Icons.schools, href: '/dashboard/schools' },
        { label: 'طلبات الانضمام', icon: Icons.joinReq, href: '/dashboard/join-requests' },
        { label: 'الشركاء والموردون', icon: Icons.partners, href: '/dashboard/partners' },
      ]},
      { title: 'الإعلانات والمحتوى', items: [
        { label: 'الإعلانات السيادية', icon: Icons.ads, href: '/dashboard/ads' },
        { label: 'الإشعارات الجماعية', icon: Icons.notification, href: '/dashboard/push-notifications' },
        { label: 'المكتبة الرقمية', icon: Icons.library, href: '/dashboard/library' },
        { label: 'الملتقى المجتمعي', icon: Icons.community, href: '/dashboard/community' },
      ]},
      { title: 'الذكاء الاصطناعي', items: [
        { label: 'المفتش الرقمي AI', icon: Icons.ai, href: '/dashboard/ai-chat' },
        { label: 'تحليلات المنصة', icon: Icons.analytics, href: '/dashboard/question-analytics' },
      ]},
      { title: 'الأمان والتقارير', items: [
        { label: 'سجل الأمان', icon: Icons.security, href: '/dashboard/activity-log' },
        { label: 'التكاملات والـ API', icon: Icons.api, href: '/dashboard/api' },
        { label: 'الدعم الفني', icon: Icons.support, href: '/dashboard/support' },
        { label: 'النسخ الاحتياطي', icon: Icons.backup, href: '/dashboard/backup' },
      ]},
    ];
  }

  if (['admin', 'school_owner', 'university_owner', 'institute_owner', 'kindergarten_owner', 'training_owner', 'owner'].includes(role)) {
    return [
      { title: 'الرئيسية', items: [
        { label: 'لوحة التحكم', icon: Icons.dashboard, href: '/dashboard/admin' },
        { label: 'صفحة المؤسسة', icon: Icons.schoolPage, href: '/dashboard/school-page' },
        { label: 'التقويم', icon: Icons.calendar, href: '/dashboard/calendar' },
        { label: 'الإعدادات', icon: Icons.settings, href: '/dashboard/settings' },
        { label: 'المظهر والتخصيص', icon: Icons.appearance, href: '/dashboard/appearance' },
        { label: 'التكاملات', icon: Icons.integrations, href: '/dashboard/integrations' },
      ]},
      { title: 'الهيكل الأكاديمي', items: [
        { label: 'المراحل والمواد والمسارات', icon: Icons.structure, href: '/dashboard/academic-structure' },
        { label: 'الجدول الأسبوعي', icon: Icons.weekSched, href: '/dashboard/weekly-schedule' },
        { label: 'المناهج', icon: Icons.curriculum, href: '/dashboard/curriculum' },
      ]},
      { title: 'الطلاب', items: [
        { label: 'الطلاب', icon: Icons.students, href: '/dashboard/students' },
        { label: 'طلبات القبول', icon: Icons.admission, href: '/dashboard/admission' },
        { label: 'الموهوبون', icon: Icons.gifted, href: '/dashboard/gifted' },
        { label: 'ذوو الاحتياجات الخاصة', icon: Icons.special, href: '/dashboard/special-needs' },
        { label: 'الإرشاد الطلابي', icon: Icons.counseling, href: '/dashboard/counseling' },
        { label: 'السلوك والانضباط', icon: Icons.behavior, href: '/dashboard/behavior' },
        { label: 'الشكاوى', icon: Icons.complaint, href: '/dashboard/complaints' },
      ]},
      { title: 'العمليات الأكاديمية', items: [
        { label: 'الفصول', icon: Icons.classes, href: '/dashboard/classes' },
        { label: 'المعلمون', icon: Icons.teachers, href: '/dashboard/teachers' },
        { label: 'الجداول', icon: Icons.schedule, href: '/dashboard/schedules' },
        { label: 'الحضور', icon: Icons.attendance, href: '/dashboard/attendance' },
        { label: 'الدرجات', icon: Icons.grades, href: '/dashboard/grades' },
        { label: 'الواجبات', icon: Icons.homework, href: '/dashboard/homework' },
        { label: 'الشهادات', icon: Icons.certificates, href: '/dashboard/certificates' },
      ]},
      { title: 'الاختبارات', items: [
        { label: 'الاختبارات', icon: Icons.exams, href: '/dashboard/exams' },
        { label: 'بنك الأسئلة', icon: Icons.questionBank, href: '/dashboard/question-bank' },
        { label: 'جدول الاختبارات', icon: Icons.examSchedule, href: '/dashboard/exam-schedule' },
        { label: 'قاعات الاختبار', icon: Icons.examRooms, href: '/dashboard/exam-rooms' },
        { label: 'مراقبة الاختبار', icon: Icons.proctoring, href: '/dashboard/exam-proctoring' },
        { label: 'تحليلات الأسئلة', icon: Icons.analytics, href: '/dashboard/question-analytics' },
      ]},
      { title: 'التعليم الإلكتروني', items: [
        { label: 'المحاضرات', icon: Icons.lectures, href: '/dashboard/lectures' },
        { label: 'البث المباشر', icon: Icons.liveStream, href: '/dashboard/live-stream' },
        { label: 'التسجيلات', icon: Icons.recording, href: '/dashboard/recordings' },
        { label: 'المكتبة الرقمية', icon: Icons.library, href: '/dashboard/library' },
        { label: 'الأنشطة', icon: Icons.activities, href: '/dashboard/activities' },
        { label: 'الاستبيانات', icon: Icons.survey, href: '/dashboard/surveys' },
      ]},
      { title: 'الموارد البشرية', items: [
        { label: 'الموظفون', icon: Icons.employees, href: '/dashboard/employees' },
        { label: 'الرواتب', icon: Icons.salaries, href: '/dashboard/salaries' },
        { label: 'كشف الرواتب', icon: Icons.payroll, href: '/dashboard/payroll' },
        { label: 'الإجازات', icon: Icons.leaves, href: '/dashboard/leaves' },
        { label: 'العقود', icon: Icons.contracts, href: '/dashboard/contracts' },
        { label: 'التدريب المهني', icon: Icons.training, href: '/dashboard/training' },
        { label: 'الصلاحيات', icon: Icons.permissions, href: '/dashboard/permissions' },
      ]},
      { title: 'المالية', items: [
        { label: 'المالية', icon: Icons.finance, href: '/dashboard/finance' },
        { label: 'رسوم الطلاب', icon: Icons.payments, href: '/dashboard/student-fees' },
        { label: 'الفواتير', icon: Icons.invoice, href: '/dashboard/school-invoices' },
        { label: 'المنح الدراسية', icon: Icons.scholarship, href: '/dashboard/scholarships' },
        { label: 'الاشتراك', icon: Icons.subscription, href: '/dashboard/subscribe' },
      ]},
      { title: 'الخدمات', items: [
        { label: 'النقل المدرسي', icon: Icons.transport, href: '/dashboard/transport' },
        { label: 'الكافتيريا', icon: Icons.cafeteria, href: '/dashboard/cafeteria' },
        { label: 'الصحة والتطعيمات', icon: Icons.health, href: '/dashboard/health' },
        { label: 'المرافق والمباني', icon: Icons.facilities, href: '/dashboard/facilities' },
        { label: 'المتجر', icon: Icons.store, href: '/dashboard/store' },
        { label: 'الزوار', icon: Icons.visitors, href: '/dashboard/visitors' },
        { label: 'الملتقى المجتمعي', icon: Icons.community, href: '/dashboard/community' },
      ]},
      { title: 'التواصل', items: [
        { label: 'الرسائل', icon: Icons.messages, href: '/dashboard/messages' },
        { label: 'الإشعارات', icon: Icons.notification, href: '/dashboard/push-notifications' },
        { label: 'الإعلانات', icon: Icons.announcements, href: '/dashboard/announcements' },
        { label: 'الأخبار', icon: Icons.news, href: '/dashboard/news' },
        { label: 'معرض الصور', icon: Icons.gallery, href: '/dashboard/gallery' },
        { label: 'أولياء الأمور', icon: Icons.parents, href: '/dashboard/parents' },
        { label: 'مجلس الآباء', icon: Icons.parentsCouncil, href: '/dashboard/parents-council' },
        { label: 'الاجتماعات', icon: Icons.meetings, href: '/dashboard/meetings' },
      ]},
      { title: 'الذكاء الاصطناعي والتقارير', items: [
        { label: 'المساعد الذكي', icon: Icons.ai, href: '/dashboard/ai-chat' },
        { label: 'التقارير الذكية', icon: Icons.reports, href: '/dashboard/reports' },
        { label: 'تحليلات الأداء', icon: Icons.analytics, href: '/dashboard/platform-analytics' },
        { label: 'المهام', icon: Icons.tasks, href: '/dashboard/tasks' },
        { label: 'سجل النشاط', icon: Icons.errorLog, href: '/dashboard/activity-log' },
      ]},
    ];
  }

  if (role === 'teacher') {
    return [
      { title: 'الرئيسية', items: [
        { label: 'لوحتي', icon: Icons.dashboard, href: '/dashboard/teacher' },
        { label: 'ملفي الإنجازي', icon: Icons.portfolio, href: '/dashboard/teacher-assignments' },
        { label: 'جدولي الأسبوعي', icon: Icons.weekSched, href: '/dashboard/weekly-schedule' },
        { label: 'التقويم', icon: Icons.calendar, href: '/dashboard/calendar' },
      ]},
      { title: 'الفصول والطلاب', items: [
        { label: 'فصولي', icon: Icons.classes, href: '/dashboard/classes' },
        { label: 'طلابي', icon: Icons.students, href: '/dashboard/students' },
        { label: 'الحضور', icon: Icons.attendance, href: '/dashboard/attendance' },
        { label: 'الدرجات', icon: Icons.grades, href: '/dashboard/grades' },
        { label: 'الواجبات', icon: Icons.homework, href: '/dashboard/homework' },
        { label: 'السلوك والانضباط', icon: Icons.behavior, href: '/dashboard/behavior' },
      ]},
      { title: 'الاختبارات', items: [
        { label: 'اختباراتي', icon: Icons.exams, href: '/dashboard/exams' },
        { label: 'بنك الأسئلة', icon: Icons.questionBank, href: '/dashboard/question-bank' },
        { label: 'جدول الاختبارات', icon: Icons.examSchedule, href: '/dashboard/exam-schedule' },
      ]},
      { title: 'التعليم الإلكتروني', items: [
        { label: 'المحاضرات', icon: Icons.lectures, href: '/dashboard/lectures' },
        { label: 'البث المباشر', icon: Icons.liveStream, href: '/dashboard/live-stream' },
        { label: 'التسجيلات', icon: Icons.recording, href: '/dashboard/recordings' },
        { label: 'الأنشطة', icon: Icons.activities, href: '/dashboard/activities' },
        { label: 'المكتبة الرقمية', icon: Icons.library, href: '/dashboard/library' },
        { label: 'الاستبيانات', icon: Icons.survey, href: '/dashboard/surveys' },
      ]},
      { title: 'التواصل', items: [
        { label: 'الرسائل', icon: Icons.messages, href: '/dashboard/messages' },
        { label: 'الإشعارات', icon: Icons.notification, href: '/dashboard/notifications' },
        { label: 'الملتقى المجتمعي', icon: Icons.community, href: '/dashboard/community' },
        { label: 'المساعد الذكي', icon: Icons.ai, href: '/dashboard/ai-chat' },
        { label: 'المهام', icon: Icons.tasks, href: '/dashboard/tasks' },
      ]},
    ];
  }

  if (role === 'student') {
    return [
      { title: 'الرئيسية', items: [
        { label: 'لوحتي', icon: Icons.dashboard, href: '/dashboard/student' },
        { label: 'محفظتي الرقمية', icon: Icons.certificates, href: '/dashboard/certificates' },
        { label: 'التقويم', icon: Icons.calendar, href: '/dashboard/calendar' },
      ]},
      { title: 'الدراسة', items: [
        { label: 'جدولي الأسبوعي', icon: Icons.weekSched, href: '/dashboard/weekly-schedule' },
        { label: 'الجداول', icon: Icons.schedule, href: '/dashboard/schedules' },
        { label: 'الواجبات', icon: Icons.homework, href: '/dashboard/homework' },
        { label: 'درجاتي', icon: Icons.grades, href: '/dashboard/grades' },
        { label: 'حضوري', icon: Icons.attendance, href: '/dashboard/attendance' },
        { label: 'الأنشطة', icon: Icons.activities, href: '/dashboard/activities' },
      ]},
      { title: 'الاختبارات', items: [
        { label: 'اختباراتي', icon: Icons.exams, href: '/dashboard/exams' },
        { label: 'أداء الاختبار', icon: Icons.proctoring, href: '/dashboard/exam-take' },
        { label: 'جدول الاختبارات', icon: Icons.examSchedule, href: '/dashboard/exam-schedule' },
      ]},
      { title: 'التعليم الإلكتروني', items: [
        { label: 'المحاضرات', icon: Icons.lectures, href: '/dashboard/lectures' },
        { label: 'البث المباشر', icon: Icons.liveStream, href: '/dashboard/live-stream' },
        { label: 'المكتبة', icon: Icons.library, href: '/dashboard/library' },
        { label: 'الاستبيانات', icon: Icons.survey, href: '/dashboard/surveys' },
      ]},
      { title: 'الخدمات والتواصل', items: [
        { label: 'المتجر', icon: Icons.store, href: '/dashboard/store' },
        { label: 'المقصف', icon: Icons.cafeteria, href: '/dashboard/cafeteria' },
        { label: 'الصحة', icon: Icons.health, href: '/dashboard/health' },
        { label: 'الملتقى المجتمعي', icon: Icons.community, href: '/dashboard/community' },
        { label: 'الرسائل', icon: Icons.messages, href: '/dashboard/messages' },
        { label: 'الإشعارات', icon: Icons.notification, href: '/dashboard/notifications' },
        { label: 'المساعد الذكي', icon: Icons.ai, href: '/dashboard/ai-chat' },
        { label: 'المهام', icon: Icons.tasks, href: '/dashboard/tasks' },
      ]},
    ];
  }

  if (role === 'parent') {
    return [
      { title: 'الرئيسية', items: [
        { label: 'لوحتي', icon: Icons.dashboard, href: '/dashboard/parent' },
        { label: 'التقويم', icon: Icons.calendar, href: '/dashboard/calendar' },
      ]},
      { title: 'متابعة الأبناء', items: [
        { label: 'الحضور والغياب', icon: Icons.attendance, href: '/dashboard/attendance' },
        { label: 'الدرجات والتقارير', icon: Icons.grades, href: '/dashboard/grades' },
        { label: 'الواجبات', icon: Icons.homework, href: '/dashboard/homework' },
        { label: 'الجدول الدراسي', icon: Icons.weekSched, href: '/dashboard/weekly-schedule' },
        { label: 'الاختبارات', icon: Icons.exams, href: '/dashboard/exams' },
        { label: 'السلوك والانضباط', icon: Icons.behavior, href: '/dashboard/behavior' },
        { label: 'الشهادات', icon: Icons.certificates, href: '/dashboard/certificates' },
      ]},
      { title: 'الخدمات', items: [
        { label: 'النقل المدرسي (GPS)', icon: Icons.transport, href: '/dashboard/transport' },
        { label: 'المقصف الذكي', icon: Icons.cafeteria, href: '/dashboard/cafeteria' },
        { label: 'الصحة', icon: Icons.health, href: '/dashboard/health' },
        { label: 'المدفوعات', icon: Icons.payments, href: '/dashboard/parent/payments' },
        { label: 'المتجر', icon: Icons.store, href: '/dashboard/store' },
      ]},
      { title: 'التواصل', items: [
        { label: 'الرسائل', icon: Icons.messages, href: '/dashboard/messages' },
        { label: 'الإشعارات', icon: Icons.notification, href: '/dashboard/notifications' },
        { label: 'الملتقى المجتمعي', icon: Icons.community, href: '/dashboard/community' },
        { label: 'مجلس الآباء', icon: Icons.parentsCouncil, href: '/dashboard/parents-council' },
        { label: 'الشكاوى والمقترحات', icon: Icons.complaint, href: '/dashboard/complaints' },
        { label: 'المساعد الذكي', icon: Icons.ai, href: '/dashboard/ai-chat' },
      ]},
    ];
  }

  if (role === 'driver') {
    return [
      { title: 'الرئيسية', items: [
        { label: 'لوحتي', icon: Icons.dashboard, href: '/dashboard' },
        { label: 'تطبيق السائق', icon: Icons.driverApp, href: '/driver-app' },
      ]},
      { title: 'العمليات', items: [
        { label: 'الطلاب في رحلتي', icon: Icons.tracking, href: '/dashboard/student-tracking' },
        { label: 'إدارة المركبة', icon: Icons.transport, href: '/dashboard/bus-maintenance' },
        { label: 'الرسائل', icon: Icons.messages, href: '/dashboard/messages' },
        { label: 'الإشعارات', icon: Icons.notification, href: '/dashboard/notifications' },
      ]},
    ];
  }

  if (role === 'platform_staff') {
    return [
      { title: 'الرئيسية', items: [
        { label: 'لوحة التحكم', icon: Icons.dashboard, href: '/dashboard' },
      ]},
      { title: 'الدعم', items: [
        { label: 'تذاكر الدعم', icon: Icons.support, href: '/dashboard/support' },
        { label: 'المؤسسات', icon: Icons.schools, href: '/dashboard/schools' },
        { label: 'الإشعارات', icon: Icons.notification, href: '/dashboard/push-notifications' },
        { label: 'سجل الأخطاء', icon: Icons.errorLog, href: '/dashboard/error-logs' },
      ]},
    ];
  }

  return [
    { title: 'الرئيسية', items: [
      { label: 'لوحة التحكم', icon: Icons.dashboard, href: '/dashboard' },
      { label: 'الملف الشخصي', icon: Icons.students, href: '/profile' },
    ]},
  ];
};

const roleLabels: Record<string, string> = {
  'super_admin': 'مالك المنصة',
  'admin': 'مدير المؤسسة',
  'owner': 'مالك المؤسسة',
  'school_owner': 'مدير المدرسة',
  'university_owner': 'مدير الجامعة',
  'institute_owner': 'مدير المعهد',
  'kindergarten_owner': 'مدير الروضة',
  'training_owner': 'مدير التدريب',
  'teacher': 'معلم',
  'student': 'طالب',
  'parent': 'ولي أمر',
  'driver': 'سائق',
  'platform_staff': 'موظف المنصة',
};

export default function Sidebar({ isOpen, onClose, screenSize, userRole = 'admin' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('');

  const isOverlay = screenSize !== 'desktop';
  const sidebarWidth = 260;

  useEffect(() => {
    const stored = localStorage.getItem('matin_user');
    if (stored) {
      try { setUserName(JSON.parse(stored).name || ''); } catch {}
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('matin_token');
    localStorage.removeItem('matin_user');
    router.push('/login');
  };

  const menu = getMenuByRole(userRole);

  return (
    <>
      {isOverlay && isOpen && (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 998 }} />
      )}
      <aside style={{
        width: sidebarWidth,
        height: '100vh',
        background: '#0B0B16',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        position: isOverlay ? 'fixed' : 'sticky',
        top: 0,
        right: isOverlay ? (isOpen ? 0 : '-100%') : 0,
        zIndex: 999,
        transition: 'right 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* الشعار */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #C9A84C 0%, #E2C46A 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 900, color: '#000', flexShrink: 0,
              boxShadow: '0 4px 12px rgba(201,168,76,0.30)',
            }}>م</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#EEEEF5', letterSpacing: -0.5 }}>متين</div>
          </Link>
          <div style={{ marginTop: 10, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 7, padding: '4px 10px', display: 'inline-block' }}>
            <span style={{ color: '#C9A84C', fontSize: 11, fontWeight: 700 }}>
              {roleLabels[userRole] || userRole}
            </span>
          </div>
          {userName && (
            <div style={{ marginTop: 6, color: 'rgba(238,238,245,0.4)', fontSize: 12, fontWeight: 500 }}>{userName}</div>
          )}
        </div>

        {/* القائمة */}
        <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
          {menu.map((group, gi) => (
            <div key={gi} style={{ marginBottom: 2 }}>
              <div style={{ padding: '8px 16px 3px', color: 'rgba(238,238,245,0.25)', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                {group.title}
              </div>
              {group.items.map((item, ii) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={ii}
                    href={item.href}
                    onClick={isOverlay ? onClose : undefined}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 16px', textDecoration: 'none',
                      background: isActive ? 'rgba(201,168,76,0.08)' : 'transparent',
                      borderRight: isActive ? '3px solid #C9A84C' : '3px solid transparent',
                      transition: 'all 0.15s', margin: '1px 0',
                      color: isActive ? '#C9A84C' : 'rgba(238,238,245,0.50)',
                    }}
                  >
                    <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                    <span style={{
                      color: isActive ? '#EEEEF5' : 'rgba(238,238,245,0.55)',
                      fontSize: 13, fontWeight: isActive ? 600 : 400,
                    }}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* تسجيل الخروج */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)', flexShrink: 0 }}>
          <button
            onClick={logout}
            style={{
              width: '100%', background: 'rgba(239,68,68,0.07)', color: '#F87171',
              border: '1px solid rgba(239,68,68,0.15)', borderRadius: 9, padding: '9px 16px',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.07)')}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>{Icons.logout}</span>
            تسجيل الخروج
          </button>
          <div style={{ marginTop: 10, color: 'rgba(238,238,245,0.18)', fontSize: 10, textAlign: 'center', fontWeight: 500 }}>
            متين v5 — النظام السيادي للتعليم
          </div>
        </div>
      </aside>
    </>
  );
}
