import { parseStrToBool } from '../lib/str';

export const SQL = {
  ANSWER_LOG: {
    RESET: `UPDATE answer_log SET deleted_at = NOW() WHERE quiz_format_id = ? AND file_num = ? AND quiz_num = ?; `,
    FILE: {
      RESET: `
        UPDATE
          answer_log
        SET
          deleted_at = NOW()
        WHERE
          file_num = ?
          AND deleted_at IS NULL;
      `,
    },
  },
  QUIZ_FILE: {
    LIST: ` 
      SELECT
        file_num,
        file_name,
        file_nickname
      FROM quiz_file
      WHERE deleted_at IS NULL
      ORDER BY file_num; 
    `,
    ADD: ` INSERT INTO quiz_file (file_num, file_name, file_nickname) VALUES (?,?,?);`,
    COUNT: `SELECT MAX(file_num) as file_num FROM quiz_file;`,
    DELETE: `UPDATE quiz_file SET updated_at = NOW(), deleted_at = NOW() WHERE file_num = ?  `,
  },
  QUIZ: {
    INFO: `
      SELECT
        id,
        file_num,
        quiz_num,
        quiz_sentense,
        answer,
        category,
        img_file,
        checked,
        clear_count,
        fail_count,
        accuracy_rate
      FROM quiz_view
      WHERE
        file_num = ?
        AND quiz_num = ?
        AND deleted_at IS NULL;
    `,
    RANDOM: (category?: string, checked?: string) => {
      return ` 
      SELECT 
        id,
        file_num,
        quiz_num,
        quiz_sentense,
        answer,
        category,
        img_file,
        checked,
        clear_count,
        fail_count,
        accuracy_rate
      FROM 
        quiz_view 
      WHERE file_num = ? 
      AND accuracy_rate >= ? 
      AND accuracy_rate <= ? 
      AND deleted_at IS NULL 
      ${
        category && category !== ''
          ? ` AND category LIKE '%` + category + `%' `
          : ''
      }
      ${parseStrToBool(checked) ? ` AND checked = 1 ` : ''}
      ORDER BY random() LIMIT 1 
      ;`;
    },
    WORST: (category?: string, checked?: string) => {
      return ` 
        SELECT
          id,
          file_num,
          quiz_num,
          quiz_sentense,
          answer,
          category,
          img_file,
          checked,
          clear_count,
          fail_count,
          accuracy_rate
        FROM
            quiz_view
        WHERE
            file_num = ?
        AND deleted_at IS NULL 
        ${
          category && category !== ''
            ? ` AND category LIKE '%` + category + `%' `
            : ''
        }
        ${parseStrToBool(checked) ? ` AND checked = 1 ` : ''}
        ORDER BY accuracy_rate LIMIT 1
        ;
    `;
    },
    MINIMUM: (category?: string, checked?: string) => {
      return ` 
        SELECT
          id,
          file_num,
          quiz_num,
          quiz_sentense,
          answer,
          category,
          img_file,
          checked,
          clear_count,
          fail_count,
          accuracy_rate
        FROM
            quiz_view
        WHERE
            file_num = ?
        AND deleted_at IS NULL 
        ${
          category && category !== ''
            ? ` AND category LIKE '%` + category + `%' `
            : ''
        }
        ${parseStrToBool(checked) ? ` AND checked = 1 ` : ''}
        ORDER BY (clear_count+fail_count),fail_count desc LIMIT 1
        ;
      `;
    },
    LRU: (file_num: number, category?: string, checked?: string) => {
      return `
        SELECT
          v.id,
          v.file_num,
          v.quiz_num,
          v.quiz_sentense,
          v.answer,
          v.category,
          v.img_file,
          v.checked,
          v.clear_count,
          v.fail_count,
          v.accuracy_rate
        FROM
            quiz_view v
        LEFT OUTER JOIN (
          SELECT
            quiz_format_id,
            file_num,
            quiz_num,
            MAX(updated_at)  as updated_at
          FROM answer_log al
          WHERE quiz_format_id = 1
          AND file_num = ${file_num}
          GROUP BY              		
            quiz_format_id,
            file_num,
            quiz_num
        ) l
        ON
            l.quiz_format_id = 1
          AND v.file_num = l.file_num              		
          AND v.quiz_num = l.quiz_num
        WHERE
            v.file_num = ${file_num}
        ${category ? ` AND category LIKE '%` + category + `%' ` : ''}
        ${parseStrToBool(checked) ? ` AND checked = 1 ` : ''}
        AND v.deleted_at IS NULL 
        ORDER BY l.updated_at LIMIT 1
        ;
      `;
    },
    REVIEW: (file_num: number, category?: string, checked?: string) => {
      return `
        SELECT
          v.id,
          v.file_num,
          v.quiz_num,
          v.quiz_sentense,
          v.answer,
          v.category,
          v.img_file,
          v.checked,
          v.clear_count,
          v.fail_count,
          v.accuracy_rate
        FROM
            quiz_view v
        INNER JOIN (
          SELECT DISTINCT
            quiz_format_id,
            file_num,
            quiz_num
          FROM answer_log al
          WHERE quiz_format_id = 1
          AND file_num = ${file_num}
          AND is_corrected = false
          AND CAST(created_at AS DATE) = CURRENT_DATE - INTERVAL '1 DAY'
        ) l
        ON
            l.quiz_format_id = 1
          AND v.file_num = l.file_num              		
          AND v.quiz_num = l.quiz_num
        WHERE
            v.file_num = ${file_num}
        ${category ? ` AND category LIKE '%` + category + `%' ` : ''}
        ${parseStrToBool(checked) ? ` AND checked = 1 ` : ''}
        AND v.deleted_at IS NULL 
        ORDER BY random() LIMIT 1
        ;
      `;
    },
    CLEARED: {
      INPUT: `
        INSERT INTO
            answer_log (
                quiz_format_id,
                file_num,
                quiz_num,
                is_corrected
            )
        VALUES (1, ?, ?, true);
      `,
    },
    FAILED: {
      INPUT: `
        INSERT INTO
            answer_log (
                quiz_format_id,
                file_num,
                quiz_num,
                is_corrected
            )
        VALUES (1, ?, ?, false);
      `,
    },
    DELETED: {
      GET: `
        SELECT
            quiz_num
        FROM
            quiz
        WHERE
            file_num = ?
            AND deleted_at IS NULL
        ORDER BY
            quiz_num
        LIMIT 1
        ;
      `,
    },
    ADD: `
      INSERT INTO
          quiz (
              file_num,
              quiz_num,
              quiz_sentense,
              answer,
              category,
              img_file,
              checked
          )
      VALUES
      (?, ?, ?, ?, ?, ?, false)
      ;
    `,
    EDIT: `
      UPDATE
          quiz
      SET
          quiz_sentense = ? ,
          answer = ? ,
          category = ? ,
          img_file = ? ,
          checked = 0, 
          updated_at = NOW()
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
      ;
    `,
    COUNT: `
      SELECT 
          count(*) 
      FROM 
          quiz 
      WHERE 
          file_num = ?
      AND deleted_at IS NULL
      ;
    `,
    MAX_QUIZ_NUM: `
      SELECT 
          quiz_num
      FROM 
          quiz 
      WHERE 
          file_num = ?
      ORDER BY quiz_num DESC
      LIMIT 1
      ;
    `,
    SEARCH: (
      category: string,
      checked: string,
      query: string,
      queryOnlyInSentense: string,
      queryOnlyInAnswer: string,
    ) => {
      return `
      SELECT
          id, 
          file_num, 
          quiz_num, 
          quiz_sentense, 
          answer, 
          clear_count, 
          fail_count, 
          category, 
          img_file, 
          checked, 
          ROUND(accuracy_rate,1) AS accuracy_rate 
      FROM
          quiz_view
      WHERE
          file_num = ?
      AND accuracy_rate >= ? 
      AND accuracy_rate <= ? 
      AND deleted_at IS NULL 
      ${
        category && category !== ''
          ? ` AND category LIKE '%` + category + `%' `
          : ''
      }
      ${parseStrToBool(checked) ? ` AND checked = 1 ` : ''}
      ${
        query && query !== ''
          ? parseStrToBool(queryOnlyInSentense) &&
            !parseStrToBool(queryOnlyInAnswer)
            ? ` AND quiz_sentense LIKE '%${query || ''}%' `
            : !parseStrToBool(queryOnlyInSentense) &&
              parseStrToBool(queryOnlyInAnswer)
            ? ` AND answer LIKE '%${query || ''}%' `
            : ` AND (quiz_sentense LIKE '%${query || ''}%' OR answer LIKE '%${
                query || ''
              }%') `
          : ''
      }
      ORDER BY quiz_num
      ; 
    `;
    },
    DELETE: `
      UPDATE
          quiz
      SET
          quiz_sentense = concat(quiz_sentense,'(削除済-',DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'),')'),
          updated_at = NOW(), 
          deleted_at = NOW()
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
      ;
    `,
    DELETE_FILE: ` 
      UPDATE 
        quiz
      SET
        updated_at = NOW(),
        deleted_at = NOW()
      WHERE
        file_num = ?
      ;
    `,
    INTEGRATE: `
      UPDATE
          quiz
      SET
          category = ?,
          updated_at = NOW()
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
    `,
    CATEGORY: {
      GET: `
        SELECT
          category
        FROM
          quiz
        WHERE 
          file_num = ? 
          AND quiz_num = ? 
          AND deleted_at IS NULL
      `,
      UPDATE: `
        UPDATE
            quiz
        SET
            category = ?,
            updated_at = NOW()
        WHERE 
            file_num = ? 
            AND quiz_num = ? 
      `,
      DISTINCT: `
        SELECT DISTINCT
            category
        FROM
            quiz
        WHERE
            file_num = ? 
        ;
      `,
    },
    CHECK: `
      UPDATE
          quiz
      SET
          checked = true,
          updated_at = NOW()
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
    `,
    UNCHECK: `
      UPDATE
          quiz
      SET
          checked = false,
          updated_at = NOW()
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
    `,
    ACCURACYRATE: `
      SELECT 
          checked, 
          count(*) as count, 
          SUM(clear_count) as sum_clear, 
          SUM(fail_count) as sum_fail, 
          ( 100 * SUM(clear_count) / ( SUM(clear_count) + SUM(fail_count) ) ) as accuracy_rate 
      FROM 
          quiz_view 
      where 
          file_num = ? 
          and checked = 1 
          and deleted_at IS NULL
      group by checked;
    `,
  },
  ADVANCED_QUIZ: {
    INFO: `
      SELECT 
        id,
        file_num,
        quiz_num,
        advanced_quiz_type_id,
        quiz_sentense,
        answer,
        img_file,
        checked,
        clear_count,
        fail_count,
        accuracy_rate
      FROM 
        advanced_quiz_view 
      WHERE file_num = ? 
      AND quiz_num = ? 
      AND advanced_quiz_type_id = 1 
      AND deleted_at IS NULL
      ; 
    `,
    RANDOM: (checked?: string) => {
      return ` 
      SELECT 
        id,
        file_num,
        quiz_num,
        advanced_quiz_type_id,
        quiz_sentense,
        answer,
        img_file,
        checked,
        clear_count,
        fail_count,
        accuracy_rate
      FROM 
        advanced_quiz_view 
      WHERE file_num = ? 
      AND advanced_quiz_type_id = 1 
      AND accuracy_rate >= ? 
      AND accuracy_rate <= ? 
      AND deleted_at IS NULL 
      ${parseStrToBool(checked) ? ` AND checked = 1 ` : ''}
      ORDER BY random() LIMIT 1 
      ;`;
    },
    WORST: (checked?: string) => {
      return ` 
        SELECT
          id,
          file_num,
          quiz_num,
          advanced_quiz_type_id,
          quiz_sentense,
          answer,
          img_file,
          checked,
          clear_count,
          fail_count,
          accuracy_rate
        FROM
            advanced_quiz_view
        WHERE
            file_num = ?
        AND advanced_quiz_type_id = 1 
        AND deleted_at IS NULL 
        ${parseStrToBool(checked) ? ` AND checked = 1 ` : ''}
        ORDER BY accuracy_rate LIMIT 1
      ;
      `;
    },
    MINIMUM: (checked?: string) => {
      return ` 
        SELECT
          id,
          file_num,
          quiz_num,
          advanced_quiz_type_id,
          quiz_sentense,
          answer,
          img_file,
          checked,
          clear_count,
          fail_count,
          accuracy_rate
        FROM
          advanced_quiz_view
        WHERE
          file_num = ?
        AND advanced_quiz_type_id = 1 
        AND deleted_at IS NULL 
        ${parseStrToBool(checked) ? ` AND checked = 1 ` : ''}
        ORDER BY (clear_count+fail_count),fail_count desc LIMIT 1 
        ;
      `;
    },
    LRU: (quiz_format_id: number, file_num: number, checked?: string) => {
      return `
        SELECT
          v.id,
          v.file_num,
          v.quiz_num,
          v.advanced_quiz_type_id,
          v.quiz_sentense,
          v.answer,
          v.img_file,
          v.checked,
          v.clear_count,
          v.fail_count,
          v.accuracy_rate
        FROM
          advanced_quiz_view v
        LEFT OUTER JOIN (
          SELECT
            quiz_format_id,
            file_num,
            quiz_num,
            MAX(updated_at)  as updated_at
          FROM answer_log al
          WHERE quiz_format_id = ${quiz_format_id}
          AND file_num = ${file_num}
          GROUP BY              		
            quiz_format_id,
            file_num,
            quiz_num
        ) l
        ON
            l.quiz_format_id = ${quiz_format_id}
          AND v.file_num = l.file_num              		
          AND v.quiz_num = l.quiz_num
        WHERE
            v.file_num = ${file_num}
        ${parseStrToBool(checked) ? ` AND checked = 1 ` : ''}
        AND v.deleted_at IS NULL 
        ORDER BY l.updated_at LIMIT 1
        ;
      `;
    },
    REVIEW: (quiz_format_id: number, file_num: number, checked?: string) => {
      return `
        SELECT
          v.id,
          v.file_num,
          v.quiz_num,
          v.advanced_quiz_type_id,
          v.quiz_sentense,
          v.answer,
          v.img_file,
          v.checked,
          v.clear_count,
          v.fail_count,
          v.accuracy_rate
        FROM
          advanced_quiz_view v
        INNER JOIN (
          SELECT DISTINCT
            quiz_format_id,
            file_num,
            quiz_num
          FROM answer_log al
          WHERE quiz_format_id = ${quiz_format_id}
          AND file_num = ${file_num}
          AND is_corrected = false
          AND CAST(created_at AS DATE) = CURRENT_DATE - INTERVAL '1 DAY'
        ) l
        ON
          l.quiz_format_id = ${quiz_format_id}
          AND v.file_num = l.file_num              		
          AND v.quiz_num = l.quiz_num
        WHERE
            v.file_num = ${file_num}
        ${parseStrToBool(checked) ? ` AND checked = 1 ` : ''}
        AND v.deleted_at IS NULL 
        ORDER BY random() LIMIT 1
        ;
      `;
    },
    CLEARED: {
      INPUT: `
      INSERT INTO
        answer_log (
            quiz_format_id,
            file_num,
            quiz_num,
            is_corrected
        )
      VALUES (2, ?, ?, true);
      `,
    },
    FAILED: {
      INPUT: `
      INSERT INTO
        answer_log (
            quiz_format_id,
            file_num,
            quiz_num,
            is_corrected
        )
      VALUES (2, ?, ?, false);
      `,
    },
    ADD: `
    INSERT INTO
        advanced_quiz (
            file_num,
            quiz_num,
            advanced_quiz_type_id,
            quiz_sentense,
            answer,
            img_file,
            checked
        )
    VALUES
    (?, ?, ?, ?, ?, ?, false);
    `,
    EDIT: `
      UPDATE
          advanced_quiz
      SET
          quiz_sentense = ? ,
          answer = ? ,
          img_file = ? ,
          updated_at = NOW()
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
      ;
    `,
    CHECK: `
      UPDATE
          advanced_quiz
      SET
          checked = true,
          updated_at = NOW()
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
    `,
    UNCHECK: `
      UPDATE
          advanced_quiz
      SET
          checked = false,
          updated_at = NOW()
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
    `,
    MAX_QUIZ_NUM: {
      BYFILE: `
        SELECT 
            quiz_num
        FROM 
            advanced_quiz 
        WHERE 
            file_num = ?
        ORDER BY quiz_num DESC
        LIMIT 1
      `,
      ALL: `
        SELECT 
            MAX(id) as id
        FROM 
            advanced_quiz 
      `,
    },
    SEARCH: (
      category: string,
      checked: string,
      query: string,
      queryOnlyInSentense: string,
      queryOnlyInAnswer: string,
    ) => {
      return `
      SELECT
          id, 
          file_num, 
          quiz_num, 
          quiz_sentense, 
          answer, 
          clear_count, 
          fail_count, 
          img_file, 
          checked, 
          ROUND(accuracy_rate,1) AS accuracy_rate 
      FROM
          advanced_quiz_view
      WHERE
          file_num = ?
      AND accuracy_rate >= ? 
      AND accuracy_rate <= ? 
      AND deleted_at IS NULL 
      ${
        category && category !== ''
          ? ` AND category LIKE '%` + category + `%' `
          : ''
      }
      ${parseStrToBool(checked) ? ` AND checked = 1 ` : ''}
      ${
        query && query !== ''
          ? parseStrToBool(queryOnlyInSentense) &&
            !parseStrToBool(queryOnlyInAnswer)
            ? ` AND quiz_sentense LIKE '%${query || ''}%' `
            : !parseStrToBool(queryOnlyInSentense) &&
              parseStrToBool(queryOnlyInAnswer)
            ? ` AND answer LIKE '%${query || ''}%' `
            : ` AND (quiz_sentense LIKE '%${query || ''}%' OR answer LIKE '%${
                query || ''
              }%') `
          : ''
      }
      ORDER BY quiz_num
      ; 
    `;
    },
    DELETE: `
      UPDATE
          advanced_quiz
      SET
          quiz_sentense = concat(quiz_sentense,'(削除済-',DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'),')'),
          updated_at = NOW(), 
          deleted_at = NOW()
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
      ;
    `,
    DUMMY_CHOICE: {
      ADD: `
        INSERT INTO 
          dummy_choice (advanced_quiz_id,dummy_choice_sentense)
        VALUES(?,?)
      `,
    },
    EXPLANATION: {
      UPSERT: `
        INSERT INTO
          advanced_quiz_explanation
        (advanced_quiz_id,explanation)
        VALUES (?,?)
        ON DUPLICATE KEY UPDATE 
        explanation = ?,updated_at = NOW()
        ;
      `,
    },
    BASIC_LINKAGE: {
      GET: `
        SELECT
          basis_quiz_id
        FROM
          advanced_quiz as a
        INNER JOIN
          quiz_basis_advanced_linkage as b
        ON
          a.file_num = b.file_num
        AND a.id = b.advanced_quiz_id
        WHERE
          a.file_num = ?
          AND a.quiz_num = ?
        ;
      `,
    },
    FOUR_CHOICE: {
      GET: {
        DUMMY_CHOICE: `
          SELECT
            a.id,
            a.file_num,
            a.quiz_num,
            a.quiz_sentense,
            a.answer,
            a.img_file,
            a.checked,
            a.accuracy_rate,
            d.dummy_choice_sentense,
            e.explanation
          FROM
            advanced_quiz_view as a
          LEFT OUTER JOIN
            dummy_choice as d
          ON
            a.id = d.advanced_quiz_id
          LEFT OUTER JOIN
            advanced_quiz_explanation as e 
          ON
            a.id = e.advanced_quiz_id
          WHERE
            a.file_num = ?
            AND a.quiz_num = ? 
            AND a.advanced_quiz_type_id = 2
        `,
        BASIS_ADVANCED_LINK: `
          SELECT
            a.id,
            a.file_num,
            a.quiz_num,
            l.basis_quiz_id
          FROM
            advanced_quiz as a
          INNER JOIN
            quiz_basis_advanced_linkage as l
          ON
            a.id = l.advanced_quiz_id
          WHERE
            a.file_num = ?
            AND a.quiz_num = ?
            AND a.advanced_quiz_type_id = 2 
        `,
      },
      RANDOM: (checked?: string) => {
        return `
          SELECT 
            a.id,
            a.file_num,
            a.quiz_num,
            a.quiz_sentense,
            a.answer,
            a.img_file,
            a.checked,
            a.accuracy_rate,
            d.dummy_choice_sentense,
            e.explanation
          FROM 
          ( SELECT 
              id,
              file_num,
              quiz_num,
              quiz_sentense,
              answer,
              img_file,
              checked,
              accuracy_rate
            FROM 
            advanced_quiz_view 
          WHERE file_num = ? 
          AND advanced_quiz_type_id = 2 
          AND accuracy_rate >= ? 
          AND accuracy_rate <= ? 
          AND deleted_at IS NULL 
          ${parseStrToBool(checked) ? ` AND checked = 1 ` : ''}
          ORDER BY random() LIMIT 1 
          ) as a
            INNER JOIN
              dummy_choice as d
            ON
              a.id = d.advanced_quiz_id
            LEFT OUTER JOIN
              advanced_quiz_explanation as e 
            ON
              a.id = e.advanced_quiz_id
        ;
      `;
      },
      WORST: (checked?: string) => {
        return `
          SELECT 
            a.id,
            a.file_num,
            a.quiz_num,
            a.quiz_sentense,
            a.answer,
            a.img_file,
            a.checked,
            a.accuracy_rate,
            d.dummy_choice_sentense,
            e.explanation
          FROM 
          ( SELECT 
              id,
              file_num,
              quiz_num,
              quiz_sentense,
              answer,
              img_file,
              checked,
              accuracy_rate
            FROM 
            advanced_quiz_view 
          WHERE file_num = ? 
          AND advanced_quiz_type_id = 2 
          AND deleted_at IS NULL 
          ${parseStrToBool(checked) ? ` AND checked = 1 ` : ''}
          ORDER BY accuracy_rate LIMIT 1 
          ) as a
          INNER JOIN
            dummy_choice as d
          ON
            a.id = d.advanced_quiz_id
          LEFT OUTER JOIN
            advanced_quiz_explanation as e 
          ON
            a.id = e.advanced_quiz_id
          ;
        `;
      },
      MINIMUM: (checked?: string) => {
        return `
          SELECT 
            a.id,
            a.file_num,
            a.quiz_num,
            a.quiz_sentense,
            a.answer,
            a.img_file,
            a.checked,
            a.accuracy_rate,
            d.dummy_choice_sentense,
            e.explanation
          FROM 
          ( SELECT
              id,
              file_num,
              quiz_num,
              quiz_sentense,
              answer,
              img_file,
              checked,
              accuracy_rate
            FROM 
            advanced_quiz_view 
          WHERE file_num = ? 
          AND advanced_quiz_type_id = 2 
          AND deleted_at IS NULL 
          ${parseStrToBool(checked) ? ` AND checked = 1 ` : ''}
          ORDER BY (clear_count+fail_count),fail_count desc LIMIT 1 
          ) as a
          INNER JOIN
            dummy_choice as d
          ON
            a.id = d.advanced_quiz_id
          LEFT OUTER JOIN
            advanced_quiz_explanation as e 
          ON
            a.id = e.advanced_quiz_id
          ;
        `;
      },
      LRU: (file_num: number, checked?: string) => {
        return `
          SELECT 
            a.id,
            a.file_num,
            a.quiz_num,
            a.quiz_sentense,
            a.answer,
            a.img_file,
            a.checked,
            a.accuracy_rate,
            d.dummy_choice_sentense,
            e.explanation
          FROM 
          ( SELECT
              aqv.id,
              aqv.file_num,
              aqv.quiz_num,
              aqv.quiz_sentense,
              aqv.answer,
              aqv.img_file,
              aqv.checked,
              aqv.accuracy_rate 
            FROM 
            advanced_quiz_view aqv
            LEFT OUTER JOIN (
              SELECT
                quiz_format_id,
                file_num,
                quiz_num,
                MAX(updated_at)  as updated_at
              FROM answer_log al
              WHERE quiz_format_id = 3
              AND file_num = ${file_num}
              GROUP BY              		
                quiz_format_id,
                file_num,
                quiz_num
            ) l
            ON
              aqv.file_num = l.file_num              		
              AND aqv.quiz_num = l.quiz_num
            WHERE aqv.file_num = ${file_num}
            AND aqv.advanced_quiz_type_id = 2 
            ${parseStrToBool(checked) ? ` AND aqv.checked = 1 ` : ''}
            AND aqv.deleted_at IS NULL
            ORDER BY l.updated_at LIMIT 1
          ) as a
            INNER JOIN
              dummy_choice as d
            ON
              a.id = d.advanced_quiz_id
            LEFT OUTER JOIN
              advanced_quiz_explanation as e 
            ON
              a.id = e.advanced_quiz_id
          ;
        `;
      },
      REVIEW: (file_num: number, checked?: string) => {
        return `
          SELECT 
            a.id,
            a.file_num,
            a.quiz_num,
            a.quiz_sentense,
            a.answer,
            a.img_file,
            a.checked,
            a.accuracy_rate,
            d.dummy_choice_sentense,
            e.explanation
          FROM 
          ( SELECT
              aqv.id,
              aqv.file_num,
              aqv.quiz_num,
              aqv.quiz_sentense,
              aqv.answer,
              aqv.img_file,
              aqv.checked,
              aqv.accuracy_rate 
            FROM 
            advanced_quiz_view aqv
            INNER JOIN (
              SELECT DISTINCT
                quiz_format_id,
                file_num,
                quiz_num
              FROM answer_log al
              WHERE quiz_format_id = 3
              AND file_num = ${file_num}
              AND is_corrected = false
              AND CAST(created_at AS DATE) = CURRENT_DATE - INTERVAL '1 DAY'
            ) l
            ON
              aqv.file_num = l.file_num              		
              AND aqv.quiz_num = l.quiz_num
            WHERE aqv.file_num = ${file_num}
            AND aqv.advanced_quiz_type_id = 2 
            ${parseStrToBool(checked) ? ` AND aqv.checked = 1 ` : ''}
            AND aqv.deleted_at IS NULL
            ORDER BY random() LIMIT 1
          ) as a
            INNER JOIN
              dummy_choice as d
            ON
              a.id = d.advanced_quiz_id
            LEFT OUTER JOIN
              advanced_quiz_explanation as e 
            ON
              a.id = e.advanced_quiz_id
          ;
        `;
      },
      CLEARED: `
        INSERT INTO
          answer_log (
              quiz_format_id,
              file_num,
              quiz_num,
              is_corrected
          )
        VALUES (3, ?, ?, true);
      `,
      FAILED: `
        INSERT INTO
            answer_log (
                quiz_format_id,
                file_num,
                quiz_num,
                is_corrected
            )
        VALUES (3, ?, ?, false);
      `,
      EDIT: {
        ADVANCED_QUIZ: `
          UPDATE
              advanced_quiz
          SET
              quiz_sentense = ? ,
              answer = ? ,
              img_file = ? ,
              updated_at = NOW()
          WHERE 
              file_num = ? 
              AND quiz_num = ? 
              AND advanced_quiz_type_id = 2
          ;
        `,
        DUMMY_CHOICE: {
          UPDATE: `
            UPDATE
                dummy_choice
            SET
                dummy_choice_sentense = ? ,
                updated_at = NOW()
            WHERE 
                id = ?
            ;
          `,
          INSERT: `
            INSERT INTO
              dummy_choice
            (advanced_quiz_id,dummy_choice_sentense)
            VALUES (?,?)
            ;
          `,
          GET_DUMMY_CHOICE_ID: `
            SELECT
              id
            FROM
              dummy_choice
            WHERE
              advanced_quiz_id = ?
            ORDER BY
                id
            LIMIT 1 OFFSET ?
          `,
        },
      },
    },
  },
  CATEGORY: {
    INFO: `
      SELECT
          file_num,
          category
      FROM
          category
      WHERE
          file_num = ? 
          AND deleted_at IS NULL
      ORDER BY
          category;
    `,
    DELETE: `
      DELETE FROM 
          category
      WHERE
          file_num = ?;
    `,
    ADD: `
      INSERT INTO
          category(file_num, category)
      VALUES ? ;
    `,
    ACCURRACYRATE: `
      SELECT 
          file_num, 
          c_category,
          count,
          accuracy_rate 
      FROM 
          category_view 
      WHERE 
          file_num = ? 
      ORDER BY 
          accuracy_rate 
    `,
  },
  QUIZ_BASIS_ADVANCED_LINKAGE: {
    ADD: `
      INSERT INTO
        quiz_basis_advanced_linkage(
            file_num,
            basis_quiz_id,
            advanced_quiz_id
        )
      VALUES (?, ?, ?);
    `,
    DELETE: `
      DELETE FROM
        quiz_basis_advanced_linkage
      WHERE
        file_num = ?
        AND basis_quiz_id = ?
        AND advanced_quiz_id = ?
      ;
    `, // TODO DELETEでなくdeleted_atに設定する形にしたい
  },
  ENGLISH: {
    PARTOFSPEECH: {
      GET: {
        ALL: `
              SELECT
                  id,name
              FROM
                  partsofspeech
              WHERE
                  deleted_at IS NULL
              ORDER BY
                  id
              ;
            `,
        BYNAME: `
            SELECT
                id,name
            FROM
                partsofspeech
            WHERE
                name = ?
                AND deleted_at IS NULL
            ;
        `,
      },
      ADD: `
        INSERT INTO
          partsofspeech (name)
        VALUES(?)
        ;
      `,
    },
    SOURCE: {
      GET: {
        ALL: `
            SELECT
                id,name
            FROM
                source
            WHERE
                deleted_at IS NULL
            ORDER BY
                id
            ;
        `,
        BYNAME: `
            SELECT
                id,name
            FROM
                source
            WHERE
                name = ?
                AND deleted_at IS NULL
            ;
        `,
      },
      ADD: `
        INSERT INTO
          source (name)
        VALUES(?)
        ;
      `,
    },
    WORD: {
      ADD: `
        INSERT INTO
          word (name,pronounce)
        VALUES(?,?)
        ;
      `,
      SEARCH: (wordName: string, subSourceName?: string) => {
        return `
          SELECT 
            DISTINCT w.id,w.name,w.pronounce
          FROM 
            word w
          LEFT OUTER JOIN
            word_subsource ws
          ON
            w.id = ws.word_id
          WHERE
            w.name LIKE '%${wordName}%'
            ${
              subSourceName ? `AND ws.subsource LIKE '%${subSourceName}%' ` : ''
            }
            AND w.deleted_at IS NULL
          ORDER BY
            w.name, w.id
          LIMIT 200
          ;
        `;
      },
      GET: {
        ALL: `
          SELECT 
            id,name,pronounce
          FROM 
            word
          WHERE
            deleted_at IS NULL
          ;
        `,
        MAX_ID: `
          SELECT
            MAX(id) as id
          FROM
            word
          ;
        `,
        ID: `
          SELECT
            word.id as word_id,
            word.name as name,
            word.pronounce,
            mean.id as mean_id, 
            mean.wordmean_id,
            mean.meaning,
            partsofspeech.id as partsofspeech_id,
            partsofspeech.name as partsofspeech
          FROM
            word
          INNER JOIN
            mean
          ON
            word.id = mean.word_id
          INNER JOIN
            partsofspeech
          ON
            mean.partsofspeech_id = partsofspeech.id
          WHERE
            word.id = ?
            AND word.deleted_at IS NULL
          ;
        `,
        NAME: `
          SELECT
            word.id as word_id,
            word.name as name,
            word.pronounce,
            mean.id as mean_id, 
            mean.wordmean_id as wordmean_id,
            mean.meaning,
            partsofspeech.id as partsofspeech_id,
            partsofspeech.name as partsofspeech
          FROM
            word
          INNER JOIN
            mean
          ON
            word.id = mean.word_id
          INNER JOIN
            partsofspeech
          ON
            mean.partsofspeech_id = partsofspeech.id
          WHERE
            word.name = ?
            AND word.deleted_at IS NULL
          ;
        `,
        RANDOM: (sourceTemplate: string, subSourceTemplate: string) => {
          return `
            SELECT
              w.id,
              w.name
            FROM
              word w 
            INNER JOIN
              (
              SELECT 
                m.word_id
              FROM
                mean m 
              ${sourceTemplate}
              ${subSourceTemplate}
              GROUP BY m.word_id
              ORDER BY RANDOM() LIMIT 1) as random_word
            ON
              w.id = random_word.word_id;
        `;
        },
        SOURCE: `
          SELECT DISTINCT
            word.id as word_id,
            word.name as word_name,
            source.id as source_id,
            source.name as source_name
          FROM 
            word
          INNER JOIN
            mean
          ON
            word.id = mean.word_id
          INNER JOIN
            mean_source
          ON
            mean.id = mean_source.mean_id
          INNER JOIN
            source
          ON
            mean_source.source_id = source.id
          WHERE
            word.id = ?
            AND word.deleted_at IS NULL
          ;
        `,
        SUBSOURCE: `
          SELECT
            subsource
          FROM
            word_subsource
          WHERE
            word_id = ?
            AND deleted_at IS NULL
          ;
        `,
      },
      SUBSOURCE: {
        ADD: `
          INSERT INTO
            word_subsource (word_id,subsource)
          VALUES(?,?)
          ;
        `,
      },
      SUMMARY: {
        GET: `
          SELECT
            name,count
          FROM
            word_summarize
          ;
        `,
      },
    },
    MEAN: {
      GET: {
        MAX_ID: `
          SELECT
            MAX(id) as id
          FROM
            mean
          ;
        `,
        BY_WORD_ID: `
          SELECT
            id,
            word_id,
            wordmean_id,
            partsofspeech_id,
            meaning
          FROM
            mean
          WHERE
            word_id = ?
          ORDER BY RANDOM()
          LIMIT 1
          ;
        `,
        BY_NOT_WORD_ID: `
          SELECT
            id,
            word_id,
            wordmean_id,
            partsofspeech_id,
            meaning
          FROM
            mean
          WHERE
            word_id <> ?
          ORDER BY RANDOM()
          LIMIT 3
          ;
        `,
      },
      ADD: `
        INSERT INTO
          mean (word_id,wordmean_id,partsofspeech_id,meaning)
        VALUES(?,?,?,?)
        ;
      `,
      EDIT: `
        UPDATE
            mean
        SET
            partsofspeech_id = ?,
            meaning = ?,
            updated_at = NOW()
        WHERE 
            word_id = ? 
            AND wordmean_id = ?  
      `,
      SOURCE: {
        ADD: `
          INSERT INTO
            mean_source (mean_id,source_id)
          VALUES(?,?)
          ;
        `,
        EDIT: `
          UPDATE
            mean_source
          SET
            source_id = ?,
            updated_at = NOW()
          WHERE
            mean_id = ?
            AND source_id = ?
          ;
        `,
      },
      EXAMPLE: {
        ADD: `
          INSERT INTO
            mean_example (example_sentense_id, mean_id)
          VALUES(?,?)
          ;
        `,
      },
    },
    EXAMPLE: {
      GET: {
        MAX_ID: `
          SELECT
            MAX(id) as id
          FROM
            example
          ;
        `,
      },
      ADD: `
        INSERT INTO
          example (en_example_sentense,ja_example_sentense)
        VALUES(?,?)
        ;
      `,
    },
    WORD_TEST: {
      CLEARED: {
        INPUT: `
          INSERT INTO 
            englishbot_answer_log 
          (word_id, result) VALUES (?,true);
        `,
      },
      FAILED: {
        INPUT: `
          INSERT INTO 
            englishbot_answer_log 
          (word_id, result) VALUES (?,false);
        `,
      },
    },
  },
  SAYING: {
    ADD: `
      INSERT INTO
        saying (book_id,book_saying_id,saying,explanation)
      VALUES(?,?,?,?)
    `,
    GET: {
      RANDOM: {
        ALL: `
          SELECT
            s.saying,
            s.explanation,
            b.name
          FROM
            saying s
          INNER JOIN
            selfhelp_book b
          ON
            s.book_id = b.id
          WHERE
            s.deleted_at IS NULL
          AND b.deleted_at IS NULL
          ORDER BY RANDOM()
          LIMIT 1
          ;
        `,
        BYBOOK: `
          SELECT
            s.saying,
            s.explanation,
            b.name
          FROM
            saying s
          INNER JOIN
            selfhelp_book b
          ON
            s.book_id = b.id
          WHERE
            s.deleted_at IS NULL
            AND b.deleted_at IS NULL
          ORDER BY RANDOM()
          LIMIT 1
          ;
        `,
      },
      ID: {
        BYBOOK: `
          SELECT
            MAX(book_saying_id) as book_saying_id
          FROM
            saying
          WHERE
            book_id = ?
          GROUP BY
            book_id
          ;
        `,
      },
      BYID: `
        SELECT
          saying,
          explanation
        FROM
          saying
        WHERE
          id = ?
          AND deleted_at IS NULL
        ;
      `,
      SEARCH: (saying: string) => {
        return `
          SELECT
            s.id,
            s.saying,
            s.explanation,
            b.name
          FROM
            saying s
          INNER JOIN
            selfhelp_book b
          ON
            s.book_id = b.id
          WHERE
            s.saying LIKE '%${saying || ''}%'
          AND s.deleted_at IS NULL
          AND b.deleted_at IS NULL
          ;
        `;
      },
    },
    EDIT: `
      UPDATE
        saying
      SET
          saying = ?,
          explanation = ?,
          updated_at = NOW()
      WHERE 
          id = ? 
    `,
  },
  SELFHELP_BOOK: {
    ADD: `
      INSERT INTO
        selfhelp_book (name)
      VALUES(?)
      ;
    `,
    GET: {
      ALL: `
        SELECT
          id,name
        FROM
          selfhelp_book
        WHERE
          deleted_at IS NULL
        ORDER BY
          id
        ;
      `,
    },
  },
};
