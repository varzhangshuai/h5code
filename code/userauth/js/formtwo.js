
$(function () {
    // getFormData(appData,renderLast);
    OCJSJAVA('/costin/mapi/authentication/after',getFormData,{},renderLast);

    //确定value
    //姓名
    if($('#alumni1Name').val()!=null){
        name_state1 = true;
        buttonChange2()
    }
    if($('#alumni2Name').val()!=null){
        name_state2 = true;
        buttonChange2()
    }
    //手机号
    if($('#alumni1Phone').val()!=null){
        phone_state1 = true;
        buttonChange2()
    }
     if($('#alumni2Phone').val()!=null){
         phone_state2 = true;
        buttonChange2()
    }
     //商学院状态
    if($('#alumni1Classes').val()!=null){
        classes_state1 = true;
        buttonChange2()
    }
    if($('#alumni2Classes').val()!=null){
        classes_state2 = true;
        buttonChange2()
    }
     if($('#alumni1Major').val()!=null){
         major_state1 = true;
        buttonChange2()
    }
     if($('#alumni2Major').val()!=null){
         major_state2 = true;
        buttonChange2()
    }



    //手机号
    $('#alumni1Phone').blur(function () {
        var re = /[^\w\u4e00-\u9fa5]/g;
        var value=$(this).val()
        if (re.test(value)) {
            toast('含有非法字符')
            phone_state1 = false;
            buttonChange2()
        } else if (value == "") {
            toast('请输入手机号!')
            phone_state1 = false;
            buttonChange2()
        } else if (value.length != 11) {
            toast('手机号输入错误，请重新输入！')
            phone_state1 = false;
            buttonChange2()
        } else {
            phone_state1 = true;
            buttonChange2()
        }
    })
    $('#alumni2Phone').blur(function () {
        var re = /[^\w\u4e00-\u9fa5]/g;
        var value=$(this).val()
        if (re.test(value)) {
            toast('含有非法字符')
            phone_state2 = false;
            buttonChange2()
        } else if (value == "") {
            toast('请输入手机号!')
            phone_state2 = false;
            buttonChange2()
        } else if (value.length != 11) {
            toast('手机号输入错误，请重新输入！')
            phone_state2 = false;
            buttonChange2()
        } else {
            phone_state2 = true;
            buttonChange2()
        }
    })
    //姓名
    $('#alumni1Name').blur(function () {
        var re = /[^\w\u4e00-\u9fa5]/g;
        var value=$(this).val()
        if (re.test(value)) {
            toast('姓名含有非法字符')
            name_state1 = false;
            buttonChange2()
        } else if (value == "") {
            toast('请输入名字!')
            name_state1 = false;
            buttonChange2()
        } else if (value.length <2||value.length >20) {
            toast('姓名不符合条件，请重新输入！')
            name_state1 = false;
            buttonChange2()
        } else {
            name_state1 = true;
            buttonChange2()
        }
    })

    //姓名
    $('#alumni2Name').blur(function () {
        var re = /[^\w\u4e00-\u9fa5]/g;
        var value=$(this).val()
        if (re.test(value)) {
            toast('姓名含有非法字符')
            name_state2 = false;
            buttonChange2()
        } else if (value == "") {
            toast('请输入名字!')
            name_state2 = false;
            buttonChange2()
        } else if (value.length <2||value.length >20) {
            toast('姓名不符合条件，请重新输入！')
            name_state2 = false;
            buttonChange2()
        } else {
            name_state2 = true;
            buttonChange2()
        }
    })

//学院
    $('#alumni1Major').blur(function () {
        var value=$(this).val()
        if (this.value == "") {
            toast('请输入学院!')
            major_state1 = false;
            buttonChange2()
        } else {
            major_state1 = true;
            buttonChange2()
        }
    })

    //学院
    $('#alumni2Major').blur(function () {
        var value=$(this).val()
        if (this.value == "") {
            toast('请输入学院!')
            major_state2 = true;
            buttonChange2()
        } else {
            major_state2 = true;
            buttonChange2()
        }
    })
//        班级
    $('#alumni1Classes').blur(function () {
        var value=$(this).val()
        if (this.value == "") {
            toast('请输入届别!')
            classes_state1 = false;
            buttonChange2()
        } else {
            classes_state1 = true;
            buttonChange2()
        }
    })

    $('#alumni2Classes').blur(function () {
        var value=$(this).val()
        if (this.value == "") {
            toast('请输入届别!')
            classes_state2 = false;
            buttonChange2()
        } else {
            classes_state2 = true;
            buttonChange2()
        }
    })
})

