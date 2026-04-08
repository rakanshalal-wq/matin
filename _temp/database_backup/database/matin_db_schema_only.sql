--
-- PostgreSQL database dump
--

\restrict 4FYZ7ftgIFcBfPRwAifdN19OkCx4eaRIfq9BeTCrBSIuHV2gfRKkbWeXTHpD829

-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: AttendanceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AttendanceStatus" AS ENUM (
    'PRESENT',
    'ABSENT',
    'LATE',
    'EXCUSED'
);


ALTER TYPE public."AttendanceStatus" OWNER TO postgres;

--
-- Name: ExamStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ExamStatus" AS ENUM (
    'DRAFT',
    'SCHEDULED',
    'ONGOING',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."ExamStatus" OWNER TO postgres;

--
-- Name: ExamType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ExamType" AS ENUM (
    'QUIZ',
    'MIDTERM',
    'FINAL',
    'ASSIGNMENT'
);


ALTER TYPE public."ExamType" OWNER TO postgres;

--
-- Name: Gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Gender" AS ENUM (
    'MALE',
    'FEMALE'
);


ALTER TYPE public."Gender" OWNER TO postgres;

--
-- Name: InvoiceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InvoiceStatus" AS ENUM (
    'PENDING',
    'PAID',
    'OVERDUE',
    'CANCELLED',
    'PARTIAL'
);


ALTER TYPE public."InvoiceStatus" OWNER TO postgres;

--
-- Name: LeaveStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LeaveStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."LeaveStatus" OWNER TO postgres;

--
-- Name: LeaveType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LeaveType" AS ENUM (
    'ANNUAL',
    'SICK',
    'EMERGENCY',
    'UNPAID'
);


ALTER TYPE public."LeaveType" OWNER TO postgres;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NotificationType" AS ENUM (
    'INFO',
    'WARNING',
    'SUCCESS',
    'ERROR'
);


ALTER TYPE public."NotificationType" OWNER TO postgres;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- Name: SchoolStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SchoolStatus" AS ENUM (
    'ACTIVE',
    'TRIAL',
    'SUSPENDED',
    'CANCELLED',
    'PENDING',
    'REJECTED'
);


ALTER TYPE public."SchoolStatus" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'SUPER_ADMIN',
    'SCHOOL_OWNER',
    'ADMIN',
    'TEACHER',
    'STUDENT',
    'PARENT'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
    'PENDING'
);


