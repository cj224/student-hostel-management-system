let accountTag = document.querySelector("input[name='account']");
let passwordTag = document.querySelector("input[name='password']");
let accountHint = document.querySelector(".name-hint");
let passwordHint = document.querySelector(".password-hint");
let checkbox = document.querySelector("input[type='checkbox']");


let tagMap = new Map();
tagMap.set("account", accountTag);
tagMap.set("password", passwordTag);
tagMap.set("accountHint", accountHint);
tagMap.set("passwordHint", passwordHint);

let account = "";
let password = "";
let login_type = "";

checkbox.onchange = () => {
  if (checkbox.checked === false) {
    Cookies.remove("account");
    Cookies.remove("password");
    Cookies.remove("login_type");
  }
}
window.onload = () => {
  if (Cookies.get("account") && Cookies.get("password") && Cookies.get("login_type")) {
    tagMap.get("account").value = Cookies.get("account");
    tagMap.get("password").value = Cookies.get("password");
    document.querySelector(`#${Cookies.get("login_type")}`).checked = true;
    checkbox.checked = true;
  }
}

//禁止用户输入空格
accountTag.addEventListener("keydown", function (e) {
  if (e.keyCode == 32) {
    e.preventDefault();
  }
});
//判断用户名
accountTag.addEventListener("input", function (e) {
  account = tagMap.get("account").value;
  if (account.length < 5) {
    accountHint.innerHTML = `长度最少为5位！`;
  } else {
    accountHint.innerHTML = ``;
  }
});
//判断密码
passwordTag.addEventListener("input", function (e) {
  password = tagMap.get("password").value;
  if (password.length < 3 || password.length > 18) {
    passwordHint.innerHTML = `密码最少为3位,最大18位！`;
  } else {
    passwordHint.innerHTML = ``;
  }
});


//提交按钮
function check_data() {
  let radio = document.querySelector("input[type='radio']:checked");

  account = tagMap.get("account").value;
  password = tagMap.get("password").value;
  if (!radio) {
    passwordHint.innerHTML = `请选择登录身份`;
    return;
  }
  login_type = radio.id;
  if (account == "" && password == "") {
    accountHint.innerHTML = `长度最少为6位！`;
    passwordHint.innerHTML = `密码最少为3位,最大18位！`;
    return;
  } else if (account.length < 5) {
    accountHint.innerHTML = `长度最少为5位！`;
    return;
  } else if (password.length < 3 || password.length > 18) {
    passwordHint.innerHTML = `密码最少为3位,最大18位！`;
    return;
  }

  if (login_type === "system_admin") {
    let flag = data.system_admin.find(function (item) {
      return item.account === account && item.password === password;
    })
    if (flag) {
      location.href = "/index.html";
    } else {
      passwordHint.innerHTML = `账号或密码错误`;
      return;
    }
  } else if (login_type === "houseparent") {
    let flag = data.houseparent.find(function (item) {
      return item.account === account && item.password === password;
    })
    if (flag) {
      location.href = "/index.html";
    } else {
      passwordHint.innerHTML = `账号或密码错误`;
      return;
    }
  } else if (login_type === "student") {
    let flag = data.student.find(function (item) {
      return item.student_ID + "" === account && item.password === password;
    })
    if (flag) {
      location.href = "/index.html";
    } else {
      passwordHint.innerHTML = `账号或密码错误`;
      return;
    }
  }
  if (checkbox.checked === true) {
    Cookies.set("account", account, { expires: 7 });
    Cookies.set("password", password, { expires: 7 });
    Cookies.set("login_type", login_type, { expires: 7 });
  }
  sessionStorage.setItem("account", account);
  sessionStorage.setItem("login_type", login_type);
  return;
};



