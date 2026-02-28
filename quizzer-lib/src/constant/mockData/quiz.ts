export const quizFileMockData = [
    {
        "file_num": 1,
        "file_name": "プログラミング基礎問題集",
        "file_nickname": "プログラミング基礎問題集",
        "created_at": "2024-01-01T00:00:00Z"
    },
    {
        "file_num": 2,
        "file_name": "AWS認定試験対策",
        "file_nickname": "AWS認定試験対策",
        "created_at": "2024-01-02T00:00:00Z"
    },
    {
        "file_num": 3,
        "file_name": "データベース設計",
        "file_nickname": "データベース設計",
        "created_at": "2024-01-03T00:00:00Z"
    }
]

export const quizFormatMockData = [
    {
        "id": 1,
        "name": "基礎問題"
    },
    {
        "id": 2,
        "name": "応用問題"
    },
    {
        "id": 3,
        "name": "四択問題"
    }
]

export const quizMockData = [
    {
        "id": 1,
        "file_num": 1,
        "quiz_num": 1,
        "quiz_sentense": "JavaScriptで変数を宣言する際に使用するキーワードはどれか？",
        "answer": "let, const, var",
        "img_file": null,
        "checked": false,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "deleted_at": null,
        "format_id": 1
    },
    {
        "id": 2,
        "file_num": 1,
        "quiz_num": 2,
        "quiz_sentense": "配列の要素を順番に処理するメソッドはどれか？",
        "answer": "forEach",
        "img_file": null,
        "checked": false,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "deleted_at": null,
        "format_id": 3
    },
    {
        "id": 3,
        "file_num": 1,
        "quiz_num": 3,
        "quiz_sentense": "非同期処理を実現するPromiseの状態はどれか？",
        "answer": "pending, fulfilled, rejected",
        "img_file": null,
        "checked": true,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "deleted_at": null,
        "format_id": 2
    },
    {
        "id": 4,
        "file_num": 2,
        "quiz_num": 1,
        "quiz_sentense": "AWSの主要なコンピューティングサービスはどれか？",
        "answer": "EC2",
        "img_file": null,
        "checked": false,
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z",
        "deleted_at": null,
        "format_id": 3
    },
    {
        "id": 5,
        "file_num": 2,
        "quiz_num": 2,
        "quiz_sentense": "S3のストレージクラスで最も低コストなのはどれか？",
        "answer": "S3 Glacier",
        "img_file": null,
        "checked": false,
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z",
        "deleted_at": null,
        "format_id": 3
    },
    {
        "id": 6,
        "file_num": 2,
        "quiz_num": 3,
        "quiz_sentense": "VPCのセキュリティグループとNACLの違いを説明せよ",
        "answer": "セキュリティグループはステートフル、NACLはステートレス",
        "img_file": null,
        "checked": true,
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z",
        "deleted_at": null,
        "format_id": 2
    },
    {
        "id": 7,
        "file_num": 3,
        "quiz_num": 1,
        "quiz_sentense": "リレーショナルデータベースの正規化の目的は何か？",
        "answer": "データの重複を排除し、整合性を保つ",
        "img_file": null,
        "checked": false,
        "created_at": "2024-01-03T00:00:00Z",
        "updated_at": "2024-01-03T00:00:00Z",
        "deleted_at": null,
        "format_id": 1
    },
    {
        "id": 8,
        "file_num": 3,
        "quiz_num": 2,
        "quiz_sentense": "SQLのJOINの種類で、両方のテーブルの一致する行のみを返すのはどれか？",
        "answer": "INNER JOIN",
        "img_file": null,
        "checked": false,
        "created_at": "2024-01-03T00:00:00Z",
        "updated_at": "2024-01-03T00:00:00Z",
        "deleted_at": null,
        "format_id": 3
    }
]

export const quizCategoryMockData = [
    {
        "id": 1,
        "category": "JavaScript",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "deleted_at": null,
        "quiz_id": 1
    },
    {
        "id": 2,
        "category": "JavaScript",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "deleted_at": null,
        "quiz_id": 2
    },
    {
        "id": 3,
        "category": "非同期処理",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "deleted_at": null,
        "quiz_id": 2
    },
    {
        "id": 4,
        "category": "Promise",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "deleted_at": null,
        "quiz_id": 3
    },
    {
        "id": 5,
        "category": "AWS",
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z",
        "deleted_at": null,
        "quiz_id": 4
    },
    {
        "id": 6,
        "category": "コンピューティング",
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z",
        "deleted_at": null,
        "quiz_id": 4
    },
    {
        "id": 7,
        "category": "AWS",
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z",
        "deleted_at": null,
        "quiz_id": 5
    },
    {
        "id": 8,
        "category": "ストレージ",
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z",
        "deleted_at": null,
        "quiz_id": 5
    },
    {
        "id": 9,
        "category": "AWS",
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z",
        "deleted_at": null,
        "quiz_id": 6
    },
    {
        "id": 10,
        "category": "ネットワーク",
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z",
        "deleted_at": null,
        "quiz_id": 6
    },
    {
        "id": 11,
        "category": "データベース",
        "created_at": "2024-01-03T00:00:00Z",
        "updated_at": "2024-01-03T00:00:00Z",
        "deleted_at": null,
        "quiz_id": 7
    },
    {
        "id": 12,
        "category": "正規化",
        "created_at": "2024-01-03T00:00:00Z",
        "updated_at": "2024-01-03T00:00:00Z",
        "deleted_at": null,
        "quiz_id": 7
    },
    {
        "id": 13,
        "category": "データベース",
        "created_at": "2024-01-03T00:00:00Z",
        "updated_at": "2024-01-03T00:00:00Z",
        "deleted_at": null,
        "quiz_id": 8
    },
    {
        "id": 14,
        "category": "SQL",
        "created_at": "2024-01-03T00:00:00Z",
        "updated_at": "2024-01-03T00:00:00Z",
        "deleted_at": null,
        "quiz_id": 8
    }
]

