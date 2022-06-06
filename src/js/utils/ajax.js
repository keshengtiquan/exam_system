import $ from 'jquery'

export default function ajax({url,type,data}){
  return new Promise((resolve,reject)=>{
    $.ajax({
      url: url,
      data: data,
      type: type,
      success: function(res){
        resolve(res);
      }
    })
  })
}