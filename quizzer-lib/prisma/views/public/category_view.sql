SELECT
  q.file_num,
  qc.category,
  count(*) AS count,
  sum(qv.clear_count) AS sum_of_clear_count,
  sum(qv.fail_count) AS sum_of_fail_count,
  CASE
    WHEN (
      (sum(qv.clear_count) + sum(qv.fail_count)) = (0) :: numeric
    ) THEN (0) :: numeric
    ELSE (
      ((100) :: numeric * sum(qv.clear_count)) / (sum(qv.clear_count) + sum(qv.fail_count))
    )
  END AS accuracy_rate
FROM
  (
    (
      quiz q
      JOIN quiz_category qc ON (
        (
          (q.id = qc.quiz_id)
          AND (q.deleted_at IS NULL)
          AND (qc.deleted_at IS NULL)
        )
      )
    )
    JOIN quiz_view qv ON (
      (
        (q.id = qv.id)
        AND (qv.deleted_at IS NULL)
      )
    )
  )
GROUP BY
  q.file_num,
  qc.category
ORDER BY
  q.file_num,
  qc.category;