ALTER TYPE public."UserStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: academic_years; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.academic_years (
    id text NOT NULL,
    name text NOT NULL,
    name_ar text NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    is_current boolean DEFAULT false NOT NULL,
    school_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.academic_years OWNER TO postgres;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activities (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    type character varying(100),
    date timestamp without time zone,
    location character varying(200),
    participants text,
    status character varying(50) DEFAULT 'planned'::character varying,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.activities OWNER TO postgres;

--
-- Name: activities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activities_id_seq OWNER TO postgres;

--
-- Name: activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activities_id_seq OWNED BY public.activities.id;


--
-- Name: activity_log; Type: TABLE; Schema: public; Owner: matin
--

CREATE TABLE public.activity_log (
    id integer NOT NULL,
    user_id integer,
    action character varying(255) NOT NULL,
    entity character varying(100),
    entity_id character varying(100),
    details jsonb,
    ip_address character varying(50),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.activity_log OWNER TO matin;

--
-- Name: activity_log_id_seq; Type: SEQUENCE; Schema: public; Owner: matin
--

CREATE SEQUENCE public.activity_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_log_id_seq OWNER TO matin;

--
-- Name: activity_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matin
--

ALTER SEQUENCE public.activity_log_id_seq OWNED BY public.activity_log.id;


--
-- Name: addon_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addon_plans (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    billing_cycle character varying(50) DEFAULT 'monthly'::character varying,
    icon character varying(100),
    color character varying(20),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.addon_plans OWNER TO postgres;

--
-- Name: addon_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.addon_plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.addon_plans_id_seq OWNER TO postgres;

--
-- Name: addon_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.addon_plans_id_seq OWNED BY public.addon_plans.id;


--
-- Name: admissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admissions (
    id integer NOT NULL,
    student_name character varying(200) NOT NULL,
    parent_name character varying(200),
    phone character varying(50),
    email character varying(200),
    grade_applying character varying(50),
    previous_school character varying(200),
    documents jsonb DEFAULT '[]'::jsonb,
    status character varying(50) DEFAULT 'pending'::character varying,
    notes text,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.admissions OWNER TO postgres;

--
-- Name: admissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admissions_id_seq OWNER TO postgres;

--
-- Name: admissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admissions_id_seq OWNED BY public.admissions.id;


--
-- Name: ads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ads (
    id integer NOT NULL,
    title text NOT NULL,
    content text,
    image_url text,
    link_url text,
    advertiser text,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    is_active boolean DEFAULT true,
    show_on_schools boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    is_platform_ad boolean DEFAULT false,
    owner_id text,
    school_id text
);


ALTER TABLE public.ads OWNER TO postgres;

--
-- Name: ads_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ads_id_seq OWNER TO postgres;

--
-- Name: ads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ads_id_seq OWNED BY public.ads.id;


--
-- Name: advertisements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.advertisements (
    id integer NOT NULL,
    title character varying(255),
    image_url text,
    link character varying(255),
    bg_color character varying(50) DEFAULT 'rgba(201, 162, 39, 0.2)'::character varying,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.advertisements OWNER TO postgres;

--
-- Name: advertisements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.advertisements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.advertisements_id_seq OWNER TO postgres;

--
-- Name: advertisements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.advertisements_id_seq OWNED BY public.advertisements.id;


--
-- Name: ai_chats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_chats (
    id integer NOT NULL,
    user_id integer,
    message text,
    reply text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ai_chats OWNER TO postgres;

--
-- Name: ai_chats_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ai_chats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ai_chats_id_seq OWNER TO postgres;

--
-- Name: ai_chats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ai_chats_id_seq OWNED BY public.ai_chats.id;


--
-- Name: ai_moderation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_moderation (
    id integer NOT NULL,
    content_type character varying(20) NOT NULL,
    content_id integer NOT NULL,
    content_text text NOT NULL,
    safety_score integer DEFAULT 100,
    verdict character varying(20) DEFAULT 'safe'::character varying,
    categories jsonb DEFAULT '{}'::jsonb,
    ai_explanation text,
    action_taken character varying(30) DEFAULT 'none'::character varying,
    reviewed_by_human boolean DEFAULT false,
    model_used character varying(50) DEFAULT 'gpt-4.1-mini'::character varying,
    tokens_used integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ai_moderation OWNER TO postgres;

--
-- Name: ai_moderation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ai_moderation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ai_moderation_id_seq OWNER TO postgres;

--
-- Name: ai_moderation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ai_moderation_id_seq OWNED BY public.ai_moderation.id;


--
-- Name: ai_moderation_log; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.ai_moderation_log AS
 SELECT id,
    content_type,
    content_id,
    content_text,
    safety_score,
    verdict,
    categories,
    ai_explanation,
    action_taken,
    reviewed_by_human,
    model_used,
    tokens_used,
    created_at
   FROM public.ai_moderation;


ALTER VIEW public.ai_moderation_log OWNER TO postgres;

--
-- Name: announcements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.announcements (
    id text NOT NULL,
    title text NOT NULL,
    title_ar text,
    content text NOT NULL,
    content_ar text,
    priority text,
    published_at timestamp(3) without time zone,
    expires_at timestamp(3) without time zone,
    school_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.announcements OWNER TO postgres;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id integer NOT NULL,
    title character varying(200),
    date timestamp without time zone,
    location character varying(200),
    attendees text,
    school_id text,
    owner_id text,
    status character varying(20) DEFAULT 'scheduled'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- Name: appointments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.appointments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.appointments_id_seq OWNER TO postgres;

--
-- Name: appointments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.appointments_id_seq OWNED BY public.appointments.id;


--
-- Name: assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignments (
    id text NOT NULL,
    title text NOT NULL,
    title_ar text,
    description text,
    due_date timestamp(3) without time zone NOT NULL,
    total_marks integer NOT NULL,
    course_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.assignments OWNER TO postgres;

--
-- Name: attendance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance (
    id integer NOT NULL,
    student_id integer,
    lecture_id integer,
    status character varying(20) DEFAULT 'absent'::character varying,
    check_in_time timestamp without time zone,
    notes text,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.attendance OWNER TO postgres;

--
-- Name: attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_id_seq OWNER TO postgres;

--
-- Name: attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;


--
-- Name: attendances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendances (
    id text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    status public."AttendanceStatus" NOT NULL,
    notes text,
    student_id text NOT NULL,
    class_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.attendances OWNER TO postgres;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id text NOT NULL,
    action text NOT NULL,
    entity text NOT NULL,
    entity_id text NOT NULL,
    old_data jsonb,
    new_data jsonb,
    ip_address text,
    user_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    admin_id integer
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: behavior; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.behavior (
    id integer NOT NULL,
    student_id integer,
    student_name character varying(200),
    type character varying(50) DEFAULT 'positive'::character varying,
    description text,
    points integer DEFAULT 0,
    date date DEFAULT CURRENT_DATE,
    teacher_id integer,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.behavior OWNER TO postgres;

--
-- Name: behavior_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.behavior_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.behavior_id_seq OWNER TO postgres;

--
-- Name: behavior_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.behavior_id_seq OWNED BY public.behavior.id;


--
-- Name: book_borrowings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book_borrowings (
    id text NOT NULL,
    borrowed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    due_date timestamp(3) without time zone NOT NULL,
    returned_at timestamp(3) without time zone,
    borrower_id text NOT NULL,
    book_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.book_borrowings OWNER TO postgres;

--
-- Name: bus_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bus_events (
    id integer NOT NULL,
    bus_id integer,
    event_type character varying(100),
    description text,
    date timestamp without time zone DEFAULT now(),
    school_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.bus_events OWNER TO postgres;

--
-- Name: bus_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bus_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bus_events_id_seq OWNER TO postgres;

--
-- Name: bus_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bus_events_id_seq OWNED BY public.bus_events.id;


--
-- Name: bus_live_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bus_live_location (
    id integer NOT NULL,
    bus_id integer,
    driver_id integer,
    latitude numeric(10,8),
    longitude numeric(11,8),
    speed numeric(5,2),
    heading numeric(5,2),
    status text DEFAULT 'active'::text,
    school_id text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.bus_live_location OWNER TO postgres;

--
-- Name: bus_live_location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bus_live_location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bus_live_location_id_seq OWNER TO postgres;

--
-- Name: bus_live_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bus_live_location_id_seq OWNED BY public.bus_live_location.id;


--
-- Name: bus_maintenance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bus_maintenance (
    id integer NOT NULL,
    bus_number character varying(50),
    maintenance_type character varying(100),
    description text,
    cost numeric(10,2),
    date date,
    next_maintenance date,
    status character varying(50) DEFAULT 'completed'::character varying,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.bus_maintenance OWNER TO postgres;

--
-- Name: bus_maintenance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bus_maintenance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bus_maintenance_id_seq OWNER TO postgres;

--
-- Name: bus_maintenance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bus_maintenance_id_seq OWNED BY public.bus_maintenance.id;


--
-- Name: bus_riders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bus_riders (
    id integer NOT NULL,
    student_id integer,
    bus_id integer,
    pickup_point character varying(200),
    dropoff_point character varying(200),
    school_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.bus_riders OWNER TO postgres;

--
-- Name: bus_riders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bus_riders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bus_riders_id_seq OWNER TO postgres;

--
-- Name: bus_riders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bus_riders_id_seq OWNED BY public.bus_riders.id;


--
-- Name: bus_trips; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bus_trips (
    id integer NOT NULL,
    bus_id integer,
    route character varying(200),
    departure_time timestamp without time zone,
    arrival_time timestamp without time zone,
    status character varying(50) DEFAULT 'scheduled'::character varying,
    school_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.bus_trips OWNER TO postgres;

--
-- Name: bus_trips_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bus_trips_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bus_trips_id_seq OWNER TO postgres;

--
-- Name: bus_trips_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bus_trips_id_seq OWNED BY public.bus_trips.id;


--
-- Name: buses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buses (
    id integer NOT NULL,
    bus_number character varying(50),
    capacity integer,
    driver_id integer,
    route character varying(200),
    status character varying(50) DEFAULT 'active'::character varying,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.buses OWNER TO postgres;

--
-- Name: buses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.buses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.buses_id_seq OWNER TO postgres;

--
-- Name: buses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.buses_id_seq OWNED BY public.buses.id;


--
-- Name: cafeteria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cafeteria (
    id integer NOT NULL,
    item_name character varying(200) NOT NULL,
    category character varying(100),
    price numeric(10,2),
    quantity integer DEFAULT 0,
    is_available boolean DEFAULT true,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cafeteria OWNER TO postgres;

--
-- Name: cafeteria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cafeteria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cafeteria_id_seq OWNER TO postgres;

--
-- Name: cafeteria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cafeteria_id_seq OWNED BY public.cafeteria.id;


--
-- Name: calendar_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calendar_events (
    id integer NOT NULL,
    title character varying(300) NOT NULL,
    description text,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    type character varying(100),
    color character varying(20),
    all_day boolean DEFAULT false,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.calendar_events OWNER TO postgres;

--
-- Name: calendar_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.calendar_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.calendar_events_id_seq OWNER TO postgres;

--
-- Name: calendar_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.calendar_events_id_seq OWNED BY public.calendar_events.id;


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: matin
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    user_id integer,
    product_id integer,
    quantity integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cart_items OWNER TO matin;

--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: matin
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_id_seq OWNER TO matin;

--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matin
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: certificates; Type: TABLE; Schema: public; Owner: matin
--

CREATE TABLE public.certificates (
    id integer NOT NULL,
    student_id integer,
    student_name character varying(200),
    type character varying(100) DEFAULT 'completion'::character varying,
    title character varying(300),
    description text,
    grade numeric(5,2),
    issue_date date DEFAULT CURRENT_DATE,
    certificate_number character varying(100),
    template character varying(100) DEFAULT 'default'::character varying,
    status character varying(50) DEFAULT 'issued'::character varying,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.certificates OWNER TO matin;

--
-- Name: certificates_id_seq; Type: SEQUENCE; Schema: public; Owner: matin
--

CREATE SEQUENCE public.certificates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certificates_id_seq OWNER TO matin;

--
-- Name: certificates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matin
--

ALTER SEQUENCE public.certificates_id_seq OWNED BY public.certificates.id;


--
-- Name: chat_rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_rooms (
    id integer NOT NULL,
    name character varying(200),
    type character varying(50) DEFAULT 'group'::character varying,
    members jsonb DEFAULT '[]'::jsonb,
    school_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.chat_rooms OWNER TO postgres;

--
-- Name: chat_rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chat_rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_rooms_id_seq OWNER TO postgres;

--
-- Name: chat_rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chat_rooms_id_seq OWNED BY public.chat_rooms.id;


--
-- Name: circulars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.circulars (
    id integer NOT NULL,
    title character varying(300) NOT NULL,
    content text,
    type character varying(100),
    target_audience character varying(100),
    priority character varying(50) DEFAULT 'normal'::character varying,
    attachments jsonb DEFAULT '[]'::jsonb,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.circulars OWNER TO postgres;

--
-- Name: circulars_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.circulars_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.circulars_id_seq OWNER TO postgres;

--
-- Name: circulars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.circulars_id_seq OWNED BY public.circulars.id;


--
-- Name: classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.classes (
    id text NOT NULL,
    name text NOT NULL,
    name_ar text NOT NULL,
    grade text NOT NULL,
    section text,
    capacity integer DEFAULT 30 NOT NULL,
    school_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.classes OWNER TO postgres;

--
-- Name: clinic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clinic (
    id integer NOT NULL,
    patient_id integer,
    patient_name character varying(200),
    complaint text,
    diagnosis text,
    treatment text,
    visit_date timestamp without time zone DEFAULT now(),
    doctor_name character varying(200),
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.clinic OWNER TO postgres;

--
-- Name: clinic_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clinic_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clinic_id_seq OWNER TO postgres;

--
-- Name: clinic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clinic_id_seq OWNED BY public.clinic.id;


--
-- Name: cms_ads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cms_ads (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    image_url character varying(500) NOT NULL,
    link_url character varying(500),
    school_id integer,
    is_active boolean DEFAULT true,
    display_position character varying(50),
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cms_ads OWNER TO postgres;

--
-- Name: cms_ads_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cms_ads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cms_ads_id_seq OWNER TO postgres;

--
-- Name: cms_ads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cms_ads_id_seq OWNED BY public.cms_ads.id;


--
-- Name: cms_banners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cms_banners (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    image_url character varying(500) NOT NULL,
    link_url character varying(500),
    button_text character varying(100),
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cms_banners OWNER TO postgres;

--
-- Name: cms_banners_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cms_banners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cms_banners_id_seq OWNER TO postgres;

--
-- Name: cms_banners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cms_banners_id_seq OWNED BY public.cms_banners.id;


--
-- Name: cms_sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cms_sections (
    id integer NOT NULL,
    section_key character varying(50) NOT NULL,
    title character varying(255),
    description text,
    content text,
    image_url character varying(500),
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cms_sections OWNER TO postgres;

--
-- Name: cms_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cms_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cms_sections_id_seq OWNER TO postgres;

--
-- Name: cms_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cms_sections_id_seq OWNED BY public.cms_sections.id;


--
-- Name: cms_seo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cms_seo (
    id integer NOT NULL,
    page_key character varying(50) NOT NULL,
    meta_title character varying(255),
    meta_description character varying(500),
    meta_keywords character varying(500),
    og_image character varying(500),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cms_seo OWNER TO postgres;

--
-- Name: cms_seo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cms_seo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cms_seo_id_seq OWNER TO postgres;

--
-- Name: cms_seo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cms_seo_id_seq OWNED BY public.cms_seo.id;


--
-- Name: colleges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.colleges (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    code character varying(50),
    school_id text,
    owner_id text,
    description text,
    dean character varying(100),
    phone character varying(20),
    email character varying(150),
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.colleges OWNER TO postgres;

--
-- Name: colleges_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.colleges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.colleges_id_seq OWNER TO postgres;

--
-- Name: colleges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.colleges_id_seq OWNED BY public.colleges.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    user_id integer,
    post_id integer,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_hidden boolean DEFAULT false,
    status character varying(20) DEFAULT 'active'::character varying,
    reports_count integer DEFAULT 0,
    ai_verdict character varying(20) DEFAULT 'pending'::character varying
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: commissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.commissions (
    id integer NOT NULL,
    user_id integer,
    amount numeric(10,2),
    type character varying(100),
    reference_id integer,
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.commissions OWNER TO postgres;

--
-- Name: commissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.commissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.commissions_id_seq OWNER TO postgres;

--
-- Name: commissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.commissions_id_seq OWNED BY public.commissions.id;


--
-- Name: community_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.community_comments (
    id integer NOT NULL,
    post_id integer,
    user_id integer,
    content text,
    school_id text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.community_comments OWNER TO postgres;

--
-- Name: community_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.community_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.community_comments_id_seq OWNER TO postgres;

--
-- Name: community_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.community_comments_id_seq OWNED BY public.community_comments.id;


--
-- Name: community_likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.community_likes (
    id integer NOT NULL,
    post_id integer,
    user_id integer,
    school_id text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.community_likes OWNER TO postgres;

--
-- Name: community_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.community_likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.community_likes_id_seq OWNER TO postgres;

--
-- Name: community_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.community_likes_id_seq OWNED BY public.community_likes.id;


--
-- Name: community_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.community_posts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    content text,
    media_urls jsonb,
    post_type text DEFAULT 'public'::text,
    school_id text,
    is_approved boolean DEFAULT false,
    ai_flagged boolean DEFAULT false,
    ai_flag_reason text,
    likes_count integer DEFAULT 0,
    comments_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.community_posts OWNER TO postgres;

--
-- Name: community_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.community_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.community_posts_id_seq OWNER TO postgres;

--
-- Name: community_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.community_posts_id_seq OWNED BY public.community_posts.id;


--
-- Name: complaints; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.complaints (
    id integer NOT NULL,
    user_id integer,
    user_name character varying(200),
    subject character varying(300),
    description text,
    category character varying(100),
    priority character varying(50) DEFAULT 'medium'::character varying,
    status character varying(50) DEFAULT 'open'::character varying,
    response text,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.complaints OWNER TO postgres;

--
-- Name: complaints_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.complaints_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.complaints_id_seq OWNER TO postgres;

--
-- Name: complaints_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.complaints_id_seq OWNED BY public.complaints.id;


--
-- Name: content_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.content_reports (
    id integer NOT NULL,
    content_type character varying(20) NOT NULL,
    content_id integer NOT NULL,
    reporter_id integer,
    reason character varying(100) NOT NULL,
    description text,
    status character varying(20) DEFAULT 'pending'::character varying,
    reviewed_by integer,
    reviewed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.content_reports OWNER TO postgres;

--
-- Name: content_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.content_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.content_reports_id_seq OWNER TO postgres;

--
-- Name: content_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.content_reports_id_seq OWNED BY public.content_reports.id;


--
-- Name: contracts_docs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contracts_docs (
    id integer NOT NULL,
    title character varying(300) NOT NULL,
    content text,
    party_name character varying(200),
    start_date date,
    end_date date,
    value numeric(10,2),
    status character varying(50) DEFAULT 'draft'::character varying,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.contracts_docs OWNER TO postgres;

--
-- Name: contracts_docs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contracts_docs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contracts_docs_id_seq OWNER TO postgres;

--
-- Name: contracts_docs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contracts_docs_id_seq OWNED BY public.contracts_docs.id;


--
-- Name: counseling; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.counseling (
    id integer NOT NULL,
    student_id integer,
    counselor_id integer,
    type character varying(50),
    notes text,
    school_id text,
    owner_id text,
    status character varying(20) DEFAULT 'active'::character varying,
    session_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.counseling OWNER TO postgres;

--
-- Name: counseling_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.counseling_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.counseling_id_seq OWNER TO postgres;

--
-- Name: counseling_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.counseling_id_seq OWNED BY public.counseling.id;


--
-- Name: coupons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupons (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    discount_type character varying(20) DEFAULT 'percentage'::character varying,
    discount_value numeric(10,2),
    max_uses integer,
    used_count integer DEFAULT 0,
    valid_from date,
    valid_until date,
    is_active boolean DEFAULT true,
    school_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.coupons OWNER TO postgres;

--
-- Name: coupons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coupons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coupons_id_seq OWNER TO postgres;

--
-- Name: coupons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coupons_id_seq OWNED BY public.coupons.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    name_ar text NOT NULL,
    description text,
    credits integer DEFAULT 1 NOT NULL,
    school_id text NOT NULL,
    subject_id text,
    teacher_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: credit_hours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credit_hours (
    id integer NOT NULL,
    course_name character varying(200),
    hours integer DEFAULT 3,
    department character varying(100),
    school_id text,
    owner_id text,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.credit_hours OWNER TO postgres;

--
-- Name: credit_hours_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.credit_hours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.credit_hours_id_seq OWNER TO postgres;

--
-- Name: credit_hours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.credit_hours_id_seq OWNED BY public.credit_hours.id;


--
-- Name: curriculum; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.curriculum (
    id integer NOT NULL,
    name character varying(200),
    subject character varying(100),
    grade character varying(50),
    description text,
    school_id text,
    owner_id text,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.curriculum OWNER TO postgres;

--
-- Name: curriculum_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.curriculum_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.curriculum_id_seq OWNER TO postgres;

--
-- Name: curriculum_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.curriculum_id_seq OWNED BY public.curriculum.id;


--
-- Name: delegates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.delegates (
    id integer NOT NULL,
    student_id integer,
    name text,
    relation text,
    phone text,
    id_number text,
    photo text,
    school_id text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.delegates OWNER TO postgres;

--
-- Name: delegates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.delegates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.delegates_id_seq OWNER TO postgres;

--
-- Name: delegates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.delegates_id_seq OWNED BY public.delegates.id;


--
-- Name: driver_licenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver_licenses (
    id integer NOT NULL,
    driver_id integer,
    license_type character varying(50),
    license_number character varying(100),
    issue_date date,
    expiry_date date,
    status character varying(50) DEFAULT 'valid'::character varying,
    school_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.driver_licenses OWNER TO postgres;

--
-- Name: driver_licenses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.driver_licenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.driver_licenses_id_seq OWNER TO postgres;

--
-- Name: driver_licenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.driver_licenses_id_seq OWNED BY public.driver_licenses.id;


--
-- Name: drivers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.drivers (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    phone character varying(50),
    license_number character varying(100),
    license_expiry date,
    status character varying(50) DEFAULT 'active'::character varying,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.drivers OWNER TO postgres;

--
-- Name: drivers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.drivers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.drivers_id_seq OWNER TO postgres;

--
-- Name: drivers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.drivers_id_seq OWNED BY public.drivers.id;


--
-- Name: elearning; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.elearning (
    id integer NOT NULL,
    title character varying(300) NOT NULL,
    description text,
    content_url character varying(500),
    type character varying(100),
    subject character varying(200),
    grade_level character varying(50),
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.elearning OWNER TO postgres;

--
-- Name: elearning_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.elearning_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.elearning_id_seq OWNER TO postgres;

--
-- Name: elearning_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.elearning_id_seq OWNED BY public.elearning.id;


--
-- Name: email_otps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_otps (
    id integer NOT NULL,
    email text NOT NULL,
    otp text NOT NULL,
    purpose text DEFAULT 'verify'::text,
    expires_at timestamp without time zone NOT NULL,
    used boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.email_otps OWNER TO postgres;

--
-- Name: email_otps_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.email_otps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.email_otps_id_seq OWNER TO postgres;

--
-- Name: email_otps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.email_otps_id_seq OWNED BY public.email_otps.id;


--
-- Name: emergencies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emergencies (
    id integer NOT NULL,
    title character varying(300) NOT NULL,
    description text,
    type character varying(100),
    severity character varying(50) DEFAULT 'medium'::character varying,
    status character varying(50) DEFAULT 'active'::character varying,
    reported_by integer,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.emergencies OWNER TO postgres;

--
-- Name: emergencies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emergencies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emergencies_id_seq OWNER TO postgres;

--
-- Name: emergencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emergencies_id_seq OWNED BY public.emergencies.id;


--
-- Name: emergency_key_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emergency_key_logs (
    id integer NOT NULL,
    key_id integer,
    action character varying(100),
    user_id integer,
    details text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.emergency_key_logs OWNER TO postgres;

--
-- Name: emergency_key_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emergency_key_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emergency_key_logs_id_seq OWNER TO postgres;

--
-- Name: emergency_key_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emergency_key_logs_id_seq OWNED BY public.emergency_key_logs.id;


--
-- Name: emergency_keys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emergency_keys (
    id integer NOT NULL,
    exam_id integer,
    key_value character varying(200),
    is_used boolean DEFAULT false,
    used_by integer,
    used_at timestamp without time zone,
    school_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.emergency_keys OWNER TO postgres;

--
-- Name: emergency_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emergency_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emergency_keys_id_seq OWNER TO postgres;

--
-- Name: emergency_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emergency_keys_id_seq OWNED BY public.emergency_keys.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id text NOT NULL,
    title text NOT NULL,
    title_ar text,
    description text,
    location text,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone,
    is_all_day boolean DEFAULT false NOT NULL,
    school_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.events OWNER TO postgres;

--
-- Name: exam_ai_analysis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exam_ai_analysis (
    id integer NOT NULL,
    exam_id text,
    school_id character varying(100),
    analysis_type character varying(50),
    result jsonb,
    recommendations text[],
    weak_topics text[],
    strong_topics text[],
    average_score numeric(5,2),
    pass_rate numeric(5,2),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.exam_ai_analysis OWNER TO postgres;

--
-- Name: exam_ai_analysis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exam_ai_analysis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exam_ai_analysis_id_seq OWNER TO postgres;

--
-- Name: exam_ai_analysis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exam_ai_analysis_id_seq OWNED BY public.exam_ai_analysis.id;


--
-- Name: exam_answers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exam_answers (
    id text NOT NULL,
    session_id text NOT NULL,
    question_id text,
    question_bank_id integer,
    answer text,
    is_correct boolean DEFAULT false,
    time_spent_seconds integer DEFAULT 0,
    answered_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.exam_answers OWNER TO postgres;

--
-- Name: exam_print_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exam_print_logs (
    id integer NOT NULL,
    exam_id integer,
    user_id integer,
    copies integer DEFAULT 1,
    printed_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.exam_print_logs OWNER TO postgres;

--
-- Name: exam_print_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exam_print_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exam_print_logs_id_seq OWNER TO postgres;

--
-- Name: exam_print_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exam_print_logs_id_seq OWNED BY public.exam_print_logs.id;


--
-- Name: exam_proctoring_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exam_proctoring_sessions (
    id integer NOT NULL,
    exam_id integer,
    student_id integer,
    status character varying(50) DEFAULT 'active'::character varying,
    violations_count integer DEFAULT 0,
    started_at timestamp without time zone,
    ended_at timestamp without time zone,
    school_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.exam_proctoring_sessions OWNER TO postgres;

--
-- Name: exam_proctoring_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exam_proctoring_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exam_proctoring_sessions_id_seq OWNER TO postgres;

--
-- Name: exam_proctoring_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exam_proctoring_sessions_id_seq OWNED BY public.exam_proctoring_sessions.id;


--
-- Name: exam_questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exam_questions (
    id text NOT NULL,
    "order" integer NOT NULL,
    exam_id text NOT NULL,
    question_id text,
    question_bank_id integer,
    points numeric(5,2) DEFAULT 1,
    question_text text,
    options jsonb,
    correct_answer text,
    difficulty text,
    ai_generated boolean DEFAULT false,
    topic character varying(100),
    explanation text,
    bloom_level character varying(30),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.exam_questions OWNER TO postgres;

--
-- Name: exam_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exam_results (
    id integer NOT NULL,
    exam_id text NOT NULL,
    student_id text NOT NULL,
    school_id text,
    score numeric DEFAULT 0,
    max_score numeric DEFAULT 100,
    percentage numeric DEFAULT 0,
    passed boolean DEFAULT false,
    answers jsonb DEFAULT '{}'::jsonb,
    time_taken integer DEFAULT 0,
    submitted_at timestamp without time zone DEFAULT now(),
    graded_at timestamp without time zone,
    graded_by integer,
    feedback text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.exam_results OWNER TO postgres;

--
-- Name: exam_results_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exam_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exam_results_id_seq OWNER TO postgres;

--
-- Name: exam_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exam_results_id_seq OWNED BY public.exam_results.id;


--
-- Name: exam_rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exam_rooms (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    capacity integer,
    location character varying(200),
    equipment text,
    is_available boolean DEFAULT true,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.exam_rooms OWNER TO postgres;

--
-- Name: exam_rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exam_rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exam_rooms_id_seq OWNER TO postgres;

--
-- Name: exam_rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exam_rooms_id_seq OWNED BY public.exam_rooms.id;


--
-- Name: exam_schedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exam_schedule (
    id integer NOT NULL,
    exam_id integer,
    room_id integer,
    date date,
    start_time time without time zone,
    end_time time without time zone,
    proctor_id integer,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.exam_schedule OWNER TO postgres;

--
-- Name: exam_schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exam_schedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exam_schedule_id_seq OWNER TO postgres;

--
-- Name: exam_schedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exam_schedule_id_seq OWNED BY public.exam_schedule.id;


--
-- Name: exam_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exam_sessions (
    id text NOT NULL,
    exam_id text NOT NULL,
    student_id text NOT NULL,
    school_id text,
    owner_id text,
    status text DEFAULT 'active'::text,
    ip_address text,
    user_agent text,
    fullscreen_exits integer DEFAULT 0,
    tab_switches integer DEFAULT 0,
    copy_attempts integer DEFAULT 0,
    suspicious_flags integer DEFAULT 0,
    started_at timestamp without time zone DEFAULT now(),
    finished_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.exam_sessions OWNER TO postgres;

--
-- Name: exam_violations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exam_violations (
    id text NOT NULL,
    session_id text NOT NULL,
    type text NOT NULL,
    description text,
    severity text DEFAULT 'warning'::text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.exam_violations OWNER TO postgres;

--
-- Name: exams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exams (
    id text NOT NULL,
    title text NOT NULL,
    title_ar text NOT NULL,
    description text,
    type public."ExamType" DEFAULT 'QUIZ'::public."ExamType" NOT NULL,
    total_marks integer NOT NULL,
    passing_marks integer NOT NULL,
    duration integer NOT NULL,
    scheduled_at timestamp(3) without time zone,
    status public."ExamStatus" DEFAULT 'DRAFT'::public."ExamStatus" NOT NULL,
    course_id text,
    school_id text NOT NULL,
    semester_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    subject text,
    grade text,
    semester text,
    exam_type text DEFAULT 'quiz'::text,
    room text,
    supervisors jsonb,
    publish_at timestamp without time zone,
    is_published boolean DEFAULT false,
    ai_generated boolean DEFAULT false,
    ai_difficulty character varying(20) DEFAULT 'medium'::character varying,
    ai_topics text[],
    proctoring_enabled boolean DEFAULT false,
    proctoring_type character varying(30) DEFAULT 'none'::character varying,
    allow_retake boolean DEFAULT false,
    max_retakes integer DEFAULT 1,
    shuffle_questions boolean DEFAULT true,
    shuffle_answers boolean DEFAULT true,
    show_result_immediately boolean DEFAULT true,
    negative_marking boolean DEFAULT false,
    negative_marks_per_wrong numeric(4,2) DEFAULT 0,
    instructions text,
    class_id integer,
    teacher_id integer
);


ALTER TABLE public.exams OWNER TO postgres;

--
-- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenses (
    id text NOT NULL,
    category text NOT NULL,
    amount double precision NOT NULL,
    description text,
    date timestamp(3) without time zone NOT NULL,
    receipt text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    school_id text,
    owner_id text
);


ALTER TABLE public.expenses OWNER TO postgres;

--
-- Name: facilities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facilities (
    id integer NOT NULL,
    name character varying(200),
    type character varying(50),
    capacity integer,
    location character varying(200),
    school_id text,
    owner_id text,
    status character varying(20) DEFAULT 'available'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.facilities OWNER TO postgres;

--
-- Name: facilities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.facilities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.facilities_id_seq OWNER TO postgres;

--
-- Name: facilities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.facilities_id_seq OWNED BY public.facilities.id;


--
-- Name: feature_usage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feature_usage (
    id integer NOT NULL,
    school_id text NOT NULL,
    feature_key character varying(100) NOT NULL,
    current_usage integer DEFAULT 0,
    limit_value integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.feature_usage OWNER TO postgres;

--
-- Name: feature_usage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.feature_usage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.feature_usage_id_seq OWNER TO postgres;

--
-- Name: feature_usage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.feature_usage_id_seq OWNED BY public.feature_usage.id;


--
-- Name: features; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.features (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    icon character varying(50),
    image_url text,
    link character varying(255),
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.features OWNER TO postgres;

--
-- Name: features_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.features_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.features_id_seq OWNER TO postgres;

--
-- Name: features_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.features_id_seq OWNED BY public.features.id;


--
-- Name: financial_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.financial_log (
    id integer NOT NULL,
    type character varying(50),
    amount numeric(10,2),
    description text,
    category character varying(100),
    reference_id integer,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.financial_log OWNER TO postgres;

--
-- Name: financial_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.financial_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financial_log_id_seq OWNER TO postgres;

--
-- Name: financial_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.financial_log_id_seq OWNED BY public.financial_log.id;


--
-- Name: follows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.follows (
    id integer NOT NULL,
    follower_id integer,
    following_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.follows OWNER TO postgres;

--
-- Name: follows_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.follows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.follows_id_seq OWNER TO postgres;

--
-- Name: follows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.follows_id_seq OWNED BY public.follows.id;


--
-- Name: forum_replies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forum_replies (
    id integer NOT NULL,
    forum_id integer,
    user_id integer,
    content text NOT NULL,
    likes_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.forum_replies OWNER TO postgres;

--
-- Name: forum_replies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.forum_replies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.forum_replies_id_seq OWNER TO postgres;

--
-- Name: forum_replies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.forum_replies_id_seq OWNED BY public.forum_replies.id;


--
-- Name: forums; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forums (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    category character varying(100),
    user_id integer,
    school_id integer,
    replies_count integer DEFAULT 0,
    views_count integer DEFAULT 0,
    is_pinned boolean DEFAULT false,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.forums OWNER TO postgres;

--
-- Name: forums_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.forums_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.forums_id_seq OWNER TO postgres;

--
-- Name: forums_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.forums_id_seq OWNED BY public.forums.id;


--
-- Name: fuel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fuel (
    id integer NOT NULL,
    vehicle_id integer,
    amount numeric(10,2),
    cost numeric(10,2),
    date date,
    school_id text,
    owner_id text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.fuel OWNER TO postgres;

--
-- Name: fuel_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fuel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fuel_id_seq OWNER TO postgres;

--
-- Name: fuel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fuel_id_seq OWNED BY public.fuel.id;


--
-- Name: fuel_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fuel_records (
    id integer NOT NULL,
    vehicle character varying(100),
    fuel_type character varying(50),
    liters numeric(10,2),
    cost numeric(10,2),
    odometer integer,
    date date DEFAULT CURRENT_DATE,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.fuel_records OWNER TO postgres;

--
-- Name: fuel_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fuel_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fuel_records_id_seq OWNER TO postgres;

--
-- Name: fuel_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fuel_records_id_seq OWNED BY public.fuel_records.id;


--
-- Name: gallery_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gallery_items (
    id integer NOT NULL,
    title character varying(300),
    description text,
    image_url character varying(500),
    category character varying(100),
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.gallery_items OWNER TO postgres;

--
-- Name: gallery_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gallery_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gallery_items_id_seq OWNER TO postgres;

--
-- Name: gallery_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gallery_items_id_seq OWNED BY public.gallery_items.id;


--
-- Name: gifted; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gifted (
    id integer NOT NULL,
    student_id integer,
    student_name character varying(200),
    talent_area character varying(200),
    assessment_score numeric(5,2),
    program text,
    status character varying(50) DEFAULT 'identified'::character varying,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.gifted OWNER TO postgres;

--
-- Name: gifted_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gifted_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gifted_id_seq OWNER TO postgres;

--
-- Name: gifted_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gifted_id_seq OWNED BY public.gifted.id;


--
-- Name: grade_appeals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grade_appeals (
    id integer NOT NULL,
    student_id integer,
    exam_id integer,
    school_id text,
    reason text,
    status text DEFAULT 'pending'::text,
    admin_response text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.grade_appeals OWNER TO postgres;

--
-- Name: grade_appeals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.grade_appeals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.grade_appeals_id_seq OWNER TO postgres;

--
-- Name: grade_appeals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.grade_appeals_id_seq OWNED BY public.grade_appeals.id;


--
-- Name: grade_results; Type: TABLE; Schema: public; Owner: matin
--

CREATE TABLE public.grade_results (
    id integer NOT NULL,
    student_id integer,
    exam_id integer,
    score numeric(5,2),
    max_score numeric(5,2),
    percentage numeric(5,2),
    grade character varying(10),
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.grade_results OWNER TO matin;

--
-- Name: grade_results_id_seq; Type: SEQUENCE; Schema: public; Owner: matin
--

CREATE SEQUENCE public.grade_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.grade_results_id_seq OWNER TO matin;

--
-- Name: grade_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matin
--

ALTER SEQUENCE public.grade_results_id_seq OWNED BY public.grade_results.id;


--
-- Name: grades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grades (
    id text NOT NULL,
    marks double precision NOT NULL,
    max_marks double precision NOT NULL,
    percentage double precision,
    grade text,
    remarks text,
    student_id text NOT NULL,
    course_id text NOT NULL,
    exam_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    school_id text,
    owner_id text
);


ALTER TABLE public.grades OWNER TO postgres;

--
-- Name: grading_committees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grading_committees (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    exam_id integer,
    members jsonb DEFAULT '[]'::jsonb,
    status character varying(50) DEFAULT 'active'::character varying,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.grading_committees OWNER TO postgres;

--
-- Name: grading_committees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.grading_committees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.grading_committees_id_seq OWNER TO postgres;

--
-- Name: grading_committees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.grading_committees_id_seq OWNED BY public.grading_committees.id;


--
-- Name: guest_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guest_users (
    id integer NOT NULL,
    name character varying(200),
    email character varying(200),
    phone character varying(50),
    access_code character varying(50),
    expires_at timestamp without time zone,
    school_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.guest_users OWNER TO postgres;

--
-- Name: guest_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.guest_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guest_users_id_seq OWNER TO postgres;

--
-- Name: guest_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.guest_users_id_seq OWNED BY public.guest_users.id;


--
-- Name: health_insurance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.health_insurance (
    id integer NOT NULL,
    user_id integer,
    provider character varying(200),
    policy_number character varying(100),
    coverage_type character varying(100),
    start_date date,
    end_date date,
    status character varying(50) DEFAULT 'active'::character varying,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.health_insurance OWNER TO postgres;

--
-- Name: health_insurance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.health_insurance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.health_insurance_id_seq OWNER TO postgres;

--
-- Name: health_insurance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.health_insurance_id_seq OWNED BY public.health_insurance.id;


--
-- Name: health_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.health_records (
    id integer NOT NULL,
    student_id integer,
    student_name character varying(200),
    condition_type character varying(200),
    description text,
    medications text,
    allergies text,
    emergency_contact character varying(200),
    blood_type character varying(10),
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.health_records OWNER TO postgres;

--
-- Name: health_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.health_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.health_records_id_seq OWNER TO postgres;

--
-- Name: health_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.health_records_id_seq OWNED BY public.health_records.id;


--
-- Name: homework; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.homework (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    subject text,
    class_name text,
    teacher_name text,
    due_date date,
    status text DEFAULT 'active'::text,
    school_id text,
    class_id text,
    created_by integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.homework OWNER TO postgres;

--
-- Name: homework_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.homework_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.homework_id_seq OWNER TO postgres;

--
-- Name: homework_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.homework_id_seq OWNED BY public.homework.id;


--
-- Name: homework_submissions; Type: TABLE; Schema: public; Owner: matin
--

CREATE TABLE public.homework_submissions (
    id integer NOT NULL,
    homework_id integer,
    student_id integer,
    student_name character varying(200),
    file_url character varying(500),
    content text,
    grade numeric(5,2),
    feedback text,
    status character varying(50) DEFAULT 'submitted'::character varying,
    submitted_at timestamp without time zone DEFAULT now(),
    graded_at timestamp without time zone,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.homework_submissions OWNER TO matin;

--
-- Name: homework_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: matin
--

CREATE SEQUENCE public.homework_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.homework_submissions_id_seq OWNER TO matin;

--
-- Name: homework_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matin
--

ALTER SEQUENCE public.homework_submissions_id_seq OWNED BY public.homework_submissions.id;


--
-- Name: inbox_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inbox_messages (
    id integer NOT NULL,
    from_user_id integer,
    to_user_id integer,
    subject character varying(300),
    content text,
    is_read boolean DEFAULT false,
    attachments jsonb DEFAULT '[]'::jsonb,
    school_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.inbox_messages OWNER TO postgres;

--
-- Name: inbox_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inbox_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inbox_messages_id_seq OWNER TO postgres;

--
-- Name: inbox_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inbox_messages_id_seq OWNED BY public.inbox_messages.id;


--
-- Name: institution_services; Type: TABLE; Schema: public; Owner: matin
--

CREATE TABLE public.institution_services (
    id integer NOT NULL,
    school_id text NOT NULL,
    service_key character varying(100) NOT NULL,
    is_enabled boolean DEFAULT true,
    enabled_by text,
    enabled_at timestamp without time zone DEFAULT now(),
    disabled_at timestamp without time zone,
    disabled_by text,
    notes text,
    config jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.institution_services OWNER TO matin;

--
-- Name: institution_services_id_seq; Type: SEQUENCE; Schema: public; Owner: matin
--

CREATE SEQUENCE public.institution_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.institution_services_id_seq OWNER TO matin;

--
-- Name: institution_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matin
--

ALTER SEQUENCE public.institution_services_id_seq OWNED BY public.institution_services.id;


--
-- Name: insurance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.insurance (
    id integer NOT NULL,
    policy_name character varying(200),
    provider character varying(200),
    coverage text,
    start_date date,
    end_date date,
    school_id text,
    owner_id text,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.insurance OWNER TO postgres;

--
-- Name: insurance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.insurance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.insurance_id_seq OWNER TO postgres;

--
-- Name: insurance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.insurance_id_seq OWNED BY public.insurance.id;


--
-- Name: integrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.integrations (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    config jsonb,
    is_active boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    display_name text,
    description text,
    category text DEFAULT 'other'::text,
    icon text,
    color text,
    api_key text,
    api_secret text,
    webhook_secret text,
    extra_config jsonb DEFAULT '{}'::jsonb,
    test_mode boolean DEFAULT false,
    docs_url text,
    connected_at timestamp without time zone
);


ALTER TABLE public.integrations OWNER TO postgres;

--
-- Name: inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory (
    id integer NOT NULL,
    item_name character varying(200),
    category character varying(100),
    quantity integer DEFAULT 0,
    unit_price numeric(10,2),
    location character varying(200),
    school_id text,
    owner_id text,
    status character varying(20) DEFAULT 'available'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.inventory OWNER TO postgres;

--
-- Name: inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_id_seq OWNER TO postgres;

--
-- Name: inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_id_seq OWNED BY public.inventory.id;


--
-- Name: inventory_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_items (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    category character varying(100),
    quantity integer DEFAULT 0,
    min_quantity integer DEFAULT 5,
    unit character varying(50),
    location character varying(200),
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.inventory_items OWNER TO postgres;

--
-- Name: inventory_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_items_id_seq OWNER TO postgres;

--
-- Name: inventory_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_items_id_seq OWNED BY public.inventory_items.id;


--
-- Name: invoice_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_items (
    id text NOT NULL,
    description text NOT NULL,
    amount double precision NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    invoice_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.invoice_items OWNER TO postgres;

--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id text NOT NULL,
    invoice_number text NOT NULL,
    amount double precision NOT NULL,
    due_date timestamp(3) without time zone NOT NULL,
    paid_at timestamp(3) without time zone,
    status public."InvoiceStatus" DEFAULT 'PENDING'::public."InvoiceStatus" NOT NULL,
    description text,
    student_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    school_id text,
    addon_plan_id integer,
    tax numeric(10,2) DEFAULT 0
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: knowledge_base; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knowledge_base (
    id integer NOT NULL,
    title character varying(200),
    content text,
    category character varying(100),
    author_id integer,
    school_id text,
    owner_id text,
    views integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.knowledge_base OWNER TO postgres;

--
-- Name: knowledge_base_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knowledge_base_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.knowledge_base_id_seq OWNER TO postgres;

--
-- Name: knowledge_base_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knowledge_base_id_seq OWNED BY public.knowledge_base.id;


--
-- Name: leads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leads (
    id integer NOT NULL,
    name character varying(200),
    email character varying(200),
    phone character varying(50),
    institution character varying(200),
    message text,
    source character varying(100),
    status character varying(50) DEFAULT 'new'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.leads OWNER TO postgres;

--
-- Name: leads_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leads_id_seq OWNER TO postgres;

--
-- Name: leads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leads_id_seq OWNED BY public.leads.id;


--
-- Name: leaves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leaves (
    id text NOT NULL,
    type public."LeaveType" NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    reason text,
    status public."LeaveStatus" DEFAULT 'PENDING'::public."LeaveStatus" NOT NULL,
    teacher_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    school_id text
);


ALTER TABLE public.leaves OWNER TO postgres;

--
-- Name: lecture_confirmations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lecture_confirmations (
    id integer NOT NULL,
    lecture_id integer,
    teacher_id integer,
    confirmed boolean DEFAULT false,
    confirmed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.lecture_confirmations OWNER TO postgres;

--
-- Name: lecture_confirmations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lecture_confirmations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lecture_confirmations_id_seq OWNER TO postgres;

--
-- Name: lecture_confirmations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lecture_confirmations_id_seq OWNED BY public.lecture_confirmations.id;


--
-- Name: lecture_post_answers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lecture_post_answers (
    id integer NOT NULL,
    question_id integer,
    student_id integer,
    answer integer,
    is_correct boolean,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.lecture_post_answers OWNER TO postgres;

--
-- Name: lecture_post_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lecture_post_answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lecture_post_answers_id_seq OWNER TO postgres;

--
-- Name: lecture_post_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lecture_post_answers_id_seq OWNED BY public.lecture_post_answers.id;


--
-- Name: lecture_post_questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lecture_post_questions (
    id integer NOT NULL,
    lecture_id integer,
    question text,
    options jsonb DEFAULT '[]'::jsonb,
    correct_answer integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.lecture_post_questions OWNER TO postgres;

--
-- Name: lecture_post_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lecture_post_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lecture_post_questions_id_seq OWNER TO postgres;

--
-- Name: lecture_post_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lecture_post_questions_id_seq OWNED BY public.lecture_post_questions.id;


--
-- Name: lectures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lectures (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    subject character varying(100),
    grade character varying(50),
    teacher_id integer,
    school_id text,
    url text,
    type character varying(50) DEFAULT 'recorded'::character varying,
    status character varying(20) DEFAULT 'active'::character varying,
    duration integer DEFAULT 0,
    views integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    date timestamp without time zone,
    confirmation_status character varying(20) DEFAULT 'pending'::character varying,
    notification_2h_sent boolean DEFAULT false,
    teacher_name character varying(100),
    owner_id integer,
    auto_converted boolean DEFAULT false,
    class_id text,
    notification_3h_sent boolean DEFAULT false,
    notification_1h_sent boolean DEFAULT false,
    notification_30m_sent boolean DEFAULT false,
    scheduled_at timestamp without time zone,
    location character varying(200),
    confirmed boolean DEFAULT false,
    video_url character varying(500),
    attachments jsonb DEFAULT '[]'::jsonb,
    materials jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.lectures OWNER TO postgres;

--
-- Name: lectures_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lectures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lectures_id_seq OWNER TO postgres;

--
-- Name: lectures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lectures_id_seq OWNED BY public.lectures.id;


--
-- Name: library_books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.library_books (
    id text NOT NULL,
    isbn text,
    title text NOT NULL,
    title_ar text,
    author text,
    publisher text,
    category text,
    quantity integer DEFAULT 1 NOT NULL,
    available integer DEFAULT 1 NOT NULL,
    location text,
    school_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.library_books OWNER TO postgres;

--
-- Name: likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.likes (
    id integer NOT NULL,
    user_id integer,
    post_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.likes OWNER TO postgres;

--
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.likes_id_seq OWNER TO postgres;

--
-- Name: likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.likes_id_seq OWNED BY public.likes.id;


--
-- Name: live_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.live_sessions (
    id integer NOT NULL,
    school_id character varying(100),
    teacher_id integer,
    class_id integer,
    subject_id integer,
    title character varying(255) NOT NULL,
    description text,
    platform character varying(30) DEFAULT 'built_in'::character varying,
    meeting_url text,
    meeting_id character varying(100),
    meeting_password character varying(50),
    scheduled_at timestamp without time zone,
    started_at timestamp without time zone,
    ended_at timestamp without time zone,
    duration_minutes integer,
    status character varying(20) DEFAULT 'scheduled'::character varying,
    recording_url text,
    attendees_count integer DEFAULT 0,
    max_attendees integer,
    is_recorded boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.live_sessions OWNER TO postgres;

--
-- Name: live_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.live_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.live_sessions_id_seq OWNER TO postgres;

--
-- Name: live_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.live_sessions_id_seq OWNED BY public.live_sessions.id;


--
-- Name: live_streams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.live_streams (
    id integer NOT NULL,
    title character varying(300) NOT NULL,
    description text,
    stream_url character varying(500),
    teacher_id integer,
    class_id integer,
    status character varying(50) DEFAULT 'scheduled'::character varying,
    scheduled_at timestamp without time zone,
    ended_at timestamp without time zone,
    viewers_count integer DEFAULT 0,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.live_streams OWNER TO postgres;

--
-- Name: live_streams_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.live_streams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.live_streams_id_seq OWNER TO postgres;

--
-- Name: live_streams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.live_streams_id_seq OWNED BY public.live_streams.id;


--
-- Name: meetings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.meetings (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    date timestamp without time zone,
    location character varying(200),
    organizer character varying(200),
    attendees text,
    status character varying(50) DEFAULT 'upcoming'::character varying,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.meetings OWNER TO postgres;

--
-- Name: meetings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.meetings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.meetings_id_seq OWNER TO postgres;

--
-- Name: meetings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.meetings_id_seq OWNED BY public.meetings.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id text NOT NULL,
    subject text,
    content text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    sender_id text NOT NULL,
    receiver_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: moderation_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.moderation_log (
    id integer NOT NULL,
    content_type character varying(20) NOT NULL,
    content_id integer NOT NULL,
    action character varying(30) NOT NULL,
    reason text,
    admin_note text,
    moderator_id integer,
    moderator_name character varying(200),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.moderation_log OWNER TO postgres;

--
-- Name: moderation_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.moderation_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.moderation_log_id_seq OWNER TO postgres;

--
-- Name: moderation_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.moderation_log_id_seq OWNED BY public.moderation_log.id;


--
-- Name: moderation_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.moderation_settings (
    id integer NOT NULL,
    key character varying(100) NOT NULL,
    value text,
    description text,
    updated_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.moderation_settings OWNER TO postgres;

--
-- Name: moderation_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.moderation_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.moderation_settings_id_seq OWNER TO postgres;

--
-- Name: moderation_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.moderation_settings_id_seq OWNED BY public.moderation_settings.id;


--
-- Name: news_articles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news_articles (
    id integer NOT NULL,
    title character varying(300) NOT NULL,
    content text,
    image_url character varying(500),
    author_id integer,
    category character varying(100),
    is_published boolean DEFAULT true,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.news_articles OWNER TO postgres;

--
-- Name: news_articles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.news_articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.news_articles_id_seq OWNER TO postgres;

--
-- Name: news_articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.news_articles_id_seq OWNED BY public.news_articles.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type public."NotificationType" DEFAULT 'INFO'::public."NotificationType" NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    link text,
    user_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description text
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id text NOT NULL,
    quantity integer NOT NULL,
    price double precision NOT NULL,
    order_id text NOT NULL,
    product_id text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id text NOT NULL,
    order_number text NOT NULL,
    total_amount double precision NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    buyer_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: otp_codes; Type: TABLE; Schema: public; Owner: matin
--

CREATE TABLE public.otp_codes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    code character varying(6) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.otp_codes OWNER TO matin;

--
-- Name: otp_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: matin
--

CREATE SEQUENCE public.otp_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.otp_codes_id_seq OWNER TO matin;

--
-- Name: otp_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matin
--

ALTER SEQUENCE public.otp_codes_id_seq OWNED BY public.otp_codes.id;


--
-- Name: page_designs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.page_designs (
    id integer NOT NULL,
    page_name character varying(200),
    layout jsonb DEFAULT '{}'::jsonb,
    styles jsonb DEFAULT '{}'::jsonb,
    school_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.page_designs OWNER TO postgres;

--
-- Name: page_designs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.page_designs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.page_designs_id_seq OWNER TO postgres;

--
-- Name: page_designs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.page_designs_id_seq OWNED BY public.page_designs.id;


--
-- Name: parents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parents (
    id text NOT NULL,
    occupation text,
    user_id text NOT NULL,
    school_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    password character varying(255),
    owner_id text,
    name character varying(100),
    email character varying(150),
    phone character varying(20),
    national_id character varying(20)
);


ALTER TABLE public.parents OWNER TO postgres;

--
-- Name: parents_council; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parents_council (
    id integer NOT NULL,
    title character varying(300),
    description text,
    date date,
    attendees jsonb DEFAULT '[]'::jsonb,
    minutes text,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.parents_council OWNER TO postgres;

--
-- Name: parents_council_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parents_council_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.parents_council_id_seq OWNER TO postgres;

--
-- Name: parents_council_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parents_council_id_seq OWNED BY public.parents_council.id;


--
-- Name: partners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.partners (
    id integer NOT NULL,
    name character varying(255),
    logo_url text,
    icon character varying(50) DEFAULT '🏛️'::character varying,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.partners OWNER TO postgres;

--
-- Name: partners_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.partners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.partners_id_seq OWNER TO postgres;

--
-- Name: partners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.partners_id_seq OWNED BY public.partners.id;


--
-- Name: payment_settings; Type: TABLE; Schema: public; Owner: matin
--

CREATE TABLE public.payment_settings (
    id integer NOT NULL,
    school_id integer,
    provider character varying(100) DEFAULT 'manual'::character varying,
    api_key character varying(500),
    secret_key character varying(500),
    webhook_url character varying(500),
    is_active boolean DEFAULT false,
    settings jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.payment_settings OWNER TO matin;

--
-- Name: payment_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: matin
--

CREATE SEQUENCE public.payment_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_settings_id_seq OWNER TO matin;

--
-- Name: payment_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matin
--

ALTER SEQUENCE public.payment_settings_id_seq OWNED BY public.payment_settings.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id text NOT NULL,
    amount double precision NOT NULL,
    method text NOT NULL,
    reference text,
    invoice_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer,
    currency text DEFAULT 'SAR'::text,
    status text DEFAULT 'pending'::text,
    type text,
    description text,
    school_id text,
    owner_id text,
    paid_at timestamp without time zone
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payroll; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payroll (
    id integer NOT NULL,
    school_id text NOT NULL,
    employee_id integer,
    employee_name text,
    role text,
    basic_salary numeric(12,2) DEFAULT 0,
    allowances numeric(12,2) DEFAULT 0,
    deductions numeric(12,2) DEFAULT 0,
    net_salary numeric(12,2) DEFAULT 0,
    month integer,
    year integer,
    status text DEFAULT 'pending'::text,
    payment_date date,
    notes text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.payroll OWNER TO postgres;

--
-- Name: payroll_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payroll_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payroll_id_seq OWNER TO postgres;

--
-- Name: payroll_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payroll_id_seq OWNED BY public.payroll.id;


--
-- Name: payrolls; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payrolls (
    id text NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    base_salary double precision NOT NULL,
    allowances double precision DEFAULT 0 NOT NULL,
    deductions double precision DEFAULT 0 NOT NULL,
    net_salary double precision NOT NULL,
    paid_at timestamp(3) without time zone,
    employee_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.payrolls OWNER TO postgres;

--
-- Name: plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plans (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    name_ar character varying(100),
    price_monthly numeric DEFAULT 0,
    price_yearly numeric DEFAULT 0,
    max_students integer DEFAULT 100,
    max_teachers integer DEFAULT 10,
    features jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.plans OWNER TO postgres;

--
-- Name: plans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plans_id_seq OWNER TO postgres;

--
-- Name: plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.plans_id_seq OWNED BY public.plans.id;


--
-- Name: platform_services; Type: TABLE; Schema: public; Owner: matin
--

CREATE TABLE public.platform_services (
    id integer NOT NULL,
    key character varying(100) NOT NULL,
    name_ar character varying(200) NOT NULL,
    name_en character varying(200),
    description text,
    category character varying(100),
    icon character varying(50),
    is_core boolean DEFAULT false,
    requires_plan character varying(50),
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.platform_services OWNER TO matin;

--
-- Name: platform_services_id_seq; Type: SEQUENCE; Schema: public; Owner: matin
--

CREATE SEQUENCE public.platform_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.platform_services_id_seq OWNER TO matin;

--
-- Name: platform_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matin
--

ALTER SEQUENCE public.platform_services_id_seq OWNED BY public.platform_services.id;


--
-- Name: platform_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.platform_settings (
    id integer NOT NULL,
    key character varying(200) NOT NULL,
    value text,
    category character varying(100),
    updated_at timestamp without time zone DEFAULT now(),
    description text,
    updated_by integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.platform_settings OWNER TO postgres;

--
-- Name: platform_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.platform_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.platform_settings_id_seq OWNER TO postgres;

--
-- Name: platform_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.platform_settings_id_seq OWNED BY public.platform_settings.id;


--
-- Name: post_comments; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.post_comments AS
 SELECT id,
    user_id,
    post_id,
    content,
    created_at
   FROM public.comments;


ALTER VIEW public.post_comments OWNER TO postgres;

--
-- Name: post_likes; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.post_likes AS
 SELECT id,
    user_id,
    post_id,
    created_at
   FROM public.likes;


ALTER VIEW public.post_likes OWNER TO postgres;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    user_id integer,
    content text NOT NULL,
    image_url character varying(500),
    likes_count integer DEFAULT 0,
    comments_count integer DEFAULT 0,
    shares_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ai_safety_score integer,
    ai_flags jsonb,
    ai_recommendation character varying(20),
    status character varying(20) DEFAULT 'active'::character varying,
    is_pinned boolean DEFAULT false,
    is_hidden boolean DEFAULT false,
    category character varying(50) DEFAULT 'general'::character varying,
    title character varying(300),
    type character varying(30) DEFAULT 'post'::character varying,
    visibility character varying(20) DEFAULT 'public'::character varying,
    author_name character varying(200),
    school_id integer,
    owner_id integer,
    updated_at timestamp without time zone DEFAULT now(),
    admin_note text,
    reports_count integer DEFAULT 0,
    ai_verdict character varying(20) DEFAULT 'pending'::character varying
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_id_seq OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: proctoring_snapshots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proctoring_snapshots (
    id integer NOT NULL,
    session_id integer,
    image_url character varying(500),
    ai_analysis text,
    flagged boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.proctoring_snapshots OWNER TO postgres;

--
-- Name: proctoring_snapshots_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.proctoring_snapshots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proctoring_snapshots_id_seq OWNER TO postgres;

--
-- Name: proctoring_snapshots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.proctoring_snapshots_id_seq OWNED BY public.proctoring_snapshots.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id text NOT NULL,
    name text NOT NULL,
    name_ar text,
    description text,
    price double precision NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    category text,
    image text,
    school_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    category_id integer,
    discount_price numeric(10,2)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: question_bank; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.question_bank (
    id integer NOT NULL,
    school_id text,
    subject text,
    grade text,
    semester text,
    lesson text,
    question_text text NOT NULL,
    question_type text DEFAULT 'mcq'::text,
    options jsonb,
    correct_answer text,
    explanation text,
    difficulty text DEFAULT 'medium'::text,
    difficulty_score numeric DEFAULT 0.5,
    ai_analyzed boolean DEFAULT false,
    created_by integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    tags text[],
    image_url text,
    is_active boolean DEFAULT true,
    usage_count integer DEFAULT 0,
    is_global boolean DEFAULT false,
    times_used integer DEFAULT 0,
    times_correct integer DEFAULT 0,
    times_wrong integer DEFAULT 0,
    avg_time_seconds numeric DEFAULT 0,
    quality_score numeric DEFAULT 0.5,
    quality_label text DEFAULT 'غير محلل'::text
);


ALTER TABLE public.question_bank OWNER TO postgres;

--
-- Name: question_bank_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.question_bank_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.question_bank_id_seq OWNER TO postgres;

--
-- Name: question_bank_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.question_bank_id_seq OWNED BY public.question_bank.id;


--
-- Name: questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questions (
    id text NOT NULL,
    text text NOT NULL,
    text_ar text,
    type text NOT NULL,
    options jsonb,
    answer text,
    marks integer DEFAULT 1 NOT NULL,
    difficulty text,
    subject_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.questions OWNER TO postgres;

--
-- Name: recordings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recordings (
    id integer NOT NULL,
    title character varying(200),
    url text,
    lecture_id integer,
    duration integer,
    school_id text,
    owner_id text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.recordings OWNER TO postgres;

--
-- Name: recordings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recordings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recordings_id_seq OWNER TO postgres;

--
-- Name: recordings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recordings_id_seq OWNED BY public.recordings.id;


--
-- Name: referrals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.referrals (
    id integer NOT NULL,
    referrer_id integer,
    referred_id integer,
    referral_code character varying(50),
    status character varying(50) DEFAULT 'pending'::character varying,
    commission_amount numeric(10,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    referrer_school_id integer,
    reward_amount numeric(10,2) DEFAULT 0,
    referred_school_id integer
);


ALTER TABLE public.referrals OWNER TO postgres;

--
-- Name: referrals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.referrals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.referrals_id_seq OWNER TO postgres;

--
-- Name: referrals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.referrals_id_seq OWNED BY public.referrals.id;


--
-- Name: salaries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salaries (
    id integer NOT NULL,
    employee_id integer,
    employee_name character varying(200),
    base_salary numeric(10,2),
    allowances numeric(10,2) DEFAULT 0,
    deductions numeric(10,2) DEFAULT 0,
    net_salary numeric(10,2),
    month character varying(20),
    year integer,
    status character varying(50) DEFAULT 'pending'::character varying,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.salaries OWNER TO postgres;

--
-- Name: salaries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.salaries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.salaries_id_seq OWNER TO postgres;

--
-- Name: salaries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.salaries_id_seq OWNED BY public.salaries.id;


--
-- Name: schedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedules (
    id text NOT NULL,
    day_of_week integer NOT NULL,
    start_time text NOT NULL,
    end_time text NOT NULL,
    room text,
    class_id text NOT NULL,
    course_id text NOT NULL,
    teacher_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.schedules OWNER TO postgres;

--
-- Name: scholarships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scholarships (
    id integer NOT NULL,
    name character varying(200),
    description text,
    amount numeric(10,2),
    criteria text,
    school_id text,
    owner_id text,
    status character varying(20) DEFAULT 'open'::character varying,
    deadline date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.scholarships OWNER TO postgres;

--
-- Name: scholarships_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.scholarships_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.scholarships_id_seq OWNER TO postgres;

--
-- Name: scholarships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.scholarships_id_seq OWNED BY public.scholarships.id;


--
-- Name: school_addon_subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_addon_subscriptions (
    id integer NOT NULL,
    school_id text NOT NULL,
    addon_plan_id integer NOT NULL,
    status character varying(50) DEFAULT 'active'::character varying,
    start_date timestamp without time zone DEFAULT now(),
    end_date timestamp without time zone,
    auto_renew boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.school_addon_subscriptions OWNER TO postgres;

--
-- Name: school_addon_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.school_addon_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.school_addon_subscriptions_id_seq OWNER TO postgres;

--
-- Name: school_addon_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.school_addon_subscriptions_id_seq OWNED BY public.school_addon_subscriptions.id;


--
-- Name: school_appearance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_appearance (
    id integer NOT NULL,
    school_id integer,
    primary_color character varying(20),
    secondary_color character varying(20),
    logo character varying(500),
    favicon character varying(500),
    custom_css text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.school_appearance OWNER TO postgres;

--
-- Name: school_appearance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.school_appearance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.school_appearance_id_seq OWNER TO postgres;

--
-- Name: school_appearance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.school_appearance_id_seq OWNED BY public.school_appearance.id;


--
-- Name: school_integrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_integrations (
    id integer NOT NULL,
    school_id integer,
    provider character varying(100),
    api_key character varying(500),
    settings jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.school_integrations OWNER TO postgres;

--
-- Name: school_integrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.school_integrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.school_integrations_id_seq OWNER TO postgres;

--
-- Name: school_integrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.school_integrations_id_seq OWNED BY public.school_integrations.id;


--
-- Name: school_invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_invoices (
    id integer NOT NULL,
    school_id text,
    amount numeric(10,2),
    description text,
    status text DEFAULT 'pending'::text,
    due_date date,
    paid_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.school_invoices OWNER TO postgres;

--
-- Name: school_invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.school_invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.school_invoices_id_seq OWNER TO postgres;

--
-- Name: school_invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.school_invoices_id_seq OWNED BY public.school_invoices.id;


--
-- Name: school_owners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_owners (
    id integer NOT NULL,
    user_id integer NOT NULL,
    school_id text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.school_owners OWNER TO postgres;

--
-- Name: school_owners_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.school_owners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.school_owners_id_seq OWNER TO postgres;

--
-- Name: school_owners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.school_owners_id_seq OWNED BY public.school_owners.id;


--
-- Name: school_pages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_pages (
    id integer NOT NULL,
    school_id text,
    slug character varying(200),
    title character varying(300),
    content text,
    logo character varying(500),
    cover_image character varying(500),
    theme jsonb DEFAULT '{}'::jsonb,
    is_published boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    owner_id text,
    school_name character varying(200),
    description text,
    vision text,
    mission text,
    phone character varying(20),
    email character varying(150),
    address text,
    social_twitter character varying(200),
    social_instagram character varying(200),
    social_snapchat character varying(200),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.school_pages OWNER TO postgres;

--
-- Name: school_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.school_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.school_pages_id_seq OWNER TO postgres;

--
-- Name: school_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.school_pages_id_seq OWNED BY public.school_pages.id;


--
-- Name: school_payment_settings; Type: TABLE; Schema: public; Owner: matin
--

CREATE TABLE public.school_payment_settings (
    id integer NOT NULL,
    school_id text NOT NULL,
    owner_id text,
    enabled_gateways jsonb DEFAULT '["cash"]'::jsonb,
    default_gateway character varying(50) DEFAULT 'cash'::character varying,
    auto_send_invoice boolean DEFAULT true,
    send_reminder boolean DEFAULT true,
    reminder_days integer DEFAULT 3,
    late_fee_enabled boolean DEFAULT false,
    late_fee_pct numeric(5,2) DEFAULT 0,
    vat_enabled boolean DEFAULT false,
    vat_number character varying(50),
    vat_pct numeric(5,2) DEFAULT 15,
    platform_fee_pct numeric(5,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.school_payment_settings OWNER TO matin;

--
-- Name: school_payment_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: matin
--

CREATE SEQUENCE public.school_payment_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.school_payment_settings_id_seq OWNER TO matin;

--
-- Name: school_payment_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matin
--

ALTER SEQUENCE public.school_payment_settings_id_seq OWNED BY public.school_payment_settings.id;


--
-- Name: school_registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_registrations (
    id integer NOT NULL,
    school_name character varying(300),
    owner_name character varying(200),
    email character varying(200),
    phone character varying(50),
    city character varying(100),
    type character varying(100),
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.school_registrations OWNER TO postgres;

--
-- Name: school_registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.school_registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.school_registrations_id_seq OWNER TO postgres;

--
-- Name: school_registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.school_registrations_id_seq OWNED BY public.school_registrations.id;


--
-- Name: school_staff; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_staff (
    id integer NOT NULL,
    user_id integer NOT NULL,
    school_id text NOT NULL,
    role character varying(20) DEFAULT 'teacher'::character varying NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying,
    joined_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.school_staff OWNER TO postgres;

--
-- Name: school_staff_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.school_staff_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.school_staff_id_seq OWNER TO postgres;

--
-- Name: school_staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.school_staff_id_seq OWNED BY public.school_staff.id;


--
-- Name: school_store_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_store_settings (
    id integer NOT NULL,
    school_id character varying(100),
    show_matin_products boolean DEFAULT true,
    show_matin_ads boolean DEFAULT true,
    featured_categories text[],
    commission_rate numeric(4,2) DEFAULT 5.0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.school_store_settings OWNER TO postgres;

--
-- Name: school_store_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.school_store_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.school_store_settings_id_seq OWNER TO postgres;

--
-- Name: school_store_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.school_store_settings_id_seq OWNED BY public.school_store_settings.id;


--
-- Name: schools; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schools (
    id text NOT NULL,
    name text NOT NULL,
    name_ar text NOT NULL,
    code text NOT NULL,
    email text,
    phone text,
    address text,
    city text,
    logo text,
    status public."SchoolStatus" DEFAULT 'TRIAL'::public."SchoolStatus" NOT NULL,
    trial_ends_at timestamp(3) without time zone,
    subscription_ends_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    slug text,
    website_url text,
    logo_url text,
    cover_url text,
    description text,
    social_feed_enabled boolean DEFAULT true,
    plan text DEFAULT 'free'::text,
    plan_expires_at timestamp without time zone,
    owner_id text,
    institution_type character varying(50) DEFAULT 'school'::character varying,
    students_count integer DEFAULT 0,
    subscription_status character varying(20) DEFAULT 'trial'::character varying,
    website character varying(200),
    cover_image text,
    template character varying(50),
    license_number character varying(50),
    founded_year integer,
    custom_domain character varying(255),
    domain_verified boolean DEFAULT false,
    domain_verification_token character varying(100),
    subdomain character varying(100),
    primary_color character varying(20) DEFAULT '#1a3a5c'::character varying,
    secondary_color character varying(20) DEFAULT '#C9A227'::character varying,
    tagline character varying(255),
    features jsonb DEFAULT '{}'::jsonb,
    show_matin_ads boolean DEFAULT true,
    show_matin_store boolean DEFAULT true,
    plan_id integer,
    type text DEFAULT 'school'::text,
    country text DEFAULT 'SA'::text,
    region text,
    zip text,
    max_students integer DEFAULT 500,
    max_teachers integer DEFAULT 50,
    settings jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true
);


ALTER TABLE public.schools OWNER TO postgres;

--
-- Name: security; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.security (
    id integer NOT NULL,
    type character varying(50),
    description text,
    location character varying(200),
    reported_by integer,
    school_id text,
    owner_id text,
    status character varying(20) DEFAULT 'reported'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.security OWNER TO postgres;

--
-- Name: security_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.security_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.security_id_seq OWNER TO postgres;

--
-- Name: security_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.security_id_seq OWNED BY public.security.id;


--
-- Name: security_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.security_records (
    id integer NOT NULL,
    type character varying(100),
    description text,
    location character varying(200),
    reported_by integer,
    status character varying(50) DEFAULT 'open'::character varying,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.security_records OWNER TO postgres;

--
-- Name: security_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.security_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.security_records_id_seq OWNER TO postgres;

--
-- Name: security_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.security_records_id_seq OWNED BY public.security_records.id;


--
-- Name: semesters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.semesters (
    id text NOT NULL,
    name text NOT NULL,
    name_ar text NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    academic_year_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.semesters OWNER TO postgres;

--
-- Name: service_audit_log; Type: TABLE; Schema: public; Owner: matin
--

CREATE TABLE public.service_audit_log (
    id integer NOT NULL,
    school_id text,
    service_key character varying(100),
    action character varying(50),
    changed_by text,
    changed_by_role character varying(50),
    old_value jsonb,
    new_value jsonb,
    notes text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.service_audit_log OWNER TO matin;

--
-- Name: service_audit_log_id_seq; Type: SEQUENCE; Schema: public; Owner: matin
--

CREATE SEQUENCE public.service_audit_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.service_audit_log_id_seq OWNER TO matin;

--
-- Name: service_audit_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matin
--

ALTER SEQUENCE public.service_audit_log_id_seq OWNED BY public.service_audit_log.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.settings (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    category text,
    updated_at timestamp(3) without time zone NOT NULL,
    school_id text,
    owner_id text,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    title text,
    status text DEFAULT 'active'::text
);


ALTER TABLE public.settings OWNER TO postgres;

--
-- Name: shipping_companies; Type: TABLE; Schema: public; Owner: matin
--

CREATE TABLE public.shipping_companies (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    logo character varying(500),
    tracking_url character varying(500),
    api_key character varying(500),
    is_active boolean DEFAULT true,
    rates jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.shipping_companies OWNER TO matin;

--
-- Name: shipping_companies_id_seq; Type: SEQUENCE; Schema: public; Owner: matin
--

CREATE SEQUENCE public.shipping_companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shipping_companies_id_seq OWNER TO matin;

--
-- Name: shipping_companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matin
--

ALTER SEQUENCE public.shipping_companies_id_seq OWNED BY public.shipping_companies.id;


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.site_settings (
    id integer NOT NULL,
    setting_key character varying(255) NOT NULL,
    setting_value text,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.site_settings OWNER TO postgres;

--
-- Name: site_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.site_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.site_settings_id_seq OWNER TO postgres;

--
-- Name: site_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.site_settings_id_seq OWNED BY public.site_settings.id;


--
-- Name: social_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.social_comments (
    id integer NOT NULL,
    post_id integer,
    user_id integer,
    content text NOT NULL,
    likes_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.social_comments OWNER TO postgres;

--
-- Name: social_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.social_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_comments_id_seq OWNER TO postgres;

--
-- Name: social_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.social_comments_id_seq OWNED BY public.social_comments.id;


--
-- Name: social_likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.social_likes (
    id integer NOT NULL,
    post_id integer,
    user_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.social_likes OWNER TO postgres;

--
-- Name: social_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.social_likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_likes_id_seq OWNER TO postgres;

--
-- Name: social_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.social_likes_id_seq OWNED BY public.social_likes.id;


--
-- Name: social_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.social_posts (
    id integer NOT NULL,
    user_id integer,
    content text NOT NULL,
    image_url text,
    likes_count integer DEFAULT 0,
    comments_count integer DEFAULT 0,
    shares_count integer DEFAULT 0,
    visibility character varying(20) DEFAULT 'public'::character varying,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.social_posts OWNER TO postgres;

--
-- Name: social_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.social_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_posts_id_seq OWNER TO postgres;

--
-- Name: social_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.social_posts_id_seq OWNED BY public.social_posts.id;


--
-- Name: special_needs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.special_needs (
    id integer NOT NULL,
    student_id integer,
    student_name character varying(200),
    condition_type character varying(200),
    support_plan text,
    accommodations text,
    iep_date date,
    review_date date,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.special_needs OWNER TO postgres;

--
-- Name: special_needs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.special_needs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.special_needs_id_seq OWNER TO postgres;

--
-- Name: special_needs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.special_needs_id_seq OWNED BY public.special_needs.id;


--
-- Name: store_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_orders (
    id integer NOT NULL,
    school_id text,
    owner_id text,
    customer_name text,
    customer_phone text,
    customer_email text,
    items jsonb,
    total numeric DEFAULT 0 NOT NULL,
    status text DEFAULT 'pending'::text,
    payment_method text DEFAULT 'cash'::text,
    address text,
    notes text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.store_orders OWNER TO postgres;

--
-- Name: store_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.store_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.store_orders_id_seq OWNER TO postgres;

--
-- Name: store_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.store_orders_id_seq OWNED BY public.store_orders.id;


--
-- Name: store_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_products (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    price numeric NOT NULL,
    category text,
    image_url text,
    stock integer DEFAULT 0,
    seller_id integer,
    seller_type text DEFAULT 'platform'::text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    school_id text,
    owner_id text,
    sale_price numeric,
    image text,
    is_platform_product boolean DEFAULT false,
    images jsonb DEFAULT '[]'::jsonb,
    sku character varying(100),
    weight numeric(10,2),
    tags text[]
);


ALTER TABLE public.store_products OWNER TO postgres;

--
-- Name: store_products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.store_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.store_products_id_seq OWNER TO postgres;

--
-- Name: store_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.store_products_id_seq OWNED BY public.store_products.id;


--
-- Name: student_fees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_fees (
    id integer NOT NULL,
    student_id integer,
    student_name character varying(200),
    fee_type character varying(100),
    amount numeric(10,2),
    paid_amount numeric(10,2) DEFAULT 0,
    due_date date,
    status character varying(50) DEFAULT 'unpaid'::character varying,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.student_fees OWNER TO postgres;

--
-- Name: student_fees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_fees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_fees_id_seq OWNER TO postgres;

--
-- Name: student_fees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_fees_id_seq OWNED BY public.student_fees.id;


--
-- Name: student_tracking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_tracking (
    id integer NOT NULL,
    student_id integer,
    type character varying(100),
    description text,
    date date DEFAULT CURRENT_DATE,
    teacher_id integer,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.student_tracking OWNER TO postgres;

--
-- Name: student_tracking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_tracking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_tracking_id_seq OWNER TO postgres;

--
-- Name: student_tracking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_tracking_id_seq OWNED BY public.student_tracking.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id text NOT NULL,
    student_id text NOT NULL,
    date_of_birth timestamp(3) without time zone,
    gender public."Gender",
    enrollment_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id text NOT NULL,
    school_id text NOT NULL,
    class_id text,
    parent_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    nationality character varying(50),
    owner_id text,
    grade text,
    birth_date date,
    national_id text,
    parent_phone text,
    parent_name text,
    address text,
    photo text,
    status text DEFAULT 'active'::text,
    notes text
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: subjects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subjects (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    name_ar text NOT NULL,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    school_id text,
    owner_id text
);


ALTER TABLE public.subjects OWNER TO postgres;

--
-- Name: submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.submissions (
    id text NOT NULL,
    content text,
    attachment_url text,
    marks double precision,
    feedback text,
    submitted_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    assignment_id text NOT NULL,
    student_id text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.submissions OWNER TO postgres;

--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    id integer NOT NULL,
    school_id text NOT NULL,
    owner_id text,
    plan_id integer,
    status character varying(20) DEFAULT 'trial'::character varying,
    billing_cycle character varying(20) DEFAULT 'monthly'::character varying,
    trial_ends_at timestamp without time zone,
    starts_at timestamp without time zone DEFAULT now(),
    ends_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    user_id integer,
    package text DEFAULT 'basic'::text,
    amount numeric(10,2)
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subscriptions_id_seq OWNER TO postgres;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;


--
-- Name: supervisors_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supervisors_table (
    id integer NOT NULL,
    user_id integer,
    name character varying(200),
    department character varying(200),
    responsibilities text,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.supervisors_table OWNER TO postgres;

--
-- Name: supervisors_table_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.supervisors_table_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.supervisors_table_id_seq OWNER TO postgres;

--
-- Name: supervisors_table_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.supervisors_table_id_seq OWNED BY public.supervisors_table.id;


--
-- Name: support_tickets; Type: TABLE; Schema: public; Owner: matin
--

CREATE TABLE public.support_tickets (
    id integer NOT NULL,
    user_id integer,
    school_id integer,
    subject character varying(500) NOT NULL,
    message text NOT NULL,
    status character varying(50) DEFAULT 'open'::character varying,
    priority character varying(50) DEFAULT 'normal'::character varying,
    category character varying(100),
    assigned_to integer,
    resolved_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.support_tickets OWNER TO matin;

--
-- Name: support_tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: matin
--

CREATE SEQUENCE public.support_tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.support_tickets_id_seq OWNER TO matin;

--
-- Name: support_tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matin
--

ALTER SEQUENCE public.support_tickets_id_seq OWNED BY public.support_tickets.id;


--
-- Name: surveys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.surveys (
    id integer NOT NULL,
    title character varying(200),
    description text,
    questions jsonb,
    school_id text,
    owner_id text,
    status character varying(20) DEFAULT 'draft'::character varying,
    responses integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.surveys OWNER TO postgres;

--
-- Name: surveys_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.surveys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.surveys_id_seq OWNER TO postgres;

--
-- Name: surveys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.surveys_id_seq OWNED BY public.surveys.id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    title character varying(300) NOT NULL,
    description text,
    assigned_to integer,
    assigned_by integer,
    priority character varying(50) DEFAULT 'medium'::character varying,
    status character varying(50) DEFAULT 'pending'::character varying,
    due_date date,
    completed_at timestamp without time zone,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tasks_id_seq OWNER TO postgres;

--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: teacher_assignments; Type: TABLE; Schema: public; Owner: matin
--

CREATE TABLE public.teacher_assignments (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    teacher_id text NOT NULL,
    subject_id text NOT NULL,
    class_id text NOT NULL,
    school_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.teacher_assignments OWNER TO matin;

--
-- Name: teachers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teachers (
    id text NOT NULL,
    employee_id text NOT NULL,
    department text,
    specialization text,
    hire_date timestamp(3) without time zone,
    salary double precision,
    user_id text NOT NULL,
    school_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    nationality character varying(50),
    owner_id text
);


ALTER TABLE public.teachers OWNER TO postgres;

--
-- Name: trainers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trainers (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    specialization character varying(200),
    phone character varying(50),
    email character varying(200),
    bio text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.trainers OWNER TO postgres;

--
-- Name: trainers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trainers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.trainers_id_seq OWNER TO postgres;

--
-- Name: trainers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trainers_id_seq OWNED BY public.trainers.id;


--
-- Name: training_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.training_records (
    id integer NOT NULL,
    title character varying(300) NOT NULL,
    description text,
    trainer character varying(200),
    date date,
    duration integer,
    participants text,
    status character varying(50) DEFAULT 'planned'::character varying,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.training_records OWNER TO postgres;

--
-- Name: training_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.training_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.training_records_id_seq OWNER TO postgres;

--
-- Name: training_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.training_records_id_seq OWNED BY public.training_records.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    user_id integer,
    school_id text,
    owner_id text,
    type text DEFAULT 'income'::text,
    amount numeric(10,2),
    description text,
    category text,
    reference text,
    status text DEFAULT 'completed'::text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_id_seq OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: transport_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transport_assignments (
    id text NOT NULL,
    student_id text NOT NULL,
    route_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.transport_assignments OWNER TO postgres;

--
-- Name: transport_routes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transport_routes (
    id text NOT NULL,
    name text NOT NULL,
    name_ar text,
    driver text,
    driver_phone text,
    bus_number text,
    capacity integer DEFAULT 40 NOT NULL,
    school_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.transport_routes OWNER TO postgres;

--
-- Name: transport_stops; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transport_stops (
    id text NOT NULL,
    name text NOT NULL,
    name_ar text,
    address text,
    latitude double precision,
    longitude double precision,
    "order" integer NOT NULL,
    pickup_time text,
    route_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.transport_stops OWNER TO postgres;

--
-- Name: unified_invoice_items; Type: TABLE; Schema: public; Owner: matin
--

CREATE TABLE public.unified_invoice_items (
    id integer NOT NULL,
    invoice_id text NOT NULL,
    fee_type_id integer,
    description character varying(500) NOT NULL,
    quantity numeric(8,2) DEFAULT 1,
    unit_price numeric(12,2) NOT NULL,
    total numeric(12,2) NOT NULL,
    period character varying(100),
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.unified_invoice_items OWNER TO matin;

--
-- Name: unified_invoice_items_id_seq; Type: SEQUENCE; Schema: public; Owner: matin
--

CREATE SEQUENCE public.unified_invoice_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.unified_invoice_items_id_seq OWNER TO matin;

--
-- Name: unified_invoice_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: matin
--

ALTER SEQUENCE public.unified_invoice_items_id_seq OWNED BY public.unified_invoice_items.id;


--
-- Name: unified_invoice_seq; Type: SEQUENCE; Schema: public; Owner: matin
--

CREATE SEQUENCE public.unified_invoice_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.unified_invoice_seq OWNER TO matin;

--
-- Name: unified_invoices; Type: TABLE; Schema: public; Owner: matin
--

CREATE TABLE public.unified_invoices (
    id text NOT NULL,
    invoice_number character varying(50) NOT NULL,
    school_id text NOT NULL,
    owner_id text,
    student_id text,
    parent_id text,
    title character varying(300),
    description text,
    subtotal numeric(12,2) DEFAULT 0,
    discount numeric(12,2) DEFAULT 0,
    tax numeric(12,2) DEFAULT 0,
    total numeric(12,2) NOT NULL,
    status character varying(30) DEFAULT 'pending'::character varying,
    due_date date,
    paid_at timestamp without time zone,
    payment_method character varying(50),
    payment_ref character varying(200),
    payment_url text,
    platform_fee_pct numeric(5,2) DEFAULT 0,
    platform_fee_amt numeric(12,2) DEFAULT 0,
    sent_at timestamp without time zone,
    viewed_at timestamp without time zone,
    reminder_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.unified_invoices OWNER TO matin;

--
-- Name: unified_payment_seq; Type: SEQUENCE; Schema: public; Owner: matin
--

CREATE SEQUENCE public.unified_payment_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.unified_payment_seq OWNER TO matin;

--
-- Name: unified_payments; Type: TABLE; Schema: public; Owner: matin
--

CREATE TABLE public.unified_payments (
    id text NOT NULL,
    invoice_id text NOT NULL,
    school_id text,
    owner_id text,
    amount numeric(12,2) NOT NULL,
    payment_method character varying(50),
    provider character varying(50),
    provider_ref character varying(200),
    provider_status character varying(50),
    provider_data jsonb,
    platform_fee numeric(12,2) DEFAULT 0,
    net_amount numeric(12,2),
    status character varying(30) DEFAULT 'pending'::character varying,
    paid_by text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.unified_payments OWNER TO matin;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    avatar character varying(10) DEFAULT '👤'::character varying,
    bio text DEFAULT 'عضو في متين'::text,
    phone character varying(20),
    website character varying(200),
    linkedin character varying(200),
    twitter character varying(200),
    instagram character varying(200),
    show_contact boolean DEFAULT false,
    verified boolean DEFAULT false,
    role character varying(20) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    email_verified boolean DEFAULT false,
    verification_code text,
    profile_image text,
    cv_data jsonb,
    social_links jsonb,
    is_active boolean DEFAULT true,
    school_id text,
    owner_id text,
    status character varying(20) DEFAULT 'active'::character varying,
    package character varying(50) DEFAULT 'free'::character varying,
    code_expires_at timestamp without time zone,
    last_login timestamp without time zone,
    institution_type character varying(50),
    city character varying(100),
    max_schools integer DEFAULT 1,
    max_students integer DEFAULT 500,
    max_teachers integer DEFAULT 50,
    national_id character varying(20),
    must_change_password boolean DEFAULT false,
    warnings_count integer DEFAULT 0,
    is_community_banned boolean DEFAULT false,
    community_ban_reason text,
    community_ban_until timestamp without time zone,
    requested_grade character varying(50),
    nationality character varying(50),
    community_banned_at timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vaccinations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vaccinations (
    id integer NOT NULL,
    student_id integer,
    vaccine_name character varying(100),
    date date,
    next_dose date,
    school_id text,
    owner_id text,
    status character varying(20) DEFAULT 'completed'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vaccinations OWNER TO postgres;

--
-- Name: vaccinations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vaccinations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vaccinations_id_seq OWNER TO postgres;

--
-- Name: vaccinations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vaccinations_id_seq OWNED BY public.vaccinations.id;


--
-- Name: vaccinations_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vaccinations_table (
    id integer NOT NULL,
    student_id integer,
    student_name character varying(200),
    vaccine_name character varying(200),
    dose_number integer DEFAULT 1,
    date_given date,
    next_dose_date date,
    status character varying(50) DEFAULT 'completed'::character varying,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.vaccinations_table OWNER TO postgres;

--
-- Name: vaccinations_table_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vaccinations_table_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vaccinations_table_id_seq OWNER TO postgres;

--
-- Name: vaccinations_table_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vaccinations_table_id_seq OWNED BY public.vaccinations_table.id;


--
-- Name: video_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.video_items (
    id integer NOT NULL,
    title character varying(300) NOT NULL,
    description text,
    url character varying(500),
    thumbnail character varying(500),
    duration integer,
    views_count integer DEFAULT 0,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.video_items OWNER TO postgres;

--
-- Name: video_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.video_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.video_items_id_seq OWNER TO postgres;

--
-- Name: video_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.video_items_id_seq OWNED BY public.video_items.id;


--
-- Name: videos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.videos (
    id integer NOT NULL,
    title character varying(200),
    url text,
    subject character varying(100),
    grade character varying(50),
    school_id text,
    owner_id text,
    views integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.videos OWNER TO postgres;

--
-- Name: videos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.videos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.videos_id_seq OWNER TO postgres;

--
-- Name: videos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.videos_id_seq OWNED BY public.videos.id;


--
-- Name: visitors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.visitors (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    phone character varying(50),
    id_number character varying(50),
    purpose character varying(200),
    visiting character varying(200),
    check_in timestamp without time zone DEFAULT now(),
    check_out timestamp without time zone,
    badge_number character varying(50),
    status character varying(50) DEFAULT 'checked_in'::character varying,
    school_id integer,
    owner_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.visitors OWNER TO postgres;

--
-- Name: visitors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.visitors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.visitors_id_seq OWNER TO postgres;

--
-- Name: visitors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.visitors_id_seq OWNED BY public.visitors.id;


--
-- Name: activities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities ALTER COLUMN id SET DEFAULT nextval('public.activities_id_seq'::regclass);


--
-- Name: activity_log id; Type: DEFAULT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.activity_log ALTER COLUMN id SET DEFAULT nextval('public.activity_log_id_seq'::regclass);


--
-- Name: addon_plans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addon_plans ALTER COLUMN id SET DEFAULT nextval('public.addon_plans_id_seq'::regclass);


--
-- Name: admissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admissions ALTER COLUMN id SET DEFAULT nextval('public.admissions_id_seq'::regclass);


--
-- Name: ads id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ads ALTER COLUMN id SET DEFAULT nextval('public.ads_id_seq'::regclass);


--
-- Name: advertisements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.advertisements ALTER COLUMN id SET DEFAULT nextval('public.advertisements_id_seq'::regclass);


--
-- Name: ai_chats id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_chats ALTER COLUMN id SET DEFAULT nextval('public.ai_chats_id_seq'::regclass);


--
-- Name: ai_moderation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_moderation ALTER COLUMN id SET DEFAULT nextval('public.ai_moderation_id_seq'::regclass);


--
-- Name: appointments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments ALTER COLUMN id SET DEFAULT nextval('public.appointments_id_seq'::regclass);


--
-- Name: attendance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);


--
-- Name: behavior id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.behavior ALTER COLUMN id SET DEFAULT nextval('public.behavior_id_seq'::regclass);


--
-- Name: bus_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus_events ALTER COLUMN id SET DEFAULT nextval('public.bus_events_id_seq'::regclass);


--
-- Name: bus_live_location id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus_live_location ALTER COLUMN id SET DEFAULT nextval('public.bus_live_location_id_seq'::regclass);


--
-- Name: bus_maintenance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus_maintenance ALTER COLUMN id SET DEFAULT nextval('public.bus_maintenance_id_seq'::regclass);


--
-- Name: bus_riders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus_riders ALTER COLUMN id SET DEFAULT nextval('public.bus_riders_id_seq'::regclass);


--
-- Name: bus_trips id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus_trips ALTER COLUMN id SET DEFAULT nextval('public.bus_trips_id_seq'::regclass);


--
-- Name: buses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buses ALTER COLUMN id SET DEFAULT nextval('public.buses_id_seq'::regclass);


--
-- Name: cafeteria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cafeteria ALTER COLUMN id SET DEFAULT nextval('public.cafeteria_id_seq'::regclass);


--
-- Name: calendar_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_events ALTER COLUMN id SET DEFAULT nextval('public.calendar_events_id_seq'::regclass);


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: certificates id; Type: DEFAULT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.certificates ALTER COLUMN id SET DEFAULT nextval('public.certificates_id_seq'::regclass);


--
-- Name: chat_rooms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms ALTER COLUMN id SET DEFAULT nextval('public.chat_rooms_id_seq'::regclass);


--
-- Name: circulars id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.circulars ALTER COLUMN id SET DEFAULT nextval('public.circulars_id_seq'::regclass);


--
-- Name: clinic id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic ALTER COLUMN id SET DEFAULT nextval('public.clinic_id_seq'::regclass);


--
-- Name: cms_ads id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_ads ALTER COLUMN id SET DEFAULT nextval('public.cms_ads_id_seq'::regclass);


--
-- Name: cms_banners id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_banners ALTER COLUMN id SET DEFAULT nextval('public.cms_banners_id_seq'::regclass);


--
-- Name: cms_sections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_sections ALTER COLUMN id SET DEFAULT nextval('public.cms_sections_id_seq'::regclass);


--
-- Name: cms_seo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_seo ALTER COLUMN id SET DEFAULT nextval('public.cms_seo_id_seq'::regclass);


--
-- Name: colleges id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colleges ALTER COLUMN id SET DEFAULT nextval('public.colleges_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: commissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commissions ALTER COLUMN id SET DEFAULT nextval('public.commissions_id_seq'::regclass);


--
-- Name: community_comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_comments ALTER COLUMN id SET DEFAULT nextval('public.community_comments_id_seq'::regclass);


--
-- Name: community_likes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_likes ALTER COLUMN id SET DEFAULT nextval('public.community_likes_id_seq'::regclass);


--
-- Name: community_posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_posts ALTER COLUMN id SET DEFAULT nextval('public.community_posts_id_seq'::regclass);


--
-- Name: complaints id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaints ALTER COLUMN id SET DEFAULT nextval('public.complaints_id_seq'::regclass);


--
-- Name: content_reports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_reports ALTER COLUMN id SET DEFAULT nextval('public.content_reports_id_seq'::regclass);


--
-- Name: contracts_docs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts_docs ALTER COLUMN id SET DEFAULT nextval('public.contracts_docs_id_seq'::regclass);


--
-- Name: counseling id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.counseling ALTER COLUMN id SET DEFAULT nextval('public.counseling_id_seq'::regclass);


--
-- Name: coupons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons ALTER COLUMN id SET DEFAULT nextval('public.coupons_id_seq'::regclass);


--
-- Name: credit_hours id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_hours ALTER COLUMN id SET DEFAULT nextval('public.credit_hours_id_seq'::regclass);


--
-- Name: curriculum id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curriculum ALTER COLUMN id SET DEFAULT nextval('public.curriculum_id_seq'::regclass);


--
-- Name: delegates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delegates ALTER COLUMN id SET DEFAULT nextval('public.delegates_id_seq'::regclass);


--
-- Name: driver_licenses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_licenses ALTER COLUMN id SET DEFAULT nextval('public.driver_licenses_id_seq'::regclass);


--
-- Name: drivers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers ALTER COLUMN id SET DEFAULT nextval('public.drivers_id_seq'::regclass);


--
-- Name: elearning id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.elearning ALTER COLUMN id SET DEFAULT nextval('public.elearning_id_seq'::regclass);


--
-- Name: email_otps id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_otps ALTER COLUMN id SET DEFAULT nextval('public.email_otps_id_seq'::regclass);


--
-- Name: emergencies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergencies ALTER COLUMN id SET DEFAULT nextval('public.emergencies_id_seq'::regclass);


--
-- Name: emergency_key_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_key_logs ALTER COLUMN id SET DEFAULT nextval('public.emergency_key_logs_id_seq'::regclass);


--
-- Name: emergency_keys id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_keys ALTER COLUMN id SET DEFAULT nextval('public.emergency_keys_id_seq'::regclass);


--
-- Name: exam_ai_analysis id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_ai_analysis ALTER COLUMN id SET DEFAULT nextval('public.exam_ai_analysis_id_seq'::regclass);


--
-- Name: exam_print_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_print_logs ALTER COLUMN id SET DEFAULT nextval('public.exam_print_logs_id_seq'::regclass);


--
-- Name: exam_proctoring_sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_proctoring_sessions ALTER COLUMN id SET DEFAULT nextval('public.exam_proctoring_sessions_id_seq'::regclass);


--
-- Name: exam_results id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_results ALTER COLUMN id SET DEFAULT nextval('public.exam_results_id_seq'::regclass);


--
-- Name: exam_rooms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_rooms ALTER COLUMN id SET DEFAULT nextval('public.exam_rooms_id_seq'::regclass);


--
-- Name: exam_schedule id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_schedule ALTER COLUMN id SET DEFAULT nextval('public.exam_schedule_id_seq'::regclass);


--
-- Name: facilities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facilities ALTER COLUMN id SET DEFAULT nextval('public.facilities_id_seq'::regclass);


--
-- Name: feature_usage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feature_usage ALTER COLUMN id SET DEFAULT nextval('public.feature_usage_id_seq'::regclass);


--
-- Name: features id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.features ALTER COLUMN id SET DEFAULT nextval('public.features_id_seq'::regclass);


--
-- Name: financial_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_log ALTER COLUMN id SET DEFAULT nextval('public.financial_log_id_seq'::regclass);


--
-- Name: follows id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows ALTER COLUMN id SET DEFAULT nextval('public.follows_id_seq'::regclass);


--
-- Name: forum_replies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_replies ALTER COLUMN id SET DEFAULT nextval('public.forum_replies_id_seq'::regclass);


--
-- Name: forums id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forums ALTER COLUMN id SET DEFAULT nextval('public.forums_id_seq'::regclass);


--
-- Name: fuel id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fuel ALTER COLUMN id SET DEFAULT nextval('public.fuel_id_seq'::regclass);


--
-- Name: fuel_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fuel_records ALTER COLUMN id SET DEFAULT nextval('public.fuel_records_id_seq'::regclass);


--
-- Name: gallery_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery_items ALTER COLUMN id SET DEFAULT nextval('public.gallery_items_id_seq'::regclass);


--
-- Name: gifted id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gifted ALTER COLUMN id SET DEFAULT nextval('public.gifted_id_seq'::regclass);


--
-- Name: grade_appeals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grade_appeals ALTER COLUMN id SET DEFAULT nextval('public.grade_appeals_id_seq'::regclass);


--
-- Name: grade_results id; Type: DEFAULT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.grade_results ALTER COLUMN id SET DEFAULT nextval('public.grade_results_id_seq'::regclass);


--
-- Name: grading_committees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grading_committees ALTER COLUMN id SET DEFAULT nextval('public.grading_committees_id_seq'::regclass);


--
-- Name: guest_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guest_users ALTER COLUMN id SET DEFAULT nextval('public.guest_users_id_seq'::regclass);


--
-- Name: health_insurance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.health_insurance ALTER COLUMN id SET DEFAULT nextval('public.health_insurance_id_seq'::regclass);


--
-- Name: health_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.health_records ALTER COLUMN id SET DEFAULT nextval('public.health_records_id_seq'::regclass);


--
-- Name: homework id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.homework ALTER COLUMN id SET DEFAULT nextval('public.homework_id_seq'::regclass);


--
-- Name: homework_submissions id; Type: DEFAULT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.homework_submissions ALTER COLUMN id SET DEFAULT nextval('public.homework_submissions_id_seq'::regclass);


--
-- Name: inbox_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inbox_messages ALTER COLUMN id SET DEFAULT nextval('public.inbox_messages_id_seq'::regclass);


--
-- Name: institution_services id; Type: DEFAULT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.institution_services ALTER COLUMN id SET DEFAULT nextval('public.institution_services_id_seq'::regclass);


--
-- Name: insurance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insurance ALTER COLUMN id SET DEFAULT nextval('public.insurance_id_seq'::regclass);


--
-- Name: inventory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);


--
-- Name: inventory_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_items ALTER COLUMN id SET DEFAULT nextval('public.inventory_items_id_seq'::regclass);


--
-- Name: knowledge_base id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base ALTER COLUMN id SET DEFAULT nextval('public.knowledge_base_id_seq'::regclass);


--
-- Name: leads id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads ALTER COLUMN id SET DEFAULT nextval('public.leads_id_seq'::regclass);


--
-- Name: lecture_confirmations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lecture_confirmations ALTER COLUMN id SET DEFAULT nextval('public.lecture_confirmations_id_seq'::regclass);


--
-- Name: lecture_post_answers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lecture_post_answers ALTER COLUMN id SET DEFAULT nextval('public.lecture_post_answers_id_seq'::regclass);


--
-- Name: lecture_post_questions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lecture_post_questions ALTER COLUMN id SET DEFAULT nextval('public.lecture_post_questions_id_seq'::regclass);


--
-- Name: lectures id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lectures ALTER COLUMN id SET DEFAULT nextval('public.lectures_id_seq'::regclass);


--
-- Name: likes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes ALTER COLUMN id SET DEFAULT nextval('public.likes_id_seq'::regclass);


--
-- Name: live_sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.live_sessions ALTER COLUMN id SET DEFAULT nextval('public.live_sessions_id_seq'::regclass);


--
-- Name: live_streams id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.live_streams ALTER COLUMN id SET DEFAULT nextval('public.live_streams_id_seq'::regclass);


--
-- Name: meetings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meetings ALTER COLUMN id SET DEFAULT nextval('public.meetings_id_seq'::regclass);


--
-- Name: moderation_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moderation_log ALTER COLUMN id SET DEFAULT nextval('public.moderation_log_id_seq'::regclass);


--
-- Name: moderation_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moderation_settings ALTER COLUMN id SET DEFAULT nextval('public.moderation_settings_id_seq'::regclass);


--
-- Name: news_articles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_articles ALTER COLUMN id SET DEFAULT nextval('public.news_articles_id_seq'::regclass);


--
-- Name: otp_codes id; Type: DEFAULT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.otp_codes ALTER COLUMN id SET DEFAULT nextval('public.otp_codes_id_seq'::regclass);


--
-- Name: page_designs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.page_designs ALTER COLUMN id SET DEFAULT nextval('public.page_designs_id_seq'::regclass);


--
-- Name: parents_council id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parents_council ALTER COLUMN id SET DEFAULT nextval('public.parents_council_id_seq'::regclass);


--
-- Name: partners id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partners ALTER COLUMN id SET DEFAULT nextval('public.partners_id_seq'::regclass);


--
-- Name: payment_settings id; Type: DEFAULT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.payment_settings ALTER COLUMN id SET DEFAULT nextval('public.payment_settings_id_seq'::regclass);


--
-- Name: payroll id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll ALTER COLUMN id SET DEFAULT nextval('public.payroll_id_seq'::regclass);


--
-- Name: plans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plans ALTER COLUMN id SET DEFAULT nextval('public.plans_id_seq'::regclass);


--
-- Name: platform_services id; Type: DEFAULT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.platform_services ALTER COLUMN id SET DEFAULT nextval('public.platform_services_id_seq'::regclass);


--
-- Name: platform_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_settings ALTER COLUMN id SET DEFAULT nextval('public.platform_settings_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: proctoring_snapshots id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proctoring_snapshots ALTER COLUMN id SET DEFAULT nextval('public.proctoring_snapshots_id_seq'::regclass);


--
-- Name: question_bank id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.question_bank ALTER COLUMN id SET DEFAULT nextval('public.question_bank_id_seq'::regclass);


--
-- Name: recordings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recordings ALTER COLUMN id SET DEFAULT nextval('public.recordings_id_seq'::regclass);


--
-- Name: referrals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referrals ALTER COLUMN id SET DEFAULT nextval('public.referrals_id_seq'::regclass);


--
-- Name: salaries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salaries ALTER COLUMN id SET DEFAULT nextval('public.salaries_id_seq'::regclass);


--
-- Name: scholarships id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scholarships ALTER COLUMN id SET DEFAULT nextval('public.scholarships_id_seq'::regclass);


--
-- Name: school_addon_subscriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_addon_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.school_addon_subscriptions_id_seq'::regclass);


--
-- Name: school_appearance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_appearance ALTER COLUMN id SET DEFAULT nextval('public.school_appearance_id_seq'::regclass);


--
-- Name: school_integrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_integrations ALTER COLUMN id SET DEFAULT nextval('public.school_integrations_id_seq'::regclass);


--
-- Name: school_invoices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_invoices ALTER COLUMN id SET DEFAULT nextval('public.school_invoices_id_seq'::regclass);


--
-- Name: school_owners id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_owners ALTER COLUMN id SET DEFAULT nextval('public.school_owners_id_seq'::regclass);


--
-- Name: school_pages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_pages ALTER COLUMN id SET DEFAULT nextval('public.school_pages_id_seq'::regclass);


--
-- Name: school_payment_settings id; Type: DEFAULT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.school_payment_settings ALTER COLUMN id SET DEFAULT nextval('public.school_payment_settings_id_seq'::regclass);


--
-- Name: school_registrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_registrations ALTER COLUMN id SET DEFAULT nextval('public.school_registrations_id_seq'::regclass);


--
-- Name: school_staff id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_staff ALTER COLUMN id SET DEFAULT nextval('public.school_staff_id_seq'::regclass);


--
-- Name: school_store_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_store_settings ALTER COLUMN id SET DEFAULT nextval('public.school_store_settings_id_seq'::regclass);


--
-- Name: security id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.security ALTER COLUMN id SET DEFAULT nextval('public.security_id_seq'::regclass);


--
-- Name: security_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.security_records ALTER COLUMN id SET DEFAULT nextval('public.security_records_id_seq'::regclass);


--
-- Name: service_audit_log id; Type: DEFAULT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.service_audit_log ALTER COLUMN id SET DEFAULT nextval('public.service_audit_log_id_seq'::regclass);


--
-- Name: shipping_companies id; Type: DEFAULT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.shipping_companies ALTER COLUMN id SET DEFAULT nextval('public.shipping_companies_id_seq'::regclass);


--
-- Name: site_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings ALTER COLUMN id SET DEFAULT nextval('public.site_settings_id_seq'::regclass);


--
-- Name: social_comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_comments ALTER COLUMN id SET DEFAULT nextval('public.social_comments_id_seq'::regclass);


--
-- Name: social_likes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_likes ALTER COLUMN id SET DEFAULT nextval('public.social_likes_id_seq'::regclass);


--
-- Name: social_posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_posts ALTER COLUMN id SET DEFAULT nextval('public.social_posts_id_seq'::regclass);


--
-- Name: special_needs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.special_needs ALTER COLUMN id SET DEFAULT nextval('public.special_needs_id_seq'::regclass);


--
-- Name: store_orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_orders ALTER COLUMN id SET DEFAULT nextval('public.store_orders_id_seq'::regclass);


--
-- Name: store_products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_products ALTER COLUMN id SET DEFAULT nextval('public.store_products_id_seq'::regclass);


--
-- Name: student_fees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_fees ALTER COLUMN id SET DEFAULT nextval('public.student_fees_id_seq'::regclass);


--
-- Name: student_tracking id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_tracking ALTER COLUMN id SET DEFAULT nextval('public.student_tracking_id_seq'::regclass);


--
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_id_seq'::regclass);


--
-- Name: supervisors_table id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supervisors_table ALTER COLUMN id SET DEFAULT nextval('public.supervisors_table_id_seq'::regclass);


--
-- Name: support_tickets id; Type: DEFAULT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.support_tickets ALTER COLUMN id SET DEFAULT nextval('public.support_tickets_id_seq'::regclass);


--
-- Name: surveys id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.surveys ALTER COLUMN id SET DEFAULT nextval('public.surveys_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: trainers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainers ALTER COLUMN id SET DEFAULT nextval('public.trainers_id_seq'::regclass);


--
-- Name: training_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.training_records ALTER COLUMN id SET DEFAULT nextval('public.training_records_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: unified_invoice_items id; Type: DEFAULT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.unified_invoice_items ALTER COLUMN id SET DEFAULT nextval('public.unified_invoice_items_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vaccinations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vaccinations ALTER COLUMN id SET DEFAULT nextval('public.vaccinations_id_seq'::regclass);


--
-- Name: vaccinations_table id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vaccinations_table ALTER COLUMN id SET DEFAULT nextval('public.vaccinations_table_id_seq'::regclass);


--
-- Name: video_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video_items ALTER COLUMN id SET DEFAULT nextval('public.video_items_id_seq'::regclass);


--
-- Name: videos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.videos ALTER COLUMN id SET DEFAULT nextval('public.videos_id_seq'::regclass);


--
-- Name: visitors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitors ALTER COLUMN id SET DEFAULT nextval('public.visitors_id_seq'::regclass);


--
-- Name: academic_years academic_years_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_years
    ADD CONSTRAINT academic_years_pkey PRIMARY KEY (id);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: activity_log activity_log_pkey; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT activity_log_pkey PRIMARY KEY (id);


--
-- Name: addon_plans addon_plans_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addon_plans
    ADD CONSTRAINT addon_plans_name_key UNIQUE (name);


--
-- Name: addon_plans addon_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addon_plans
    ADD CONSTRAINT addon_plans_pkey PRIMARY KEY (id);


--
-- Name: admissions admissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admissions
    ADD CONSTRAINT admissions_pkey PRIMARY KEY (id);


--
-- Name: ads ads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ads
    ADD CONSTRAINT ads_pkey PRIMARY KEY (id);


--
-- Name: advertisements advertisements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.advertisements
    ADD CONSTRAINT advertisements_pkey PRIMARY KEY (id);


--
-- Name: ai_chats ai_chats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_chats
    ADD CONSTRAINT ai_chats_pkey PRIMARY KEY (id);


--
-- Name: ai_moderation ai_moderation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_moderation
    ADD CONSTRAINT ai_moderation_pkey PRIMARY KEY (id);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: assignments assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_pkey PRIMARY KEY (id);


--
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);


--
-- Name: attendances attendances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: behavior behavior_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.behavior
    ADD CONSTRAINT behavior_pkey PRIMARY KEY (id);


--
-- Name: book_borrowings book_borrowings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_borrowings
    ADD CONSTRAINT book_borrowings_pkey PRIMARY KEY (id);


--
-- Name: bus_events bus_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus_events
    ADD CONSTRAINT bus_events_pkey PRIMARY KEY (id);


--
-- Name: bus_live_location bus_live_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus_live_location
    ADD CONSTRAINT bus_live_location_pkey PRIMARY KEY (id);


--
-- Name: bus_maintenance bus_maintenance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus_maintenance
    ADD CONSTRAINT bus_maintenance_pkey PRIMARY KEY (id);


--
-- Name: bus_riders bus_riders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus_riders
    ADD CONSTRAINT bus_riders_pkey PRIMARY KEY (id);


--
-- Name: bus_trips bus_trips_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bus_trips
    ADD CONSTRAINT bus_trips_pkey PRIMARY KEY (id);


--
-- Name: buses buses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buses
    ADD CONSTRAINT buses_pkey PRIMARY KEY (id);


--
-- Name: cafeteria cafeteria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cafeteria
    ADD CONSTRAINT cafeteria_pkey PRIMARY KEY (id);


--
-- Name: calendar_events calendar_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_events
    ADD CONSTRAINT calendar_events_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- Name: chat_rooms chat_rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_rooms
    ADD CONSTRAINT chat_rooms_pkey PRIMARY KEY (id);


--
-- Name: circulars circulars_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.circulars
    ADD CONSTRAINT circulars_pkey PRIMARY KEY (id);


--
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- Name: clinic clinic_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinic
    ADD CONSTRAINT clinic_pkey PRIMARY KEY (id);


--
-- Name: cms_ads cms_ads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_ads
    ADD CONSTRAINT cms_ads_pkey PRIMARY KEY (id);


--
-- Name: cms_banners cms_banners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_banners
    ADD CONSTRAINT cms_banners_pkey PRIMARY KEY (id);


--
-- Name: cms_sections cms_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_sections
    ADD CONSTRAINT cms_sections_pkey PRIMARY KEY (id);


--
-- Name: cms_sections cms_sections_section_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_sections
    ADD CONSTRAINT cms_sections_section_key_key UNIQUE (section_key);


--
-- Name: cms_seo cms_seo_page_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_seo
    ADD CONSTRAINT cms_seo_page_key_key UNIQUE (page_key);


--
-- Name: cms_seo cms_seo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cms_seo
    ADD CONSTRAINT cms_seo_pkey PRIMARY KEY (id);


--
-- Name: colleges colleges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colleges
    ADD CONSTRAINT colleges_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: commissions commissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.commissions
    ADD CONSTRAINT commissions_pkey PRIMARY KEY (id);


--
-- Name: community_comments community_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_comments
    ADD CONSTRAINT community_comments_pkey PRIMARY KEY (id);


--
-- Name: community_likes community_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_likes
    ADD CONSTRAINT community_likes_pkey PRIMARY KEY (id);


--
-- Name: community_posts community_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community_posts
    ADD CONSTRAINT community_posts_pkey PRIMARY KEY (id);


--
-- Name: complaints complaints_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_pkey PRIMARY KEY (id);


--
-- Name: content_reports content_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_reports
    ADD CONSTRAINT content_reports_pkey PRIMARY KEY (id);


--
-- Name: contracts_docs contracts_docs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts_docs
    ADD CONSTRAINT contracts_docs_pkey PRIMARY KEY (id);


--
-- Name: counseling counseling_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.counseling
    ADD CONSTRAINT counseling_pkey PRIMARY KEY (id);


--
-- Name: coupons coupons_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_code_key UNIQUE (code);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: credit_hours credit_hours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_hours
    ADD CONSTRAINT credit_hours_pkey PRIMARY KEY (id);


--
-- Name: curriculum curriculum_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curriculum
    ADD CONSTRAINT curriculum_pkey PRIMARY KEY (id);


--
-- Name: delegates delegates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delegates
    ADD CONSTRAINT delegates_pkey PRIMARY KEY (id);


--
-- Name: driver_licenses driver_licenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_licenses
    ADD CONSTRAINT driver_licenses_pkey PRIMARY KEY (id);


--
-- Name: drivers drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_pkey PRIMARY KEY (id);


--
-- Name: elearning elearning_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.elearning
    ADD CONSTRAINT elearning_pkey PRIMARY KEY (id);


--
-- Name: email_otps email_otps_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_otps
    ADD CONSTRAINT email_otps_email_unique UNIQUE (email);


--
-- Name: email_otps email_otps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_otps
    ADD CONSTRAINT email_otps_pkey PRIMARY KEY (id);


--
-- Name: emergencies emergencies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergencies
    ADD CONSTRAINT emergencies_pkey PRIMARY KEY (id);


--
-- Name: emergency_key_logs emergency_key_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_key_logs
    ADD CONSTRAINT emergency_key_logs_pkey PRIMARY KEY (id);


--
-- Name: emergency_keys emergency_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_keys
    ADD CONSTRAINT emergency_keys_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: exam_ai_analysis exam_ai_analysis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_ai_analysis
    ADD CONSTRAINT exam_ai_analysis_pkey PRIMARY KEY (id);


--
-- Name: exam_answers exam_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_answers
    ADD CONSTRAINT exam_answers_pkey PRIMARY KEY (id);


--
-- Name: exam_answers exam_answers_session_id_question_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_answers
    ADD CONSTRAINT exam_answers_session_id_question_id_key UNIQUE (session_id, question_id);


--
-- Name: exam_print_logs exam_print_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_print_logs
    ADD CONSTRAINT exam_print_logs_pkey PRIMARY KEY (id);


--
-- Name: exam_proctoring_sessions exam_proctoring_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_proctoring_sessions
    ADD CONSTRAINT exam_proctoring_sessions_pkey PRIMARY KEY (id);


--
-- Name: exam_questions exam_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_questions
    ADD CONSTRAINT exam_questions_pkey PRIMARY KEY (id);


--
-- Name: exam_results exam_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_results
    ADD CONSTRAINT exam_results_pkey PRIMARY KEY (id);


--
-- Name: exam_rooms exam_rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_rooms
    ADD CONSTRAINT exam_rooms_pkey PRIMARY KEY (id);


--
-- Name: exam_schedule exam_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_schedule
    ADD CONSTRAINT exam_schedule_pkey PRIMARY KEY (id);


--
-- Name: exam_sessions exam_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_sessions
    ADD CONSTRAINT exam_sessions_pkey PRIMARY KEY (id);


--
-- Name: exam_violations exam_violations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_violations
    ADD CONSTRAINT exam_violations_pkey PRIMARY KEY (id);


--
-- Name: exams exams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: facilities facilities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facilities
    ADD CONSTRAINT facilities_pkey PRIMARY KEY (id);


--
-- Name: feature_usage feature_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feature_usage
    ADD CONSTRAINT feature_usage_pkey PRIMARY KEY (id);


--
-- Name: features features_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.features
    ADD CONSTRAINT features_pkey PRIMARY KEY (id);


--
-- Name: financial_log financial_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_log
    ADD CONSTRAINT financial_log_pkey PRIMARY KEY (id);


--
-- Name: follows follows_follower_id_following_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_follower_id_following_id_key UNIQUE (follower_id, following_id);


--
-- Name: follows follows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_pkey PRIMARY KEY (id);


--
-- Name: forum_replies forum_replies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_replies
    ADD CONSTRAINT forum_replies_pkey PRIMARY KEY (id);


--
-- Name: forums forums_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forums
    ADD CONSTRAINT forums_pkey PRIMARY KEY (id);


--
-- Name: fuel fuel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fuel
    ADD CONSTRAINT fuel_pkey PRIMARY KEY (id);


--
-- Name: fuel_records fuel_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fuel_records
    ADD CONSTRAINT fuel_records_pkey PRIMARY KEY (id);


--
-- Name: gallery_items gallery_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery_items
    ADD CONSTRAINT gallery_items_pkey PRIMARY KEY (id);


--
-- Name: gifted gifted_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gifted
    ADD CONSTRAINT gifted_pkey PRIMARY KEY (id);


--
-- Name: grade_appeals grade_appeals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grade_appeals
    ADD CONSTRAINT grade_appeals_pkey PRIMARY KEY (id);


--
-- Name: grade_results grade_results_pkey; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.grade_results
    ADD CONSTRAINT grade_results_pkey PRIMARY KEY (id);


--
-- Name: grades grades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_pkey PRIMARY KEY (id);


--
-- Name: grading_committees grading_committees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grading_committees
    ADD CONSTRAINT grading_committees_pkey PRIMARY KEY (id);


--
-- Name: guest_users guest_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guest_users
    ADD CONSTRAINT guest_users_pkey PRIMARY KEY (id);


--
-- Name: health_insurance health_insurance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.health_insurance
    ADD CONSTRAINT health_insurance_pkey PRIMARY KEY (id);


--
-- Name: health_records health_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.health_records
    ADD CONSTRAINT health_records_pkey PRIMARY KEY (id);


--
-- Name: homework homework_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.homework
    ADD CONSTRAINT homework_pkey PRIMARY KEY (id);


--
-- Name: homework_submissions homework_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.homework_submissions
    ADD CONSTRAINT homework_submissions_pkey PRIMARY KEY (id);


--
-- Name: inbox_messages inbox_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inbox_messages
    ADD CONSTRAINT inbox_messages_pkey PRIMARY KEY (id);


--
-- Name: institution_services institution_services_pkey; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.institution_services
    ADD CONSTRAINT institution_services_pkey PRIMARY KEY (id);


--
-- Name: institution_services institution_services_school_id_service_key_key; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.institution_services
    ADD CONSTRAINT institution_services_school_id_service_key_key UNIQUE (school_id, service_key);


--
-- Name: insurance insurance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insurance
    ADD CONSTRAINT insurance_pkey PRIMARY KEY (id);


--
-- Name: integrations integrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.integrations
    ADD CONSTRAINT integrations_pkey PRIMARY KEY (id);


--
-- Name: inventory_items inventory_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_items
    ADD CONSTRAINT inventory_items_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: invoice_items invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base knowledge_base_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knowledge_base
    ADD CONSTRAINT knowledge_base_pkey PRIMARY KEY (id);


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- Name: leaves leaves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaves
    ADD CONSTRAINT leaves_pkey PRIMARY KEY (id);


--
-- Name: lecture_confirmations lecture_confirmations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lecture_confirmations
    ADD CONSTRAINT lecture_confirmations_pkey PRIMARY KEY (id);


--
-- Name: lecture_post_answers lecture_post_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lecture_post_answers
    ADD CONSTRAINT lecture_post_answers_pkey PRIMARY KEY (id);


--
-- Name: lecture_post_questions lecture_post_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lecture_post_questions
    ADD CONSTRAINT lecture_post_questions_pkey PRIMARY KEY (id);


--
-- Name: lectures lectures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lectures
    ADD CONSTRAINT lectures_pkey PRIMARY KEY (id);


--
-- Name: library_books library_books_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.library_books
    ADD CONSTRAINT library_books_pkey PRIMARY KEY (id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: likes likes_user_id_post_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_id_post_id_key UNIQUE (user_id, post_id);


--
-- Name: live_sessions live_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.live_sessions
    ADD CONSTRAINT live_sessions_pkey PRIMARY KEY (id);


--
-- Name: live_streams live_streams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.live_streams
    ADD CONSTRAINT live_streams_pkey PRIMARY KEY (id);


--
-- Name: meetings meetings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meetings
    ADD CONSTRAINT meetings_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: moderation_log moderation_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moderation_log
    ADD CONSTRAINT moderation_log_pkey PRIMARY KEY (id);


--
-- Name: moderation_settings moderation_settings_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moderation_settings
    ADD CONSTRAINT moderation_settings_key_key UNIQUE (key);


--
-- Name: moderation_settings moderation_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moderation_settings
    ADD CONSTRAINT moderation_settings_pkey PRIMARY KEY (id);


--
-- Name: news_articles news_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_articles
    ADD CONSTRAINT news_articles_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: otp_codes otp_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.otp_codes
    ADD CONSTRAINT otp_codes_pkey PRIMARY KEY (id);


--
-- Name: page_designs page_designs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.page_designs
    ADD CONSTRAINT page_designs_pkey PRIMARY KEY (id);


--
-- Name: parents_council parents_council_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parents_council
    ADD CONSTRAINT parents_council_pkey PRIMARY KEY (id);


--
-- Name: parents parents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parents
    ADD CONSTRAINT parents_pkey PRIMARY KEY (id);


--
-- Name: partners partners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_pkey PRIMARY KEY (id);


--
-- Name: payment_settings payment_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.payment_settings
    ADD CONSTRAINT payment_settings_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: payroll payroll_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll
    ADD CONSTRAINT payroll_pkey PRIMARY KEY (id);


--
-- Name: payrolls payrolls_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_pkey PRIMARY KEY (id);


--
-- Name: plans plans_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plans
    ADD CONSTRAINT plans_name_key UNIQUE (name);


--
-- Name: plans plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plans
    ADD CONSTRAINT plans_pkey PRIMARY KEY (id);


--
-- Name: platform_services platform_services_key_key; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.platform_services
    ADD CONSTRAINT platform_services_key_key UNIQUE (key);


--
-- Name: platform_services platform_services_pkey; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.platform_services
    ADD CONSTRAINT platform_services_pkey PRIMARY KEY (id);


--
-- Name: platform_settings platform_settings_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_settings
    ADD CONSTRAINT platform_settings_key_key UNIQUE (key);


--
-- Name: platform_settings platform_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_settings
    ADD CONSTRAINT platform_settings_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: proctoring_snapshots proctoring_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proctoring_snapshots
    ADD CONSTRAINT proctoring_snapshots_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: question_bank question_bank_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.question_bank
    ADD CONSTRAINT question_bank_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: recordings recordings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recordings
    ADD CONSTRAINT recordings_pkey PRIMARY KEY (id);


--
-- Name: referrals referrals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_pkey PRIMARY KEY (id);


--
-- Name: salaries salaries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salaries
    ADD CONSTRAINT salaries_pkey PRIMARY KEY (id);


--
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- Name: scholarships scholarships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scholarships
    ADD CONSTRAINT scholarships_pkey PRIMARY KEY (id);


--
-- Name: school_addon_subscriptions school_addon_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_addon_subscriptions
    ADD CONSTRAINT school_addon_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: school_appearance school_appearance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_appearance
    ADD CONSTRAINT school_appearance_pkey PRIMARY KEY (id);


--
-- Name: school_integrations school_integrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_integrations
    ADD CONSTRAINT school_integrations_pkey PRIMARY KEY (id);


--
-- Name: school_invoices school_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_invoices
    ADD CONSTRAINT school_invoices_pkey PRIMARY KEY (id);


--
-- Name: school_owners school_owners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_owners
    ADD CONSTRAINT school_owners_pkey PRIMARY KEY (id);


--
-- Name: school_owners school_owners_school_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_owners
    ADD CONSTRAINT school_owners_school_id_key UNIQUE (school_id);


--
-- Name: school_pages school_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_pages
    ADD CONSTRAINT school_pages_pkey PRIMARY KEY (id);


--
-- Name: school_payment_settings school_payment_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.school_payment_settings
    ADD CONSTRAINT school_payment_settings_pkey PRIMARY KEY (id);


--
-- Name: school_payment_settings school_payment_settings_school_id_key; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.school_payment_settings
    ADD CONSTRAINT school_payment_settings_school_id_key UNIQUE (school_id);


--
-- Name: school_registrations school_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_registrations
    ADD CONSTRAINT school_registrations_pkey PRIMARY KEY (id);


--
-- Name: school_staff school_staff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_staff
    ADD CONSTRAINT school_staff_pkey PRIMARY KEY (id);


--
-- Name: school_staff school_staff_user_id_school_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_staff
    ADD CONSTRAINT school_staff_user_id_school_id_key UNIQUE (user_id, school_id);


--
-- Name: school_store_settings school_store_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_store_settings
    ADD CONSTRAINT school_store_settings_pkey PRIMARY KEY (id);


--
-- Name: school_store_settings school_store_settings_school_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_store_settings
    ADD CONSTRAINT school_store_settings_school_id_key UNIQUE (school_id);


--
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: security security_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.security
    ADD CONSTRAINT security_pkey PRIMARY KEY (id);


--
-- Name: security_records security_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.security_records
    ADD CONSTRAINT security_records_pkey PRIMARY KEY (id);


--
-- Name: semesters semesters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semesters
    ADD CONSTRAINT semesters_pkey PRIMARY KEY (id);


--
-- Name: service_audit_log service_audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.service_audit_log
    ADD CONSTRAINT service_audit_log_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: shipping_companies shipping_companies_pkey; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.shipping_companies
    ADD CONSTRAINT shipping_companies_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_setting_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_setting_key_key UNIQUE (setting_key);


--
-- Name: social_comments social_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_comments
    ADD CONSTRAINT social_comments_pkey PRIMARY KEY (id);


--
-- Name: social_likes social_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_likes
    ADD CONSTRAINT social_likes_pkey PRIMARY KEY (id);


--
-- Name: social_likes social_likes_post_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_likes
    ADD CONSTRAINT social_likes_post_id_user_id_key UNIQUE (post_id, user_id);


--
-- Name: social_posts social_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_posts
    ADD CONSTRAINT social_posts_pkey PRIMARY KEY (id);


--
-- Name: special_needs special_needs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.special_needs
    ADD CONSTRAINT special_needs_pkey PRIMARY KEY (id);


--
-- Name: store_orders store_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_orders
    ADD CONSTRAINT store_orders_pkey PRIMARY KEY (id);


--
-- Name: store_products store_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_products
    ADD CONSTRAINT store_products_pkey PRIMARY KEY (id);


--
-- Name: student_fees student_fees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_fees
    ADD CONSTRAINT student_fees_pkey PRIMARY KEY (id);


--
-- Name: student_tracking student_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_tracking
    ADD CONSTRAINT student_tracking_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- Name: submissions submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: supervisors_table supervisors_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supervisors_table
    ADD CONSTRAINT supervisors_table_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_pkey PRIMARY KEY (id);


--
-- Name: surveys surveys_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.surveys
    ADD CONSTRAINT surveys_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: teacher_assignments teacher_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.teacher_assignments
    ADD CONSTRAINT teacher_assignments_pkey PRIMARY KEY (id);


--
-- Name: teacher_assignments teacher_assignments_teacher_id_subject_id_class_id_key; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.teacher_assignments
    ADD CONSTRAINT teacher_assignments_teacher_id_subject_id_class_id_key UNIQUE (teacher_id, subject_id, class_id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: trainers trainers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainers
    ADD CONSTRAINT trainers_pkey PRIMARY KEY (id);


--
-- Name: training_records training_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.training_records
    ADD CONSTRAINT training_records_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: transport_assignments transport_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_assignments
    ADD CONSTRAINT transport_assignments_pkey PRIMARY KEY (id);


--
-- Name: transport_routes transport_routes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_routes
    ADD CONSTRAINT transport_routes_pkey PRIMARY KEY (id);


--
-- Name: transport_stops transport_stops_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_stops
    ADD CONSTRAINT transport_stops_pkey PRIMARY KEY (id);


--
-- Name: unified_invoice_items unified_invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.unified_invoice_items
    ADD CONSTRAINT unified_invoice_items_pkey PRIMARY KEY (id);


--
-- Name: unified_invoices unified_invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.unified_invoices
    ADD CONSTRAINT unified_invoices_invoice_number_key UNIQUE (invoice_number);


--
-- Name: unified_invoices unified_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.unified_invoices
    ADD CONSTRAINT unified_invoices_pkey PRIMARY KEY (id);


--
-- Name: unified_payments unified_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.unified_payments
    ADD CONSTRAINT unified_payments_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vaccinations vaccinations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vaccinations
    ADD CONSTRAINT vaccinations_pkey PRIMARY KEY (id);


--
-- Name: vaccinations_table vaccinations_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vaccinations_table
    ADD CONSTRAINT vaccinations_table_pkey PRIMARY KEY (id);


--
-- Name: video_items video_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video_items
    ADD CONSTRAINT video_items_pkey PRIMARY KEY (id);


--
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- Name: visitors visitors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT visitors_pkey PRIMARY KEY (id);


--
-- Name: attendances_student_id_date_class_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX attendances_student_id_date_class_id_key ON public.attendances USING btree (student_id, date, class_id);


--
-- Name: courses_code_school_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX courses_code_school_id_key ON public.courses USING btree (code, school_id);


--
-- Name: exam_questions_exam_id_question_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX exam_questions_exam_id_question_id_key ON public.exam_questions USING btree (exam_id, question_id);


--
-- Name: idx_ai_moderation_verdict; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ai_moderation_verdict ON public.ai_moderation USING btree (verdict);


--
-- Name: idx_attendance_lecture; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attendance_lecture ON public.attendance USING btree (lecture_id);


--
-- Name: idx_attendance_student; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attendance_student ON public.attendance USING btree (student_id);


--
-- Name: idx_attendances_class_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attendances_class_id ON public.attendances USING btree (class_id);


--
-- Name: idx_attendances_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attendances_date ON public.attendances USING btree (date);


--
-- Name: idx_audit_logs_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_created_at ON public.audit_logs USING btree (created_at DESC);


--
-- Name: idx_cart_user; Type: INDEX; Schema: public; Owner: matin
--

CREATE INDEX idx_cart_user ON public.cart_items USING btree (user_id);


--
-- Name: idx_certificates_school; Type: INDEX; Schema: public; Owner: matin
--

CREATE INDEX idx_certificates_school ON public.certificates USING btree (school_id);


--
-- Name: idx_classes_school_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_classes_school_id ON public.classes USING btree (school_id);


--
-- Name: idx_cms_ads_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cms_ads_active ON public.cms_ads USING btree (is_active);


--
-- Name: idx_cms_banners_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cms_banners_active ON public.cms_banners USING btree (is_active);


--
-- Name: idx_cms_sections_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cms_sections_key ON public.cms_sections USING btree (section_key);


--
-- Name: idx_content_reports_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_reports_status ON public.content_reports USING btree (status);


--
-- Name: idx_exam_results_exam_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_exam_results_exam_id ON public.exam_results USING btree (exam_id);


--
-- Name: idx_exam_results_student_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_exam_results_student_id ON public.exam_results USING btree (student_id);


--
-- Name: idx_exams_school_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_exams_school_id ON public.exams USING btree (school_id);


--
-- Name: idx_exams_school_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_exams_school_status ON public.exams USING btree (school_id, status);


--
-- Name: idx_exams_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_exams_status ON public.exams USING btree (status);


--
-- Name: idx_financial_log_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_financial_log_created_at ON public.financial_log USING btree (created_at DESC);


--
-- Name: idx_financial_log_school_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_financial_log_school_id ON public.financial_log USING btree (school_id);


--
-- Name: idx_grades_exam_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_grades_exam_id ON public.grades USING btree (exam_id);


--
-- Name: idx_grades_school_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_grades_school_id ON public.grades USING btree (school_id);


--
-- Name: idx_grades_student_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_grades_student_id ON public.grades USING btree (student_id);


--
-- Name: idx_hw_sub_homework; Type: INDEX; Schema: public; Owner: matin
--

CREATE INDEX idx_hw_sub_homework ON public.homework_submissions USING btree (homework_id);


--
-- Name: idx_inbox_messages_school_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inbox_messages_school_id ON public.inbox_messages USING btree (school_id);


--
-- Name: idx_institution_services_school; Type: INDEX; Schema: public; Owner: matin
--

CREATE INDEX idx_institution_services_school ON public.institution_services USING btree (school_id);


--
-- Name: idx_messages_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_created_at ON public.messages USING btree (created_at DESC);


--
-- Name: idx_messages_receiver_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_receiver_id ON public.messages USING btree (receiver_id);


--
-- Name: idx_messages_sender_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_sender_id ON public.messages USING btree (sender_id);


--
-- Name: idx_moderation_log_content; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_moderation_log_content ON public.moderation_log USING btree (content_type, content_id);


--
-- Name: idx_notifications_read; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_read ON public.notifications USING btree (user_id, is_read);


--
-- Name: idx_notifications_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);


--
-- Name: idx_payments_school_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_school_id ON public.payments USING btree (school_id);


--
-- Name: idx_payments_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_status ON public.payments USING btree (status);


--
-- Name: idx_payments_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_user_id ON public.payments USING btree (user_id);


--
-- Name: idx_posts_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_posts_status ON public.posts USING btree (status, is_hidden);


--
-- Name: idx_question_bank_global; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_question_bank_global ON public.question_bank USING btree (is_global);


--
-- Name: idx_question_bank_subject_grade; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_question_bank_subject_grade ON public.question_bank USING btree (subject, grade);


--
-- Name: idx_schools_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schools_status ON public.schools USING btree (status);


--
-- Name: idx_schools_subscription; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schools_subscription ON public.schools USING btree (subscription_status);


--
-- Name: idx_students_class_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_students_class_id ON public.students USING btree (class_id);


--
-- Name: idx_students_school_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_students_school_id ON public.students USING btree (school_id);


--
-- Name: idx_students_school_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_students_school_status ON public.students USING btree (school_id, status);


--
-- Name: idx_students_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_students_status ON public.students USING btree (status);


--
-- Name: idx_subscriptions_school_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subscriptions_school_id ON public.subscriptions USING btree (school_id);


--
-- Name: idx_unified_invoices_parent; Type: INDEX; Schema: public; Owner: matin
--

CREATE INDEX idx_unified_invoices_parent ON public.unified_invoices USING btree (parent_id);


--
-- Name: idx_unified_invoices_school; Type: INDEX; Schema: public; Owner: matin
--

CREATE INDEX idx_unified_invoices_school ON public.unified_invoices USING btree (school_id);


--
-- Name: idx_unified_invoices_status; Type: INDEX; Schema: public; Owner: matin
--

CREATE INDEX idx_unified_invoices_status ON public.unified_invoices USING btree (status);


--
-- Name: idx_unified_payments_invoice; Type: INDEX; Schema: public; Owner: matin
--

CREATE INDEX idx_unified_payments_invoice ON public.unified_payments USING btree (invoice_id);


--
-- Name: idx_unified_payments_school_id; Type: INDEX; Schema: public; Owner: matin
--

CREATE INDEX idx_unified_payments_school_id ON public.unified_payments USING btree (school_id);


--
-- Name: idx_unified_payments_status; Type: INDEX; Schema: public; Owner: matin
--

CREATE INDEX idx_unified_payments_status ON public.unified_payments USING btree (status);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: idx_users_school_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_school_id ON public.users USING btree (school_id);


--
-- Name: idx_users_school_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_school_role ON public.users USING btree (school_id, role);


--
-- Name: idx_users_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_status ON public.users USING btree (status);


--
-- Name: invoices_invoice_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX invoices_invoice_number_key ON public.invoices USING btree (invoice_number);


--
-- Name: orders_order_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX orders_order_number_key ON public.orders USING btree (order_number);


--
-- Name: parents_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX parents_user_id_key ON public.parents USING btree (user_id);


--
-- Name: payrolls_employee_id_month_year_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX payrolls_employee_id_month_year_key ON public.payrolls USING btree (employee_id, month, year);


--
-- Name: schools_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX schools_code_key ON public.schools USING btree (code);


--
-- Name: settings_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX settings_key_key ON public.settings USING btree (key);


--
-- Name: students_student_id_school_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX students_student_id_school_id_key ON public.students USING btree (student_id, school_id);


--
-- Name: students_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX students_user_id_key ON public.students USING btree (user_id);


--
-- Name: submissions_assignment_id_student_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX submissions_assignment_id_student_id_key ON public.submissions USING btree (assignment_id, student_id);


--
-- Name: teachers_employee_id_school_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX teachers_employee_id_school_id_key ON public.teachers USING btree (employee_id, school_id);


--
-- Name: teachers_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX teachers_user_id_key ON public.teachers USING btree (user_id);


--
-- Name: transport_assignments_student_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX transport_assignments_student_id_key ON public.transport_assignments USING btree (student_id);


--
-- Name: academic_years academic_years_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_years
    ADD CONSTRAINT academic_years_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: announcements announcements_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assignments assignments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: attendances attendances_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: attendances attendances_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: book_borrowings book_borrowings_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_borrowings
    ADD CONSTRAINT book_borrowings_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.library_books(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.store_products(id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: classes classes_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: comments comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: content_reports content_reports_reporter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_reports
    ADD CONSTRAINT content_reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.users(id);


--
-- Name: content_reports content_reports_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_reports
    ADD CONSTRAINT content_reports_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id);


--
-- Name: courses courses_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: courses courses_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: courses courses_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: events events_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: exam_questions exam_questions_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_questions
    ADD CONSTRAINT exam_questions_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: exam_questions exam_questions_question_bank_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_questions
    ADD CONSTRAINT exam_questions_question_bank_id_fkey FOREIGN KEY (question_bank_id) REFERENCES public.question_bank(id) ON DELETE SET NULL;


--
-- Name: exam_questions exam_questions_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_questions
    ADD CONSTRAINT exam_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: exams exams_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;


--
-- Name: exams exams_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: exams exams_semester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_semester_id_fkey FOREIGN KEY (semester_id) REFERENCES public.semesters(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: follows follows_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: follows follows_following_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_following_id_fkey FOREIGN KEY (following_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: forum_replies forum_replies_forum_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_replies
    ADD CONSTRAINT forum_replies_forum_id_fkey FOREIGN KEY (forum_id) REFERENCES public.forums(id) ON DELETE CASCADE;


--
-- Name: forum_replies forum_replies_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forum_replies
    ADD CONSTRAINT forum_replies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: forums forums_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forums
    ADD CONSTRAINT forums_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: grades grades_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: grades grades_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: grades grades_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: homework_submissions homework_submissions_homework_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.homework_submissions
    ADD CONSTRAINT homework_submissions_homework_id_fkey FOREIGN KEY (homework_id) REFERENCES public.homework(id) ON DELETE CASCADE;


--
-- Name: invoice_items invoice_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: invoices invoices_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: leaves leaves_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaves
    ADD CONSTRAINT leaves_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: library_books library_books_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.library_books
    ADD CONSTRAINT library_books_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: likes likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: likes likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: moderation_log moderation_log_moderator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moderation_log
    ADD CONSTRAINT moderation_log_moderator_id_fkey FOREIGN KEY (moderator_id) REFERENCES public.users(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: payments payments_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: payroll payroll_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll
    ADD CONSTRAINT payroll_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.users(id);


--
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: products products_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: questions questions_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: schedules schedules_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: schedules schedules_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: schedules schedules_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: school_addon_subscriptions school_addon_subscriptions_addon_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_addon_subscriptions
    ADD CONSTRAINT school_addon_subscriptions_addon_plan_id_fkey FOREIGN KEY (addon_plan_id) REFERENCES public.addon_plans(id) ON DELETE CASCADE;


--
-- Name: school_owners school_owners_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_owners
    ADD CONSTRAINT school_owners_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE CASCADE;


--
-- Name: school_owners school_owners_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_owners
    ADD CONSTRAINT school_owners_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: school_staff school_staff_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_staff
    ADD CONSTRAINT school_staff_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE CASCADE;


--
-- Name: school_staff school_staff_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_staff
    ADD CONSTRAINT school_staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: semesters semesters_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semesters
    ADD CONSTRAINT semesters_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: social_comments social_comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_comments
    ADD CONSTRAINT social_comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.social_posts(id) ON DELETE CASCADE;


--
-- Name: social_comments social_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_comments
    ADD CONSTRAINT social_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: social_likes social_likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_likes
    ADD CONSTRAINT social_likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.social_posts(id) ON DELETE CASCADE;


--
-- Name: social_likes social_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_likes
    ADD CONSTRAINT social_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: social_posts social_posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_posts
    ADD CONSTRAINT social_posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: submissions submissions_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.assignments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: submissions submissions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transport_assignments transport_assignments_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_assignments
    ADD CONSTRAINT transport_assignments_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.transport_routes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transport_assignments transport_assignments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_assignments
    ADD CONSTRAINT transport_assignments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transport_routes transport_routes_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_routes
    ADD CONSTRAINT transport_routes_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transport_stops transport_stops_route_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_stops
    ADD CONSTRAINT transport_stops_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.transport_routes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: unified_invoice_items unified_invoice_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.unified_invoice_items
    ADD CONSTRAINT unified_invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.unified_invoices(id) ON DELETE CASCADE;


--
-- Name: unified_payments unified_payments_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: matin
--

ALTER TABLE ONLY public.unified_payments
    ADD CONSTRAINT unified_payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.unified_invoices(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO matin;


--
-- Name: TABLE academic_years; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.academic_years TO matin_user;
GRANT ALL ON TABLE public.academic_years TO matin;


--
-- Name: TABLE activities; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.activities TO matin_user;
GRANT ALL ON TABLE public.activities TO matin;


--
-- Name: SEQUENCE activities_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.activities_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.activities_id_seq TO matin;


--
-- Name: TABLE addon_plans; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.addon_plans TO matin_user;


--
-- Name: SEQUENCE addon_plans_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.addon_plans_id_seq TO matin_user;
GRANT SELECT,USAGE ON SEQUENCE public.addon_plans_id_seq TO matin;


--
-- Name: TABLE admissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.admissions TO matin_user;
GRANT ALL ON TABLE public.admissions TO matin;


--
-- Name: SEQUENCE admissions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.admissions_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.admissions_id_seq TO matin;


--
-- Name: TABLE ads; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ads TO matin_user;
GRANT ALL ON TABLE public.ads TO matin;


--
-- Name: SEQUENCE ads_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.ads_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.ads_id_seq TO matin;


--
-- Name: TABLE advertisements; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.advertisements TO matin_user;
GRANT ALL ON TABLE public.advertisements TO matin;


--
-- Name: SEQUENCE advertisements_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.advertisements_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.advertisements_id_seq TO matin;


--
-- Name: TABLE ai_chats; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ai_chats TO matin_user;
GRANT ALL ON TABLE public.ai_chats TO matin;


--
-- Name: SEQUENCE ai_chats_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.ai_chats_id_seq TO matin_user;
GRANT SELECT,USAGE ON SEQUENCE public.ai_chats_id_seq TO matin;


--
-- Name: TABLE ai_moderation; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ai_moderation TO matin_user;
GRANT ALL ON TABLE public.ai_moderation TO matin;


--
-- Name: SEQUENCE ai_moderation_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.ai_moderation_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.ai_moderation_id_seq TO matin;


--
-- Name: TABLE ai_moderation_log; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ai_moderation_log TO matin_user;


--
-- Name: TABLE announcements; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.announcements TO matin_user;
GRANT ALL ON TABLE public.announcements TO matin;


--
-- Name: TABLE appointments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.appointments TO matin_user;
GRANT ALL ON TABLE public.appointments TO matin;


--
-- Name: SEQUENCE appointments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.appointments_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.appointments_id_seq TO matin;


--
-- Name: TABLE assignments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.assignments TO matin_user;
GRANT ALL ON TABLE public.assignments TO matin;


--
-- Name: TABLE attendance; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.attendance TO matin_user;
GRANT ALL ON TABLE public.attendance TO matin;


--
-- Name: SEQUENCE attendance_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.attendance_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.attendance_id_seq TO matin;


--
-- Name: TABLE attendances; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.attendances TO matin_user;
GRANT ALL ON TABLE public.attendances TO matin;


--
-- Name: TABLE audit_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.audit_logs TO matin_user;
GRANT ALL ON TABLE public.audit_logs TO matin;


--
-- Name: TABLE behavior; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.behavior TO matin_user;
GRANT ALL ON TABLE public.behavior TO matin;


--
-- Name: SEQUENCE behavior_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.behavior_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.behavior_id_seq TO matin;


--
-- Name: TABLE book_borrowings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.book_borrowings TO matin_user;
GRANT ALL ON TABLE public.book_borrowings TO matin;


--
-- Name: TABLE bus_events; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bus_events TO matin_user;
GRANT ALL ON TABLE public.bus_events TO matin;


--
-- Name: SEQUENCE bus_events_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.bus_events_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.bus_events_id_seq TO matin;


--
-- Name: TABLE bus_live_location; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bus_live_location TO matin_user;
GRANT ALL ON TABLE public.bus_live_location TO matin;


--
-- Name: SEQUENCE bus_live_location_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.bus_live_location_id_seq TO matin_user;
GRANT SELECT,USAGE ON SEQUENCE public.bus_live_location_id_seq TO matin;


--
-- Name: TABLE bus_maintenance; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bus_maintenance TO matin_user;
GRANT ALL ON TABLE public.bus_maintenance TO matin;


--
-- Name: SEQUENCE bus_maintenance_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.bus_maintenance_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.bus_maintenance_id_seq TO matin;


--
-- Name: TABLE bus_riders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bus_riders TO matin_user;
GRANT ALL ON TABLE public.bus_riders TO matin;


--
-- Name: SEQUENCE bus_riders_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.bus_riders_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.bus_riders_id_seq TO matin;


--
-- Name: TABLE bus_trips; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bus_trips TO matin_user;
GRANT ALL ON TABLE public.bus_trips TO matin;


--
-- Name: SEQUENCE bus_trips_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.bus_trips_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.bus_trips_id_seq TO matin;


--
-- Name: TABLE buses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.buses TO matin_user;
GRANT ALL ON TABLE public.buses TO matin;


--
-- Name: SEQUENCE buses_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.buses_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.buses_id_seq TO matin;


--
-- Name: TABLE cafeteria; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cafeteria TO matin_user;
GRANT ALL ON TABLE public.cafeteria TO matin;


--
-- Name: SEQUENCE cafeteria_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.cafeteria_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.cafeteria_id_seq TO matin;


--
-- Name: TABLE calendar_events; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.calendar_events TO matin_user;
GRANT ALL ON TABLE public.calendar_events TO matin;


--
-- Name: SEQUENCE calendar_events_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.calendar_events_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.calendar_events_id_seq TO matin;


--
-- Name: TABLE chat_rooms; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.chat_rooms TO matin_user;
GRANT ALL ON TABLE public.chat_rooms TO matin;


--
-- Name: SEQUENCE chat_rooms_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.chat_rooms_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.chat_rooms_id_seq TO matin;


--
-- Name: TABLE circulars; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.circulars TO matin_user;
GRANT ALL ON TABLE public.circulars TO matin;


--
-- Name: SEQUENCE circulars_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.circulars_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.circulars_id_seq TO matin;


--
-- Name: TABLE classes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.classes TO matin_user;
GRANT ALL ON TABLE public.classes TO matin;


--
-- Name: TABLE clinic; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.clinic TO matin_user;
GRANT ALL ON TABLE public.clinic TO matin;


--
-- Name: SEQUENCE clinic_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.clinic_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.clinic_id_seq TO matin;


--
-- Name: TABLE cms_ads; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cms_ads TO matin_user;


--
-- Name: SEQUENCE cms_ads_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.cms_ads_id_seq TO matin_user;
GRANT SELECT,USAGE ON SEQUENCE public.cms_ads_id_seq TO matin;


--
-- Name: TABLE cms_banners; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cms_banners TO matin_user;


--
-- Name: SEQUENCE cms_banners_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.cms_banners_id_seq TO matin_user;
GRANT SELECT,USAGE ON SEQUENCE public.cms_banners_id_seq TO matin;


--
-- Name: TABLE cms_sections; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cms_sections TO matin_user;


--
-- Name: SEQUENCE cms_sections_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.cms_sections_id_seq TO matin_user;
GRANT SELECT,USAGE ON SEQUENCE public.cms_sections_id_seq TO matin;


--
-- Name: TABLE cms_seo; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cms_seo TO matin_user;


--
-- Name: SEQUENCE cms_seo_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.cms_seo_id_seq TO matin_user;
GRANT SELECT,USAGE ON SEQUENCE public.cms_seo_id_seq TO matin;


--
-- Name: TABLE colleges; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.colleges TO matin_user;
GRANT ALL ON TABLE public.colleges TO matin;


--
-- Name: SEQUENCE colleges_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.colleges_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.colleges_id_seq TO matin;


--
-- Name: TABLE comments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.comments TO matin_user;
GRANT ALL ON TABLE public.comments TO matin;


--
-- Name: SEQUENCE comments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.comments_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.comments_id_seq TO matin;


--
-- Name: TABLE commissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.commissions TO matin_user;
GRANT ALL ON TABLE public.commissions TO matin;


--
-- Name: SEQUENCE commissions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.commissions_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.commissions_id_seq TO matin;


--
-- Name: TABLE community_comments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.community_comments TO matin_user;
GRANT ALL ON TABLE public.community_comments TO matin;


--
-- Name: SEQUENCE community_comments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.community_comments_id_seq TO matin_user;
GRANT SELECT,USAGE ON SEQUENCE public.community_comments_id_seq TO matin;


--
-- Name: TABLE community_likes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.community_likes TO matin_user;
GRANT ALL ON TABLE public.community_likes TO matin;


--
-- Name: SEQUENCE community_likes_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.community_likes_id_seq TO matin_user;
GRANT SELECT,USAGE ON SEQUENCE public.community_likes_id_seq TO matin;


--
-- Name: TABLE community_posts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.community_posts TO matin_user;
GRANT ALL ON TABLE public.community_posts TO matin;


--
-- Name: SEQUENCE community_posts_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.community_posts_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.community_posts_id_seq TO matin;


--
-- Name: TABLE complaints; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.complaints TO matin_user;
GRANT ALL ON TABLE public.complaints TO matin;


--
-- Name: SEQUENCE complaints_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.complaints_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.complaints_id_seq TO matin;


--
-- Name: TABLE content_reports; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.content_reports TO matin_user;
GRANT ALL ON TABLE public.content_reports TO matin;


--
-- Name: SEQUENCE content_reports_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.content_reports_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.content_reports_id_seq TO matin;


--
-- Name: TABLE contracts_docs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.contracts_docs TO matin_user;
GRANT ALL ON TABLE public.contracts_docs TO matin;


--
-- Name: SEQUENCE contracts_docs_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.contracts_docs_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.contracts_docs_id_seq TO matin;


--
-- Name: TABLE counseling; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.counseling TO matin_user;
GRANT ALL ON TABLE public.counseling TO matin;


--
-- Name: SEQUENCE counseling_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.counseling_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.counseling_id_seq TO matin;


--
-- Name: TABLE coupons; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.coupons TO matin_user;
GRANT ALL ON TABLE public.coupons TO matin;


--
-- Name: SEQUENCE coupons_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.coupons_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.coupons_id_seq TO matin;


--
-- Name: TABLE courses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.courses TO matin_user;
GRANT ALL ON TABLE public.courses TO matin;


--
-- Name: TABLE credit_hours; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.credit_hours TO matin_user;
GRANT ALL ON TABLE public.credit_hours TO matin;


--
-- Name: SEQUENCE credit_hours_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.credit_hours_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.credit_hours_id_seq TO matin;


--
-- Name: TABLE curriculum; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.curriculum TO matin_user;
GRANT ALL ON TABLE public.curriculum TO matin;


--
-- Name: SEQUENCE curriculum_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.curriculum_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.curriculum_id_seq TO matin;


--
-- Name: TABLE delegates; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.delegates TO matin_user;
GRANT ALL ON TABLE public.delegates TO matin;


--
-- Name: SEQUENCE delegates_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.delegates_id_seq TO matin_user;
GRANT SELECT,USAGE ON SEQUENCE public.delegates_id_seq TO matin;


--
-- Name: TABLE driver_licenses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.driver_licenses TO matin_user;
GRANT ALL ON TABLE public.driver_licenses TO matin;


--
-- Name: SEQUENCE driver_licenses_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.driver_licenses_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.driver_licenses_id_seq TO matin;


--
-- Name: TABLE drivers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.drivers TO matin_user;
GRANT ALL ON TABLE public.drivers TO matin;


--
-- Name: SEQUENCE drivers_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.drivers_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.drivers_id_seq TO matin;


--
-- Name: TABLE elearning; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.elearning TO matin_user;
GRANT ALL ON TABLE public.elearning TO matin;


--
-- Name: SEQUENCE elearning_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.elearning_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.elearning_id_seq TO matin;


--
-- Name: TABLE email_otps; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.email_otps TO matin_user;
GRANT ALL ON TABLE public.email_otps TO matin;


--
-- Name: SEQUENCE email_otps_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.email_otps_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.email_otps_id_seq TO matin;


--
-- Name: TABLE emergencies; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.emergencies TO matin_user;
GRANT ALL ON TABLE public.emergencies TO matin;


--
-- Name: SEQUENCE emergencies_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.emergencies_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.emergencies_id_seq TO matin;


--
-- Name: TABLE emergency_key_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.emergency_key_logs TO matin_user;
GRANT ALL ON TABLE public.emergency_key_logs TO matin;


--
-- Name: SEQUENCE emergency_key_logs_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.emergency_key_logs_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.emergency_key_logs_id_seq TO matin;


--
-- Name: TABLE emergency_keys; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.emergency_keys TO matin_user;
GRANT ALL ON TABLE public.emergency_keys TO matin;


--
-- Name: SEQUENCE emergency_keys_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.emergency_keys_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.emergency_keys_id_seq TO matin;


--
-- Name: TABLE events; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.events TO matin_user;
GRANT ALL ON TABLE public.events TO matin;


--
-- Name: TABLE exam_ai_analysis; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.exam_ai_analysis TO matin_user;


--
-- Name: SEQUENCE exam_ai_analysis_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.exam_ai_analysis_id_seq TO matin_user;
GRANT SELECT,USAGE ON SEQUENCE public.exam_ai_analysis_id_seq TO matin;


--
-- Name: TABLE exam_answers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.exam_answers TO matin_user;
GRANT ALL ON TABLE public.exam_answers TO matin;


--
-- Name: TABLE exam_print_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.exam_print_logs TO matin_user;
GRANT ALL ON TABLE public.exam_print_logs TO matin;


--
-- Name: SEQUENCE exam_print_logs_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.exam_print_logs_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.exam_print_logs_id_seq TO matin;


--
-- Name: TABLE exam_proctoring_sessions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.exam_proctoring_sessions TO matin_user;
GRANT ALL ON TABLE public.exam_proctoring_sessions TO matin;


--
-- Name: SEQUENCE exam_proctoring_sessions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.exam_proctoring_sessions_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.exam_proctoring_sessions_id_seq TO matin;


--
-- Name: TABLE exam_questions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.exam_questions TO matin_user;
GRANT ALL ON TABLE public.exam_questions TO matin;


--
-- Name: TABLE exam_results; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.exam_results TO matin_user;
GRANT ALL ON TABLE public.exam_results TO matin;


--
-- Name: SEQUENCE exam_results_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.exam_results_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.exam_results_id_seq TO matin;


--
-- Name: TABLE exam_rooms; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.exam_rooms TO matin_user;
GRANT ALL ON TABLE public.exam_rooms TO matin;


--
-- Name: SEQUENCE exam_rooms_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.exam_rooms_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.exam_rooms_id_seq TO matin;


--
-- Name: TABLE exam_schedule; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.exam_schedule TO matin_user;
GRANT ALL ON TABLE public.exam_schedule TO matin;


--
-- Name: SEQUENCE exam_schedule_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.exam_schedule_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.exam_schedule_id_seq TO matin;


--
-- Name: TABLE exam_sessions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.exam_sessions TO matin_user;
GRANT ALL ON TABLE public.exam_sessions TO matin;


--
-- Name: TABLE exam_violations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.exam_violations TO matin_user;
GRANT ALL ON TABLE public.exam_violations TO matin;


--
-- Name: TABLE exams; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.exams TO matin_user;
GRANT ALL ON TABLE public.exams TO matin;


--
-- Name: TABLE expenses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.expenses TO matin_user;
GRANT ALL ON TABLE public.expenses TO matin;


--
-- Name: TABLE facilities; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.facilities TO matin_user;
GRANT ALL ON TABLE public.facilities TO matin;


--
-- Name: SEQUENCE facilities_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.facilities_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.facilities_id_seq TO matin;


--
-- Name: TABLE feature_usage; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.feature_usage TO matin_user;


--
-- Name: SEQUENCE feature_usage_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.feature_usage_id_seq TO matin_user;
GRANT SELECT,USAGE ON SEQUENCE public.feature_usage_id_seq TO matin;


--
-- Name: TABLE features; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.features TO matin_user;
GRANT ALL ON TABLE public.features TO matin;


--
-- Name: SEQUENCE features_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.features_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.features_id_seq TO matin;


--
-- Name: TABLE financial_log; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.financial_log TO matin_user;
GRANT ALL ON TABLE public.financial_log TO matin;


--
-- Name: SEQUENCE financial_log_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.financial_log_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.financial_log_id_seq TO matin;


--
-- Name: TABLE follows; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.follows TO matin_user;
GRANT ALL ON TABLE public.follows TO matin;


--
-- Name: SEQUENCE follows_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.follows_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.follows_id_seq TO matin;


--
-- Name: TABLE forum_replies; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.forum_replies TO matin_user;
GRANT ALL ON TABLE public.forum_replies TO matin;


--
-- Name: SEQUENCE forum_replies_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.forum_replies_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.forum_replies_id_seq TO matin;


--
-- Name: TABLE forums; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.forums TO matin_user;
GRANT ALL ON TABLE public.forums TO matin;


--
-- Name: SEQUENCE forums_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.forums_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.forums_id_seq TO matin;


--
-- Name: TABLE fuel; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.fuel TO matin_user;
GRANT ALL ON TABLE public.fuel TO matin;


--
-- Name: SEQUENCE fuel_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.fuel_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.fuel_id_seq TO matin;


--
-- Name: TABLE fuel_records; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.fuel_records TO matin_user;
GRANT ALL ON TABLE public.fuel_records TO matin;


--
-- Name: SEQUENCE fuel_records_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.fuel_records_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.fuel_records_id_seq TO matin;


--
-- Name: TABLE gallery_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.gallery_items TO matin_user;
GRANT ALL ON TABLE public.gallery_items TO matin;


--
-- Name: SEQUENCE gallery_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.gallery_items_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.gallery_items_id_seq TO matin;


--
-- Name: TABLE gifted; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.gifted TO matin_user;
GRANT ALL ON TABLE public.gifted TO matin;


--
-- Name: SEQUENCE gifted_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.gifted_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.gifted_id_seq TO matin;


--
-- Name: TABLE grade_appeals; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.grade_appeals TO matin_user;
GRANT ALL ON TABLE public.grade_appeals TO matin;


--
-- Name: SEQUENCE grade_appeals_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.grade_appeals_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.grade_appeals_id_seq TO matin;


--
-- Name: TABLE grades; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.grades TO matin_user;
GRANT ALL ON TABLE public.grades TO matin;


--
-- Name: TABLE grading_committees; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.grading_committees TO matin_user;
GRANT ALL ON TABLE public.grading_committees TO matin;


--
-- Name: SEQUENCE grading_committees_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.grading_committees_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.grading_committees_id_seq TO matin;


--
-- Name: TABLE guest_users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.guest_users TO matin_user;
GRANT ALL ON TABLE public.guest_users TO matin;


--
-- Name: SEQUENCE guest_users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.guest_users_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.guest_users_id_seq TO matin;


--
-- Name: TABLE health_insurance; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.health_insurance TO matin_user;
GRANT ALL ON TABLE public.health_insurance TO matin;


--
-- Name: SEQUENCE health_insurance_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.health_insurance_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.health_insurance_id_seq TO matin;


--
-- Name: TABLE health_records; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.health_records TO matin_user;
GRANT ALL ON TABLE public.health_records TO matin;


--
-- Name: SEQUENCE health_records_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.health_records_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.health_records_id_seq TO matin;


--
-- Name: TABLE homework; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.homework TO matin_user;
GRANT ALL ON TABLE public.homework TO matin;


--
-- Name: SEQUENCE homework_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.homework_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.homework_id_seq TO matin;


--
-- Name: TABLE inbox_messages; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.inbox_messages TO matin_user;
GRANT ALL ON TABLE public.inbox_messages TO matin;


--
-- Name: SEQUENCE inbox_messages_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.inbox_messages_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.inbox_messages_id_seq TO matin;


--
-- Name: TABLE insurance; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.insurance TO matin_user;
GRANT ALL ON TABLE public.insurance TO matin;


--
-- Name: SEQUENCE insurance_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.insurance_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.insurance_id_seq TO matin;


--
-- Name: TABLE integrations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.integrations TO matin_user;
GRANT ALL ON TABLE public.integrations TO matin;


--
-- Name: TABLE inventory; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.inventory TO matin_user;
GRANT ALL ON TABLE public.inventory TO matin;


--
-- Name: SEQUENCE inventory_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.inventory_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.inventory_id_seq TO matin;


--
-- Name: TABLE inventory_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.inventory_items TO matin_user;
GRANT ALL ON TABLE public.inventory_items TO matin;


--
-- Name: SEQUENCE inventory_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.inventory_items_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.inventory_items_id_seq TO matin;


--
-- Name: TABLE invoice_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.invoice_items TO matin_user;
GRANT ALL ON TABLE public.invoice_items TO matin;


--
-- Name: TABLE invoices; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.invoices TO matin_user;
GRANT ALL ON TABLE public.invoices TO matin;


--
-- Name: TABLE knowledge_base; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.knowledge_base TO matin_user;
GRANT ALL ON TABLE public.knowledge_base TO matin;


--
-- Name: SEQUENCE knowledge_base_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.knowledge_base_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.knowledge_base_id_seq TO matin;


--
-- Name: TABLE leads; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.leads TO matin_user;
GRANT ALL ON TABLE public.leads TO matin;


--
-- Name: SEQUENCE leads_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.leads_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.leads_id_seq TO matin;


--
-- Name: TABLE leaves; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.leaves TO matin_user;
GRANT ALL ON TABLE public.leaves TO matin;


--
-- Name: TABLE lecture_confirmations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.lecture_confirmations TO matin_user;
GRANT ALL ON TABLE public.lecture_confirmations TO matin;


--
-- Name: SEQUENCE lecture_confirmations_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.lecture_confirmations_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.lecture_confirmations_id_seq TO matin;


--
-- Name: TABLE lecture_post_answers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.lecture_post_answers TO matin_user;
GRANT ALL ON TABLE public.lecture_post_answers TO matin;


--
-- Name: SEQUENCE lecture_post_answers_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.lecture_post_answers_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.lecture_post_answers_id_seq TO matin;


--
-- Name: TABLE lecture_post_questions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.lecture_post_questions TO matin_user;
GRANT ALL ON TABLE public.lecture_post_questions TO matin;


--
-- Name: SEQUENCE lecture_post_questions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.lecture_post_questions_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.lecture_post_questions_id_seq TO matin;


--
-- Name: TABLE lectures; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.lectures TO matin_user;
GRANT ALL ON TABLE public.lectures TO matin;


--
-- Name: SEQUENCE lectures_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.lectures_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.lectures_id_seq TO matin;


--
-- Name: TABLE library_books; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.library_books TO matin_user;
GRANT ALL ON TABLE public.library_books TO matin;


--
-- Name: TABLE likes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.likes TO matin_user;
GRANT ALL ON TABLE public.likes TO matin;


--
-- Name: SEQUENCE likes_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.likes_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.likes_id_seq TO matin;


--
-- Name: TABLE live_sessions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.live_sessions TO matin_user;


--
-- Name: SEQUENCE live_sessions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.live_sessions_id_seq TO matin_user;
GRANT SELECT,USAGE ON SEQUENCE public.live_sessions_id_seq TO matin;


--
-- Name: TABLE live_streams; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.live_streams TO matin_user;
GRANT ALL ON TABLE public.live_streams TO matin;


--
-- Name: SEQUENCE live_streams_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.live_streams_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.live_streams_id_seq TO matin;


--
-- Name: TABLE meetings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.meetings TO matin_user;
GRANT ALL ON TABLE public.meetings TO matin;


--
-- Name: SEQUENCE meetings_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.meetings_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.meetings_id_seq TO matin;


--
-- Name: TABLE messages; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.messages TO matin_user;
GRANT ALL ON TABLE public.messages TO matin;


--
-- Name: TABLE moderation_log; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.moderation_log TO matin_user;
GRANT ALL ON TABLE public.moderation_log TO matin;


--
-- Name: SEQUENCE moderation_log_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.moderation_log_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.moderation_log_id_seq TO matin;


--
-- Name: TABLE moderation_settings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.moderation_settings TO matin_user;
GRANT ALL ON TABLE public.moderation_settings TO matin;


--
-- Name: SEQUENCE moderation_settings_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.moderation_settings_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.moderation_settings_id_seq TO matin;


--
-- Name: TABLE news_articles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.news_articles TO matin_user;
GRANT ALL ON TABLE public.news_articles TO matin;


--
-- Name: SEQUENCE news_articles_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.news_articles_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.news_articles_id_seq TO matin;


--
-- Name: TABLE notifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notifications TO matin_user;
GRANT ALL ON TABLE public.notifications TO matin;


--
-- Name: TABLE order_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.order_items TO matin_user;
GRANT ALL ON TABLE public.order_items TO matin;


--
-- Name: TABLE orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.orders TO matin_user;
GRANT ALL ON TABLE public.orders TO matin;


--
-- Name: TABLE page_designs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.page_designs TO matin_user;
GRANT ALL ON TABLE public.page_designs TO matin;


--
-- Name: SEQUENCE page_designs_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.page_designs_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.page_designs_id_seq TO matin;


--
-- Name: TABLE parents; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.parents TO matin_user;
GRANT ALL ON TABLE public.parents TO matin;


--
-- Name: TABLE parents_council; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.parents_council TO matin_user;
GRANT ALL ON TABLE public.parents_council TO matin;


--
-- Name: SEQUENCE parents_council_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.parents_council_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.parents_council_id_seq TO matin;


--
-- Name: TABLE partners; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.partners TO matin_user;
GRANT ALL ON TABLE public.partners TO matin;


--
-- Name: SEQUENCE partners_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.partners_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.partners_id_seq TO matin;


--
-- Name: TABLE payments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payments TO matin_user;
GRANT ALL ON TABLE public.payments TO matin;


--
-- Name: TABLE payroll; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payroll TO matin_user;
GRANT ALL ON TABLE public.payroll TO matin;


--
-- Name: SEQUENCE payroll_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.payroll_id_seq TO matin_user;
GRANT SELECT,USAGE ON SEQUENCE public.payroll_id_seq TO matin;


--
-- Name: TABLE payrolls; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payrolls TO matin_user;
GRANT ALL ON TABLE public.payrolls TO matin;


--
-- Name: TABLE plans; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.plans TO matin_user;
GRANT ALL ON TABLE public.plans TO matin;


--
-- Name: SEQUENCE plans_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.plans_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.plans_id_seq TO matin;


--
-- Name: TABLE platform_settings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.platform_settings TO matin_user;
GRANT ALL ON TABLE public.platform_settings TO matin;


--
-- Name: SEQUENCE platform_settings_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.platform_settings_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.platform_settings_id_seq TO matin;


--
-- Name: TABLE post_comments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.post_comments TO matin_user;
GRANT ALL ON TABLE public.post_comments TO matin;


--
-- Name: TABLE post_likes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.post_likes TO matin_user;
GRANT ALL ON TABLE public.post_likes TO matin;


--
-- Name: TABLE posts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.posts TO matin_user;
GRANT ALL ON TABLE public.posts TO matin;


--
-- Name: SEQUENCE posts_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.posts_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.posts_id_seq TO matin;


--
-- Name: TABLE proctoring_snapshots; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.proctoring_snapshots TO matin_user;
GRANT ALL ON TABLE public.proctoring_snapshots TO matin;


--
-- Name: SEQUENCE proctoring_snapshots_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.proctoring_snapshots_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.proctoring_snapshots_id_seq TO matin;


--
-- Name: TABLE products; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.products TO matin_user;
GRANT ALL ON TABLE public.products TO matin;


--
-- Name: TABLE question_bank; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.question_bank TO matin_user;
GRANT ALL ON TABLE public.question_bank TO matin;


--
-- Name: SEQUENCE question_bank_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.question_bank_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.question_bank_id_seq TO matin;


--
-- Name: TABLE questions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.questions TO matin_user;
GRANT ALL ON TABLE public.questions TO matin;


--
-- Name: TABLE recordings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.recordings TO matin_user;
GRANT ALL ON TABLE public.recordings TO matin;


--
-- Name: SEQUENCE recordings_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.recordings_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.recordings_id_seq TO matin;


--
-- Name: TABLE referrals; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.referrals TO matin_user;
GRANT ALL ON TABLE public.referrals TO matin;


--
-- Name: SEQUENCE referrals_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.referrals_id_seq TO matin_user;
GRANT SELECT,USAGE ON SEQUENCE public.referrals_id_seq TO matin;


--
-- Name: TABLE salaries; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.salaries TO matin_user;
GRANT ALL ON TABLE public.salaries TO matin;


--
-- Name: SEQUENCE salaries_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.salaries_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.salaries_id_seq TO matin;


--
-- Name: TABLE schedules; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.schedules TO matin_user;
GRANT ALL ON TABLE public.schedules TO matin;


--
-- Name: TABLE scholarships; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.scholarships TO matin_user;
GRANT ALL ON TABLE public.scholarships TO matin;


--
-- Name: SEQUENCE scholarships_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.scholarships_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.scholarships_id_seq TO matin;


--
-- Name: TABLE school_addon_subscriptions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.school_addon_subscriptions TO matin_user;


--
-- Name: SEQUENCE school_addon_subscriptions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.school_addon_subscriptions_id_seq TO matin_user;
GRANT SELECT,USAGE ON SEQUENCE public.school_addon_subscriptions_id_seq TO matin;


--
-- Name: TABLE school_appearance; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.school_appearance TO matin_user;
GRANT ALL ON TABLE public.school_appearance TO matin;


--
-- Name: SEQUENCE school_appearance_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.school_appearance_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.school_appearance_id_seq TO matin;


--
-- Name: TABLE school_integrations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.school_integrations TO matin_user;
GRANT ALL ON TABLE public.school_integrations TO matin;


--
-- Name: SEQUENCE school_integrations_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.school_integrations_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.school_integrations_id_seq TO matin;


--
-- Name: TABLE school_invoices; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.school_invoices TO matin_user;
GRANT ALL ON TABLE public.school_invoices TO matin;


--
-- Name: SEQUENCE school_invoices_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.school_invoices_id_seq TO matin_user;
GRANT SELECT,USAGE ON SEQUENCE public.school_invoices_id_seq TO matin;


--
-- Name: TABLE school_owners; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.school_owners TO matin_user;
GRANT ALL ON TABLE public.school_owners TO matin;


--
-- Name: SEQUENCE school_owners_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.school_owners_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.school_owners_id_seq TO matin;


--
-- Name: TABLE school_pages; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.school_pages TO matin_user;
GRANT ALL ON TABLE public.school_pages TO matin;


--
-- Name: SEQUENCE school_pages_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.school_pages_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.school_pages_id_seq TO matin;


--
-- Name: TABLE school_registrations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.school_registrations TO matin_user;
GRANT ALL ON TABLE public.school_registrations TO matin;


--
-- Name: SEQUENCE school_registrations_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.school_registrations_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.school_registrations_id_seq TO matin;


--
-- Name: TABLE school_staff; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.school_staff TO matin_user;
GRANT ALL ON TABLE public.school_staff TO matin;


--
-- Name: SEQUENCE school_staff_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.school_staff_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.school_staff_id_seq TO matin;


--
-- Name: TABLE school_store_settings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.school_store_settings TO matin_user;


--
-- Name: SEQUENCE school_store_settings_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.school_store_settings_id_seq TO matin_user;
GRANT SELECT,USAGE ON SEQUENCE public.school_store_settings_id_seq TO matin;


--
-- Name: TABLE schools; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.schools TO matin_user;
GRANT ALL ON TABLE public.schools TO matin;


--
-- Name: TABLE security; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.security TO matin_user;
GRANT ALL ON TABLE public.security TO matin;


--
-- Name: SEQUENCE security_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.security_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.security_id_seq TO matin;


--
-- Name: TABLE security_records; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.security_records TO matin_user;
GRANT ALL ON TABLE public.security_records TO matin;


--
-- Name: SEQUENCE security_records_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.security_records_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.security_records_id_seq TO matin;


--
-- Name: TABLE semesters; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.semesters TO matin_user;
GRANT ALL ON TABLE public.semesters TO matin;


--
-- Name: TABLE settings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.settings TO matin_user;
GRANT ALL ON TABLE public.settings TO matin;


--
-- Name: TABLE site_settings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.site_settings TO matin_user;
GRANT ALL ON TABLE public.site_settings TO matin;


--
-- Name: SEQUENCE site_settings_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.site_settings_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.site_settings_id_seq TO matin;


--
-- Name: TABLE social_comments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.social_comments TO matin_user;
GRANT ALL ON TABLE public.social_comments TO matin;


--
-- Name: SEQUENCE social_comments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.social_comments_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.social_comments_id_seq TO matin;


--
-- Name: TABLE social_likes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.social_likes TO matin_user;
GRANT ALL ON TABLE public.social_likes TO matin;


--
-- Name: SEQUENCE social_likes_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.social_likes_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.social_likes_id_seq TO matin;


--
-- Name: TABLE social_posts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.social_posts TO matin_user;
GRANT ALL ON TABLE public.social_posts TO matin;


--
-- Name: SEQUENCE social_posts_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.social_posts_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.social_posts_id_seq TO matin;


--
-- Name: TABLE special_needs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.special_needs TO matin_user;
GRANT ALL ON TABLE public.special_needs TO matin;


--
-- Name: SEQUENCE special_needs_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.special_needs_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.special_needs_id_seq TO matin;


--
-- Name: TABLE store_orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.store_orders TO matin_user;
GRANT ALL ON TABLE public.store_orders TO matin;


--
-- Name: SEQUENCE store_orders_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.store_orders_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.store_orders_id_seq TO matin;


--
-- Name: TABLE store_products; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.store_products TO matin_user;
GRANT ALL ON TABLE public.store_products TO matin;


--
-- Name: SEQUENCE store_products_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.store_products_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.store_products_id_seq TO matin;


--
-- Name: TABLE student_fees; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.student_fees TO matin_user;
GRANT ALL ON TABLE public.student_fees TO matin;


--
-- Name: SEQUENCE student_fees_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.student_fees_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.student_fees_id_seq TO matin;


--
-- Name: TABLE student_tracking; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.student_tracking TO matin_user;
GRANT ALL ON TABLE public.student_tracking TO matin;


--
-- Name: SEQUENCE student_tracking_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.student_tracking_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.student_tracking_id_seq TO matin;


--
-- Name: TABLE students; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.students TO matin_user;
GRANT ALL ON TABLE public.students TO matin;


--
-- Name: TABLE subjects; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.subjects TO matin_user;
GRANT ALL ON TABLE public.subjects TO matin;


--
-- Name: TABLE submissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.submissions TO matin_user;
GRANT ALL ON TABLE public.submissions TO matin;


--
-- Name: TABLE subscriptions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.subscriptions TO matin_user;
GRANT ALL ON TABLE public.subscriptions TO matin;


--
-- Name: SEQUENCE subscriptions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.subscriptions_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.subscriptions_id_seq TO matin;


--
-- Name: TABLE supervisors_table; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.supervisors_table TO matin_user;
GRANT ALL ON TABLE public.supervisors_table TO matin;


--
-- Name: SEQUENCE supervisors_table_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.supervisors_table_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.supervisors_table_id_seq TO matin;


--
-- Name: TABLE surveys; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.surveys TO matin_user;
GRANT ALL ON TABLE public.surveys TO matin;


--
-- Name: SEQUENCE surveys_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.surveys_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.surveys_id_seq TO matin;


--
-- Name: TABLE tasks; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tasks TO matin_user;
GRANT ALL ON TABLE public.tasks TO matin;


--
-- Name: SEQUENCE tasks_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tasks_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.tasks_id_seq TO matin;


--
-- Name: TABLE teachers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.teachers TO matin_user;
GRANT ALL ON TABLE public.teachers TO matin;


--
-- Name: TABLE trainers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trainers TO matin_user;
GRANT ALL ON TABLE public.trainers TO matin;


--
-- Name: SEQUENCE trainers_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.trainers_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.trainers_id_seq TO matin;


--
-- Name: TABLE training_records; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.training_records TO matin_user;
GRANT ALL ON TABLE public.training_records TO matin;


--
-- Name: SEQUENCE training_records_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.training_records_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.training_records_id_seq TO matin;


--
-- Name: TABLE transactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transactions TO matin_user;
GRANT ALL ON TABLE public.transactions TO matin;


--
-- Name: SEQUENCE transactions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.transactions_id_seq TO matin_user;
GRANT SELECT,USAGE ON SEQUENCE public.transactions_id_seq TO matin;


--
-- Name: TABLE transport_assignments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transport_assignments TO matin_user;
GRANT ALL ON TABLE public.transport_assignments TO matin;


--
-- Name: TABLE transport_routes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transport_routes TO matin_user;
GRANT ALL ON TABLE public.transport_routes TO matin;


--
-- Name: TABLE transport_stops; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transport_stops TO matin_user;
GRANT ALL ON TABLE public.transport_stops TO matin;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO matin_user;
GRANT ALL ON TABLE public.users TO matin;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.users_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.users_id_seq TO matin;


--
-- Name: TABLE vaccinations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.vaccinations TO matin_user;
GRANT ALL ON TABLE public.vaccinations TO matin;


--
-- Name: SEQUENCE vaccinations_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.vaccinations_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.vaccinations_id_seq TO matin;


--
-- Name: TABLE vaccinations_table; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.vaccinations_table TO matin_user;
GRANT ALL ON TABLE public.vaccinations_table TO matin;


--
-- Name: SEQUENCE vaccinations_table_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.vaccinations_table_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.vaccinations_table_id_seq TO matin;


--
-- Name: TABLE video_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.video_items TO matin_user;
GRANT ALL ON TABLE public.video_items TO matin;


--
-- Name: SEQUENCE video_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.video_items_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.video_items_id_seq TO matin;


--
-- Name: TABLE videos; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.videos TO matin_user;
GRANT ALL ON TABLE public.videos TO matin;


--
-- Name: SEQUENCE videos_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.videos_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.videos_id_seq TO matin;


--
-- Name: TABLE visitors; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.visitors TO matin_user;
GRANT ALL ON TABLE public.visitors TO matin;


--
-- Name: SEQUENCE visitors_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.visitors_id_seq TO matin_user;
GRANT ALL ON SEQUENCE public.visitors_id_seq TO matin;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO matin_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO matin_user;


--
-- PostgreSQL database dump complete
--

\unrestrict 4FYZ7ftgIFcBfPRwAifdN19OkCx4eaRIfq9BeTCrBSIuHV2gfRKkbWeXTHpD829

