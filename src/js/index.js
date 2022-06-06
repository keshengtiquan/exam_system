import '../css/index.scss';

import $, { ajax } from 'jquery';

init();
function init() {
  //获取用户信息
  getuserdata();

  //获取收藏题目
  getCollections();

  //获取错题
  getErrors()

}

//获取用户信息
function getuserdata() {
  $.ajax({
    type: 'post',
    url: 'http://127.0.0.1/api/getUSerInfo',
    data: {
      _id: '610bb559a50c000097006402',
    },
    success: function (res) {
      // console.log(res.data[0]);
      // console.log(res.data[0].avatar);
      $('.head_right img:eq(0)').attr('src', res.data[0].avatar);
      $('#userName').text(res.data[0].name);
      $('#phone').text(res.data[0].phone);
      $('#avatar img').attr('src', res.data[0].avatar);
      $('.infoModel .name input').val(res.data[0].name);

      document.forms[0].gender.forEach(ele => {
        if (ele.value == res.data[0].gender) {
          ele.setAttribute('checked', 'true')
        }
      });
      // console.log(res);
    }
  })
}
// console.log(res);

//获取收藏
function getCollections() {
  $.ajax({
    type: 'GET',
    url: 'http://127.0.0.1/api/getCollections',
    data: {
      _id: '610bb559a50c000097006402',
    },
    success: function (res) {
      // console.log(res.result);
      const data = res.result;
      const answerArr = ['A', 'B', 'C', 'D'];
      const collectionsHTML = data.map((item, index) =>
        // console.log(item.exerciseId._id)
        `
        <li data-id='${item.exerciseId._id}'>
          <ul>
              <li>${item.exerciseId.topics}</li>
              <li><span>A</span> ${item.exerciseId.options[0]}</li>
              <li><span>B</span> ${item.exerciseId.options[1]}</li>
              <li><span>C</span> ${item.exerciseId.options[2]}</li>
              <li><span>D</span> ${item.exerciseId.options[3]}</li>
          </ul>
          <p>
              <button class="collectionBtn"  data-id='${item.exerciseId._id}'>取消收藏</button>
              <span>
                  <button class='preBtn' data-index=${index - 1}>上一题</button>
                  <button class='nextBtn' data-index=${index + 1}>下一题</button>
              </span>
          </p>
          <div class="parsing">
              <ul>
                  <li>考生答案: <span>A</span></li>
                  <li>正确答案: <span>${answerArr[item.exerciseId.answer]}</span></li>
                  <li>解析: <span>${item.exerciseId.options}</span>
                  </li>
              </ul>
          </div>
        </li>
      `).join('');

      $('#content>li:eq(1) .colltion_list .collection').html(collectionsHTML);
      data.length == 0 && $('#content>li:eq(1) .colltion_list .collection').html('<li><h1>没有收藏~</h1></li>');
      $('#content>li:eq(1) .topicCard .number').html(data.length);
      $('#nav>li:eq(1) span').html(data.length);
      const NumberHTML = data.map((item, index) => `<div class="number_small" data-index=${index + 1}>${index + 1}</div>`)
      $('#content>li:eq(1) .topicCard .numBtn').html(NumberHTML);

    }
  })
};


function getErrors() {
  $.ajax({
    type: 'post',
    url: 'http://127.0.0.1/api/getErrors',
    data: {
      _id: '610bb559a50c000097006402',
    },
    success: function (res) {
      // console.log(res);
      const data = res.result;
      // console.log(res.result);
      const answerArr = ['A', 'B', 'C', 'D'];
      const errorsHTML = data.map((it, index) =>
        `
        <li data-id='${it.exerciseId._id}'>
            <ul>
                <li>${it.exerciseId.topics}</li>
                <li><span>A</span> ${it.exerciseId.options[0]}</li>
                <li><span>B</span> ${it.exerciseId.options[1]}</li>
                <li><span>C</span> ${it.exerciseId.options[2]}</li>
                <li><span>D</span> ${it.exerciseId.options[3]}</li>
            </ul>
            <p>
                <span class="longer">
                    <button data-id=${it._id} class='delError'>标记已学会</button>
                </span>
                <span>
                    <button class='preBtn' data-index=${index - 1}>上一题</button>
                    <button class='nextBtn' data-index=${index + 1}>下一题</button>
                </span>
            </p>
            <div class="parsing">
                <div class="prompt">错误</div>
                <ul>
                    <li>考生答案: <span>${answerArr[it.errorAnswer]}</span></li>
                    <li>正确答案: <span>${answerArr[it.exerciseId.answer]}</span></li>
                    <li>解析: <span>${it.exerciseId.options}</span>
                    </li>
                </ul>
            </div>
        </li>
        `).join('');
      $('#content>li:eq(2) .colltion_list .error').html(errorsHTML);
      data.length == 0 && $('#content>li:eq(2) .colltion_list .error').html('<li><h1>先去做几道题吧~</h1></li>');
      const NumberHTML = data.map((item, index) => `<div class="number_small">${index + 1}</div>`)
      $('#content>li:eq(2) .topicCard .numBtn').html(NumberHTML);
      $('#content>li:eq(2) .topicCard .number').html(data.length);
      $('#nav>li:eq(2) span').html(data.length);
    }
  })
};

