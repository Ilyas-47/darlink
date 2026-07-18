--
-- PostgreSQL database dump
--

\restrict 6sDGnpBGouXc11NT6ZKlJHPooGmlxsQp9vIPlIw7BD0xRMpDwXHzyGdecpt82Z8

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-07-18 19:56:24

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 16753)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 5228 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 896 (class 1247 OID 16792)
-- Name: MethodePaiement; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MethodePaiement" AS ENUM (
    'VIREMENT',
    'ESPECE',
    'CARTE_BANCAIRE',
    'PAYPAL'
);


ALTER TYPE public."MethodePaiement" OWNER TO postgres;

--
-- TOC entry 881 (class 1247 OID 16755)
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'CLIENT',
    'HOTE',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- TOC entry 890 (class 1247 OID 16778)
-- Name: StatutPaiement; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatutPaiement" AS ENUM (
    'EN_ATTENTE',
    'PAYE',
    'ECHOUE'
);


ALTER TYPE public."StatutPaiement" OWNER TO postgres;

--
-- TOC entry 887 (class 1247 OID 16770)
-- Name: StatutReservation; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatutReservation" AS ENUM (
    'EN_ATTENTE',
    'CONFIRMEE',
    'ANNULEE'
);


ALTER TYPE public."StatutReservation" OWNER TO postgres;

--
-- TOC entry 884 (class 1247 OID 16762)
-- Name: StatutValidation; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatutValidation" AS ENUM (
    'EN_ATTENTE',
    'VALIDE',
    'REFUSE'
);


ALTER TYPE public."StatutValidation" OWNER TO postgres;

--
-- TOC entry 899 (class 1247 OID 16798)
-- Name: TypeActivite; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TypeActivite" AS ENUM (
    'SPORT_SURF',
    'BIEN_ETRE_YOGA',
    'WORKSHOP',
    'EXCURSION',
    'SOIREE_SOCIALE'
);


ALTER TYPE public."TypeActivite" OWNER TO postgres;

--
-- TOC entry 893 (class 1247 OID 16786)
-- Name: TypeChambre; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TypeChambre" AS ENUM (
    'PRIVEE',
    'PARTAGEE_DORTOIR'
);


ALTER TYPE public."TypeChambre" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 235 (class 1259 OID 16926)
-- Name: activites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activites (
    id integer NOT NULL,
    coliving_id integer NOT NULL,
    titre text NOT NULL,
    description text,
    date_prevue timestamp(3) without time zone NOT NULL,
    prix_optionnel numeric(10,2) DEFAULT 0.00 NOT NULL,
    type_activite public."TypeActivite" NOT NULL
);


ALTER TABLE public.activites OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16925)
-- Name: activites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activites_id_seq OWNER TO postgres;

--
-- TOC entry 5230 (class 0 OID 0)
-- Dependencies: 234
-- Name: activites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activites_id_seq OWNED BY public.activites.id;


--
-- TOC entry 244 (class 1259 OID 49160)
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    user_id integer,
    action text NOT NULL,
    details text,
    date_creation timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 49159)
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO postgres;

--
-- TOC entry 5231 (class 0 OID 0)
-- Dependencies: 243
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- TOC entry 242 (class 1259 OID 16986)
-- Name: avis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.avis (
    id integer NOT NULL,
    client_id integer NOT NULL,
    coliving_id integer NOT NULL,
    note integer,
    commentaire text,
    date_creation timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.avis OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16985)
-- Name: avis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.avis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.avis_id_seq OWNER TO postgres;

--
-- TOC entry 5232 (class 0 OID 0)
-- Dependencies: 241
-- Name: avis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.avis_id_seq OWNED BY public.avis.id;


--
-- TOC entry 231 (class 1259 OID 16899)
-- Name: chambres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chambres (
    id integer NOT NULL,
    coliving_id integer NOT NULL,
    nom text NOT NULL,
    description text,
    capacite_personnes integer NOT NULL,
    lits_disponibles integer NOT NULL,
    prix_par_mois numeric(10,2) NOT NULL,
    type_chambre public."TypeChambre" NOT NULL
);


ALTER TABLE public.chambres OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16898)
-- Name: chambres_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chambres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chambres_id_seq OWNER TO postgres;

--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 230
-- Name: chambres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chambres_id_seq OWNED BY public.chambres.id;


--
-- TOC entry 221 (class 1259 OID 16825)
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    user_id integer NOT NULL,
    profession text,
    biographie text
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16875)
-- Name: coliving_equipements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coliving_equipements (
    coliving_id integer NOT NULL,
    equipement_id integer NOT NULL
);


ALTER TABLE public.coliving_equipements OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16859)
-- Name: colivings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.colivings (
    id integer NOT NULL,
    hote_id integer NOT NULL,
    titre text NOT NULL,
    description text,
    adresse text NOT NULL,
    lien_google_map text,
    regles text,
    statut public."StatutValidation" DEFAULT 'EN_ATTENTE'::public."StatutValidation" NOT NULL,
    date_creation timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    latitude double precision,
    longitude double precision
);


ALTER TABLE public.colivings OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16858)
-- Name: colivings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.colivings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.colivings_id_seq OWNER TO postgres;

--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 225
-- Name: colivings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.colivings_id_seq OWNED BY public.colivings.id;


