$(document).ready(function () {
    create_dorm_select()
});

let contentData = data.dorm;
localStorage.setItem('curList', "dorm");

/** 
 * @description: 生成tr模板
 * @param {*} item 当前数据
 * @param {*} isOnlyShow
 * @return {*}
 */
function create_tr(item, isOnlyShow) {
    //匹配当前宿舍楼的管理员
    let dorm = [];
    if (item) {
        dorm = data.houseparent.filter(da => {
            return da.dorm_id === item.id;
        })
    }
    let curSpanName = "";
    let curDelName = "";
    dorm.forEach(j => {
        curSpanName += j.name + " ";
        curDelName += `<p class="option-p" ${!isOnlyShow ? '' : 'hidden'}>${j.name}<button type="button" class="close" onclick="del_houseparent(this,'${j.name}',${j.dorm_id})"><span aria-hidden="true">&times;</span></button></p>`
    });

    let disName = [];
    data.dorm.forEach(da => {
        let disArr = data.houseparent.filter(ht => {
            return ht.dorm_id === da.id
        });
        if (disArr.length == 1) {
            disName.push(disArr[0].name);
        }
    })

    let optionTag = "";
    data.houseparent.forEach(j => {
        if (disName.indexOf(j.name) != -1) {
            optionTag += `<option value="${j.name}" disabled>${j.name}</option>`;
        } else {
            optionTag += `<option value="${j.name}">${j.name}</option>`;
        }
    });

    let curSelectName = `<select ${!isOnlyShow ? '' : 'hidden'} multiple>${optionTag}</select>`;

    return `
    <tr>
        <td><input type="checkbox" name="cb_select" value="${item ? item.id : ''}" /></td>
        <td><span>${item ? item.id : ''}</span></td>
        <td><span ${isOnlyShow ? '' : 'hidden'}>${item ? item.name : ''}</span><input ${!isOnlyShow ? '' : 'hidden'} name="name" value="${item ? item.name : ""}"></td>
        <td><span ${isOnlyShow ? '' : 'hidden'}>${item ? item.intro : ''}</span><input ${!isOnlyShow ? '' : 'hidden'} type="text" name="intro" value="${item ? item.intro : ''}"></td>
        <td><span ${isOnlyShow ? '' : 'hidden'}>${item ? curSpanName : ''}</span>${item ? curDelName : curSelectName}</td>
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
    data.houseparent.forEach((item, index) => {
        if (item.dorm_id == id) {
            data.houseparent.splice(index, 1);
        }
    })
    data.student.forEach((item, index) => {
        if (item.dorm_id == id) {
            data.student.splice(index, 1);
        }
    })
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
        data.houseparent.forEach((item, index) => {
            if (item.dorm_id == curdata.value) {
                data.houseparent.splice(index, 1);
            }
        })
        data.student.forEach((item, index) => {
            if (item.dorm_id == curdata.value) {
                data.student.splice(index, 1);
            }
        })
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
        $(".close").mouseover(function (e) {
            $(e.target.parentNode.parentNode).addClass("option-p-sel");
        })
        $(".close").mouseout(function (e) {
            $(e.target.parentNode.parentNode).removeClass("option-p-sel");
        })
    } else {
        $(".tbody").append(create_tr(null, false));
    }
}
/** 
 * @description: 修改宿舍楼管理员
 * @param {*} self 当前删除按钮
 * @param {*} name 删除的宿舍管理员名字
 * @return {*}
 */
function del_houseparent(self, name, dorm_id) {
    if (data.houseparent.filter(item => item.dorm_id == dorm_id).length == 1) {
        alert("一栋楼至少需要一位宿舍管理员，如不需要，请直接删除！");
        return;
    }
    let result = confirm(`确认删除管理员“${name}”？`);
    if (!result) {
        return;
    }
    let index = data.houseparent.findIndex(item => {
        return item.name == name;
    })
    data.houseparent.splice(index, 1);
    self.parentNode.remove();
}

//保存按钮
function do_save(self, id) {
    if (id) {
        let curData = contentData.find(item => item.id == id);
        let curTr = self.parentNode.parentNode;
        save_data(curData, curTr);
        if (filterArr.length > 0) {
            let filter = filterArr.findIndex(item => item.id == id);
            let editData = contentData.find(item => item.id == id);
            filterArr.splice(filter, 1, editData);
        }
    } else {
        let obj = {}
        let curTr = $(".tbody tr:last-child")[0];
        let maxId = Math.max(...contentData.map(item => item.id))
        obj.id = maxId + 1;
        save_data(obj, curTr, true);
        contentData.push(obj);
        if (filterArr.length > 0) {
            filterArr.push(obj);
        }
    }
    function save_data(obj, element, flag) {
        let inputArr = Array.from(element.querySelectorAll("input"));
        inputArr.shift();
        inputArr.forEach(item => {
            let attr = item.name;
            if (attr == "name") {
                obj.name = item.value;
            } else if (attr == "intro") {
                obj.intro = item.value;
            }
        });
        if (flag) {
            let select = element.querySelector("select");
            let optionArr = [];
            let length = select.options.length
            for (let i = 0; i < length; i = i + 1) {
                if (select.options[i].selected) {
                    optionArr.push(select.options[i].value);
                }
            }
            optionArr.forEach(optionItem => {
                let htData = data.houseparent.find(ht => ht.name == optionItem);
                console.log(optionItem, htData);
                htData.dorm_id = obj.id;
            });
        }
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
    let dorm_s = $(".dorm-menu").val();
    if (dorm_s) {
        filterArr = filterArr.filter(item => item.id == dorm_s);
    }
    clear($(".pagination")[0]);
    if (filterArr.length > 0) {
        pageObj.pageNum = 1;
        pageObj.count = filterArr.length;
        ul_pager_create();
    }
    update_table(filterArr);
}

//宿舍楼生成下拉列表
function create_dorm_select() {
    let dorm_menu = `<option value="">请选择宿舍楼</option>`;
    data.dorm.forEach(item => {
        dorm_menu += `<option value="${item.id}">${item.name}</option>`
    })
    $(".dorm-menu").html(dorm_menu);
}



