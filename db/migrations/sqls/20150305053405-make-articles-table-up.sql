CREATE TABLE articles (
	id	SERIAL PRIMARY KEY,
	title	TEXT UNIQUE NOT NULL,
	link	TEXT UNIQUE NOT NULL,
	country VARCHAR(255) NOT NULL,
	city	VARCHAR(255) DEFAULT '',
	pub_date TIMESTAMP
);