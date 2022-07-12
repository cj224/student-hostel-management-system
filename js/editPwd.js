//禁止用户输入空格
$("form").keydown(function (e) {
    if (e.target.nodeName.toLowerCase() != "input") {
        return;
    }
    if (e.keyCode == 32) {
        e.preventDefault();
    }
    e.target.oninput = function () {
        if (e.target.value.length < 3 || e.target.value.length > 18) {
            $(`.${e.target.id}-hint`).html("密码最少为3位,最大18位！");
        } else {
            $(`.${e.target.id}-hint`).html("");
        }
    }
});

$(".edit-pwd").click(function (e) {
    let login_type = sessionStorage.getItem("login_type");
    let account = sessionStorage.getItem("account");
    let old_pwd = $("#oldPwd").val();
    let new_pwd = $("#newPwd").val();
    let renew_pwd = $("#reNewPwd").val();
    if(old_pwd == "" || new_pwd =="" || renew_pwd == ""){
        $(".reNewPwd-hint").html("所有输入框为必填！")
        return;
    }
    if($("#newPwd").val() !== $("#reNewPwd").val()){
        $(".reNewPwd-hint").html("两次密码输入不一致！");
        return;
    }
    let result = confirm(`确认修改账户为${account}的密码吗？`);
    if (!result) {
        return;
    }
    if (login_type == "system_admin") {
        let ix = data.system_admin.findIndex(item => item.account === account);
        if(old_pwd !== data.system_admin[ix].password){
            $(".oldPwd-hint").html("原密码错误！")
            return;
        }
        data.system_admin[ix].password = renew_pwd;
        location.href = "/html/login.html";
    }
    if (login_type == "houseparent") {
        let ix = data.houseparent.findIndex(item => item.account === account);
        if(old_pwd !== data.houseparent[ix].password){
            $(".oldPwd-hint").html("原密码错误！")
            return;
        }
        data.houseparent[ix].password = renew_pwd;
        location.href = "/html/login.html";
    }
    if (login_type == "student") {
        let ix = data.student.findIndex(item => item.student_ID == account);
        if(old_pwd !== data.student[ix].password){
            $(".oldPwd-hint").html("原密码错误！")
            return;
        }
        data.student[ix].password = renew_pwd;
        location.href = "/html/login.html";
    }
    
    localStorage.setItem("data", JSON.stringify(data));
});