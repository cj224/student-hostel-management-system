
let contentData = data.houseparent;
localStorage.setItem('curList', "houseparent");

/** 
 * @description: 生成tr模板
 * @param {*} item 当前数据
 * @param {*} isOnlyShow
 * @return {*}
 */
function create_tr(item, isOnlyShow) {
    //匹配当前宿舍管理员的宿舍楼数据
    let dorm = "";
    if (item) {
        dorm = data.dorm.find(da => {
            return da.id === item.dorm_id;
        })
    }
    //宿舍楼选择器模板
    let dorm_select = "";
    data.dorm.forEach(dormItem => {
        create_dorm_select(dormItem)
    })
    function create_dorm_select(curItem) {
        dorm_select += `
            <option value="${curItem.id}" ${item && item.dorm_id == curItem.id ? "selected" : ""}>${curItem.name}</option>
        `;
    }
    //性别选择器模板
    let sexArr = ["男", "女"];
    let sex_select = "";
    sexArr.forEach(sex_i => {
        create_sex_select(sex_i)
    })
    function create_sex_select(sex_i) {
        sex_select += `
            <option ${item && item.sex == sex_i ? "selected" : ""}>${sex_i}</option>
        `;
    }
    return `
    <tr>
        <td><input type="checkbox" name="cb_select" value="${item ? item.id : ''}" /></td>
        <td><span>${item ? item.id : ''}</span></td>
        <td><span ${isOnlyShow ? '' : 'hidden'}>${item ? item.name : ''}</span><input ${!isOnlyShow ? '' : 'hidden'} type="text" name="name" value="${item ? item.name : ''}"></td>
        <td><span ${isOnlyShow ? '' : 'hidden'}>${item ? item.sex : ''}</span><select ${!isOnlyShow ? '' : 'hidden'} id="sex">${sex_select}</select></td>
        <td><span ${isOnlyShow ? '' : 'hidden'}>${item ? item.phone : ''}</span><input ${!isOnlyShow ? '' : 'hidden'} type="text" name="phone" value="${item ? item.phone : ''}"></td>
        <td><span ${isOnlyShow ? '' : 'hidden'}>${item ? dorm.name : ''}</span><select ${!isOnlyShow ? '' : 'hidden'} id="name">${dorm_select}</select></td>
        <td><span ${isOnlyShow ? '' : 'hidden'}>${item ? item.account : ''}</span><input ${!isOnlyShow ? '' : 'hidden'} type="text" name="account" value="${item ? item.account : ''}"></td>
        <td>
            <button ${isOnlyShow ? '' : 'hidden'} type="button" onclick="add_update(${item ? item.id : ''}, this)">修改</button>
            <button ${isOnlyShow ? '' : 'hidden'} type="button" onclick="do_del(${item ? item.id : ''})">删除</button>

            <button ${!isOnlyShow ? '' : 'hidden'} type="button" onclick="do_save(this, ${item ? item.id : ''})">保存</button>
            <button ${!isOnlyShow ? '' : 'hidden'} type="button" onclick="do_cancel()">取消</button>
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
    let index = contentData.findIndex(item => item.id === id);
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
        let index = contentData.findIndex(item => item.id == curdata.value);
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

/** 
 * @description: 
 * @param {*} id 当前操作数据的id
 * @param {*} self 当前元素
 * @return {*}
 */
function add_update(id, self) {
    if (id) {
        let curData = contentData.find(item => item.id == id);
        let curTr = self.parentNode.parentNode;
        curTr.insertAdjacentHTML("beforebegin", create_tr(curData, false));
        curTr.remove();
    } else {
        $(".tbody").append(create_tr(null, false));
    }
}

//保存按钮
function do_save(self, id) {
    if (id) {
        let curData = contentData.find(item => item.id == id);
        let curTr = self.parentNode.parentNode;
        save_data(curData, curTr);
        if (filterArr.length > 0) {
            let filter = filterArr.findIndex(item => item.id == id);
            let editData = student.find(item => item.id == id);
            filterArr.splice(filter, 1, editData);
        }
    } else {
        let obj = {
            "password": "123456",
            "power": [
                { "id": "index", "name": "首页" },
                { "id": "student", "name": "学生管理" },
                { "id": "absence", "name": "缺勤记录" },
                { "id": "editPwd", "name": "修改密码" }
            ]
        }
        let curTr = $(".tbody tr:last-child")[0];
        save_data(obj, curTr);
        let maxId = Math.max(...contentData.map(item => item.id))
        obj.id = maxId + 1;
        contentData.push(obj);
        if (filterArr.length > 0) {
            filterArr.push(obj);
        }
    }
    function save_data(obj, element) {
        let inputArr = Array.from(element.querySelectorAll("input"));
        inputArr.shift();
        inputArr.forEach(item => {
            let attr = item.name;
            if (attr == "name") {
                obj.name = item.value;
            } else if (attr == "phone") {
                obj.phone = item.value;
            } else {
                obj.account = item.value;
            }
        });
        let selArr = element.querySelectorAll("select");
        selArr.forEach(item => {
            let idr = item.id;
            if (idr == "sex") {
                obj.sex = item.value;
            } else {
                obj.dorm_id = Number(item.value);
            }
        });
    }
    clear($(".pagination")[0]);
    pageObj.count = contentData.length;
    if (filterArr.length > 0) {
        pageObj.count = filterArr.length;
    }
    ul_pager_create();
    update_table(contentData);
}

//搜索数据
let filterArr = [];
function do_search() {
    filterArr = contentData;
    let name_s = $("form input[name='name']").val().toLowerCase().trim();
    let phone_s = $("form input[name='phone']").val().trim();
    let sex_s = $(".sex-menu").val();
    let dorm_s = $(".dorm-menu").val();
    if (name_s.length > 0) {
        filterArr = filterArr.filter(item => item.name.toLowerCase().indexOf(name_s) !== -1);
    }
    if (phone_s.length > 0) {
        filterArr = filterArr.filter(item => item.phone.toLowerCase().indexOf(phone_s) !== -1);
    }
    if (sex_s) {
        filterArr = filterArr.filter(item => item.sex == sex_s);
    }
    if (dorm_s) {
        filterArr = filterArr.filter(item => item.dorm_id == dorm_s);
    }
    clear($(".pagination")[0]);
    if (filterArr.length > 0) {
        pageObj.pageNum = 1;
        pageObj.count = filterArr.length;
        ul_pager_create();
    }
    update_table(filterArr);
}