--
-- TOC entry 246 (class 1259 OID 49173)
-- Name: document_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_requests (
    id integer NOT NULL,
    hote_id integer NOT NULL,
    client_id integer NOT NULL,
    document_id integer,
    statut public."StatutValidation" DEFAULT 'EN_ATTENTE'::public."StatutValidation" NOT NULL,
    date_demande timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.document_requests OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 49172)
-- Name: document_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.document_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.document_requests_id_seq OWNER TO postgres;

--
-- TOC entry 5235 (class 0 OID 0)
-- Dependencies: 245
-- Name: document_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.document_requests_id_seq OWNED BY public.document_requests.id;


--
-- TOC entry 224 (class 1259 OID 16842)
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type text NOT NULL,
    fichier text NOT NULL,
    date_soumission timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    statut public."StatutValidation" DEFAULT 'EN_ATTENTE'::public."StatutValidation" NOT NULL
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16841)
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documents_id_seq OWNER TO postgres;

--
-- TOC entry 5236 (class 0 OID 0)
-- Dependencies: 223
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- TOC entry 233 (class 1259 OID 16915)
-- Name: equipements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipements (
    id integer NOT NULL,
    nom text NOT NULL,
    icone text
);


ALTER TABLE public.equipements OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16914)
-- Name: equipements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.equipements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.equipements_id_seq OWNER TO postgres;

--
-- TOC entry 5237 (class 0 OID 0)
-- Dependencies: 232
-- Name: equipements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.equipements_id_seq OWNED BY public.equipements.id;


--
-- TOC entry 222 (class 1259 OID 16833)
-- Name: hotes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hotes (
    user_id integer NOT NULL,
    rib_banque text
);


ALTER TABLE public.hotes OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16883)
-- Name: images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.images (
    id integer NOT NULL,
    coliving_id integer NOT NULL,
    url text NOT NULL,
    is_principale boolean DEFAULT false NOT NULL,
    ordre integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.images OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16882)
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.images_id_seq OWNER TO postgres;

--
-- TOC entry 5238 (class 0 OID 0)
-- Dependencies: 228
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.images_id_seq OWNED BY public.images.id;


--
-- TOC entry 248 (class 1259 OID 49216)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    expediteur_id integer NOT NULL,
    destinataire_id integer NOT NULL,
    coliving_id integer,
    contenu text NOT NULL,
    date_envoi timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    lu boolean DEFAULT false NOT NULL
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 49215)
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO postgres;

--
-- TOC entry 5239 (class 0 OID 0)
-- Dependencies: 247
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- TOC entry 240 (class 1259 OID 16969)
-- Name: paiements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paiements (
    id integer NOT NULL,
    reservation_id integer NOT NULL,
    montant numeric(10,2) NOT NULL,
    methode public."MethodePaiement" NOT NULL,
    devise text DEFAULT 'MAD'::text NOT NULL,
    date_paiement timestamp(3) without time zone,
    statut public."StatutPaiement" DEFAULT 'EN_ATTENTE'::public."StatutPaiement" NOT NULL
);


ALTER TABLE public.paiements OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16968)
-- Name: paiements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paiements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.paiements_id_seq OWNER TO postgres;

--
-- TOC entry 5240 (class 0 OID 0)
-- Dependencies: 239
-- Name: paiements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.paiements_id_seq OWNED BY public.paiements.id;


--
-- TOC entry 236 (class 1259 OID 16941)
-- Name: participations_activites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.participations_activites (
    client_id integer NOT NULL,
    activite_id integer NOT NULL,
    date_inscription timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.participations_activites OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16951)
-- Name: reservations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservations (
    id integer NOT NULL,
    client_id integer NOT NULL,
    chambre_id integer NOT NULL,
    date_debut date NOT NULL,
    date_fin date NOT NULL,
    nombre_personnes integer NOT NULL,
    prix_total numeric(10,2) NOT NULL,
    statut public."StatutReservation" DEFAULT 'EN_ATTENTE'::public."StatutReservation" NOT NULL,
    date_creation timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.reservations OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16950)
-- Name: reservations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reservations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reservations_id_seq OWNER TO postgres;

--
-- TOC entry 5241 (class 0 OID 0)
-- Dependencies: 237
-- Name: reservations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reservations_id_seq OWNED BY public.reservations.id;


--
-- TOC entry 220 (class 1259 OID 16810)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nom text NOT NULL,
    email text NOT NULL,
    mot_de_passe text NOT NULL,
    telephone text,
    photo_profil text,
    date_creation timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    derniere_connexion timestamp(3) without time zone,
    role public."Role" NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16809)
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
-- TOC entry 5242 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4966 (class 2604 OID 16929)
-- Name: activites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activites ALTER COLUMN id SET DEFAULT nextval('public.activites_id_seq'::regclass);


--
-- TOC entry 4977 (class 2604 OID 49163)
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- TOC entry 4975 (class 2604 OID 16989)
-- Name: avis id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avis ALTER COLUMN id SET DEFAULT nextval('public.avis_id_seq'::regclass);


--
-- TOC entry 4964 (class 2604 OID 16902)
-- Name: chambres id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chambres ALTER COLUMN id SET DEFAULT nextval('public.chambres_id_seq'::regclass);


