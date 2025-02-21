SELECT
  s.id,
  s.name,
  sum(wsv.clear_count) AS clear_count,
  sum(wsv.fail_count) AS fail_count,
  count(*) AS count,
  count(
    CASE
      WHEN (wsv.last_answer_log IS NULL) THEN 1
      ELSE NULL :: integer
    END
  ) AS not_answered,
  CASE
    WHEN (
      (
        COALESCE(sum(wsv.clear_count), (0) :: numeric) + COALESCE(sum(wsv.fail_count), (0) :: numeric)
      ) = (0) :: numeric
    ) THEN (0) :: numeric
    ELSE (
      (
        (100) :: numeric * COALESCE(sum(wsv.clear_count), (0) :: numeric)
      ) / (
        COALESCE(sum(wsv.clear_count), (0) :: numeric) + COALESCE(sum(wsv.fail_count), (0) :: numeric)
      )
    )
  END AS accuracy_rate
FROM
  (
    (
      source s
      JOIN word_source ws ON ((s.id = ws.source_id))
    )
    JOIN word_statistics_view wsv ON ((ws.word_id = wsv.id))
  )
GROUP BY
  s.id,
  s.name
ORDER BY
  s.id;