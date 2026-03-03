/**
 * D1 schema: idempotent CREATE TABLE IF NOT EXISTS for all 5 tables.
 * Called by GET /db/test on every request — safe to run multiple times.
 */
export async function createSchema(db: D1Database): Promise<void> {
  await db.batch([
    db.prepare(`
      CREATE TABLE IF NOT EXISTS brands (
        id            TEXT    PRIMARY KEY,
        display_name  TEXT    NOT NULL,
        seed_l        REAL    NOT NULL,
        seed_c        REAL    NOT NULL,
        seed_h        REAL    NOT NULL,
        font_display  TEXT    NOT NULL,
        font_heading  TEXT    NOT NULL,
        font_body     TEXT    NOT NULL,
        primitives    TEXT,
        color_scale   TEXT    NOT NULL DEFAULT '{}',
        valid_status  TEXT    NOT NULL DEFAULT 'pending',
        created_at    TEXT    NOT NULL,
        updated_at    TEXT    NOT NULL
      )
    `),
    db.prepare(
      `CREATE INDEX IF NOT EXISTS idx_brands_valid_status ON brands (valid_status)`,
    ),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS semantic_tokens (
        name              TEXT    PRIMARY KEY,
        tier1_ref_light   TEXT,
        tier1_ref_dark    TEXT,
        primitive_ref     TEXT,
        description       TEXT,
        created_at        TEXT    NOT NULL,
        updated_at        TEXT    NOT NULL,
        CHECK (
          (tier1_ref_light IS NOT NULL AND tier1_ref_dark IS NOT NULL AND primitive_ref IS NULL) OR
          (tier1_ref_light IS NULL AND tier1_ref_dark IS NULL AND primitive_ref IS NOT NULL)
        )
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS component_tokens (
        name              TEXT    PRIMARY KEY,
        semantic_token    TEXT    NOT NULL,
        description       TEXT,
        created_at        TEXT    NOT NULL,
        updated_at        TEXT    NOT NULL,
        FOREIGN KEY (semantic_token) REFERENCES semantic_tokens (name)
      )
    `),
    db.prepare(
      `CREATE INDEX IF NOT EXISTS idx_component_tokens_semantic ON component_tokens (semantic_token)`,
    ),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS brand_token_overrides (
        brand_id                TEXT    NOT NULL,
        component_token         TEXT    NOT NULL,
        semantic_token_override TEXT    NOT NULL,
        created_at              TEXT    NOT NULL,
        updated_at              TEXT    NOT NULL,
        PRIMARY KEY (brand_id, component_token),
        FOREIGN KEY (brand_id)                REFERENCES brands (id)            ON DELETE CASCADE,
        FOREIGN KEY (component_token)         REFERENCES component_tokens (name),
        FOREIGN KEY (semantic_token_override) REFERENCES semantic_tokens (name)
      )
    `),
    db.prepare(
      `CREATE INDEX IF NOT EXISTS idx_overrides_brand ON brand_token_overrides (brand_id)`,
    ),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS token_validation_log (
        id          TEXT    PRIMARY KEY,
        brand_id    TEXT    NOT NULL,
        run_at      TEXT    NOT NULL,
        status      TEXT    NOT NULL,
        errors      TEXT,
        FOREIGN KEY (brand_id) REFERENCES brands (id) ON DELETE CASCADE
      )
    `),
    db.prepare(
      `CREATE INDEX IF NOT EXISTS idx_validation_brand_run ON token_validation_log (brand_id, run_at DESC)`,
    ),
  ]);
}
