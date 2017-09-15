window.onload=function () {

    //获取数据
    // getFormData(appData,renderAfter);
    OCJSJAVA('/costin/mapi/authentication/after',getFormData,{},renderAfter);


    // //表单认证
    // var head_state = false;//头像状态
    // var name_state = false;//姓名状态
    // var company_state = false;//公司状态
    // var commercial_state = false;//商学院状态
    //姓名
    $('#name').blur(function () {
        var re = /[^\w\u4e00-\u9fa5]/g;
        var value=$(this).val()
        if (re.test(value)) {
            toast('姓名含有非法字符')
            name_state = false;
            buttonChange()
        } else if (value == "") {
            toast('请输入名字!')
            name_state = false;
            buttonChange()
        } else if (value.length <2 ||value.length >20) {
            toast('姓名不符合条件，请重新输入！')
            name_state = false;
            buttonChange()
        } else {
            name_state = true;
            buttonChange()
        }
    })
    if($('#headUrl').css('background-image')!=null && $('#headUrl').css('background-image')!='none'){
        head_state = true;
        buttonChange()
    }
    if($('#name').val()!=null&&$('#name').val()!=''){
        name_state = true;
        buttonChange()
    }
    if($('#companyImg').css('background-image')!=null && getImgUrl($('#companyImg').css('background-image')).indexOf('img/uoload.png')>-1){
        company_state = true;
        buttonChange()
    }
    //
    // if($('#collegeImg').css('background-image')!=null && getImgUrl($('#collegeImg').css('background-image')).indexOf('img/uoload.png')>-1){
    //     commercial_state = true;
    //     buttonChange()
    // }

    // //上传头像
    // $('#photoHead').change(function () {
    //     postPhoto($(this), function () {
    //         if($('#headUrl').css('background-image')!=null){
    //             head_state = true;
    //             buttonChange()
    //         }else {
    //             head_state = false;
    //             buttonChange()
    //         }
    //     });
    // });
    $('#headButton').click(function () {
        $('#photoHead').trigger('click')
    })


    // $('#photoCard').change(function () {
    //     postPhoto($(this),function () {
    //         if($('#companyImg').css('background-image')!=null && getImgUrl($('#companyImg').css('background-image')) != './img/uoload.png'){
    //             company_state = true;
    //             buttonChange()
    //         }else {
    //             company_state = false;
    //             buttonChange()
    //         }
    //     });
    // });
    // $('#photoShcool').change(function () {
    //     postPhoto($(this),function () {
    //         if($('#companyImg').css('background-image')!=null && getImgUrl($('#collegeImg').css('background-image')) != './img/uoload.png'){
    //             commercial_state = true;
    //             buttonChange()
    //         }else {
    //             console.log($('#companyImg').css('background-image'))
    //             commercial_state = false;
    //             buttonChange()
    //         }
    //     });
    // });
    // $('.close-img').click(function () {
    //     $(this).css('display','none')
    //     $(this).parent().find('label div').css({'background': 'url(./img/upload.png) no-repeat center center', 'background-size': '160/@rem 90/@rem'})
    //     $(this).parent().find('input').val(null)
    // })




}