--
-- TOC entry 4958 (class 2604 OID 16862)
-- Name: colivings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colivings ALTER COLUMN id SET DEFAULT nextval('public.colivings_id_seq'::regclass);


--
-- TOC entry 4979 (class 2604 OID 49176)
-- Name: document_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_requests ALTER COLUMN id SET DEFAULT nextval('public.document_requests_id_seq'::regclass);


--
-- TOC entry 4955 (class 2604 OID 16845)
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- TOC entry 4965 (class 2604 OID 16918)
-- Name: equipements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipements ALTER COLUMN id SET DEFAULT nextval('public.equipements_id_seq'::regclass);


--
-- TOC entry 4961 (class 2604 OID 16886)
-- Name: images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images ALTER COLUMN id SET DEFAULT nextval('public.images_id_seq'::regclass);


--
-- TOC entry 4982 (class 2604 OID 49219)
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- TOC entry 4972 (class 2604 OID 16972)
-- Name: paiements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiements ALTER COLUMN id SET DEFAULT nextval('public.paiements_id_seq'::regclass);


--
-- TOC entry 4969 (class 2604 OID 16954)
-- Name: reservations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations ALTER COLUMN id SET DEFAULT nextval('public.reservations_id_seq'::regclass);


--
-- TOC entry 4953 (class 2604 OID 16813)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5209 (class 0 OID 16926)
-- Dependencies: 235
-- Data for Name: activites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activites (id, coliving_id, titre, description, date_prevue, prix_optionnel, type_activite) FROM stdin;
\.


--
-- TOC entry 5218 (class 0 OID 49160)
-- Dependencies: 244
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, user_id, action, details, date_creation) FROM stdin;
1	\N	HOTE_REQUEST_DOC	Demandé au client ID 9	2026-07-03 02:34:06.51
2	\N	HOTE_REQUEST_DOC	Demandé au client ID 9	2026-07-03 02:34:10.755
5	\N	HOTE_VALIDATE_DOC	Document de la demande ID 2 statut mis à VALIDE	2026-07-03 02:37:57.913
6	\N	HOTE_VALIDATE_DOC	Document de la demande ID 1 statut mis à REFUSE	2026-07-03 02:37:59.545
3	\N	CLIENT_UPLOAD_DOC	Document soumis pour la demande ID 2	2026-07-03 02:34:48.01
4	\N	CLIENT_UPLOAD_DOC	Document soumis pour la demande ID 1	2026-07-03 02:34:53.195
7	\N	ADMIN_VALIDATE_COLIVING	Coliving ID 14 statut mis à VALIDE	2026-07-03 19:39:52.907
8	\N	ADMIN_VALIDATE_COLIVING	Coliving ID 15 statut mis à VALIDE	2026-07-03 19:39:54.497
9	\N	ADMIN_VALIDATE_COLIVING	Coliving ID 16 statut mis à VALIDE	2026-07-03 19:39:55.895
11	15	ADMIN_VALIDATE_COLIVING	Coliving ID 20 statut mis à VALIDE	2026-07-04 01:15:20.38
12	15	ADMIN_VALIDATE_COLIVING	Coliving ID 21 statut mis à VALIDE	2026-07-04 01:15:21.545
16	15	ADMIN_VALIDATE_COLIVING	Coliving ID 22 statut mis à VALIDE	2026-07-06 19:12:26.457
17	21	CLIENT_UPLOAD_DOC	Document soumis pour la demande ID 6	2026-07-07 18:49:24.146
10	\N	HOTE_REQUEST_DOC	Demandé au client ID 19	2026-07-03 20:19:48.827
13	\N	HOTE_REQUEST_DOC	Demandé au client ID 19	2026-07-04 01:40:32.3
14	\N	HOTE_REQUEST_DOC	Demandé au client ID 19	2026-07-06 18:56:53.853
15	\N	HOTE_REQUEST_DOC	Demandé au client ID 21	2026-07-06 19:04:52.295
18	\N	HOTE_REQUEST_DOC	Demandé au client ID 19	2026-07-07 18:50:31.496
19	\N	HOTE_REQUEST_DOC	Demandé au client ID 21	2026-07-07 18:50:34.607
20	\N	HOTE_VALIDATE_DOC	Document de la demande ID 6 statut mis à VALIDE	2026-07-07 18:51:30.446
21	\N	HOTE_REQUEST_DOC	Demandé au client ID 20	2026-07-07 18:58:48.423
22	\N	HOTE_REQUEST_DOC	Demandé au client ID 19	2026-07-17 16:21:27.925
23	15	ADMIN_VALIDATE_COLIVING	Coliving ID 32 statut mis à VALIDE	2026-07-18 17:48:30.392
24	15	ADMIN_VALIDATE_COLIVING	Coliving ID 36 statut mis à VALIDE	2026-07-18 17:48:31.538
25	15	ADMIN_VALIDATE_COLIVING	Coliving ID 39 statut mis à VALIDE	2026-07-18 17:48:32.503
26	15	ADMIN_VALIDATE_COLIVING	Coliving ID 42 statut mis à VALIDE	2026-07-18 17:48:33.49
27	15	ADMIN_VALIDATE_COLIVING	Coliving ID 33 statut mis à VALIDE	2026-07-18 17:55:18.451
28	15	ADMIN_VALIDATE_COLIVING	Coliving ID 35 statut mis à VALIDE	2026-07-18 17:55:19.515
29	15	ADMIN_VALIDATE_COLIVING	Coliving ID 38 statut mis à VALIDE	2026-07-18 17:55:20.688
30	15	ADMIN_VALIDATE_COLIVING	Coliving ID 41 statut mis à VALIDE	2026-07-18 17:55:22.004
31	15	ADMIN_VALIDATE_COLIVING	Coliving ID 34 statut mis à VALIDE	2026-07-18 18:02:35.835
32	15	ADMIN_VALIDATE_COLIVING	Coliving ID 37 statut mis à VALIDE	2026-07-18 18:02:36.865
33	15	ADMIN_VALIDATE_COLIVING	Coliving ID 40 statut mis à VALIDE	2026-07-18 18:02:37.704
34	15	ADMIN_VALIDATE_COLIVING	Coliving ID 43 statut mis à VALIDE	2026-07-18 18:02:38.184
\.


