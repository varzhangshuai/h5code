$(function(){

    function changeImg(status) {
        //四个状态 未提交、审核通过、待审核、审核不通过 0 1 2 3
        if(status==0){
            //未提交
            $('.status-img').attr('src','./img/auth_1.png');
            $('.top-word').html('请提交个人真实信息进行实名认证');
            $('.apply-auth').text('立即申请认证')
        }else if(status=='2'){
            //审核通过
            $('.status-img').attr('src','./img/auth_3.png');
            $('.top-word').html('您已是实名认证用户').addClass('top-word-success');
            $('.apply-auth').css('display','none')
            $('.middle-word').text('享有以下权益')
            $('.border').addClass('long-width')
        }else if(status=='1'){
            //审核中
            $('.apply-auth').text('认证审核中').css('background','#cccccc')
            $('.top-word').html('请提交个人真实信息进行实名认证');
        }else if(status=='-1'){
            //审核不通过
            $('.status-img').attr('src','./img/auth_2.png')
            $('.top-word').html('您提交的信息未能通过审核 <br> 建议您修改信息后重新提交认证')
            $('.apply-auth').text('重新申请认证')
        }
        $('.apply-auth').click(function () {
            if(status == '1'){
                return
            }
            window.location.href='/app/userauth/formone.html?_t='+times();
        })

    }

    var uri= '/costin/mapi/authentication/status';
    // var search = getUserid()
    OCJSJAVA(uri,getData);

    // getData(appData);
    function getData(data) {
        $.ajax({
            type: "GET", //用POST方式传输
            url:route+ uri,
            //目标地址
            data:data,
            success: function (res){
                if(res.code==1){
                    var status = res.original.status;
                    changeImg(status);
                }else if(res.code==10016){

                }else if(res.code==10001){

                } else{

                }
            },
            error:function(err){
                console.log(err)
            }
        });
    }
})
