//公共函数

//加载页面
$(document).ready(function () {
    render_table(contentData);
    update_count(contentData.length);
});

//分页对象
let Pagination = (function () {
    let _count = 0;
    let _pageSize = 0;
    let _pageNum = 0;
    function getBound() {
        this.start = this.pageSize * (this.pageNum - 1);
        this.end = this.pageSize * this.pageNum;

        this.total = Math.ceil(this.count / this.pageSize);
        this.preNum = this.first;
        if (this.pageNum > 1) {
            this.preNum = this.pageNum - 1;
        }

        this.last = this.total;
        this.nextNum = this.last;
        if (this.pageNum < this.total) {
            this.nextNum = this.pageNum + 1;
        }
    }
    return class {
        constructor(pageSize, count) {
            _count = count ? count : 0;
            _pageSize = pageSize;
            _pageNum = 1;
            this.first = 1;
            getBound.call(this);
        }
        get count() { return _count; }
        set count(val) {
            _count = val;
            _pageNum = 1;
            getBound.call(this);
        }
        get pageSize() { return _pageSize; }
        set pageSize(val) {
            _pageSize = val;
            _pageNum = 1;
            getBound.call(this);
        }
        get pageNum() { return _pageNum; }
        set pageNum(val) {
            _pageNum = val;
            getBound.call(this);
        }

    }
})();

let curList = localStorage.getItem('curList');

//根据page_size(每页显示数据的大小)生成分页对象
let page_size = localStorage.getItem(`${curList}-pageSize`);
let pageObj = new Pagination(page_size ? page_size : 5, contentData.length);


//创建分页列表
function ul_pager_create() {
    let ul = document.querySelector(".pagination");
    let li = `<li id="first"><a href="#">首页</a></li>`;
    ul.insertAdjacentHTML("beforeend", li);
    li = `<li id="prev"><a href="#">上一页</a></li>`;
    ul.insertAdjacentHTML("beforeend", li);
    // 处理页码
    for (let i = 1; i <= pageObj.total; i++) {
        li = `<li value="${i}" class="${pageObj.pageNum == i ? 'active' : ''}"><a href="#">${i}</a></li>`;
        ul.insertAdjacentHTML("beforeend", li);
    }
    li = `<li id="next"><a href="#">下一页</a></li>`;
    ul.insertAdjacentHTML("beforeend", li);
    li = `<li id="last"><a href="#">尾页</a></li>`;
    ul.insertAdjacentHTML("beforeend", li);

    if (pageObj.pageNum == 1) {
        $("#first").addClass("disabled");
        $("#prev").addClass("disabled");
    }
    if (pageObj.pageNum == pageObj.total) {
        $("#last").addClass("disabled");
        $("#next").addClass("disabled");
    }
}
ul_pager_create();


//分页下拉框change事件，改变pagesize
$(".page-menu").change(function (e) {
    pageObj.pageSize = parseInt(e.target.value);
    localStorage.setItem(`${curList}-pageSize`, pageObj.pageSize);
    clear($(".pagination")[0]);
    pageObj.count = contentData.length;
    if (filterArr.length > 0) {
        pageObj.count = filterArr.length;
    }
    ul_pager_create();
    update_table(contentData);
})

//设置默认pagesize
$(".page-menu option").get().forEach(item => item.value == page_size ? item.setAttribute("selected", "selected") : "");

//分页列表点击事件
$(".pagination")[0].addEventListener("click", function (e) {
    let li = e.target.parentNode;
    $(".pagination li").removeClass("active");
    let pager = li.value;
    if (li.id == "first") {
        pager = pageObj.first;
    } else if (li.id == "prev") {
        pager = pageObj.preNum;
    } else if (li.id == "next") {
        pager = pageObj.nextNum;
    } else if (li.id == "last") {
        pager = pageObj.last;
    }
    pageObj.pageNum = pager;
    $(`.pagination li[value='${pageObj.pageNum}']`).addClass("active");

    if (pageObj.pageNum == 1) {
        $("#first").addClass("disabled");
        $("#prev").addClass("disabled");
    } else {
        $("#first").removeClass("disabled");
        $("#prev").removeClass("disabled");
    }
    if (pageObj.pageNum == pageObj.total) {
        $("#last").addClass("disabled");
        $("#next").addClass("disabled");
    } else {
        $("#last").removeClass("disabled");
        $("#next").removeClass("disabled");
    }
    update_table(contentData);
});

/** 
 * @description: 清除元素所有子节点
 * @param {*} element 操作的元素
 * @return {*}
 */
 function clear(element) {
    while (element.hasChildNodes()) {
        element.firstChild.remove()
    }
}

/** 
 * @description: 渲染表格
 * @param {*} curdata 宿舍管理员数据
 * @return {*}
 */
 function render_table(curdata) {
    if (!Array.isArray(curdata)) {
        throw new Error("curdata 必须是一个数组");
    }
    let tbody = $(".tbody");
    // 遍历数据
    curdata.forEach((item, index) => {
        if (index >= pageObj.start && index < pageObj.end) {
            tbody.append(create_tr(item, true));
        }
    })
}

// 数据大小
function update_count(count) {
    $(".total-list").html(count);
}

/**
 * 刷新表格
 * @param curdata
 */
 function update_table(curdata) {
    let tbody = $(".tbody")[0];
    // 清空表格
    while (tbody.hasChildNodes()) {
        tbody.firstChild.remove()
    }
    if (filterArr.length > 0) {
        curdata = filterArr;
    }
    // 绘制表格
    render_table(curdata);
    update_count(curdata.length);
    localStorage.setItem("data", JSON.stringify(data));
}

// 全选功能
function sel_all(self) {
    $("input[name='cb_select']").prop("checked", self.checked);
}

//取消按钮
function do_cancel() {
    update_table(contentData);
}

//搜索重置
function do_back() {
    filterArr.length = 0;
    clear($(".pagination")[0]);
    pageObj.count = contentData.length;
    ul_pager_create();
    update_table(contentData);
}