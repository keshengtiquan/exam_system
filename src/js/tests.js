import '../css/tests.scss'
import '../css/initialize.css'
import $ from 'jquery'

$(function () {
  // //前一个页面传来的id
  // let testsId = '610bce08a50c000097006458';
  // let studentId = '610bb559a50c000097006402';

  let url = window.location.href;
  let query = {}
  url = decodeURI(url.split('?')[1])
  url = url.split('&')
  for (let i = 0; i < url.length; i++) {
    let urlArray = url[i].split('=');
    query[urlArray[0]] = urlArray[1]
  }

  const {testsId,studentId} = query;

  //所有题目
  let exercises;
  let beginTime = new Date().getTime();
  // let testId;

  init();

  function init() {
    //初始化页面信息
    getTestInfo();

    //选项点击事件
    $(".options").on('click', 'div', option_click);
    //题目编号点击事件
    $("#numbers").on('click', 'div', numbers_click);
    $('#numbers').children().eq(0).trigger("click");
    //下一题点击事件
    $('li').on('click', 'button', nextBtn_click);
    //模态框的点击事件
    $('#paperBtn').on('click', model_click)
    //再检查一下点击事件
    $('#checkAgain').on('click', () => { $('#submitModel').fadeOut(); $('#maskLayer').fadeOut(); })
    //确定交卷事件
    $('#submitBtn').on('click', submit_click)
  }



  function getTestInfo() {
    $.ajax({
      url: 'http://127.0.0.1/api/getTest',
      data: {
        id: testsId
      },
      async: false,
      type: 'get',
      success: function ({ flag, data: [{ _id, date, exercisesId, time, title, typeId }] }) {
        if (flag) {
          $('#title').html(title);
          $('#testType').html(typeId.type)
        }

        let countDown = parseInt(time);
        //设置倒计时
        setTime(countDown);

        // getResidueTime(countDown)
        //获取所有的试题
        exercises = exercisesId;
        setExercises();
        //未答的题目
        setSubjectNums();
        //模态框里的总题数
        $('#totelSubjectNums').text(exercises.length);




      }
    })

  }


  //设置倒计时
  function setTime(countDown) {
    let targetTime = countDown * 60;

    setInterval(function () {
      targetTime = targetTime - 1;
      if (targetTime > 0) {
        var second = Math.floor(targetTime % 60);            // 计算秒     
        var minite = Math.floor((targetTime / 60) % 60);      //计算分
      } else {
        //自动点击提交按钮
      }
      $('#countDown').html(`${minite}:${second}`)

    }, 1000)

  }

  //设置页面的信息
  function setExercises() {
    //循环打印题目
    exercises.forEach((item, index) => {
      // console.log(item.options);
      $(`<li class="subject-item subject-select">
      <div class="sub-title clearfix">
        <div>单选题</div>
        <div>第<span>${index + 1}</span>题/共<span>${exercises.length}</span>题 </div>
      </div>
      <div class="analysis">
        <span>${item.topics}</span>
      </div>
      <div class="options" data-index=${index} data-exercisesId=${item._id} data-score=${item.score} >
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
    
      <button type="button" class="sub-btn"  data-index="${index + 1}">下一题</button>
    </li>`).appendTo('#subject')

    });
    //循环打印编号
    for (let i = 1; i <= exercises.length; i++) {
      $(`<div class="number-item">
      <span>${i}</span>
    </div>`).appendTo('#numbers')
    }
  }

  //选项的点击事件函数
  function option_click() {
    $(this).children().eq(0).addClass('active')
    $(this).siblings().children().eq(0).removeClass('active');
    $(this).siblings().children().eq(2).removeClass('active');
    $(this).siblings().children().eq(4).removeClass('active');

    //点击选项让右边的题号换样式
    let index = $(this).parent().attr('data-index')
    $('#numbers').children().eq(index).addClass("select").removeClass('checked').children().eq(0).hide()

    //未答题目的统计
    setSubjectNums();
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

    if (!$('#numbers').children().eq(index).hasClass("select")) {
      $('#numbers').children().eq(index).addClass("checked").siblings().removeClass('checked')
    }
    if (index < exercises.length) {
      $('#subject').css({
        'transform': `translate(${-870 * index}px)`
      })
    } else {
      alert('已经是最后一题')
    }
  }

  //设置未答的数量
  function setSubjectNums() {
    let num = $('#numbers').children().length;
    $("#numbers").children().each(function (i, n) {
      // console.log($(n).hasClass("select")); 
      if ($(n).hasClass("select")) {
        --num;
      }
    })
    $('#subjectNums').html(num);
    $('#unanswered').html(num);
    $('#answer').html(exercises.length - num)
  }

  //模态框的点击事件
  function model_click() {
    $('#submitModel').fadeIn();
    $('#maskLayer').fadeIn();
  }
  //确认交卷按钮
  function submit_click() {

    let options = $('.options').children().children('.option');
    let studentAnswer = [];
    let rightAnswer = [];
    let totleScore = 0;
    let paperScore = 0;
    // 获得学生的答案
    // options.each(function (i, n) {
    //   let key = $(n).attr('data-exercisesId');
    //   let value = $(n).attr('data-answer') * 1;
    //   let score = $(n).attr('data-score') * 1;
    //   if ($(n).hasClass('active')) {
    //     studentAnswer.push({
    //       id: key,
    //       answer: value,
    //       score: score
    //     })
    //   }else {
    //     studentAnswer.push({
    //       id: key,
    //       answer: '',
    //       score: score
    //     })
    //   }
    // })
    
    for (let i = 0; i < options.length; i += 4) {
      let flag = false;
      
      for (let j = i; j < i + 4; j++) {
        let key = options[j].getAttribute('data-exercisesId');
        let value = options[j].getAttribute('data-answer') * 1;
        let score = options[j].getAttribute('data-score') * 1;
        if (options[j].className.includes('active')) {
          studentAnswer.push({
            id: key,
            answer: value,
            score: score
          })
          flag = true;
          break;
        }
      }
      if(!flag){
        let key = options[i].parentNode.parentNode.getAttribute('data-exercisesId');
        let score = options[i].parentNode.parentNode.getAttribute('data-score') * 1;
        studentAnswer.push({
          id: key,
          answer: '',
          score: score
        })
      }

    }
    console.log(studentAnswer);


    // console.log(studentAnswer[0]);


    //获取正确的答案
    exercises.forEach(function (item) {
      rightAnswer.push({
        id: item._id,
        answer: item.answer,
        score: item.score
      })
      paperScore += item.score;
    })
    // console.log(rightAnswer);


    for (let i = 0; i < studentAnswer.length; i++) {
      // console.log(JSON.stringify(rightAnswer).includes(JSON.stringify(studentAnswer[i])));
      if (JSON.stringify(rightAnswer).includes(JSON.stringify(studentAnswer[i]))) {
        totleScore += studentAnswer[i].score
      }
    }
    // console.log(totleScore);

    //获取点击是的剩余时间
    let residueTime = getResidueTime();
    // console.log(JSON.stringify(studentAnswer));
    // let sessionTestedArray = [];

    // if ($('#testType').html() != '每日一测') {
    $.ajax({
      url: 'http://127.0.0.1/api/setTested',
      data: {
        testsId: testsId,
        studentId: studentId,
        score: totleScore,
        time: residueTime + '分钟',
        testsType: $('#testType').html(),
        testeScore: paperScore,
        studentOption: JSON.stringify(studentAnswer)
      },
      type: 'post',
      success: function ({ flag, msg }) {
        if (flag) {
          console.log(msg);
          let url = encodeURI(`testResult.html?testsId=${testsId}&studentId=${studentId}`)
          location.href = url
        } else {
          alert(msg)
        }
      }
    })
    // } else {
    //   sessionTestedArray.push({
    //     testId: id,
    //     studentId: studentId,
    //     score: totleScore,
    //     time: residueTime + '分钟',
    //     testeScore: paperScore,
    //     studentOption: studentAnswer
    //   })
    //   sessionStorage.setItem('sessionTested', JSON.stringify(sessionTestedArray))

    // }

  }



  function getResidueTime() {

    let endTime = new Date().getTime();
    let time = endTime - beginTime;
    var minite = Math.ceil((time / 1000 / 60) % 60);

    return minite;

  }

})