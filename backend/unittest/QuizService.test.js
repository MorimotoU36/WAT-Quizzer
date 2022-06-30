require('iconv-lite').encodingExists('foo');

const testCommon = require('./TestCommon');
const QuizService = require('../services/QuizService');

// 何かひとつ問題を追加するテスト
test('Add 1 Quiz.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,"addQuizテスト問題,addQuizテスト答え,addQuizテストカテゴリ,addQuizテスト画像");

    // 問題取得
    let data = await testCommon.getAllQuizOfFileService(0);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(1);
    expect(data[0].quiz_sentense).toBe('addQuizテスト問題');
    expect(data[0].answer).toBe('addQuizテスト答え');
    expect(data[0].clear_count).toBe(0);
    expect(data[0].fail_count).toBe(0);
    expect(data[0].category).toBe('addQuizテストカテゴリ');
    expect(data[0].img_file).toBe('addQuizテスト画像');
    expect(data[0].checked).toBe(0);
    expect(data[0].deleted).toBe(0);
});

let add_fivequizs = `addQuizテスト問題1,addQuizテスト答え1,addQuizテストカテゴリ1,addQuizテスト画像1
addQuizテスト問題2,addQuizテスト答え2,addQuizテストカテゴリ2,addQuizテスト画像2
addQuizテスト問題3,addQuizテスト答え3,addQuizテストカテゴリ3,addQuizテスト画像3
addQuizテスト問題4,addQuizテスト答え4,addQuizテストカテゴリ4,addQuizテスト画像4
addQuizテスト問題5,addQuizテスト答え5,addQuizテストカテゴリ5,addQuizテスト画像5`;

// 5つ問題を追加するテスト
test('Add 5 Quiz.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,add_fivequizs);

    // 問題取得
    let data = await testCommon.getAllQuizOfFileService(0);

    // 確認
    expect(data.length).toBe(5);
    for(var i=0;i<data.length;i++){
        expect(data[i].file_num).toBe(0);
        expect(data[i].quiz_num).toBe(i+1);    
        expect(data[i].quiz_sentense).toBe('addQuizテスト問題'+(i+1));
        expect(data[i].answer).toBe('addQuizテスト答え'+(i+1));
        expect(data[i].clear_count).toBe(0);
        expect(data[i].fail_count).toBe(0);
        expect(data[i].category).toBe('addQuizテストカテゴリ'+(i+1));
        expect(data[i].img_file).toBe('addQuizテスト画像'+(i+1));
        expect(data[i].checked).toBe(0);
        expect(data[i].deleted).toBe(0);
    }
});

// 問題を取得するテスト
test('Get 1 Quiz.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,"getQuizテスト問題,getQuizテスト答え,getQuizテストカテゴリ,getQuizテスト画像");

    // 問題取得
    let data = await QuizService.getQuiz(0,1);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(1);
    expect(data[0].quiz_sentense).toBe('getQuizテスト問題');
    expect(data[0].answer).toBe('getQuizテスト答え');
    expect(data[0].clear_count).toBe(0);
    expect(data[0].fail_count).toBe(0);
    expect(data[0].category).toBe('getQuizテストカテゴリ');
    expect(data[0].img_file).toBe('getQuizテスト画像');
    expect(data[0].checked).toBe(0);
    expect(data[0].deleted).toBe(0);
});

// 1つの問題からランダムに問題を取得するテスト
test('Random Get 1 of 1 Quiz.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,"getQuizテスト問題,getQuizテスト答え,getQuizテストカテゴリ,getQuizテスト画像");

    // 問題取得
    let data = await QuizService.getRandomQuiz(0,0,100,null,false);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    expect(data[0].quiz_num).toBe(1);
    expect(data[0].quiz_sentense).toBe('getQuizテスト問題');
    expect(data[0].answer).toBe('getQuizテスト答え');
    expect(data[0].clear_count).toBe(0);
    expect(data[0].fail_count).toBe(0);
    expect(data[0].category).toBe('getQuizテストカテゴリ');
    expect(data[0].img_file).toBe('getQuizテスト画像');
    expect(data[0].checked).toBe(0);
    expect(data[0].deleted).toBe(0);
});

// 5つの問題からランダムに問題を取得するテスト
test('Random Get 1 of 5 Quiz.',async () => {

    // まず全消し
    let result = await testCommon.deleteAllQuizOfFile(0);

    // 問題追加
    result = await QuizService.addQuiz(0,add_fivequizs);

    // 問題取得
    let data = await QuizService.getRandomQuiz(0,0,100,null,false);

    // 確認
    expect(data.length).toBe(1);
    expect(data[0].file_num).toBe(0);
    // expect(data[0].quiz_num).toBe(1);
    // expect(data[0].quiz_sentense).toBe('addQuizテスト問題');
    // expect(data[0].answer).toBe('addQuizテスト答え');
    expect(data[0].clear_count).toBe(0);
    expect(data[0].fail_count).toBe(0);
    // expect(data[0].category).toBe('addQuizテストカテゴリ');
    // expect(data[0].img_file).toBe('addQuizテスト画像');
    expect(data[0].checked).toBe(0);
    expect(data[0].deleted).toBe(0);
});