CREATE TABLE reviews (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    rating     INT          NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review     TEXT         NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_created_at ON reviews (created_at DESC);
