import express from 'express';
const router = express.Router()

import { getBackendLogger } from "../common/Logger";
const logger = getBackendLogger()

import { getQuizFileListService } from "../services/QuizFileService";
import { getAccuracyRateByCategoryService, getCategoryListService, replaceAllCategoryService } from "../services/CategoryService";
import QuizService from "../services/QuizService";
import S3Service from "../aws/S3Service";

import PartsofSpeechService from "../services/english/PartsofSpeechService";
import WordService from "../services/english/WordService";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Welcome to Quizzer!!")
})

router.get("/namelist", function (req, res) {
  getQuizFileListService()
    .then((result:any) => {
      logger.debug("/namelist")
      res.status(200).send(result)
    })
    .catch((error:any) => {
      logger.error("/namelist")
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post("/get_category", function (req, res) {
  getCategoryListService(req.body.file_num)
    .then((result:any) => {
      logger.debug("/get_category")
      res.status(200).send(result)
    })
    .catch((error:any) => {
      logger.error("/get_category")
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post("/get_quiz", function (req, res) {
  QuizService.getQuiz(req.body.file_num, req.body.quiz_num)
    .then((result:any) => {
      if (result.length > 0) {
        logger.debug("/get_quiz")
        res.status(200).send(result)
      } else {
        logger.error("/get_quiz")
        logger.error("404 Not Found")
        res.status(404).send(result)
      }
    })
    .catch((error:any) => {
      res.status(500).send(error)
      logger.error(error)
    })
})

router.post("/random", function (req, res) {
  QuizService.getRandomQuiz(
    req.body.file_num,
    req.body.min_rate,
    req.body.max_rate,
    req.body.category,
    req.body.checked
  )
    .then((result:any) => {
      if (result.length > 0) {
        logger.debug("/random")
        res.status(200).send(result)
      } else {
        logger.error("/random")
        logger.error("404 Not Found")
        res.status(404).send(result)
      }
    })
    .catch((error:any) => {
      res.status(500).send(error)
      logger.error(error)
    })
})

router.post("/worst_rate", function (req, res) {
  QuizService.getWorstRateQuiz(
    req.body.file_num,
    req.body.category,
    req.body.checked
  )
    .then((result:any) => {
      if (result.length > 0) {
        logger.debug("/worst_rate")
        res.status(200).send(result)
      } else {
        logger.info("/worst_rate")
        res.status(404).send(result)
      }
    })
    .catch((error:any) => {
      logger.error("/worst_rate")
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post("/minimum_clear", function (req, res) {
  QuizService.getMinimumClearQuiz(
    req.body.file_num,
    req.body.category,
    req.body.checked
  )
    .then((result:any) => {
      if (result.length > 0) {
        logger.debug("/minimum_clear")
        res.status(200).send(result)
      } else {
        logger.info("/minimum_clear")
        res.status(404).send(result)
      }
    })
    .catch((error:any) => {
      logger.error("/minimum_clear")
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post("/correct", function (req, res) {
  QuizService.correctRegister(req.body.file_num, req.body.quiz_num)
    .then((result:any) => {
      logger.debug("/correct")
      res.status(200).send(result)
    })
    .catch((error:any) => {
      logger.error("/correct")
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post("/incorrect", function (req, res) {
  QuizService.incorrectRegister(req.body.file_num, req.body.quiz_num)
    .then((result:any) => {
      logger.debug("/incorrect")
      res.status(200).send(result)
    })
    .catch((error:any) => {
      logger.error("/incorrect")
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post("/add", function (req, res) {
  QuizService.addQuiz(req.body.file_num, req.body.data)
    .then((result:any) => {
      logger.debug("/add")
      res.status(200).send(result)
    })
    .catch((error:any) => {
      logger.error("/add")
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post("/edit", function (req, res) {
  QuizService.editQuiz(
    req.body.file_num,
    req.body.quiz_num,
    req.body.question,
    req.body.answer,
    req.body.category,
    req.body.img_file
  )
    .then((result:any) => {
      logger.debug("/edit")
      res.status(200).send(result)
    })
    .catch((error:any) => {
      logger.error("/edit")
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post("/search", function (req, res) {
  QuizService.searchQuiz(
    req.body.file_num,
    req.body.min_rate,
    req.body.max_rate,
    req.body.category,
    req.body.checked,
    req.body.query,
    req.body.cond
  )
    .then((result:any) => {
      if (result.length > 0) {
        logger.debug("/search")
        res.status(200).send(result)
      } else {
        logger.error("/search")
        logger.error("404 Not Found")
        res.status(404).send(result)
      }
    })
    .catch((error:any) => {
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post("/delete", function (req, res) {
  QuizService.deleteQuiz(req.body.file_num, req.body.quiz_num)
    .then((result:any) => {
      logger.debug("/delete")
      res.status(200).send(result)
    })
    .catch((error:any) => {
      logger.error("/delete")
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post("/integrate", function (req, res) {
  QuizService.integrateQuiz(
    req.body.pre_file_num,
    req.body.pre_quiz_num,
    req.body.post_file_num,
    req.body.post_quiz_num
  )
    .then((result:any) => {
      logger.debug("/integrate")
      res.status(200).send(result)
    })
    .catch((error:any) => {
      logger.error("/integrate")
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post("/category/renewal", function (req, res) {
  replaceAllCategoryService(req.body.file_num)
    .then((result:any) => {
      logger.debug("/category/renewal")
      res.status(200).send(result)
    })
    .catch((error:any) => {
      logger.error("/category/renewal")
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post("/category/accuracy_rate", function (req, res) {
  getAccuracyRateByCategoryService(req.body.file_num)
    .then((result:any) => {
      logger.debug("/category/accuracy_rate")
      res.status(200).send(result)
    })
    .catch((error:any) => {
      logger.error("/category/accuracy_rate")
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post("/upload", (req, res) => {
  S3Service.upload(req.body.params)
    .then((url:any) => {
      logger.debug("/upload")
      res.json({ url: url })
    })
    .catch((error:any) => {
      logger.error("/upload")
      logger.error(error)
    })
})

/////////////////
//以下は英語版
/////////////////

router.get("/english/partsofspeech", function (req, res) {
  PartsofSpeechService.getPartsofSpeech()
    .then((result:any) => {
      logger.debug("/english/partsofspeech")
      res.status(200).send(result)
    })
    .catch((error:any) => {
      logger.error("/english/partsofspeech")
      logger.error(error)
      res.status(500).send(error)
    })
})

// meanArrayData: [
//  {
//    partOfSpeechId: 品詞ID(number)
//    meaning: 意味(string)
//  }
//  ・・・
// ]
router.post("/english/word/add", function (req, res) {
  WordService.addWordAndMean(
    req.body.wordName,
    req.body.pronounce,
    req.body.meanArrayData
  )
    .then((result:any) => {
      logger.debug("/english/word/add")
      res.status(200).send(result)
    })
    .catch((error:any) => {
      logger.error("/english/word/add")
      logger.error(error)
      res.status(500).send(error)
    })
})

// 単語検索
/**リクエストデータ
 * {
 *  wordName: 単語名
 * }
 */
router.post("/english/word/search", function (req, res) {
  WordService.searchWord(req.body.wordName)
    .then((result:any) => {
      logger.debug("/english/word/search")
      res.status(200).send(result)
    })
    .catch((error:any) => {
      logger.error("/english/word/search")
      logger.error(error)
      res.status(500).send(error)
    })
})

// 単語意味取得
/**リクエストデータ
 * {
 *  wordName: 単語名
 * }
 */
router.post("/english/word/mean", function (req, res) {
  WordService.getWordMean(req.body.wordName)
    .then((result:any) => {
      logger.debug("/english/word/mean")
      res.status(200).send(result)
    })
    .catch((error:any) => {
      logger.error("/english/word/mean")
      logger.error(error)
      res.status(500).send(error)
    })
})

module.exports = router
