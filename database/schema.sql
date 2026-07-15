CREATE TABLE IF NOT EXISTS schemes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    benefits TEXT NOT NULL,
    required_documents TEXT NOT NULL,
    application_link TEXT,
    category TEXT
);

CREATE TABLE IF NOT EXISTS eligibility_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scheme_id INTEGER NOT NULL,
    min_age INTEGER,
    max_age INTEGER,
    max_income INTEGER,
    gender TEXT,
    state TEXT,
    occupation TEXT,
    student INTEGER,
    farmer INTEGER,
    disability INTEGER,
    FOREIGN KEY (scheme_id) REFERENCES schemes(id)
);