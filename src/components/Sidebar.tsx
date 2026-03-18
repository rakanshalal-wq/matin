'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/* ═══════════════════════════════════════════════════════════
   SIDEBAR — متين v6 | هوية بصرية موحدة لجميع الأدوار
   ألوان: #08081A خلفية، #D4A843 ذهبي، #EEEEF5 نص
═══════════════════════════════════════════════════════════ */

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  screenSize: 'mobile' | 'tablet' | 'desktop';
  userRole?: string;
}
interface MenuItem { label: string; icon: React.ReactNode; href: string; }
interface MenuGroup { title: string; items: MenuItem[]; }

// ─── Design Tokens ────────────────────────────────────────
const GOLD = '#D4A843';
const BG = '#08081A';
const BG_HOVER = 'rgba(255,255,255,0.04)';
const TEXT = '#EEEEF5';
const TEXT_DIM = 'rgba(238,238,245,0.50)';
const TEXT_MUTED = 'rgba(238,238,245,0.28)';
const BORDER = 'rgba(255,255,255,0.07)';

// ─── Role Accent Colors ───────────────────────────────────
const roleAccent: Record<string, { color: string; bg: string; border: string }> = {
  super_admin:         { color: '#D4A843', bg: 'rgba(212,168,67,0.12)',  border: 'rgba(212,168,67,0.25)' },
  platform_owner:      { color: '#D4A843', bg: 'rgba(212,168,67,0.12)',  border: 'rgba(212,168,67,0.25)' },
  admin:               { color: '#60A5FA', bg: 'rgba(96,165,250,0.10)',  border: 'rgba(96,165,250,0.22)' },
  school_owner:        { color: '#34D399', bg: 'rgba(52,211,153,0.10)',  border: 'rgba(52,211,153,0.22)' },
  university_owner:    { color: '#A78BFA', bg: 'rgba(167,139,250,0.10)', border: 'rgba(167,139,250,0.22)' },
  institute_owner:     { color: '#F472B6', bg: 'rgba(244,114,182,0.10)', border: 'rgba(244,114,182,0.22)' },
  kindergarten_owner:  { color: '#FB923C', bg: 'rgba(251,146,60,0.10)',  border: 'rgba(251,146,60,0.22)' },
  training_owner:      { color: '#22D3EE', bg: 'rgba(34,211,238,0.10)',  border: 'rgba(34,211,238,0.22)' },
  owner:               { color: '#34D399', bg: 'rgba(52,211,153,0.10)',  border: 'rgba(52,211,153,0.22)' },
  teacher:             { color: '#4ADE80', bg: 'rgba(74,222,128,0.10)',  border: 'rgba(74,222,128,0.22)' },
  student:             { color: '#38BDF8', bg: 'rgba(56,189,248,0.10)',  border: 'rgba(56,189,248,0.22)' },
  parent:              { color: '#F9A8D4', bg: 'rgba(249,168,212,0.10)', border: 'rgba(249,168,212,0.22)' },
  driver:              { color: '#FCD34D', bg: 'rgba(252,211,77,0.10)',  border: 'rgba(252,211,77,0.22)' },
  guard:               { color: '#F87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.22)' },
  platform_staff:      { color: '#94A3B8', bg: 'rgba(148,163,184,0.10)', border: 'rgba(148,163,184,0.22)' },
};
const getAccent = (role: string) => roleAccent[role] || roleAccent['admin'];