export const quizDependencyMockData = [
    {
        "id": 1,
        "preliminary_quiz_id": 1,
        "quiz_id": 2,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "deleted_at": null
    },
    {
        "id": 2,
        "preliminary_quiz_id": 2,
        "quiz_id": 3,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "deleted_at": null
    },
    {
        "id": 3,
        "preliminary_quiz_id": 4,
        "quiz_id": 5,
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z",
        "deleted_at": null
    },
    {
        "id": 4,
        "preliminary_quiz_id": 7,
        "quiz_id": 8,
        "created_at": "2024-01-03T00:00:00Z",
        "updated_at": "2024-01-03T00:00:00Z",
        "deleted_at": null
    }
]

export const quizDummyChoiceMockData = [
    {
        "id": 1,
        "quiz_id": 2,
        "dummy_choice_sentense": "map",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "deleted_at": null,
        "is_corrected": false
    },
    {
        "id": 2,
        "quiz_id": 2,
        "dummy_choice_sentense": "filter",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "deleted_at": null,
        "is_corrected": false
    },
    {
        "id": 3,
        "quiz_id": 2,
        "dummy_choice_sentense": "reduce",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "deleted_at": null,
        "is_corrected": false
    },
    {
        "id": 4,
        "quiz_id": 4,
        "dummy_choice_sentense": "S3",
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z",
        "deleted_at": null,
        "is_corrected": false
    },
    {
        "id": 5,
        "quiz_id": 4,
        "dummy_choice_sentense": "Lambda",
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z",
        "deleted_at": null,
        "is_corrected": false
    },
    {
        "id": 6,
        "quiz_id": 4,
        "dummy_choice_sentense": "RDS",
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z",
        "deleted_at": null,
        "is_corrected": false
    },
    {
        "id": 7,
        "quiz_id": 5,
        "dummy_choice_sentense": "S3 Standard",
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z",
        "deleted_at": null,
        "is_corrected": false
    },
    {
        "id": 8,
        "quiz_id": 5,
        "dummy_choice_sentense": "S3 Intelligent-Tiering",
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z",
        "deleted_at": null,
        "is_corrected": false
    },
    {
        "id": 9,
        "quiz_id": 5,
        "dummy_choice_sentense": "S3 One Zone-IA",
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z",
        "deleted_at": null,
        "is_corrected": false
    },
    {
        "id": 10,
        "quiz_id": 8,
        "dummy_choice_sentense": "LEFT JOIN",
        "created_at": "2024-01-03T00:00:00Z",
        "updated_at": "2024-01-03T00:00:00Z",
        "deleted_at": null,
        "is_corrected": false
    },
    {
        "id": 11,
        "quiz_id": 8,
        "dummy_choice_sentense": "RIGHT JOIN",
        "created_at": "2024-01-03T00:00:00Z",
        "updated_at": "2024-01-03T00:00:00Z",
        "deleted_at": null,
        "is_corrected": false
    },
    {
        "id": 12,
        "quiz_id": 8,
        "dummy_choice_sentense": "FULL OUTER JOIN",
        "created_at": "2024-01-03T00:00:00Z",
        "updated_at": "2024-01-03T00:00:00Z",
        "deleted_at": null,
        "is_corrected": false
    }
]

export const quizExplanationMockData = [
    {
        "id": 1,
        "quiz_id": 1,
        "explanation": "JavaScriptでは、let、const、varの3つのキーワードで変数を宣言できます。letとconstはES6で導入され、varは従来の方法です。letは再代入可能、constは再代入不可、varは関数スコープを持ちます。",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "deleted_at": null
    },
    {
        "id": 2,
        "quiz_id": 3,
        "explanation": "Promiseには3つの状態があります。pending（待機中）、fulfilled（成功）、rejected（失敗）です。Promiseは非同期処理の結果を表現するオブジェクトで、これらの状態のいずれかになります。",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "deleted_at": null
    },
    {
        "id": 3,
        "quiz_id": 4,
        "explanation": "EC2（Elastic Compute Cloud）は、AWSの主要なコンピューティングサービスです。仮想サーバーを提供し、様々なインスタンスタイプから選択できます。スケーラブルで柔軟なコンピューティングリソースを提供します。",
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z",
        "deleted_at": null
    },
    {
        "id": 4,
        "quiz_id": 6,
        "explanation": "セキュリティグループはステートフルで、戻りトラフィックを自動的に許可します。一方、NACL（Network Access Control List）はステートレスで、明示的に許可する必要があります。セキュリティグループはインスタンスレベル、NACLはサブネットレベルで動作します。",
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z",
        "deleted_at": null
    },
    {
        "id": 5,
        "quiz_id": 7,
        "explanation": "正規化は、データベース設計においてデータの重複を排除し、データの整合性を保つための手法です。第1正規形から第5正規形まであり、段階的にデータを整理していきます。これにより、更新の不整合やストレージの無駄を防ぎます。",
        "created_at": "2024-01-03T00:00:00Z",
        "updated_at": "2024-01-03T00:00:00Z",
        "deleted_at": null
    },
    {
        "id": 6,
        "quiz_id": 8,
        "explanation": "INNER JOINは、両方のテーブルで一致する行のみを返します。LEFT JOINは左側のテーブルのすべての行を返し、RIGHT JOINは右側のテーブルのすべての行を返します。FULL OUTER JOINは両方のテーブルのすべての行を返します。",
        "created_at": "2024-01-03T00:00:00Z",
        "updated_at": "2024-01-03T00:00:00Z",
        "deleted_at": null
    }
]
