--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4
-- Dumped by pg_dump version 14.4

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


ALTER TABLE public."__EFMigrationsHistory" OWNER TO postgres;

--
-- Name: authors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authors (
    "authorId" integer NOT NULL,
    "authorName" character varying(100),
    "birthDate" timestamp with time zone
);


ALTER TABLE public.authors OWNER TO postgres;

--
-- Name: authors_authorId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.authors ALTER COLUMN "authorId" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."authors_authorId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: bookAuthors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."bookAuthors" (
    "bookId" integer NOT NULL,
    "authorId" integer NOT NULL
);


ALTER TABLE public."bookAuthors" OWNER TO postgres;

--
-- Name: books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.books (
    "bookId" integer NOT NULL,
    title character varying(255) NOT NULL,
    "totalPages" integer,
    "publishedDate" timestamp with time zone
);


ALTER TABLE public.books OWNER TO postgres;

--
-- Name: books_bookId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.books ALTER COLUMN "bookId" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."books_bookId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    "roleId" integer NOT NULL,
    "roleName" character varying(20)
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_roleId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.roles ALTER COLUMN "roleId" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."roles_roleId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: userRoles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."userRoles" (
    "userId" integer NOT NULL,
    "roleId" integer NOT NULL
);


ALTER TABLE public."userRoles" OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    "userId" integer NOT NULL,
    "fullName" character varying(50),
    "userName" character varying(50),
    email character varying(50),
    password character varying(20)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_userId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN "userId" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."users_userId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: __EFMigrationsHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") FROM stdin;
20230324190442_CreateTables	7.0.4
20230420160207_firstnametousername	7.0.4
\.


--
-- Data for Name: authors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.authors ("authorId", "authorName", "birthDate") FROM stdin;
1	Sabahattin Ali	2023-03-20 00:00:00+03
4	Yaşar Kemal	2022-03-20 00:00:00+03
\.


--
-- Data for Name: bookAuthors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."bookAuthors" ("bookId", "authorId") FROM stdin;
1	4
8	1
\.


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.books ("bookId", title, "totalPages", "publishedDate") FROM stdin;
1	İnce Memed	440	2023-03-20 00:00:00+03
8	Kürk Mantolu Madonna	160	2022-01-25 00:00:00+03
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles ("roleId", "roleName") FROM stdin;
1	admin
2	user
\.


--
-- Data for Name: userRoles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."userRoles" ("userId", "roleId") FROM stdin;
7	1
8	2
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users ("userId", "fullName", "userName", email, password) FROM stdin;
7	John Doe	admin	admindoe@mail.com	Admin.123
8	John Doe	user	userdoe@mail.com	User.123
\.


--
-- Name: authors_authorId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."authors_authorId_seq"', 16, true);


--
-- Name: books_bookId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."books_bookId_seq"', 8, true);


--
-- Name: roles_roleId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."roles_roleId_seq"', 2, true);


--
-- Name: users_userId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."users_userId_seq"', 9, true);


--
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY ("authorId");


--
-- Name: bookAuthors book_authors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."bookAuthors"
    ADD CONSTRAINT book_authors_pkey PRIMARY KEY ("bookId", "authorId");


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY ("bookId");


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY ("roleId");


--
-- Name: userRoles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."userRoles"
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY ("userId", "roleId");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY ("userId");


--
-- Name: IX_bookAuthors_authorId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_bookAuthors_authorId" ON public."bookAuthors" USING btree ("authorId");


--
-- Name: IX_userRoles_roleId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_userRoles_roleId" ON public."userRoles" USING btree ("roleId");


--
-- Name: bookAuthors fk_author; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."bookAuthors"
    ADD CONSTRAINT fk_author FOREIGN KEY ("authorId") REFERENCES public.authors("authorId") ON DELETE CASCADE;


--
-- Name: bookAuthors fk_book; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."bookAuthors"
    ADD CONSTRAINT fk_book FOREIGN KEY ("bookId") REFERENCES public.books("bookId") ON DELETE CASCADE;


--
-- Name: userRoles fk_roles; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."userRoles"
    ADD CONSTRAINT fk_roles FOREIGN KEY ("roleId") REFERENCES public.roles("roleId") ON DELETE CASCADE;


--
-- Name: userRoles fk_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."userRoles"
    ADD CONSTRAINT fk_users FOREIGN KEY ("userId") REFERENCES public.users("userId") ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--
