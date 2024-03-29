CREATE DATABASE IF NOT EXISTS english_db;

USE english_db;

CREATE TABLE
    IF NOT EXISTS word (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(256) NOT NULL UNIQUE,
        pronounce VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id)
    ) DEFAULT CHARACTER
SET
    = utf8;

CREATE TABLE
    IF NOT EXISTS partsofspeech (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id)
    ) DEFAULT CHARACTER
SET
    = utf8;

CREATE TABLE
    IF NOT EXISTS mean (
        id INT NOT NULL AUTO_INCREMENT,
        word_id INT NOT NULL,
        wordmean_id INT NOT NULL,
        partsofspeech_id INT NOT NULL,
        meaning VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE wordmean_index (word_id, wordmean_id),
        FOREIGN KEY word_id_foreign_key (word_id) REFERENCES word (id),
        FOREIGN KEY partsofspeech_id_foreign_key (partsofspeech_id) REFERENCES partsofspeech (id)
    ) DEFAULT CHARACTER
SET
    = utf8;

CREATE TABLE
    IF NOT EXISTS example (
        id INT NOT NULL AUTO_INCREMENT,
        en_example_sentense VARCHAR(256) NOT NULL,
        ja_example_sentense VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id)
    ) DEFAULT CHARACTER
SET
    = utf8;

CREATE TABLE
    IF NOT EXISTS mean_example (
        example_sentense_id INT NOT NULL,
        mean_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY (example_sentense_id, mean_id),
        FOREIGN KEY example_sentense_id_foreign_key (example_sentense_id) REFERENCES example (id),
        FOREIGN KEY mean_id_foreign_key (mean_id) REFERENCES mean (id)
    ) DEFAULT CHARACTER
SET
    = utf8;

CREATE TABLE
    IF NOT EXISTS mean_source (
        mean_id INT NOT NULL,
        source_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY (mean_id, source_id)
    ) DEFAULT CHARACTER
SET
    = utf8;

CREATE TABLE
    IF NOT EXISTS idiom (
        id INT NOT NULL AUTO_INCREMENT,
        word_id INT NOT NULL,
        name VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY word_id_foreign_key (word_id) REFERENCES word (id)
    ) DEFAULT CHARACTER
SET
    = utf8;

CREATE TABLE
    IF NOT EXISTS idiom_mean (
        id INT NOT NULL AUTO_INCREMENT,
        idiom_id INT NOT NULL,
        idiommean_id INT NOT NULL,
        partsofspeech_id INT NOT NULL,
        meaning VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE idiommean_index (idiom_id, idiommean_id),
        FOREIGN KEY idiom_id_foreign_key (idiom_id) REFERENCES idiom (id),
        FOREIGN KEY partsofspeech_id_foreign_key (partsofspeech_id) REFERENCES partsofspeech (id)
    ) DEFAULT CHARACTER
SET
    = utf8;

CREATE TABLE
    IF NOT EXISTS source (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id)
    ) DEFAULT CHARACTER
SET
    = utf8;

/* 類義語グループ */
CREATE TABLE
    IF NOT EXISTS word_similarity_group (
        id INT NOT NULL AUTO_INCREMENT,
        word_similarity_group_name VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id)
    ) DEFAULT CHARACTER
SET
    = utf8;

/* 類義語 */
CREATE TABLE
    IF NOT EXISTS word_similarity (
        id INT NOT NULL AUTO_INCREMENT,
        word_similarity_group_id INT NOT NULL,
        word_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE similarity_word_id_index (word_similarity_group_id, word_id)
    ) DEFAULT CHARACTER
SET
    = utf8;

/* 語源グループ */
CREATE TABLE
    IF NOT EXISTS word_etymology_group (
        id INT NOT NULL AUTO_INCREMENT,
        word_etymology_group_name VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id)
    ) DEFAULT CHARACTER
SET
    = utf8;

/* 単語源 */
CREATE TABLE
    IF NOT EXISTS word_etymology (
        id INT NOT NULL AUTO_INCREMENT,
        word_etymology_group_id INT NOT NULL,
        word_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE etymology_word_id_index (word_etymology_group_id, word_id)
    ) DEFAULT CHARACTER
SET
    = utf8;

/* 単語テスト解答ログ*/
CREATE TABLE
    IF NOT EXISTS englishbot_answer_log (
        id INT NOT NULL AUTO_INCREMENT,
        word_id INT NOT NULL,
        result BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id)
    ) DEFAULT CHARACTER
SET
    = utf8;

CREATE TABLE
    IF NOT EXISTS word_subsource (
        id INT NOT NULL AUTO_INCREMENT,
        word_id INT NOT NULL,
        subsource VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE etymology_word_id_index (word_id, subsource)
    ) DEFAULT CHARACTER
SET
    = utf8;


/* 以下はビュー */
DROP VIEW IF EXISTS word_summarize;

CREATE VIEW word_summarize AS
    SELECT 'all' as name, count(*) as count
    FROM word w 
    WHERE deleted_at is  null
    UNION
    SELECT 'vocabulary' as name, count(*) as count
    FROM word w 
    WHERE w.name not like '% %'
    AND deleted_at is null
    UNION
    SELECT 'idiom' as name, count(*) as count
    FROM word w 
    WHERE w.name like '% %'
    AND deleted_at is null
;