--
-- TOC entry 5216 (class 0 OID 16986)
-- Dependencies: 242
-- Data for Name: avis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.avis (id, client_id, coliving_id, note, commentaire, date_creation) FROM stdin;
\.


--
-- TOC entry 5205 (class 0 OID 16899)
-- Dependencies: 231
-- Data for Name: chambres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chambres (id, coliving_id, nom, description, capacite_personnes, lits_disponibles, prix_par_mois, type_chambre) FROM stdin;
76	32	Chambre principale	15 chambre(s) — capacité 20 pers.	20	15	6500.00	PRIVEE
78	39	Chambre principale	7 chambre(s) — capacité 12 pers.	12	7	5500.00	PRIVEE
82	38	Chambre principale	7 chambre(s) — capacité 10 pers.	10	7	4200.00	PRIVEE
84	35	Chambre principale	8 chambre(s) — capacité 14 pers.	14	8	5000.00	PRIVEE
86	34	Chambre principale	5 chambre(s) — capacité 11 pers.	11	5	4500.00	PRIVEE
88	40	Chambre principale	26 chambre(s) — capacité 41 pers.	41	26	7500.00	PRIVEE
77	36	Chambre principale	12 chambre(s) — capacité 15 pers.	15	12	7000.00	PRIVEE
79	42	Chambre principale	14 chambre(s) — capacité 30 pers.	30	14	6500.00	PRIVEE
83	33	Chambre principale	6 chambre(s) — capacité 12 pers.	12	6	9000.00	PRIVEE
85	41	Chambre principale	5 chambre(s) — capacité 10 pers.	10	5	6000.00	PRIVEE
87	37	Chambre principale	20 chambre(s) — capacité 30 pers.	30	20	4800.00	PRIVEE
89	43	Chambre principale	31 chambre(s) — capacité 50 pers.	50	31	10000.00	PRIVEE
\.


--
-- TOC entry 5195 (class 0 OID 16825)
-- Dependencies: 221
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clients (user_id, profession, biographie) FROM stdin;
19	Digital Nomad	Voyageur passionné par les cultures et les rencontres
20	Membre	ugiuugb7truybi7iiuyhjgffgui0o
21	Membre	\N
22	Membre	\N
\.


--
-- TOC entry 5201 (class 0 OID 16875)
-- Dependencies: 227
-- Data for Name: coliving_equipements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coliving_equipements (coliving_id, equipement_id) FROM stdin;
32	39
32	36
32	34
32	35
36	38
36	36
36	34
39	39
39	34
42	39
42	36
42	34
38	36
38	34
33	38
33	36
33	34
33	37
35	39
35	36
35	34
35	35
41	38
41	34
34	38
34	36
34	34
37	38
37	36
37	34
40	36
40	34
40	35
43	36
43	34
43	37
\.