//收藏
// 上一题
$('#content>li:eq(1) .colltion_list').on('click', '.preBtn', function () {
  if ($(this).attr('data-index') < 0) {
    alert('已经是第一道题了')
  } else {
    console.log($(this).attr('data-index'));
    $('.collection').css('transform', `translate(${$(this).attr('data-index') * -600}px)`);
  }
});
// 下一题
$('#content>li:eq(1) .colltion_list ').on('click', '.nextBtn', function () {
  if ($(this).attr('data-index') > $('.collectin>li').length-1) {
    alert('已经是最后一道题了')
  } else {
    $('.collection').css('transform', `translate(${$(this).attr('data-index') * -600}px)`);
  }
  console.log($(this));
});

//错题
// 上一题
$('#content>li:eq(2) .colltion_list').on('click', '.preBtn', function () {
  if ($(this).attr('data-index') < 0) {
    alert('已经是第一道题了')
  } else {
    console.log($(this).attr('data-index'));
    $('.error').css('transform', `translate(${$(this).attr('data-index') * -600}px)`);
  }
});
// 下一题
$('#content>li:eq(2) .colltion_list').on('click', '.nextBtn', function () {
  if ($(this).attr('data-index') > $('.error>li').length-1) {
    alert('已经是最后一道题了')
  } else {
    $('.error').css('transform', `translate(${$(this).attr('data-index') * -600}px)`);
  }
  console.log($(this));
});

// 解析显示
!(function () {
  let key = true;
  $('.slider_right').on('click', function () {

    if (key) {
      $('.slider_small').css(
        'transform', `translateX(${0}px)`
      );
      $('.parsing').hide();
      $('.slider_right').css(
        'background-color', '#666'
      )
      key = false;
    } else {
      $('.slider_small').css(
        'transform', `translateX(${35}px)`
      );
      $('.parsing').show();
      $('.slider_right').css(
        'background-color', 'blue'
      )
      key = true;
    }

  })
})();

//题卡点击
$('.topicCard .numBtn .number_small .number_small').on('click',function(){

})

//退出、切换账号
$('#userName').click(function () {
  $('.updatauser').stop().slideToggle();
  console.log(123);
});
//点击模态框出现
$('.head_right img').click(function () {
  $('.infobg').fadeIn("slow");
});
//关闭
$('.infoModel >p img').click(function () {
  $('.infobg').fadeOut("fast");
});
$('.infoModel >.btn:eq(0)').click(function () {
  $('.infobg').fadeOut("fast");
})

// 选项卡切换
!(function () {
  var nav = document.getElementById('nav');
  var content = document.getElementById('content');
  nav.onclick = nav_click;
  nav.children[0].click();
  function nav_click(e) {
    var ul = e.currentTarget.children;
    var li = e.target;
    for (let i = 0; i < ul.length; i++) {
      if (ul[i] == li) {
        //将class的状态改为active
        ul[i].className = 'active';
        $('.nav_bg').css(
          'transform', `translateX(${175 * i}px)`
        )
        // {left: 175 * i}
        $("#content").css(
          'transform', `translateX(${-1072 * i}px)`
        )
        // .css({
        //   marginLeft: -1072 * i
        // })
      } else {
        ul[i].className = '';
      }
    }
  }
})()

msg_load()
// 通知公告
$('#notice_all').on('click', function () {
  $('.notice_title').stop().slideToggle();

});
$('.notice_title li:eq(0)').on('click', function () {
  $('#notice_all span').text("全部")
  $('.notice_main').hide();
  $('.notice_main li').show();
  $('.notice_main').slideDown('slow');
  $('.notice_title').hide();
})

$('.notice_title li:eq(1)').on('click', function () {
  $('#notice_all span').text("已读");
  $('.notice_main').hide();
  $('.unread').hide();
  $('.read').show();
  $('.notice_main').slideDown('slow');
  $('.notice_title').hide();
});
$('.notice_title li:eq(2)').on('click', function () {
  $('#notice_all span').text("未读");
  $('.notice_main').hide();
  $('.read').hide();
  $('.unread').show();
  $('.notice_main').slideDown('slow');
  $('.notice_title').hide();
})

// 公告模态框
function msg_load() {
  $('.notice_main li').on('click', function (e) {
    $('.msg').fadeIn();
    $(e.target).attr('class', 'read');
    $(e.target).children('span').remove();
  });

  $('.msg_head img').on('click', function () {
    $('.msg').hide();
  })
}


