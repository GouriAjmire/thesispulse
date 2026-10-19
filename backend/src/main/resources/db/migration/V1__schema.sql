CREATE TABLE categories (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    slug        VARCHAR(120) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE posts (
    id           BIGSERIAL PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    slug         VARCHAR(255) NOT NULL UNIQUE,
    excerpt      TEXT         NOT NULL,
    content      TEXT         NOT NULL,
    author       VARCHAR(100) NOT NULL,
    read_minutes INT          NOT NULL DEFAULT 3,
    published    BOOLEAN      NOT NULL DEFAULT TRUE,
    published_on DATE         NOT NULL,
    category_id  BIGINT       NOT NULL REFERENCES categories (id)
);
CREATE INDEX idx_posts_published_on ON posts (published_on DESC);
CREATE INDEX idx_posts_category ON posts (category_id);

CREATE TABLE service_offerings (
    id         BIGSERIAL PRIMARY KEY,
    code       VARCHAR(40)  NOT NULL UNIQUE,
    number     VARCHAR(4)   NOT NULL,
    title      VARCHAR(150) NOT NULL,
    summary    TEXT         NOT NULL,
    features   TEXT         NOT NULL,
    badge      VARCHAR(60),
    highlight  BOOLEAN      NOT NULL DEFAULT FALSE,
    sort_order INT          NOT NULL DEFAULT 0
);

CREATE TABLE faqs (
    id         BIGSERIAL PRIMARY KEY,
    question   VARCHAR(300) NOT NULL,
    answer     TEXT         NOT NULL,
    sort_order INT          NOT NULL DEFAULT 0
);

CREATE TABLE specialties (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL UNIQUE,
    group_name VARCHAR(60)  NOT NULL,
    sort_order INT          NOT NULL DEFAULT 0
);

CREATE TABLE resources (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    description TEXT         NOT NULL,
    file_type   VARCHAR(20)  NOT NULL,
    url         VARCHAR(500) NOT NULL,
    sort_order  INT          NOT NULL DEFAULT 0
);

CREATE TABLE enquiries (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(120) NOT NULL,
    email        VARCHAR(160) NOT NULL,
    phone        VARCHAR(30),
    specialty    VARCHAR(100),
    university   VARCHAR(160),
    service_code VARCHAR(40),
    deadline     DATE,
    message      TEXT,
    status       VARCHAR(20)  NOT NULL DEFAULT 'NEW',
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_enquiries_status ON enquiries (status, created_at DESC);

CREATE TABLE subscribers (
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(160) NOT NULL UNIQUE,
    subscribed_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
