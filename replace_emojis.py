#!/usr/bin/env python3
import os, re

# SVG helper - returns inline SVG JSX string
def svg(path, color, w=20, h=20):
    return f'<svg width={{{w}}} height={{{h}}} viewBox="0 0 24 24" fill="none" stroke="{color}" strokeWidth={{1.5}} strokeLinecap="round" strokeLinejoin="round"><path d="{path}"/></svg>'

BLUE  = '#3B82F6'
GREEN = '#10B981'
GOLD  = '#D4A843'

# Path library from task spec
P = {
    'dashboard':    'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
    'users':        'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    'students':     'M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5',
    'teachers':     'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    'parents':      'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    'reports':      'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8',
    'settings':     'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
    'notifications':'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
    'documents':    'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2',
    'security':     'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    'curriculum':   'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
    'building':     'M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16',
    'health':       'M22 12h-4l-3 9L9 3l-3 9H2',
    'subscriptions':'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
    'support':      'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    'schedule':     'M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z',
    'homework':     'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4',
    'grades':       'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
    'finance':      'M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    'monitor':      'M20 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z M8 21h8 M12 17v4',
    'attendance':   'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
    'exams':        'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 M12 12h.01 M12 16h.01',
    'transport':    'M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    'cafeteria':    'M18 8h1a4 4 0 0 1 0 8h-1 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z M6 1v3 M10 1v3 M14 1v3',
    'ai':           'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 8v4l3 3',
    'star':         'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    'trophy':       'M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M18 2H6v7a6 6 0 0 0 12 0V2z',
    'analytics':    'M18 20V10 M12 20V4 M6 20v-6',
    'calendar':     'M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z',
    'chat':         'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    'phone':        'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2.68h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
    'globe':        'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
    'crown':        'M2 4l3 12h14l3-12-6 4-4-7-4 7-6-4z M5 20h14',
    'medal':        'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M8.21 13.89L7 23l5-3 5 3-1.21-9.12',
    'check':        'M20 6L9 17l-5-5',
    'plus':         'M12 5v14 M5 12h14',
    'user':         'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    'lock':         'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4',
    'key':          'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
    'mail':         'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
    'warning':      'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01',
    'elearning':    'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
    'activity':     'M22 12h-4l-3 9L9 3l-3 9H2',
    'video':        'M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
    'quran':        'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
    'compass':      'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z',
    'clipboard':    'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z',
    'tool':         'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
    'upload':       'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
    'download':     'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
    'refresh':      'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
    'info':         'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 8h.01 M12 12v4',
    'link':         'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
    'package':      'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
    'search':       'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
    'filter':       'M22 3H2l8 9.46V19l4 2v-8.54L22 3',
    'image':        'M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h4l2 3h3a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    'edit':         'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
    'trash':        'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2',
}