--
-- TOC entry 5200 (class 0 OID 16859)
-- Dependencies: 226
-- Data for Name: colivings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.colivings (id, hote_id, titre, description, adresse, lien_google_map, regles, statut, date_creation, latitude, longitude) FROM stdin;
39	30	Aourir Surf & Work	Le "Banana Village" du Maroc. Moins bondé que Taghazout, parfait pour les surfeurs de tous niveaux avec un espace de travail à deux pas de l'océan.	Banana Beach, Aourir 80750, Maroc	https://maps.app.goo.gl/Aourir	Nettoyage des combinaisons à l'extérieur.	VALIDE	2026-07-18 17:20:09.548	30.499	-9.645
38	29	Dar Digital Nomad Ouarzazate	L'expérience ultime du désert marocain avec une fibre optique incroyablement stable. Un espace inspirant aux portes du Sahara, parfait pour la concentration.	Kasbah Taourirt, Ouarzazate 45000, Maroc	https://maps.app.goo.gl/Ouarzazate	Respecter le calme du désert. S'hydrater régulièrement.	VALIDE	2026-07-18 17:20:08.894	30.919	-6.893
34	31	The Spot Essaouira	Au coeur des remparts d'Essaouira, "The Spot" rassemble créatifs, artistes et développeurs. C'est un espace de vie communautaire authentique, avec un grand salon marocain et un accès immédiat à la plage pour le kitesurf.	Rue Skala, Medina, Essaouira 44000, Maroc	https://maps.app.goo.gl/Essaouira	Les événements musicaux doivent se terminer à 23h.	VALIDE	2026-07-18 17:20:07.792	31.512	-9.762
32	30	SunDesk Coliving Taghazout	Situé au coeur du village de surfeurs de Taghazout. Un espace conçu pour les nomades digitaux avec des bureaux ergonomiques, une vue imprenable sur l'océan et une communauté internationale dynamique. Nous organisons des repas marocains familiaux et des sorties surf.	Centre ville, Taghazout, Agadir 80200, Maroc	https://maps.app.goo.gl/Taghazout	Respect des heures de silence dans l'espace coworking. Planche de surf à rincer à l'extérieur.	VALIDE	2026-07-18 17:20:07.509	30.545	-9.713
36	30	Dar Zouina Rabat	Découvrez la vie paisible dans la capitale marocaine. Un espace moderne situé au centre de Rabat (Agdal), à proximité des cafés, tramways et parcs.	Quartier Agdal, Rabat 10000, Maroc	https://maps.app.goo.gl/RabatAgdal	Espace de travail calme. Réunions dans la salle dédiée.	VALIDE	2026-07-18 17:20:08.072	34.004	-6.852
42	30	Kite & Code Essaouira	Travailler le matin, naviguer l'après-midi. Une communauté axée sur les sports nautiques avec des bureaux ergonomiques et un local sécurisé pour le matériel.	Sidi Kaouki, Essaouira 44000, Maroc	https://maps.app.goo.gl/SidiKaouki	Matériel de kite à rincer au jet d'eau extérieur.	VALIDE	2026-07-18 17:20:11.573	31.349	-9.794
41	29	Riad Innov Fès	Plongez dans le Moyen Âge avec le Wi-Fi du 21e siècle. Situé dans la plus grande médina piétonne du monde, ce riad historique a été reconverti pour les créatifs nomades.	Batha, Fès 30000, Maroc	https://maps.app.goo.gl/Fes	Les portes ferment à minuit.	VALIDE	2026-07-18 17:20:10.899	34.062	-4.978
37	31	Nomad House Chefchaouen	L'inspiration créative à son apogée dans la célèbre ville bleue du Maroc. La maison dispose de cheminées, d'une cuisine marocaine typique et d'une terrasse avec vue sur les montagnes du Rif.	Quartier Andalou, Medina, Chefchaouen 91000, Maroc	https://maps.app.goo.gl/Chefchaouen	Respect des traditions locales. Espaces communs partagés avec bienveillance.	VALIDE	2026-07-18 17:20:08.238	35.168	-5.263
33	29	Outsite Marrakech Medina	Un magnifique Riad rénové en plein coeur de la Medina de Marrakech. Plongez dans l'histoire marocaine tout en bénéficiant du haut débit. Le patio central avec sa piscine traditionnelle offre un espace rafraîchissant après une journée de travail.	Derb Assehbe, Medina, Marrakech 40000, Maroc	https://maps.app.goo.gl/MarrakechMedina	Espace 100% non fumeur. Respecter la quiétude du patio.	VALIDE	2026-07-18 17:20:07.689	31.63	-7.981
35	29	The Surf House Taghazout	L'endroit parfait pour équilibrer travail et vagues. Notre coworking offre une connexion stable de 100Mbps et une terrasse sur le toit pour checker les spots de surf.	Route d'Essaouira, Taghazout, Agadir 80200, Maroc	https://maps.app.goo.gl/TaghazoutSurf	Planches de surf interdites dans les chambres.	VALIDE	2026-07-18 17:20:07.94	30.548	-9.715
40	31	Kasbah Hub Tanger	Un magnifique coliving situé dans la Kasbah de Tanger, offrant une vue sur le détroit de Gibraltar. Inspiration garantie pour les écrivains et les entrepreneurs.	Rue Kasbah, Tanger 90000, Maroc	https://maps.app.goo.gl/Tanger	Respecter le silence dans la bibliothèque.	VALIDE	2026-07-18 17:20:10.177	35.787	-5.812
43	31	Gueliz Digital Oasis	Pour ceux qui préfèrent le quartier moderne de Gueliz. Une villa avec piscine offrant des espaces de coworking ultra-modernes, une salle de réunion et un café de spécialité sur place.	Rue Ibn Aicha, Gueliz, Marrakech 40000, Maroc	https://maps.app.goo.gl/Gueliz	L'espace coworking est ouvert 24/7 pour les résidents.	VALIDE	2026-07-18 17:20:12.211	31.636	-8.013
\.


--
-- TOC entry 5220 (class 0 OID 49173)
-- Dependencies: 246
-- Data for Name: document_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_requests (id, hote_id, client_id, document_id, statut, date_demande) FROM stdin;
\.


--
-- TOC entry 5198 (class 0 OID 16842)
-- Dependencies: 224
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (id, user_id, type, fichier, date_soumission, statut) FROM stdin;
\.


--
-- TOC entry 5207 (class 0 OID 16915)
-- Dependencies: 233
-- Data for Name: equipements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipements (id, nom, icone) FROM stdin;
34	Fibre Optique 100Mbps	wifi
35	Rooftop Vue Mer	sun
36	Espace Coworking	laptop
37	Piscine Traditionnelle	droplet
38	Cuisine Marocaine	coffee
39	Cours de Surf	activity
\.


