import '../css/information.css'
import ajax from '../js/utils/ajax'
import $ from 'jquery'

$(function () {
  
    //获取url地址中的参数，以对象的形式保存到query中
    let url = window.location.href;
    let query = {}
    url = decodeURI(url.split('?')[1])
    url = url.split('&')
    for (let i = 0; i < url.length; i++) {
      let urlArray = url[i].split('=');
      query[urlArray[0]] = urlArray[1]
    }

  $('#start').on('click',function(){
    console.log(123);
    let url = encodeURI(`tests.html?testsId=${query.testsId}&studentId=${query.studentId}`)
    location.href = url
  })

  

})