# Emoji → (path_key, color) mapping
# Sorted by string length (longest first to handle ZWJ sequences before single chars)
EMOJI_MAP = [
    # ZWJ sequences (composite emojis) - must come first
    ('\U0001F468\u200D\U0001F393', ('students', GREEN)),   # 👨‍🎓 man student
    ('\U0001F469\u200D\U0001F393', ('students', GREEN)),   # 👩‍🎓 woman student
    ('\U0001F468\u200D\U0001F3EB', ('teachers', GREEN)),   # 👨‍🏫 man teacher
    ('\U0001F469\u200D\U0001F3EB', ('teachers', GREEN)),   # 👩‍🏫 woman teacher
    ('\U0001F468\u200D\U0001F4BC', ('user', BLUE)),        # 👨‍💼 man office
    ('\U0001F469\u200D\U0001F4BC', ('user', BLUE)),        # 👩‍💼 woman office
    ('\U0001F9D1\u200D\U0001F4BC', ('user', BLUE)),        # 🧑‍💼 person office
    ('\U0001F468\u200D\U0001F4BB', ('monitor', BLUE)),     # 👨‍💻 man technologist
    ('\U0001F469\u200D\U0001F4BB', ('monitor', BLUE)),     # 👩‍💻 woman technologist
    ('\U0001F468\u200D\U0001F3CB', ('health', GREEN)),     # 👨‍🏋 man lifting
    ('\U0001F469\u200D\U0001F3CB', ('health', GREEN)),     # 👩‍🏋 woman lifting
    ('\U0001F469\u200D\U0001F37C', ('health', GREEN)),     # 👩‍🍼 woman feeding baby
    ('\U0001F468\u200D\U0001F37C', ('health', GREEN)),     # 👨‍🍼 man feeding baby
    ('\U0001F468\u200D\U0001F467\u200D\U0001F466', ('users', BLUE)),  # 👨‍👧‍👦 family
    ('\U0001F468\u200D\U0001F469\u200D\U0001F467', ('users', BLUE)),  # 👨‍👩‍👧 family
    ('\U0001F9D1\u200D\U0001F393', ('students', GREEN)),   # 🧑‍🎓
    ('\U0001F9D1\u200D\U0001F3EB', ('teachers', GREEN)),   # 🧑‍🏫
    # Single emojis with variation selectors
    ('\u2699\uFE0F', ('settings', BLUE)),   # ⚙️
    ('\u26A0\uFE0F', ('warning', GOLD)),    # ⚠️
    ('\u2714\uFE0F', ('check', GREEN)),     # ✔️
    ('\u2705\uFE0F', ('attendance', GREEN)),# ✅
    # Single code point emojis (sorted by unicode value)
    ('☁', ('upload', BLUE)),        # U+2601 cloud
    ('★', ('star', GOLD)),          # U+2605
    ('☆', ('star', GOLD)),          # U+2606
    ('☰', ('filter', BLUE)),        # U+2630 hamburger
    ('⚙', ('settings', BLUE)),      # U+2699
    ('⚠', ('warning', GOLD)),       # U+26A0
    ('⚡', ('activity', BLUE)),      # U+26A1
    ('⚽', ('activity', GREEN)),     # U+26BD soccer
    ('⛔', ('warning', GOLD)),       # U+26D4
    ('✅', ('attendance', GREEN)),   # U+2705
    ('✈', ('transport', GOLD)),     # U+2708 airplane
    ('✉', ('mail', BLUE)),          # U+2709
    ('✍', ('edit', GOLD)),          # U+270D
    ('✏', ('edit', GOLD)),          # U+270F pencil
    ('✓', ('check', GREEN)),        # U+2713
    ('✕', ('trash', GOLD)),         # U+2715
    ('❌', ('warning', GOLD)),       # U+274C
    ('❓', ('info', BLUE)),          # U+2753
    ('➕', ('plus', BLUE)),          # U+2795
    ('🌅', ('monitor', GOLD)),      # U+1F305 sunrise
    ('🌆', ('monitor', GOLD)),      # U+1F306 city
    ('🌐', ('globe', BLUE)),        # U+1F310
    ('🌱', ('activity', GREEN)),    # U+1F331 seedling
    ('🌴', ('activity', GREEN)),    # U+1F334 palm
    ('🍎', ('health', GREEN)),      # U+1F34E apple
    ('🍼', ('health', GREEN)),      # U+1F37C baby bottle
    ('🍽', ('cafeteria', GOLD)),    # U+1F37D
    ('🎁', ('star', GOLD)),         # U+1F381 gift
    ('🎒', ('students', GREEN)),    # U+1F392 backpack
    ('🎓', ('students', GREEN)),    # U+1F393 graduation cap
    ('🎖', ('medal', GOLD)),        # U+1F396
    ('🎙', ('video', BLUE)),        # U+1F399 studio mic
    ('🎟', ('calendar', GOLD)),     # U+1F39F ticket
    ('🎥', ('video', BLUE)),        # U+1F3A5
    ('🎧', ('video', BLUE)),        # U+1F3A7 headphones
    ('🎨', ('edit', GOLD)),         # U+1F3A8 art
    ('🎬', ('video', BLUE)),        # U+1F3AC clapboard
    ('🎯', ('analytics', BLUE)),    # U+1F3AF target
    ('🏁', ('check', GREEN)),       # U+1F3C1 flag
    ('🏅', ('medal', GOLD)),        # U+1F3C5
    ('🏆', ('trophy', GOLD)),       # U+1F3C6
    ('🏋', ('health', GREEN)),      # U+1F3CB weightlifter
    ('🏖', ('activity', GREEN)),    # U+1F3D6 beach
    ('🏛', ('building', GOLD)),     # U+1F3DB institution
    ('🏠', ('dashboard', BLUE)),    # U+1F3E0 home
    ('🏢', ('building', BLUE)),     # U+1F3E2 office
    ('🏥', ('health', GREEN)),      # U+1F3E5 hospital
    ('🏦', ('finance', GOLD)),      # U+1F3E6 bank
    ('🏪', ('building', BLUE)),     # U+1F3EA store
    ('🏫', ('building', BLUE)),     # U+1F3EB school
    ('🐍', ('tool', BLUE)),         # U+1F40D snake
    ('👁', ('monitor', BLUE)),      # U+1F441 eye
    ('👋', ('user', BLUE)),         # U+1F44B wave
    ('👑', ('crown', GOLD)),        # U+1F451
    ('👤', ('user', BLUE)),         # U+1F464
    ('👥', ('users', BLUE)),        # U+1F465
    ('👦', ('students', GREEN)),    # U+1F466 boy
    ('👧', ('students', GREEN)),    # U+1F467 girl
    ('��', ('user', BLUE)),         # U+1F468 man (base)
    ('👩', ('user', BLUE)),         # U+1F469 woman (base)
    ('👶', ('health', GREEN)),      # U+1F476 baby
    ('💉', ('health', GREEN)),      # U+1F489 syringe
    ('💊', ('health', GREEN)),      # U+1F48A pill
    ('💎', ('star', GOLD)),         # U+1F48E diamond
    ('💬', ('chat', BLUE)),         # U+1F4AC
    ('💰', ('finance', GOLD)),      # U+1F4B0
    ('💳', ('finance', GOLD)),      # U+1F4B3
    ('💹', ('analytics', BLUE)),    # U+1F4B9
    ('💻', ('monitor', BLUE)),      # U+1F4BB laptop
    ('💼', ('reports', BLUE)),      # U+1F4BC briefcase
    ('💾', ('documents', BLUE)),    # U+1F4BE disk
    ('📁', ('documents', BLUE)),    # U+1F4C1 folder
    ('📂', ('documents', BLUE)),    # U+1F4C2 open folder
    ('📄', ('documents', BLUE)),    # U+1F4C4 page
    ('📅', ('schedule', GOLD)),     # U+1F4C5 calendar
    ('📆', ('schedule', GOLD)),     # U+1F4C6 calendar
    ('📈', ('analytics', BLUE)),    # U+1F4C8 chart up
    ('📉', ('analytics', BLUE)),    # U+1F4C9 chart down
    ('📊', ('analytics', BLUE)),    # U+1F4CA bar chart
    ('📋', ('clipboard', BLUE)),    # U+1F4CB clipboard
    ('📌', ('info', BLUE)),         # U+1F4CC pin
    ('📍', ('info', BLUE)),         # U+1F4CD
    ('📖', ('curriculum', GREEN)),  # U+1F4D6 open book
    ('📚', ('curriculum', GREEN)),  # U+1F4DA books
    ('📜', ('documents', BLUE)),    # U+1F4DC scroll
    ('📝', ('homework', GOLD)),     # U+1F4DD memo
    ('📞', ('phone', BLUE)),        # U+1F4DE phone
    ('📢', ('notifications', BLUE)),# U+1F4E2 megaphone
    ('📣', ('notifications', BLUE)),# U+1F4E3
    ('📤', ('upload', BLUE)),       # U+1F4E4
    ('📥', ('download', BLUE)),     # U+1F4E5
    ('📦', ('package', BLUE)),      # U+1F4E6
    ('📧', ('mail', BLUE)),         # U+1F4E7
    ('📨', ('mail', BLUE)),         # U+1F4E8
    ('📭', ('mail', BLUE)),         # U+1F4ED
    ('📱', ('monitor', BLUE)),      # U+1F4F1 mobile
    ('📸', ('image', BLUE)),        # U+1F4F8 camera
    ('📹', ('video', BLUE)),        # U+1F4F9
    ('🔄', ('refresh', BLUE)),      # U+1F504
    ('🔍', ('search', BLUE)),       # U+1F50D
    ('🔐', ('security', GREEN)),    # U+1F510
    ('🔑', ('key', GOLD)),          # U+1F511
    ('🔒', ('lock', GREEN)),        # U+1F512
    ('🔓', ('security', GREEN)),    # U+1F513
    ('🔔', ('notifications', BLUE)),# U+1F514
    ('🔗', ('link', BLUE)),         # U+1F517
    ('🔥', ('activity', BLUE)),     # U+1F525
    ('🔧', ('tool', BLUE)),         # U+1F527
    ('🔬', ('search', BLUE)),       # U+1F52C microscope
    ('🔭', ('search', BLUE)),       # U+1F52D telescope
    ('🔲', ('monitor', BLUE)),      # U+1F532
    ('🔴', ('warning', GOLD)),      # U+1F534 red circle
    ('🕐', ('schedule', GOLD)),     # U+1F550 clock
    ('🖥', ('monitor', BLUE)),      # U+1F5A5
    ('🗂', ('documents', BLUE)),    # U+1F5C2
    ('🗓', ('schedule', GOLD)),     # U+1F5D3
    ('🗺', ('globe', BLUE)),        # U+1F5FA map
    ('🚌', ('transport', GOLD)),    # U+1F68C bus
    ('🚧', ('warning', GOLD)),      # U+1F6A7
    ('🚨', ('notifications', BLUE)),# U+1F6A8 alarm
    ('🚪', ('building', BLUE)),     # U+1F6AA door
    ('🛏', ('health', GREEN)),      # U+1F6CF bed
    ('🛡', ('security', GREEN)),    # U+1F6E1
    ('🟠', ('warning', GOLD)),      # U+1F7E0 orange circle
    ('🟢', ('check', GREEN)),       # U+1F7E2 green circle
    ('🤍', ('health', GREEN)),      # U+1F90D white heart
    ('🤖', ('ai', BLUE)),           # U+1F916
    ('🤝', ('users', BLUE)),        # U+1F91D handshake
    ('🥇', ('medal', GOLD)),        # U+1F947
    ('🥈', ('medal', GOLD)),        # U+1F948
    ('🥉', ('medal', GOLD)),        # U+1F949
    ('🥜', ('cafeteria', GOLD)),    # U+1F95C peanut
    ('🧑', ('user', BLUE)),         # U+1F9D1 person
    ('🧠', ('ai', BLUE)),           # U+1F9E0 brain
    ('🧾', ('finance', GOLD)),      # U+1F9FE receipt
    ('🪪', ('user', BLUE)),         # U+1FABB ID card
]