--
-- TOC entry 5196 (class 0 OID 16833)
-- Dependencies: 222
-- Data for Name: hotes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hotes (user_id, rib_banque) FROM stdin;
29	MA123456789012345678901234
30	MA987654321098765432109876
31	MA555555555555555555555555
\.


--
-- TOC entry 5203 (class 0 OID 16883)
-- Dependencies: 229
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.images (id, coliving_id, url, is_principale, ordre) FROM stdin;
97	32	http://localhost:5000/uploads/1784396442160-473049105.webp	t	0
98	32	http://localhost:5000/uploads/1784396449262-250779953.jpg	f	1
99	32	http://localhost:5000/uploads/1784396453994-752845880.jpg	f	2
100	36	http://localhost:5000/uploads/1784396576743-282444451.webp	t	0
101	36	http://localhost:5000/uploads/1784396581730-599840888.webp	f	1
102	36	http://localhost:5000/uploads/1784396586126-698819087.webp	f	2
103	39	http://localhost:5000/uploads/1784396672205-108851575.webp	t	0
104	39	http://localhost:5000/uploads/1784396675735-494630437.webp	f	1
105	39	http://localhost:5000/uploads/1784396679444-906920737.webp	f	2
106	42	http://localhost:5000/uploads/1784396856795-597758658.webp	t	0
107	42	http://localhost:5000/uploads/1784396859715-700389714.webp	f	1
108	42	http://localhost:5000/uploads/1784396862478-38432734.webp	f	2
115	38	http://localhost:5000/uploads/1784397175146-780445542.webp	t	0
116	38	http://localhost:5000/uploads/1784397178515-875313546.webp	f	1
117	38	http://localhost:5000/uploads/1784397181370-303013970.webp	f	2
118	33	http://localhost:5000/uploads/1784397036500-744744064.webp	t	0
119	33	http://localhost:5000/uploads/1784397039482-721066959.webp	f	1
120	33	http://localhost:5000/uploads/1784397042761-506351892.webp	f	2
121	35	http://localhost:5000/uploads/1784397103301-1739767.webp	t	0
122	35	http://localhost:5000/uploads/1784397106443-381938085.webp	f	1
123	35	http://localhost:5000/uploads/1784397109623-68256073.webp	f	2
124	41	http://localhost:5000/uploads/1784397280442-812195347.webp	t	0
125	41	http://localhost:5000/uploads/1784397283365-255959960.webp	f	1
126	41	http://localhost:5000/uploads/1784397287049-105558346.webp	f	2
127	34	http://localhost:5000/uploads/1784397440590-989462811.webp	t	0
128	34	http://localhost:5000/uploads/1784397443911-590045743.webp	f	1
129	34	http://localhost:5000/uploads/1784397447283-439344299.webp	f	2
130	37	http://localhost:5000/uploads/1784397502050-224888905.webp	t	0
131	37	http://localhost:5000/uploads/1784397505125-571052892.webp	f	1
132	37	http://localhost:5000/uploads/1784397507825-467642306.webp	f	2
133	40	http://localhost:5000/uploads/1784397606776-166537212.webp	t	0
134	40	http://localhost:5000/uploads/1784397609909-539197784.webp	f	1
135	40	http://localhost:5000/uploads/1784397612707-436195947.webp	f	2
136	43	http://localhost:5000/uploads/1784397714816-67201251.webp	t	0
137	43	http://localhost:5000/uploads/1784397717926-214637194.webp	f	1
138	43	http://localhost:5000/uploads/1784397721936-703429291.webp	f	2
\.


--
-- TOC entry 5222 (class 0 OID 49216)
-- Dependencies: 248
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, expediteur_id, destinataire_id, coliving_id, contenu, date_envoi, lu) FROM stdin;
\.


--
-- TOC entry 5214 (class 0 OID 16969)
-- Dependencies: 240
-- Data for Name: paiements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paiements (id, reservation_id, montant, methode, devise, date_paiement, statut) FROM stdin;
\.


--
-- TOC entry 5210 (class 0 OID 16941)
-- Dependencies: 236
-- Data for Name: participations_activites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.participations_activites (client_id, activite_id, date_inscription) FROM stdin;
\.


--
-- TOC entry 5212 (class 0 OID 16951)
-- Dependencies: 238
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservations (id, client_id, chambre_id, date_debut, date_fin, nombre_personnes, prix_total, statut, date_creation) FROM stdin;
\.


