CREATE TABLE
    IF NOT EXISTS selfhelp_book (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id)
    ) DEFAULT CHARACTER SET = utf8;

CREATE TABLE
    IF NOT EXISTS saying (
        id INT NOT NULL AUTO_INCREMENT,
        book_id INT NOT NULL,
        book_saying_id INT NOT NULL,
        saying VARCHAR(256) NOT NULL UNIQUE,
        explanation TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id)
    ) DEFAULT CHARACTER SET = utf8;