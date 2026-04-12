"use client";
export const dynamic = 'force-dynamic';
import * as LucideIcons from "lucide-react";

const iconMap: Record<string, any> = {
  ICON_Ambulance: LucideIcons.Ambulance,
  ICON_Angry: LucideIcons.Angry,
  ICON_Award: LucideIcons.Award,
  ICON_BadgeDollarSign: LucideIcons.BadgeDollarSign,
  ICON_Ban: LucideIcons.Ban,
  ICON_Banknote: LucideIcons.Banknote,
  ICON_BarChart3: LucideIcons.BarChart3,
  ICON_Bell: LucideIcons.Bell,
  ICON_Book: LucideIcons.Book,
  ICON_BookMarked: LucideIcons.BookMarked,
  ICON_BookOpen: LucideIcons.BookOpen,
  ICON_Bot: LucideIcons.Bot,
  ICON_Brain: LucideIcons.Brain,
  ICON_Briefcase: LucideIcons.Briefcase,
  ICON_Bug: LucideIcons.Bug,
  ICON_Building: LucideIcons.Building,
  ICON_Building2: LucideIcons.Building2,
  ICON_Bus: LucideIcons.Bus,
  ICON_Calendar: LucideIcons.Calendar,
  ICON_Check: LucideIcons.Check,
  ICON_CheckCircle: LucideIcons.CheckCircle,
  ICON_Circle: LucideIcons.Circle,
  ICON_Clapperboard: LucideIcons.Clapperboard,
  ICON_ClipboardList: LucideIcons.ClipboardList,
  ICON_Coins: LucideIcons.Coins,
  ICON_CreditCard: LucideIcons.CreditCard,
  ICON_Crown: LucideIcons.Crown,
  ICON_Diamond: LucideIcons.Diamond,
  ICON_Drama: LucideIcons.Drama,
  ICON_Dumbbell: LucideIcons.Dumbbell,
  ICON_File: LucideIcons.File,
  ICON_FileText: LucideIcons.FileText,
  ICON_Flag: LucideIcons.Flag,
  ICON_Flower2: LucideIcons.Flower2,
  ICON_Folder: LucideIcons.Folder,
  ICON_FolderOpen: LucideIcons.FolderOpen,
  ICON_Frown: LucideIcons.Frown,
  ICON_Gamepad2: LucideIcons.Gamepad2,
  ICON_Gift: LucideIcons.Gift,
  ICON_Globe: LucideIcons.Globe,
  ICON_GraduationCap: LucideIcons.GraduationCap,
  ICON_Hand: LucideIcons.Hand,
  ICON_HandHeart: LucideIcons.HandHeart,
  ICON_Handshake: LucideIcons.Handshake,
  ICON_Headphones: LucideIcons.Headphones,
  ICON_Heart: LucideIcons.Heart,
  ICON_HelpCircle: LucideIcons.HelpCircle,
  ICON_Hospital: LucideIcons.Hospital,
  ICON_Key: LucideIcons.Key,
  ICON_Landmark: LucideIcons.Landmark,
  ICON_Laptop: LucideIcons.Laptop,
  ICON_Lightbulb: LucideIcons.Lightbulb,
  ICON_Link: LucideIcons.Link,
  ICON_Lock: LucideIcons.Lock,
  ICON_Mail: LucideIcons.Mail,
  ICON_MailOpen: LucideIcons.MailOpen,
  ICON_Mailbox: LucideIcons.Mailbox,
  ICON_Medal: LucideIcons.Medal,
  ICON_Megaphone: LucideIcons.Megaphone,
  ICON_MessageCircle: LucideIcons.MessageCircle,
  ICON_MessageSquare: LucideIcons.MessageSquare,
  ICON_Mic: LucideIcons.Mic,
  ICON_Mic2: LucideIcons.Mic2,
  ICON_Package: LucideIcons.Package,
  ICON_Palette: LucideIcons.Palette,
  ICON_Paperclip: LucideIcons.Paperclip,
  ICON_PartyPopper: LucideIcons.PartyPopper,
  ICON_Phone: LucideIcons.Phone,
  ICON_Pill: LucideIcons.Pill,
  ICON_Pin: LucideIcons.Pin,
  ICON_Plug: LucideIcons.Plug,
  ICON_RefreshCw: LucideIcons.RefreshCw,
  ICON_Satellite: LucideIcons.Satellite,
  ICON_Save: LucideIcons.Save,
  ICON_School: LucideIcons.School,
  ICON_ScrollText: LucideIcons.ScrollText,
  ICON_Shield: LucideIcons.Shield,
  ICON_Shirt: LucideIcons.Shirt,
  ICON_ShoppingCart: LucideIcons.ShoppingCart,
  ICON_Shuffle: LucideIcons.Shuffle,
  ICON_Siren: LucideIcons.Siren,
  ICON_Smartphone: LucideIcons.Smartphone,
  ICON_Sprout: LucideIcons.Sprout,
  ICON_Star: LucideIcons.Star,
  ICON_Syringe: LucideIcons.Syringe,
  ICON_Target: LucideIcons.Target,
  ICON_Ticket: LucideIcons.Ticket,
  ICON_TrendingUp: LucideIcons.TrendingUp,
  ICON_Trophy: LucideIcons.Trophy,
  ICON_Unlock: LucideIcons.Unlock,
  ICON_Upload: LucideIcons.Upload,
  ICON_User: LucideIcons.User,
  ICON_Users: LucideIcons.Users,
  ICON_Video: LucideIcons.Video,
  ICON_Wrench: LucideIcons.Wrench,
  ICON_X: LucideIcons.X,
  ICON_XCircle: LucideIcons.XCircle,
  ICON_Zap: LucideIcons.Zap,
  ICON_PenTool: LucideIcons.PenTool,
  ICON_RotateCcw: LucideIcons.RotateCcw,
  ICON_Tag: LucideIcons.Tag,
};

interface IconRendererProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

export default function IconRenderer({ name, size = 24, className = "", color }: IconRendererProps) {
  const IconComponent = iconMap[name];
  if (IconComponent) {
    return <IconComponent size={size} className={className} style={color ? { color } : undefined} />;
  }
  // fallback - try without ICON_ prefix
  const withPrefix = `ICON_${name}`;
  const FallbackIcon = iconMap[withPrefix];
  if (FallbackIcon) {
    return <FallbackIcon size={size} className={className} style={color ? { color } : undefined} />;
  }
  return <span style={{ fontSize: size }}>{name}</span>;
}
