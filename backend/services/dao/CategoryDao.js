const database = require('../../common/Database');

// SQL 
const getCategoryByFileSQL = `
    SELECT
        *
    FROM
        category
    WHERE
        file_num = ? 
    ORDER BY
        category;
`

// 問題ファイルリスト取得
const getCategoryList = async (file_num) => {
    try{
        let data = await database.execQuery(getCategoryByFileSQL,[file_num]);
        return data
    }catch(error){
        throw error;
    }
}

// カテゴリ全削除SQL
const deleteAllCategorySQL = `
    DELETE FROM 
        category
    WHERE
        file_num = ?;
`

// 問題ファイルからカテゴリを取得
const getDistinctCategoryByFileSQL = `
    SELECT DISTINCT
        category
    FROM
        quiz
    WHERE
        file_num = ? 
    ;
`

// カテゴリ挿入SQL（バルクインサート）
const insertCategoriesSQL = `
    INSERT INTO
        category(file_num, category)
    VALUES ? ;
`

// カテゴリ総入れ替え
const replaceAllCategory = async (file_num) => {
    try{
        //まずカテゴリを全削除
        let data = await database.execQuery(deleteAllCategorySQL,[file_num]);

        //指定ファイルのカテゴリ取得
        let results = await database.execQuery(getDistinctCategoryByFileSQL,[file_num]);

        //カテゴリデータ作成
        let categories = new Set([])
        for(var i=0;i<results.length;i++){
            let result_i = new Set(results[i]['category'].split(':'))
            categories = new Set([...result_i, ...categories])
        }
        categories = Array.from(categories)
        data=[]
        for(var i=0;i<categories.length;i++){
            data.push([file_num,categories[i]])
        }

        //カテゴリデータ全挿入
        let result = await database.execQuery(insertCategoriesSQL,[data]);

        return result
    }catch(error){
        throw error;
    }
}

// カテゴリビューからカテゴリ正解率取得SQL
const getAccuracyRateByCategorySQL = `
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
`

// 指定ファイルのチェック済問題の正解率取得SQL
const getAccuracyRateOfCheckedQuizSQL = `
    SELECT 
        checked, 
        count(*) as count, 
        SUM(clear_count) as sum_clear, 
        SUM(fail_count) as sum_fail, 
        ( 100 * SUM(clear_count) / ( SUM(clear_count) + SUM(fail_count) ) ) as accuracy_rate 
    FROM 
        quiz 
    where 
        file_num = ? 
        and checked = 1 
        and deleted != 1 
    group by checked;
`

// カテゴリ正解率取得
const getAccuracyRateByCategory = async (file_num) => {
    try{
        let result = {
            "result": [],
            "checked_result": []
        }

        // カテゴリビューから指定ファイルのカテゴリ毎の正解率取得
        result["result"] = await database.execQuery(getAccuracyRateByCategorySQL,[file_num]);

        // チェック済問題の正解率取得
        result["checked_result"] = await database.execQuery(getAccuracyRateOfCheckedQuizSQL,[file_num]);

        return result;
    }catch(error){
        throw error;
    }
}

module.exports = {
    getCategoryList,
    replaceAllCategory,
    getAccuracyRateByCategory,
}