--
-- TOC entry 5194 (class 0 OID 16810)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, nom, email, mot_de_passe, telephone, photo_profil, date_creation, derniere_connexion, role) FROM stdin;
15	Admin Darlink	admin@darlink.com	$2b$10$tTbXwupmZ/Cr8TS/Y5AiIeC8RwoiRzPWPEcv8lFZ2rxQtdBko4YuC	+212600000001	https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=Admin	2026-07-03 19:49:53.821	\N	ADMIN
19	Jean Dupont	jean@example.com	$2b$10$tTbXwupmZ/Cr8TS/Y5AiIeC8RwoiRzPWPEcv8lFZ2rxQtdBko4YuC	+212612345690	https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=Jean	2026-07-03 19:49:53.906	\N	CLIENT
20	test client	testclient@gmail.com	$2b$10$RxvHcapnsvQWM5YNkh3Ee.Ws246RaTMXsP3K0L0ph2Dt43oqn8/OS	088908990877698	https://ui-avatars.com/api/?background=DD7246&color=fff&bold=true&name=test client	2026-07-03 20:09:05.352	\N	CLIENT
21	azizi azizi	azizi@gmail.com	$2b$10$.N4/TMPno6g1FY8RSU.5Dui/O77nwwG3nJDcF2qCTvS/euhAlGnVG	\N	\N	2026-07-06 19:01:43.484	\N	CLIENT
22	clientdetest clientdetest	clientdetest@gmail.com	$2b$10$XdLasnwA.G.f4mFk5qTGj.psrVdkD/DJfZUl7BqiV8hLKAofLLGtq	\N	\N	2026-07-18 16:35:06.641	\N	CLIENT
29	Mehdi Alaoui	mehdi@darlink.com	$2b$10$uZLi9QsHEJDi6wqm5L1aOuSuYg8jlBixjU5cjKzIWjsmQ2yzqZNI2	+212600112233	https://ui-avatars.com/api/?background=1A1A2E&color=fff&name=Mehdi+Alaoui	2026-07-18 17:20:07.079	\N	HOTE
30	Youssef Benjelloun	youssef@darlink.com	$2b$10$uZLi9QsHEJDi6wqm5L1aOuSuYg8jlBixjU5cjKzIWjsmQ2yzqZNI2	+212600445566	https://ui-avatars.com/api/?background=DD7246&color=fff&name=Youssef+B	2026-07-18 17:20:07.089	\N	HOTE
31	Salma El Fassi	salma@darlink.com	$2b$10$uZLi9QsHEJDi6wqm5L1aOuSuYg8jlBixjU5cjKzIWjsmQ2yzqZNI2	+212600778899	https://ui-avatars.com/api/?background=10B981&color=fff&name=Salma+E	2026-07-18 17:20:07.093	\N	HOTE
\.


--
-- TOC entry 5243 (class 0 OID 0)
-- Dependencies: 234
-- Name: activites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activites_id_seq', 12, true);


--
-- TOC entry 5244 (class 0 OID 0)
-- Dependencies: 243
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 34, true);


--
-- TOC entry 5245 (class 0 OID 0)
-- Dependencies: 241
-- Name: avis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.avis_id_seq', 6, true);


--
-- TOC entry 5246 (class 0 OID 0)
-- Dependencies: 230
-- Name: chambres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chambres_id_seq', 89, true);


--
-- TOC entry 5247 (class 0 OID 0)
-- Dependencies: 225
-- Name: colivings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.colivings_id_seq', 43, true);


--
-- TOC entry 5248 (class 0 OID 0)
-- Dependencies: 245
-- Name: document_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.document_requests_id_seq', 10, true);


--
-- TOC entry 5249 (class 0 OID 0)
-- Dependencies: 223
-- Name: documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documents_id_seq', 6, true);


--
-- TOC entry 5250 (class 0 OID 0)
-- Dependencies: 232
-- Name: equipements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equipements_id_seq', 39, true);


--
-- TOC entry 5251 (class 0 OID 0)
-- Dependencies: 228
-- Name: images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.images_id_seq', 138, true);


--
-- TOC entry 5252 (class 0 OID 0)
-- Dependencies: 247
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 7, true);


--
-- TOC entry 5253 (class 0 OID 0)
-- Dependencies: 239
-- Name: paiements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paiements_id_seq', 2, true);


--
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 237
-- Name: reservations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservations_id_seq', 14, true);


--
-- TOC entry 5255 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 31, true);


--
-- TOC entry 5006 (class 2606 OID 16940)
-- Name: activites activites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activites
    ADD CONSTRAINT activites_pkey PRIMARY KEY (id);


--
-- TOC entry 5017 (class 2606 OID 49171)
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5015 (class 2606 OID 16998)
-- Name: avis avis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avis
    ADD CONSTRAINT avis_pkey PRIMARY KEY (id);


--
-- TOC entry 5001 (class 2606 OID 16913)
-- Name: chambres chambres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chambres
    ADD CONSTRAINT chambres_pkey PRIMARY KEY (id);


--
-- TOC entry 4989 (class 2606 OID 16832)
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4997 (class 2606 OID 16881)
-- Name: coliving_equipements coliving_equipements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coliving_equipements
    ADD CONSTRAINT coliving_equipements_pkey PRIMARY KEY (coliving_id, equipement_id);


--
-- TOC entry 4995 (class 2606 OID 16874)
-- Name: colivings colivings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colivings
    ADD CONSTRAINT colivings_pkey PRIMARY KEY (id);


--
-- TOC entry 5020 (class 2606 OID 49185)
-- Name: document_requests document_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_requests
    ADD CONSTRAINT document_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 4993 (class 2606 OID 16857)
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- TOC entry 5004 (class 2606 OID 16924)
-- Name: equipements equipements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipements
    ADD CONSTRAINT equipements_pkey PRIMARY KEY (id);


