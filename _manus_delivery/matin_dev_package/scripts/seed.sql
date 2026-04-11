--
-- PostgreSQL database dump
--

\restrict TbgOXf3CYL57GK02MGvzw0V23SLPzTYGIgXqMGWqTftiCNEEfSlZzgPgkN4Jnpd

-- Dumped from database version 14.22 (Ubuntu 14.22-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.22 (Ubuntu 14.22-0ubuntu0.22.04.1)

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
-- Data for Name: platform_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.platform_settings (id, key, value, category, description, updated_at) FROM stdin;
1	platform_name	متين	general	اسم المنصة	2026-03-13 12:02:05.744977
2	platform_name_en	Matin	general	اسم المنصة بالإنجليزية	2026-03-13 12:02:05.744977
3	platform_logo	/logo.png	general	شعار المنصة	2026-03-13 12:02:05.744977
4	platform_domain	matin.ink	general	نطاق المنصة	2026-03-13 12:02:05.744977
5	otp_enabled	false	security	تفعيل OTP	2026-03-13 12:02:05.744977
6	sovereign_tax_rate	2.5	finance	نسبة الضريبة السيادية %	2026-03-13 12:02:05.744977
7	vat_rate	15	finance	نسبة ضريبة القيمة المضافة %	2026-03-13 12:02:05.744977
8	maintenance_mode	false	system	وضع الصيانة	2026-03-13 12:02:05.744977
9	email_from	noreply@matin.ink	email	إيميل الإرسال	2026-03-13 12:02:05.744977
10	email_from_name	منصة متين	email	اسم المرسل	2026-03-13 12:02:05.744977
11	email_api_key		email	مفتاح Resend API	2026-03-13 12:02:05.744977
12	sms_provider	unifonic	sms	مزود الرسائل	2026-03-13 12:02:05.744977
13	sms_api_key		sms	مفتاح SMS API	2026-03-13 12:02:05.744977
14	whatsapp_token		whatsapp	توكن واتساب	2026-03-13 12:02:05.744977
15	whatsapp_phone_id		whatsapp	رقم واتساب	2026-03-13 12:02:05.744977
16	payment_gateway	hyperpay	payment	بوابة الدفع	2026-03-13 12:02:05.744977
17	hyperpay_token		payment	توكن HyperPay	2026-03-13 12:02:05.744977
18	moyasar_key		payment	مفتاح Moyasar	2026-03-13 12:02:05.744977
21	platform_email	admin@matin.ink	email	\N	2026-03-13 12:15:39.202454
22	platform_phone	+966500000000	general	\N	2026-03-13 12:15:39.202454
24	allow_registration	true	general	\N	2026-03-13 12:15:39.202454
25	default_language	ar	general	\N	2026-03-13 12:15:39.202454
26	tax_rate	2.5	finance	\N	2026-03-13 12:15:39.202454
27	commission_rate	10	finance	\N	2026-03-13 12:15:39.202454
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, phone, password_hash, first_name, last_name, national_id, role, is_active, is_verified, avatar_url, gender, date_of_birth, created_at, updated_at, last_login, refresh_token, password_reset_token, password_reset_expires, password, school_id, owner_id, package, status, must_change_password, tenant_id) FROM stdin;
98175c14-96ee-48cd-83cf-8523cf2b5e35	admin@matin.sa	\N	$2a$12$BiaEnbx2SIzFUQdKvVk0eugbirhw14pjAn1Ep9sLFCPoS.KqYmyPu	مالك	المنصة	\N	platform_owner	t	t	\N	\N	\N	2026-03-13 11:31:20.829723-04	2026-03-13 11:31:20.829723-04	2026-03-13 11:32:13.570112-04	09ff7811-1759-48e1-b3e6-bcf9a2e7177c	\N	\N	$2a$12$BiaEnbx2SIzFUQdKvVk0eugbirhw14pjAn1Ep9sLFCPoS.KqYmyPu	\N	\N	free	active	f	\N
abd951c9-8184-4e2b-94ea-89f5872305a7	admin@matin.ink	\N	$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHG	مالك	المنصة	\N	super_admin	t	t	\N	\N	\N	2026-03-13 12:03:30.990705-04	2026-03-13 12:03:30.990705-04	\N	\N	\N	\N	$2b$10$C7QvxBo49IM04g3YLdQlMeY81S52vsXH/M1TwMK/Yfa6TDJov9rIS	\N	\N	free	active	f	\N
\.


--
-- Name: platform_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.platform_settings_id_seq', 27, true);


--
-- PostgreSQL database dump complete
--

\unrestrict TbgOXf3CYL57GK02MGvzw0V23SLPzTYGIgXqMGWqTftiCNEEfSlZzgPgkN4Jnpd

