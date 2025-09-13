CREATE TABLE IF NOT EXISTS transactions (
    id integer PRIMARY KEY,
    amount_cents integer NOT NULL,
    category text NOT NULL,
    note text,
    date text NOT NULL
);

