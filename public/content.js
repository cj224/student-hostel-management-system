let data = JSON.parse(localStorage.getItem('data'));
console.log(data);

//检测非法登录
(function () {
    let account = sessionStorage.getItem("account");
    let login_type = sessionStorage.getItem("login_type");
    if (account) {
        if (login_type == "student") {
            let stu = data.student.find(item => item.student_ID == account);
            document.querySelector(".username").innerHTML += stu.name;
        } else {
            document.querySelector(".username").innerHTML += account;
        }
    } else {
        document.body.innerHTML = `请先登录，<span class="clockURL">3</span>秒后跳转到<span class="goURL">登录</span>页面`;
        document.body.style = `display: flex;
        justify-content: center;
        align-items: center;`
        document.querySelector(".goURL").onclick = function () {
            window.location.href = "/html/login.html";
            return;
        }
        let second = document.querySelector(".clockURL").innerText;
        setInterval(function () {
            if (second === 0) {
                location.href = "/html/login.html";
                return;
            } else {
                second--;
                document.querySelector(".clockURL").innerText = second;
            }
        }, 1000);
        throw new Error("请先登录！");
    }
})();


// 退出登录
let logout = document.querySelector(".logout");
logout.addEventListener("click", function (e) {
    let flag = confirm("确定退出登录吗？");
    if (flag) {
        sessionStorage.removeItem("account");
        sessionStorage.removeItem("login_type");
        window.location.href = "/html/login.html";
    }
    return;
});

{/* <a href="#" class="list-group-item active" id="content">首页<span class="iconfont icon-xiangyou"></span></a>
<a href="#" class="list-group-item" id="houseparent">宿舍管理员管理<span class="iconfont icon-xiangyou"></span></a>
<a href="#" class="list-group-item" id="student">学生管理<span class="iconfont icon-xiangyou"></span></a>
<a href="#" class="list-group-item" id="dorm">宿舍管理<span class="iconfont icon-xiangyou"></span></a>
<a href="#" class="list-group-item" id="absence">缺勤记录<span class="iconfont icon-xiangyou"></span></a>
<a href="#" class="list-group-item" id="editPwd">修改密码<span class="iconfont icon-xiangyou"></span></a> */}
/** 
 * @description: 根据登录身份生成list菜单
 * @param {*} type 登录身份
 * @return {*}
 */
function createList(type) {
    let str = "";
    let powerArr = data[type][0].power;
    powerArr.forEach(item => {
        if (item.id == "index") {
            str += `
            <a href="/${item.id}.html" class="list-group-item" id="${item.id}">${item.name}<span class="iconfont icon-xiangyou"></span></a>
            `
        } else {
            str += `
            <a href="/html/admin/${item.id}.html" class="list-group-item" id="${item.id}">${item.name}<span class="iconfont icon-xiangyou"></span></a>
            `
        }

    });
    $(".lists").html(str);
}
let login_type = sessionStorage.getItem("login_type");
createList(login_type);

// if (localStorage.getItem("curList")) {
//     let list = $(".lists a").get().filter(item => {
//         return item.id == localStorage.getItem("curList");
//     });
//     $(list).addClass("active");
// }else{
//     $("#index").addClass("active");
//     localStorage.setItem("curList", "index");
// }
// $(".lists").click(function (e) {
//     localStorage.setItem("curList", e.target.id);
// });


//给左侧当前菜单添加active类名
let currentArr = location.pathname.split("/");
let current = currentArr[currentArr.length - 1];
let reg = /^(.+)\..+/;
current = current.match(reg)[1];
$(`.lists > #${current}`).addClass("active");

//导航路径
if ($(".lists .active").text() == "首页") {
    let liStr = `<li class="active">首页</li>`;
    $(".path").append(liStr);
} else {
    let liStr = `<li><a href="/index.html" class="index">首页</a></li>`;
    liStr += `<li class="active">${$(".lists .active").text()}</li>`;
    $(".path").append(liStr);
}
