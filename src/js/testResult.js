import '../css/testResult.scss'
import '../css/initialize.css'
import $ from 'jquery'
import ajax from '../js/utils/ajax'

$(function () {
  let wrongAnswer = [];
  let rightAnswer = [];


  init();

  function init() {

    let query = getQuery();
    console.log(query);
    setInfo(query);
  }


  function getQuery() {
    //获取url地址中的参数，以对象的形式保存到query中
    let url = window.location.href;
    let query = {}
    url = decodeURI(url.split('?')[1])
    url = url.split('&')
    for (let i = 0; i < url.length; i++) {
      let urlArray = url[i].split('=');
      query[urlArray[0]] = urlArray[1]
    }
    return query
  }

  async function setInfo(query) {
    const result = await ajax({
      url: 'http://127.0.0.1/api/getTested',
      type: 'get',
      data: query
    })
    // console.log(result);
    if (result.flag) {
      $("#testsType").html(result.data.testsType);
      $("#score").html(result.data.score);
      $("#testeScore").html(result.data.testeScore);
      $("#time").html(result.data.time);
    }

    //获取正确答案保存到rightAnswer
    getRigthAnswer(result)
    //获取错误的答案保存到wrongAnswer
    getWrongAnswer(result)

    wrongAnswer.forEach((item) => {
      console.log(query);
      $.ajax({
        url: 'http://127.0.0.1/api/setErrors',
        type: 'post',
        data: {
          errorAnswer: item.answer,
          studentId: query.studentId,
          exerciseId: item.id
        },
        async: false,

      })
    })

    console.log(wrongAnswer);

    $("#check").on('click', function () {
      let url = encodeURI(`analysis.html?testsId=${query.testsId}&studentId=${query.studentId}`)
      location.href = url
    })


  }

  function getWrongAnswer(result) {
    let studentOption = result.data.studentOption;
    for (let i = 0; i < studentOption.length; i++) {
      if (!JSON.stringify(rightAnswer).includes(JSON.stringify(studentOption[i]))) {
        wrongAnswer.push(JSON.parse(JSON.stringify(studentOption[i])));
      }
    }
  }

  async function getRigthAnswer(result) {
    await result.data.studentOption.forEach((item) => {
      $.ajax({
        url: 'http://127.0.0.1/api/getOneExercises',
        type: 'get',
        data: { id: item.id },
        async: false,
        success: function (data) {
          rightAnswer.push({
            id: data.data._id,
            answer: data.data.answer,
            score: data.data.score
          })
        }
      })
    })
  }





})