
let student = []; //保存不同身份登录时的学生数据
let newabsence = []; //保存匹配学生数据的缺勤记录
let contentData = []; //保存最终合并后的数据
let absence = data.absence; //所有缺勤记录
absence.forEach(item => {
    studentData(item);
})
function studentData(item) {
    let curStudent = data.student.find(student => student.id === item.student_id);
    if (sessionStorage.getItem("login_type") === "system_admin") {
        student.push(curStudent);
        newabsence.push(item);
    }
    if (sessionStorage.getItem("login_type") === "houseparent") {
        let account = data.houseparent.find(i => i.account === sessionStorage.getItem("account"));
        if (curStudent.dorm_id == account.dorm_id) {
            student.push(curStudent);
            newabsence.push(item);
        }
    }
    if (sessionStorage.getItem("login_type") === "student") {
        let account = data.student.find(i => i.student_ID + "" === sessionStorage.getItem("account"));
        if (item.student_id == account.id) {
            student.push(curStudent);
            newabsence.push(item);
        }
    }
}
//合并数据
student.forEach((stu, index) => {
    contentData.push({ ...stu, ...newabsence[index] });
})
localStorage.setItem('curList', "absence");

/** 
 * @description: 生成tr模板
 * @param {*} item 当前数据
 * @return {*}
 */
function create_tr(item) {
    //通过学生id匹配当前学生宿舍楼
    let dorm;
    dorm = data.dorm.find(da => {
        return da.id === item.dorm_id;
    })

    return `
    <tr>
        <td><input type="checkbox" name="cb_select" value="${item.id}" /></td>
        <td><span>${item.id}</span></td>
        <td><span>${item.student_ID}</span></td>
        <td><span>${item.name}</span></td>
        <td><span>${dorm.name}</span></td>
        <td><span>${item.dorm_number}</span></td>
        <td><span>${item.create_date}</span></td>
        <td><span>${item.remark}</span></td>
        <td>
            <button type="button" onclick="do_del(${item.id})">删除</button>
        </td>
    </tr>
    `;
}

/** 
 * @description: 
 * @param {*} id 当前删除的数据id
 * @return {*}
 */
function do_del(id) {
    // 删除确认
    let result = confirm("确认删除序号为" + id + "的数据");
    if (!result) {
        return;
    }
    let index = absence.findIndex(item => item.id === id);
    absence.splice(index, 1);
    index = newabsence.findIndex(item => item.id === id);
    contentData.splice(index, 1);
    if (filterArr.length > 0) {
        let filter = filterArr.findIndex(item => item.id === id);
        filterArr.splice(filter, 1);
    }
    update_table(contentData);
}

//批量删除功能
function del_sel() {
    let cbs = $("input[name='cb_select']:checked").get();
    let result = confirm("确认删除" + cbs.length + "条数据吗？");
    if (!result) {
        return;
    }
    cbs.forEach(curdata => {
        let index = absence.findIndex(item => item.id == curdata.value);
        absence.splice(index, 1);
        index = contentData.findIndex(item => item.id === curdata.value);
        contentData.splice(index, 1);
    })
    if (filterArr.length > 0) {
        cbs.forEach(curdata => {
            let filter = filterArr.findIndex(item => item.id == curdata.value);
            filterArr.splice(filter, 1);
        })
    }
    update_table(contentData);
}

//搜索数据
let filterArr = [];
function do_search() {
    filterArr = contentData;
    let name_s = $("form input[name='name']").val().trim();
    let startDate = $("form input[name='startDate']").val();
    let endDate = $("form input[name='endDate']").val();
    console.log(startDate, endDate);
    if (name_s.length > 0) {
        filterArr = filterArr.filter(item => item.name.indexOf(name_s) !== -1);
    }
    if (startDate) {
        filterArr = filterArr.filter(item => item.create_date >= startDate);
    }
    if (endDate) {
        filterArr = filterArr.filter(item => item.create_date <= endDate);
    }
    clear($(".pagination")[0]);
    if (filterArr.length > 0) {
        pageObj.pageNum = 1;
        pageObj.count = filterArr.length;
        ul_pager_create();
    }
    update_table(filterArr);
}

