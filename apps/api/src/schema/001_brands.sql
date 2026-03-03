-- ─── Brand Registration Schema ────────────────────────────────────────────────
-- Migration 001: brands + brand_tokens_cache tables

CREATE TABLE IF NOT EXISTS brands (
  id                   TEXT PRIMARY KEY,
  display_name         TEXT NOT NULL,
  -- primarySeed OKLCH channels
  primary_l            REAL NOT NULL CHECK (primary_l >= 0 AND primary_l <= 1),
  primary_c            REAL NOT NULL CHECK (primary_c >= 0),
  primary_h            REAL NOT NULL CHECK (primary_h >= 0 AND primary_h < 360),
  -- accentSeed OKLCH channels
  accent_l             REAL NOT NULL CHECK (accent_l >= 0 AND accent_l <= 1),
  accent_c             REAL NOT NULL CHECK (accent_c >= 0),
  accent_h             REAL NOT NULL CHECK (accent_h >= 0 AND accent_h < 360),
  -- Temperature selectors
  neutral_temperature  TEXT NOT NULL CHECK (neutral_temperature IN ('warm', 'cool', 'neutral')),
  semantic_temperature TEXT NOT NULL CHECK (semantic_temperature IN ('warm', 'cool', 'neutral')),
  -- Shape preset
  shape                TEXT NOT NULL CHECK (shape IN ('sharp', 'rounded', 'pill')),
  -- Fonts (all three required)
  font_display         TEXT NOT NULL,
  font_heading         TEXT NOT NULL,
  font_body            TEXT NOT NULL,
  -- Optional per-brand component token overrides (JSON object)
  overrides_json       TEXT,
  -- Timestamps
  created_at           TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at           TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Resolved token cache: one row per brand × mode
CREATE TABLE IF NOT EXISTS brand_tokens_cache (
  brand_id             TEXT NOT NULL,
  mode                 TEXT NOT NULL CHECK (mode IN ('light', 'dark')),
  tokens_json          TEXT NOT NULL,
  css_string           TEXT NOT NULL,
  generated_at         TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (brand_id, mode),
  FOREIGN KEY (brand_id) REFERENCES brands (id) ON DELETE CASCADE
);