--
-- TOC entry 4991 (class 2606 OID 16840)
-- Name: hotes hotes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotes
    ADD CONSTRAINT hotes_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4999 (class 2606 OID 16897)
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- TOC entry 5022 (class 2606 OID 49231)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 5012 (class 2606 OID 16984)
-- Name: paiements paiements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiements
    ADD CONSTRAINT paiements_pkey PRIMARY KEY (id);


--
-- TOC entry 5008 (class 2606 OID 16949)
-- Name: participations_activites participations_activites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participations_activites
    ADD CONSTRAINT participations_activites_pkey PRIMARY KEY (client_id, activite_id);


--
-- TOC entry 5010 (class 2606 OID 16967)
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);


--
-- TOC entry 4987 (class 2606 OID 16824)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5018 (class 1259 OID 49186)
-- Name: document_requests_document_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX document_requests_document_id_key ON public.document_requests USING btree (document_id);


--
-- TOC entry 5002 (class 1259 OID 17000)
-- Name: equipements_nom_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX equipements_nom_key ON public.equipements USING btree (nom);


--
-- TOC entry 5013 (class 1259 OID 17001)
-- Name: paiements_reservation_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX paiements_reservation_id_key ON public.paiements USING btree (reservation_id);


--
-- TOC entry 4985 (class 1259 OID 16999)
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- TOC entry 5031 (class 2606 OID 17042)
-- Name: activites activites_coliving_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activites
    ADD CONSTRAINT activites_coliving_id_fkey FOREIGN KEY (coliving_id) REFERENCES public.colivings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5039 (class 2606 OID 49187)
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5037 (class 2606 OID 17072)
-- Name: avis avis_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avis
    ADD CONSTRAINT avis_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5038 (class 2606 OID 17077)
-- Name: avis avis_coliving_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avis
    ADD CONSTRAINT avis_coliving_id_fkey FOREIGN KEY (coliving_id) REFERENCES public.colivings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5030 (class 2606 OID 17037)
-- Name: chambres chambres_coliving_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chambres
    ADD CONSTRAINT chambres_coliving_id_fkey FOREIGN KEY (coliving_id) REFERENCES public.colivings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5023 (class 2606 OID 17002)
-- Name: clients clients_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5027 (class 2606 OID 17022)
-- Name: coliving_equipements coliving_equipements_coliving_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coliving_equipements
    ADD CONSTRAINT coliving_equipements_coliving_id_fkey FOREIGN KEY (coliving_id) REFERENCES public.colivings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5028 (class 2606 OID 17027)
-- Name: coliving_equipements coliving_equipements_equipement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coliving_equipements
    ADD CONSTRAINT coliving_equipements_equipement_id_fkey FOREIGN KEY (equipement_id) REFERENCES public.equipements(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5026 (class 2606 OID 17017)
-- Name: colivings colivings_hote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.colivings
    ADD CONSTRAINT colivings_hote_id_fkey FOREIGN KEY (hote_id) REFERENCES public.hotes(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5040 (class 2606 OID 49197)
-- Name: document_requests document_requests_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_requests
    ADD CONSTRAINT document_requests_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5041 (class 2606 OID 49202)
-- Name: document_requests document_requests_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_requests
    ADD CONSTRAINT document_requests_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5042 (class 2606 OID 49192)
-- Name: document_requests document_requests_hote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_requests
    ADD CONSTRAINT document_requests_hote_id_fkey FOREIGN KEY (hote_id) REFERENCES public.hotes(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5025 (class 2606 OID 17012)
-- Name: documents documents_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5024 (class 2606 OID 17007)
-- Name: hotes hotes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotes
    ADD CONSTRAINT hotes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5029 (class 2606 OID 17032)
-- Name: images images_coliving_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_coliving_id_fkey FOREIGN KEY (coliving_id) REFERENCES public.colivings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5043 (class 2606 OID 49242)
-- Name: messages messages_coliving_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_coliving_id_fkey FOREIGN KEY (coliving_id) REFERENCES public.colivings(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5044 (class 2606 OID 49237)
-- Name: messages messages_destinataire_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_destinataire_id_fkey FOREIGN KEY (destinataire_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5045 (class 2606 OID 49232)
-- Name: messages messages_expediteur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_expediteur_id_fkey FOREIGN KEY (expediteur_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5036 (class 2606 OID 17067)
-- Name: paiements paiements_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paiements
    ADD CONSTRAINT paiements_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5032 (class 2606 OID 17052)
-- Name: participations_activites participations_activites_activite_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participations_activites
    ADD CONSTRAINT participations_activites_activite_id_fkey FOREIGN KEY (activite_id) REFERENCES public.activites(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5033 (class 2606 OID 17047)
-- Name: participations_activites participations_activites_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participations_activites
    ADD CONSTRAINT participations_activites_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5034 (class 2606 OID 17062)
-- Name: reservations reservations_chambre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_chambre_id_fkey FOREIGN KEY (chambre_id) REFERENCES public.chambres(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5035 (class 2606 OID 17057)
-- Name: reservations reservations_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5229 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-07-18 19:56:25

--
-- PostgreSQL database dump complete
--

\unrestrict 6sDGnpBGouXc11NT6ZKlJHPooGmlxsQp9vIPlIw7BD0xRMpDwXHzyGdecpt82Z8