# Build the SVG for each emoji
EMOJI_SVG = {}
for emoji, (path_key, color) in EMOJI_MAP:
    EMOJI_SVG[emoji] = svg(P[path_key], color)

# Build regex pattern - sort by length descending to match longer sequences first
sorted_emojis = sorted(EMOJI_SVG.keys(), key=lambda x: len(x), reverse=True)
# Escape each emoji for regex
escaped = [re.escape(e) for e in sorted_emojis]
emoji_regex = '|'.join(escaped)

def process_file(filepath):
    with open(filepath, encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    def replace_emoji(m):
        emoji = m.group(0)
        return EMOJI_SVG.get(emoji, emoji)
    
    # Step 1: Replace quoted single-emoji strings: 'EMOJI' or "EMOJI"
    # These appear in object literals like icon: '📊'
    def replace_quoted(m):
        quote = m.group(1)
        emoji = m.group(2)
        close_quote = m.group(3)
        if close_quote == quote:  # matching quotes
            return EMOJI_SVG.get(emoji, m.group(0))
        return m.group(0)
    
    quoted_pattern = re.compile(r"(['\"])(" + emoji_regex + r")(\1)")
    content = quoted_pattern.sub(replace_quoted, content)
    
    # Step 2: Replace bare emojis (in JSX text, etc.)
    bare_pattern = re.compile(emoji_regex)
    content = bare_pattern.sub(replace_emoji, content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

target_files = [
    'src/app/activities/page.tsx',
    'src/app/attendance/page.tsx',
    'src/app/cafeteria/page.tsx',
    'src/app/dashboard/colleges/page.tsx',
    'src/app/dashboard/faculty/page.tsx',
    'src/app/dashboard/frontend-editor-exact/page.tsx',
    'src/app/dashboard/institute-exact/page.tsx',
    'src/app/dashboard/institute-owner/page.tsx',
    'src/app/dashboard/institute-public-exact/page.tsx',
    'src/app/dashboard/muhaffiz/page.tsx',
    'src/app/dashboard/parent-exact/page.tsx',
    'src/app/dashboard/parent/page.tsx',
    'src/app/dashboard/quran-exact/page.tsx',
    'src/app/dashboard/quran-muhaffiz-exact/page.tsx',
    'src/app/dashboard/quran-student-exact/page.tsx',
    'src/app/dashboard/quran-supervisor-exact/page.tsx',
    'src/app/dashboard/school-hr-exact/page.tsx',
    'src/app/dashboard/school-owner-exact/page.tsx',
    'src/app/dashboard/school-owner/page.tsx',
    'src/app/dashboard/school-parent-exact/page.tsx',
    'src/app/dashboard/school-public-exact/page.tsx',
    'src/app/dashboard/staff/page.tsx',
    'src/app/dashboard/student-exact/page.tsx',
    'src/app/dashboard/super-admin-exact/page.tsx',
    'src/app/dashboard/supervisor/page.tsx',
    'src/app/dashboard/teacher-exact/page.tsx',
    'src/app/dashboard/teacher/page.tsx',
    'src/app/dashboard/trainee/page.tsx',
    'src/app/dashboard/trainer/page.tsx',
    'src/app/dashboard/training-exact/page.tsx',
    'src/app/dashboard/training-owner/page.tsx',
    'src/app/dashboard/training-public-exact/page.tsx',
    'src/app/dashboard/training-trainee-exact/page.tsx',
    'src/app/dashboard/training-trainer-exact/page.tsx',
    'src/app/dashboard/university-dean-exact/page.tsx',
    'src/app/dashboard/university-exact/page.tsx',
    'src/app/dashboard/university-faculty-exact/page.tsx',
    'src/app/dashboard/university-owner/page.tsx',
    'src/app/dashboard/university-parent-exact/page.tsx',
    'src/app/dashboard/university-president-exact/page.tsx',
    'src/app/dashboard/university-staff-exact/page.tsx',
    'src/app/dashboard/university-student-exact/page.tsx',
    'src/app/driver-app/page.tsx',
    'src/app/elearning/page.tsx',
    'src/app/events/page.tsx',
    'src/app/exams/page.tsx',
    'src/app/finance/page.tsx',
    'src/app/forgot-password/page.tsx',
    'src/app/health/page.tsx',
    'src/app/institute/[code]/page.tsx',
    'src/app/institute/dashboard/page.tsx',
    'src/app/owner/dashboard/page.tsx',
    'src/app/owner/page.tsx',
    'src/app/owner/services/page.tsx',
    'src/app/profile/[id]/page.tsx',
    'src/app/quran/dashboard/page.tsx',
    'src/app/quran/session/page.tsx',
    'src/app/quran/student/page.tsx',
    'src/app/quran/supervisor/page.tsx',
    'src/app/quran/teacher/page.tsx',
    'src/app/reset-password/page.tsx',
    'src/app/schedule/page.tsx',
    'src/app/school/[code]/join/page.tsx',
    'src/app/school/[code]/page.tsx',
    'src/app/school/parent/page.tsx',
    'src/app/school/teacher/page.tsx',
    'src/app/training/dashboard/page.tsx',
    'src/app/training/manager/page.tsx',
    'src/app/training/trainee/page.tsx',
    'src/app/training/trainer/page.tsx',
    'src/app/transport/page.tsx',
    'src/app/university/dean/page.tsx',
    'src/app/university/hr/page.tsx',
    'src/app/university/parent/page.tsx',
    'src/app/university/president/page.tsx',
    'src/app/university/professor/page.tsx',
    'src/app/university/student/page.tsx',
]

changed = 0
missing = 0
for f in target_files:
    if os.path.exists(f):
        if process_file(f):
            changed += 1
            print(f'  ✓ {f}')
    else:
        print(f'  MISSING: {f}')
        missing += 1

print(f'\nDone: {changed} files changed, {missing} missing')
