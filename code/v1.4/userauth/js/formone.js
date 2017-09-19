window.onload=function () {

    //获取数据
    OCJSJAVA('/costin/mapi/authentication/after',getFormData,{},renderAfter);
    //ios标题
    iosTitle({topName:document.title,topShare:1,topCloseButton:1})
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
    $('#headButton').click(function () {
        $('#photoHead').trigger('click')
    })
}