// ─── SVG Icon ─────────────────────────────────────────────
const Icon = ({ d, size = 16 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

// ─── Icons Library ────────────────────────────────────────
const Icons = {
  dashboard:    <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />,
  analytics:    <Icon d="M18 20V10 M12 20V4 M6 20v-6" />,
  schools:      <Icon d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />,
  users:        <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  settings:     <Icon d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />,
  security:     <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  support:      <Icon d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  notification: <Icon d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" />,
  library:      <Icon d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />,
  community:    <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  ads:          <Icon d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M16 2v4 M8 2v4 M3 10h18" />,
  permissions:  <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4" />,
  integrations: <Icon d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />,
  revenue:      <Icon d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  taxes:        <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M9 13h6 M9 17h3" />,
  activity:     <Icon d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  ai:           <Icon d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 8v4l3 3" />,
  api:          <Icon d="M8 9l3 3-3 3 M13 15h3 M21 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />,
  backup:       <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" />,
  joinReq:      <Icon d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M12.5 7a4 4 0 1 0 0-8 M20 8v6 M23 11h-6" />,
  partners:     <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  errorLog:     <Icon d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01" />,
  schoolPage:   <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  calendar:     <Icon d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z" />,
  appearance:   <Icon d="M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />,
  structure:    <Icon d="M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z" />,
  weekSched:    <Icon d="M8 2v4 M16 2v4 M3 10h18 M8 14h.01 M12 14h.01 M16 14h.01 M8 18h.01 M12 18h.01 M16 18h.01 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z" />,
  curriculum:   <Icon d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />,
  students:     <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  admission:    <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M12 11v6 M9 14h6" />,
  gifted:       <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  special:      <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  counseling:   <Icon d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z M8 10h8 M8 14h5" />,
  behavior:     <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4" />,
  complaint:    <Icon d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z M12 8v4 M12 16h.01" />,
  classes:      <Icon d="M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z" />,
  teachers:     <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
  schedule:     <Icon d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z" />,
  attendance:   <Icon d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />,
  grades:       <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />,
  homework:     <Icon d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 M9 14l2 2 4-4" />,
  certificates: <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  exams:        <Icon d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />,
  questionBank: <Icon d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z M8 10h8 M8 14h5" />,
  examSchedule: <Icon d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z" />,
  examRooms:    <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />,
  proctoring:   <Icon d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />,
  lectures:     <Icon d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.899L15 14 M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  liveStream:   <Icon d="M23 7l-7 5 7 5V7z M1 5h15v14H1z" />,
  activities:   <Icon d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  employees:    <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  salaries:     <Icon d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  leaves:       <Icon d="M17 8C8 10 5.9 16.17 3.82 22 M9.5 9.5c1 2.5 3.5 4 6.5 4 M14 14c-1 2.5-4 4-7 4" />,
  transport:    <Icon d="M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
  cafeteria:    <Icon d="M18 8h1a4 4 0 0 1 0 8h-1 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z M6 1v3 M10 1v3 M14 1v3" />,
  health:       <Icon d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  store:        <Icon d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0" />,
  messages:     <Icon d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  announcements:<Icon d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  parents:      <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  reports:      <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />,
  portfolio:    <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  payments:     <Icon d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M1 13h22" />,
  tracking:     <Icon d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />,
  driverApp:    <Icon d="M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
  logout:       <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" />,
  survey:       <Icon d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 M9 14l2 2 4-4" />,
  payroll:      <Icon d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6 M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />,
  contracts:    <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8" />,
  training:     <Icon d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z M6 8h2 M6 12h2" />,
  invoice:      <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M9 13h6 M9 17h3" />,
  scholarship:  <Icon d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5" />,
  news:         <Icon d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z M2 7h2 M2 12h2 M2 17h2" />,
  gallery:      <Icon d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5L5 21" />,
  tasks:        <Icon d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />,
  meetings:     <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  parentsCouncil:<Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 M15 11h6 M18 8v6" />,
  recording:    <Icon d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.899L15 14 M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 12h.01" />,
  visitors:     <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  facilities:   <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />,
  vaccination:  <Icon d="M18 2l4 4-14 14H4v-4L18 2z M14.5 5.5l4 4" />,
  busMaint:     <Icon d="M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
  fuel:         <Icon d="M3 22V8l7-6 7 6v14 M10 22V16h4v6 M14 8h4l2 2v4h-6V8z" />,
  finance:      <Icon d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M1 13h22" />,
  emergencies:  <Icon d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01" />,
  emergKeys:    <Icon d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />,
  driverLic:    <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M9 13h6 M9 17h3" />,
  pushNotif:    <Icon d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0 M15 8h6 M18 5v6" />,
  questionAnal: <Icon d="M18 20V10 M12 20V4 M6 20v-6" />,
  studentFees:  <Icon d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  examTake:     <Icon d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 M12 12v4 M10 14h4" />,
  plans:        <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  subscriptions:<Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  coupons:      <Icon d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01" />,
  commissions:  <Icon d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
};

// ─── Menu By Role ─────────────────────────────────────────
const getMenuByRole = (role: string): MenuGroup[] => {
  if (role === 'super_admin' || role === 'platform_owner') {
    return [
      { title: 'الرئيسية', items: [
        { label: 'نظرة عامة', icon: Icons.dashboard, href: '/owner' },
        { label: 'سجل النشاط', icon: Icons.activity, href: '/dashboard/activity-log' },
      ]},
      { title: 'المالية السيادية', items: [
        { label: 'الإيرادات والمالية', icon: Icons.finance, href: '/dashboard/finance' },
        { label: 'الضرائب السيادية', icon: Icons.taxes, href: '/dashboard/taxes' },
        { label: 'الاشتراكات والباقات', icon: Icons.subscriptions, href: '/dashboard/subscriptions' },
        { label: 'الباقات', icon: Icons.plans, href: '/dashboard/plans' },
        { label: 'الكوبونات', icon: Icons.coupons, href: '/dashboard/coupons' },
        { label: 'العمولات والإحالات', icon: Icons.commissions, href: '/dashboard/commissions' },
      ]},
      { title: 'إدارة المنصة', items: [
        { label: 'المستخدمون', icon: Icons.users, href: '/dashboard/users' },
        { label: 'الخدمات', icon: Icons.settings, href: '/owner/services' },
        { label: 'الصلاحيات', icon: Icons.permissions, href: '/dashboard/permissions' },
      ]},
      { title: 'إدارة المؤسسات', items: [
        { label: 'المؤسسات التعليمية', icon: Icons.schools, href: '/dashboard/schools' },
        { label: 'طلبات الانضمام', icon: Icons.joinReq, href: '/dashboard/join-requests' },
        { label: 'الشركاء والموردون', icon: Icons.partners, href: '/dashboard/partners' },
      ]},
      { title: 'الإعلانات والمحتوى', items: [
        { label: 'الإعلانات السيادية', icon: Icons.ads, href: '/dashboard/ads' },
        { label: 'الإشعارات الجماعية', icon: Icons.pushNotif, href: '/dashboard/push-notifications' },
        { label: 'المكتبة الرقمية', icon: Icons.library, href: '/dashboard/library' },
        { label: 'الملتقى المجتمعي', icon: Icons.community, href: '/dashboard/community' },
        { label: 'المتجر', icon: Icons.store, href: '/dashboard/store' },
      ]},
      { title: 'الذكاء الاصطناعي', items: [
        { label: 'المفتش الرقمي AI', icon: Icons.ai, href: '/dashboard/ai-chat' },
        { label: 'تحليلات المنصة', icon: Icons.analytics, href: '/dashboard/platform-analytics' },
      ]},
      { title: 'الأمان والتقني', items: [
        { label: 'سجل الأمان', icon: Icons.security, href: '/dashboard/security' },
        { label: 'التكاملات والـ API', icon: Icons.api, href: '/dashboard/api' },
        { label: 'الدعم الفني', icon: Icons.support, href: '/dashboard/support' },
        { label: 'النسخ الاحتياطي', icon: Icons.backup, href: '/dashboard/backup' },
        { label: 'سجل الأخطاء', icon: Icons.errorLog, href: '/dashboard/error-logs' },
        { label: 'الإعدادات', icon: Icons.settings, href: '/dashboard/settings' },
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
        { label: 'تحليلات الأسئلة', icon: Icons.questionAnal, href: '/dashboard/question-analytics' },
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
        { label: 'الإجازات', icon: Icons.leaves, href: '/dashboard/leaves' },
        { label: 'كشف الرواتب', icon: Icons.payroll, href: '/dashboard/payroll' },
        { label: 'العقود', icon: Icons.contracts, href: '/dashboard/contracts' },
      ]},
      { title: 'المالية', items: [
        { label: 'رسوم الطلاب', icon: Icons.studentFees, href: '/dashboard/student-fees' },
        { label: 'الفواتير', icon: Icons.invoice, href: '/dashboard/school-invoices' },
        { label: 'المنح والبعثات', icon: Icons.scholarship, href: '/dashboard/scholarships' },
        { label: 'الإدارة المالية', icon: Icons.finance, href: '/dashboard/finance' },
      ]},
      { title: 'الخدمات', items: [
        { label: 'النقل المدرسي', icon: Icons.transport, href: '/dashboard/transport' },
        { label: 'المقصف الذكي', icon: Icons.cafeteria, href: '/dashboard/cafeteria' },
        { label: 'الصحة والعيادة', icon: Icons.health, href: '/dashboard/health' },
        { label: 'المتجر', icon: Icons.store, href: '/dashboard/store' },
        { label: 'المرافق', icon: Icons.facilities, href: '/dashboard/facilities' },
      ]},
      { title: 'التواصل', items: [
        { label: 'أولياء الأمور', icon: Icons.parents, href: '/dashboard/parents' },
        { label: 'مجلس الآباء', icon: Icons.parentsCouncil, href: '/dashboard/parents-council' },
        { label: 'الرسائل', icon: Icons.messages, href: '/dashboard/messages' },
        { label: 'الإشعارات', icon: Icons.notification, href: '/dashboard/notifications' },
        { label: 'الأخبار والإعلانات', icon: Icons.news, href: '/dashboard/news' },
        { label: 'الملتقى المجتمعي', icon: Icons.community, href: '/dashboard/community' },
      ]},
      { title: 'التقارير والذكاء', items: [
        { label: 'التقارير', icon: Icons.reports, href: '/dashboard/reports' },
        { label: 'المساعد الذكي', icon: Icons.ai, href: '/dashboard/ai-chat' },
        { label: 'سجل النشاط', icon: Icons.activity, href: '/dashboard/activity-log' },
      ]},
    ];
  }

  if (role === 'teacher') {
    return [
      { title: 'الرئيسية', items: [
        { label: 'لوحتي', icon: Icons.dashboard, href: '/dashboard/teacher' },
        { label: 'ملفي الإنجازي', icon: Icons.portfolio, href: '/dashboard/teacher-assignments' },
        { label: 'التقويم', icon: Icons.calendar, href: '/dashboard/calendar' },
      ]},
      { title: 'الفصل الدراسي', items: [
        { label: 'طلابي', icon: Icons.students, href: '/dashboard/students' },
        { label: 'الحضور والغياب', icon: Icons.attendance, href: '/dashboard/attendance' },
        { label: 'الدرجات', icon: Icons.grades, href: '/dashboard/grades' },
        { label: 'الواجبات', icon: Icons.homework, href: '/dashboard/homework' },
        { label: 'السلوك والانضباط', icon: Icons.behavior, href: '/dashboard/behavior' },
      ]},
      { title: 'الاختبارات', items: [
        { label: 'الاختبارات', icon: Icons.exams, href: '/dashboard/exams' },
        { label: 'بنك الأسئلة', icon: Icons.questionBank, href: '/dashboard/question-bank' },
        { label: 'جدول الاختبارات', icon: Icons.examSchedule, href: '/dashboard/exam-schedule' },
        { label: 'أداء الاختبار', icon: Icons.proctoring, href: '/dashboard/exam-take' },
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

  if (role === 'student') {
    return [
      { title: 'الرئيسية', items: [
        { label: 'لوحتي', icon: Icons.dashboard, href: '/dashboard/student' },
        { label: 'التقويم', icon: Icons.calendar, href: '/dashboard/calendar' },
      ]},
      { title: 'الدراسة', items: [
        { label: 'الجدول الدراسي', icon: Icons.weekSched, href: '/dashboard/weekly-schedule' },
        { label: 'الحضور والغياب', icon: Icons.attendance, href: '/dashboard/attendance' },
        { label: 'الدرجات', icon: Icons.grades, href: '/dashboard/grades' },
        { label: 'الواجبات', icon: Icons.homework, href: '/dashboard/homework' },
        { label: 'الاختبارات', icon: Icons.exams, href: '/dashboard/exams' },
        { label: 'أداء الاختبار', icon: Icons.examTake, href: '/dashboard/exam-take' },
        { label: 'جدول الاختبارات', icon: Icons.examSchedule, href: '/dashboard/exam-schedule' },
      ]},
      { title: 'التعليم الإلكتروني', items: [
        { label: 'المحاضرات', icon: Icons.lectures, href: '/dashboard/lectures' },
        { label: 'البث المباشر', icon: Icons.liveStream, href: '/dashboard/live-stream' },
        { label: 'المكتبة الرقمية', icon: Icons.library, href: '/dashboard/library' },
        { label: 'الاستبيانات', icon: Icons.survey, href: '/dashboard/surveys' },
      ]},
      { title: 'الإنجازات', items: [
        { label: 'الشهادات', icon: Icons.certificates, href: '/dashboard/certificates' },
        { label: 'ملفي الإنجازي', icon: Icons.portfolio, href: '/dashboard/portfolio' },
      ]},
      { title: 'الخدمات', items: [
        { label: 'المتجر', icon: Icons.store, href: '/dashboard/store' },
        { label: 'المقصف الذكي', icon: Icons.cafeteria, href: '/dashboard/cafeteria' },
        { label: 'الصحة', icon: Icons.health, href: '/dashboard/health' },
        { label: 'النقل المدرسي', icon: Icons.transport, href: '/dashboard/transport' },
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
        { label: 'لوحتي', icon: Icons.dashboard, href: '/dashboard/driver' },
        { label: 'تطبيق السائق', icon: Icons.driverApp, href: '/driver-app' },
      ]},
      { title: 'العمليات', items: [
        { label: 'الطلاب في رحلتي', icon: Icons.tracking, href: '/dashboard/student-tracking' },
        { label: 'إدارة المركبة', icon: Icons.busMaint, href: '/dashboard/bus-maintenance' },
        { label: 'رخصة القيادة', icon: Icons.driverLic, href: '/dashboard/driver-licenses' },
        { label: 'الوقود', icon: Icons.fuel, href: '/dashboard/fuel' },
        { label: 'الرسائل', icon: Icons.messages, href: '/dashboard/messages' },
        { label: 'الإشعارات', icon: Icons.notification, href: '/dashboard/notifications' },
      ]},
    ];
  }

  if (role === 'guard') {
    return [
      { title: 'الرئيسية', items: [
        { label: 'لوحتي', icon: Icons.dashboard, href: '/dashboard/guard' },
      ]},
      { title: 'الأمن والدخول', items: [
        { label: 'سجل الزوار', icon: Icons.visitors, href: '/dashboard/visitors' },
        { label: 'الطوارئ', icon: Icons.emergencies, href: '/dashboard/emergencies' },
        { label: 'مفاتيح الطوارئ', icon: Icons.emergKeys, href: '/dashboard/emergency-keys' },
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
      { label: 'الملف الشخصي', icon: Icons.users, href: '/profile' },
    ]},
  ];
};

// ─── Role Labels ──────────────────────────────────────────
const roleLabels: Record<string, string> = {
  'super_admin':        'مالك المنصة',
  'platform_owner':     'مالك المنصة',
  'admin':              'مدير المؤسسة',
  'owner':              'مالك المؤسسة',
  'school_owner':       'مدير المدرسة',
  'university_owner':   'مدير الجامعة',
  'institute_owner':    'مدير المعهد',
  'kindergarten_owner': 'مدير الروضة',
  'training_owner':     'مدير التدريب',
  'teacher':            'معلم',
  'student':            'طالب',
  'parent':             'ولي أمر',
  'driver':             'سائق',
  'guard':              'حارس أمن',
  'platform_staff':     'موظف المنصة',
};

// ─── Role Emoji ───────────────────────────────────────────
const roleEmoji: Record<string, string> = {
  'super_admin':        '👑',
  'platform_owner':     '👑',
  'admin':              '🏫',
  'owner':              '🏛️',
  'school_owner':       '🏫',
  'university_owner':   '🎓',
  'institute_owner':    '🏢',
  'kindergarten_owner': '🌱',
  'training_owner':     '📚',
  'teacher':            '👨‍🏫',
  'student':            '🎒',
  'parent':             '👨‍👩‍👧',
  'driver':             '🚌',
  'guard':              '🛡️',
  'platform_staff':     '💼',
};

// ─── Sidebar Component ────────────────────────────────────
export default function Sidebar({ isOpen, onClose, screenSize, userRole = 'admin' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userSchool, setUserSchool] = useState('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const isOverlay = screenSize !== 'desktop';
  const sidebarWidth = 268;
  const accent = getAccent(userRole);

  useEffect(() => {
    const stored = localStorage.getItem('matin_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUserName(u.name || u.first_name || '');
        setUserSchool(u.school_name || '');
      } catch {}
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
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 998,
        }} />
      )}

      <aside style={{
        width: sidebarWidth,
        height: '100vh',
        background: BG,
        borderLeft: `1px solid ${BORDER}`,
        position: isOverlay ? 'fixed' : 'sticky',
        top: 0,
        right: isOverlay ? (isOpen ? 0 : `-${sidebarWidth}px`) : 0,
        zIndex: 999,
        transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>

        {/* ── الشعار وبيانات المستخدم ── */}
        <div style={{
          padding: '18px 16px 16px',
          borderBottom: `1px solid ${BORDER}`,
          flexShrink: 0,
          background: 'rgba(255,255,255,0.01)',
        }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: `linear-gradient(135deg, ${GOLD} 0%, #E8C060 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 19, fontWeight: 900, color: '#000', flexShrink: 0,
              boxShadow: `0 4px 16px rgba(212,168,67,0.35)`,
            }}>م</div>
            <div>
              <div style={{ fontSize: 19, fontWeight: 800, color: TEXT, letterSpacing: -0.5, lineHeight: 1.1 }}>متين</div>
              <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 500, letterSpacing: 0.3 }}>نظام إدارة التعليم</div>
            </div>
          </Link>

          {/* بطاقة المستخدم */}
          <div style={{
            background: accent.bg,
            border: `1px solid ${accent.border}`,
            borderRadius: 10,
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${accent.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17, flexShrink: 0,
            }}>
              {roleEmoji[userRole] || '👤'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: TEXT, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userName || 'المستخدم'}
              </div>
              <div style={{ color: accent.color, fontSize: 11, fontWeight: 600, marginTop: 1 }}>
                {roleLabels[userRole] || userRole}
              </div>
              {userSchool && (
                <div style={{ color: TEXT_MUTED, fontSize: 10, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {userSchool}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── القائمة ── */}
        <nav style={{ flex: 1, padding: '8px 0 4px', overflowY: 'auto', overflowX: 'hidden' }}>
          {menu.map((group, gi) => (
            <div key={gi} style={{ marginBottom: 4 }}>
              <div style={{
                padding: '10px 16px 4px',
                color: TEXT_MUTED,
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
              }}>
                {group.title}
              </div>

              {group.items.map((item, ii) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/owner' && pathname.startsWith(item.href + '/'));
                const isHovered = hoveredItem === `${gi}-${ii}`;
                return (
                  <Link
                    key={ii}
                    href={item.href}
                    onClick={isOverlay ? onClose : undefined}
                    onMouseEnter={() => setHoveredItem(`${gi}-${ii}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                      padding: '7px 14px 7px 16px',
                      textDecoration: 'none',
                      background: isActive ? accent.bg : isHovered ? BG_HOVER : 'transparent',
                      borderRight: isActive ? `3px solid ${accent.color}` : '3px solid transparent',
                      borderRadius: isActive ? '0 8px 8px 0' : '0',
                      transition: 'all 0.15s ease',
                      margin: '1px 6px 1px 0',
                    }}
                  >
                    <span style={{
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      color: isActive ? accent.color : TEXT_DIM,
                      transition: 'color 0.15s',
                    }}>
                      {item.icon}
                    </span>
                    <span style={{
                      color: isActive ? TEXT : isHovered ? TEXT : TEXT_DIM,
                      fontSize: 12.5,
                      fontWeight: isActive ? 600 : 400,
                      transition: 'all 0.15s',
                      flex: 1,
                    }}>
                      {item.label}
                    </span>
                    {isActive && (
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: accent.color,
                        flexShrink: 0,
                        boxShadow: `0 0 6px ${accent.color}`,
                      }} />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* ── تسجيل الخروج ── */}
        <div style={{
          padding: '12px 14px',
          borderTop: `1px solid ${BORDER}`,
          background: 'rgba(255,255,255,0.01)',
          flexShrink: 0,
        }}>
          <button
            onClick={logout}
            style={{
              width: '100%',
              background: 'rgba(248,113,113,0.07)',
              color: '#F87171',
              border: '1px solid rgba(248,113,113,0.15)',
              borderRadius: 9,
              padding: '9px 14px',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'var(--font)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(248,113,113,0.13)';
              e.currentTarget.style.borderColor = 'rgba(248,113,113,0.30)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(248,113,113,0.07)';
              e.currentTarget.style.borderColor = 'rgba(248,113,113,0.15)';
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>{Icons.logout}</span>
            تسجيل الخروج
          </button>
          <div style={{
            marginTop: 8,
            color: 'rgba(238,238,245,0.15)',
            fontSize: 10,
            textAlign: 'center',
            fontWeight: 500,
          }}>
            متين v6 — النظام السيادي للتعليم
          </div>
        </div>
      </aside>
    </>
  );
}
