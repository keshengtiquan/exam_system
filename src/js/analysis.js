import '../css/analysis.scss'
import '../css/initialize.css'
import ajax from '../js/utils/ajax'
import $ from 'jquery'

$(function () {
  

  let rightAnswer = [];
  let studentAnswer = [];


  init();

  async function init() {


    let query = getQuery();
    //初始化页面信息
    // await getTestInfo(query);

    await getTestedInfo(query)


    //设置学生答案样式
    setStudentStyle();

    //填充解析里正确错误
    setRightOrWrong()



    //题目编号点击事件
    $("#numbers").on('click', 'div', numbers_click);
    $('#numbers').children().eq(0).trigger("click");

    //下一题点击事件
    $('li').on('click', 'button', nextBtn_click);
    
    $("#back").on('click', function () {
      let url = encodeURI(`testResult.html?testsId=${query.testsId}&studentId=${query.studentId}`)
      location.href = url
    })
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

  async function getTestedInfo(query) {

    let testsedInfo = await ajax({
      url: 'http://127.0.0.1/api/getTested',
      type: 'get',
      data: query,
    })
    console.log(testsedInfo);

    let exercisesInfo = await ajax({
      url: 'http://127.0.0.1/api/getTest',
      data: { id: query.testsId },
      type: 'get'
    })
    // console.log(exercisesInfo);

    if (testsedInfo.flag) {
      $('#countDown').html(testsedInfo.data.time)
    }

    if (exercisesInfo.flag) {
      $('#title').html(exercisesInfo.data[0].title);
      $('#testType').html(exercisesInfo.data[0].typeId.type)
      await setExercises(exercisesInfo.data[0].exercisesId, testsedInfo.data.studentOption);
    }
  }

  //学生选择的项添加样式
  function setStudentStyle() {
    for (let i = 0; i < studentAnswer.length; i++) {
      // console.log(studentAnswer[i]);
      if (studentAnswer[i] === '') {

      } else {
        console.log($('#subject')[0].children[i].children[2].children[studentAnswer[i]].children[0]);
        $('#subject')[0].children[i].children[2].children[studentAnswer[i]].children[0].className = 'option studentcheck'
      }
    }
  }

  //设置页面的信息
  async function setExercises(exercises, studentOption) {
    // console.log(studentOption);
    let letter = 'ABCD';
    //循环打印题目
    await exercises.forEach((item, index) => {
      // console.log(rightAnswer);
      rightAnswer.push(item.answer);
      // console.log(item.options);
      $(`<li class="subject-item subject-select">
      <div class="sub-title clearfix">
        <div>单选题</div>
        <div>第<span>${index + 1}</span>题/共<span>${exercises.length}</span>题 </div>
      </div>
      <div class="analysis">
        <span>${item.topics}</span>
      </div>
      <div class="options" data-index=${index}>
        <div class="option-item">
          <span class="option" data-answer='0' data-exercisesId=${item._id} data-score=${item.score}>A</span>
          <span class="answer">${item.options[0]}</span>
        </div>
        <div class="option-item">
          <span class="option"  data-answer='1' data-exercisesId=${item._id} data-score=${item.score}>B</span>
          <span class="answer">${item.options[1]}</span>
        </div>
        <div class="option-item">
          <span class="option"  data-answer='2'  data-exercisesId=${item._id} data-score=${item.score}>C</span>
          <span class="answer">${item.options[2]}</span>
        </div>
        <div class="option-item">
          <span class="option" data-answer='3'  data-exercisesId=${item._id} data-score=${item.score}>D</span>
          <span class="answer">${item.options[3]}</span>
        </div>
      </div>

      <div class="parsing">
        <div></div>
        <div class = "sAnswer">
          考生答案:<span id="sAnswer">${studentOption[index].answer === '' ? null : letter.charAt(studentOption[index].answer)}<span>
          <img class='analysisWrongPic' src='../images/u628.svg'>
          <img class='analysisRightPic' src='../images/u651.svg'>
          
          <span class="rightOrWrong right" ><span>
        </div>
        <div class = "rAnswer">
          正确答案:<span id="rAnswer">${letter.charAt(rightAnswer[index])}<span>
          
        </div>
        <div class = "analysis">
          <p>解析</P>
          <p>${item.analysis}</P>
        </div>
      </div>

      <button type="button" class="sub-btn"  data-index="${index + 1}">下一题</button>
    </li>`).appendTo('#subject');

      $(`<div class="number-item">
      <span>${index + 1}</span>
      <img class='wrongPic' src='../images/u963.png'>
      <img class='rightPic' src='../images/u951.png'>
      </div>`).appendTo('#numbers');
    });

    await studentOption.forEach(function (item) {
      studentAnswer.push(item.answer)
    })
    //给正确答案添加样式
    let optionArray = $('.options .option-item .option')
    for (let i = 0; i < optionArray.length; i += 4) {
      for (let j = i; j < i + 4; j++) {
        // console.log(optionArray[j].getAttribute('data-answer'));
        if (optionArray[j].getAttribute('data-answer') == rightAnswer[j % 4]) {
          // console.log(optionArray[j].className);
          optionArray[j].className = 'option active'
        }
      }
    }
  }

  function setRightOrWrong(){
    let num = 0
    rightAnswer.forEach(function(item,index){
      // console.log(item,studentAnswer[index]);
      if(item === studentAnswer[index]){
        console.log($('.rightOrWrong')); 
        $('.rightOrWrong').children().eq(index).html('正确')
        $('.rightPic').eq(index).show()
        $('.analysisRightPic').eq(index).show()
      }else {
        $('.rightOrWrong').children().eq(index).html('错误')
        $('.wrongPic').eq(index).show()
        $('.analysisWrongPic').eq(index).show()
        num++
      }
    })
    $('#subjectNums').html(num)
  }
    

  //右侧的编号点击事件函数
  function numbers_click() {

    // console.log($(this));
    // console.log($(this).hasClass("select"));
    if (!$(this).hasClass("select")) {
      $(this).addClass("checked").siblings().removeClass("checked")
    }

    let index = $(this).index()
    let length = $(this).parent().children().length
    // console.log(length);
    $('#subject').css({
      'width': `${length * 870}px`,
      'transform': `translate(${index * -870}px)`
    })
  }
  //下一题的点击事件
  function nextBtn_click() {
    let index = $(this).attr("data-index")
    let length = $(this).parent().parent().children().length

    if (!$('#numbers').children().eq(index).hasClass("select")) {
      $('#numbers').children().eq(index).addClass("checked").siblings().removeClass('checked')
    }
    if (index < length) {
      $('#subject').css({
        'transform': `translate(${-870 * index}px)`
      })
    } else {
      alert('已经是最后一题')
    }
  }



  

  

})