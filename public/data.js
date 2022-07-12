if (localStorage.getItem("data") == null) {
    let dataArr = Mock.mock({
        "system_admin": [
            {
                "id": 1,
                "account": "admin",
                "password": "123",
                "power|6": [
                    {
                        "id|+1": ["index", "houseparent", "student", "dorm", "absence", "editPwd"],
                        "name|+1": ["首页", "宿舍管理员管理", "学生管理", "宿舍楼管理", "缺勤记录", "修改密码"]
                    }
                ]
            }
        ],
        "houseparent|10": [
            {
                "id|+1": 1,
                "dorm_id|+1": [1, 2, 3, 4, 5],
                "account|+1": ["aaaaa", "bbbbb", "ccccc", "ddddd", "eeeee", "fffff", "ggggg", "hhhhh", "iiiii", "jjjjj"],
                "password": "123456",
                "name": "@cname",
                "sex|+1": ["男", "女"],
                "phone": /^1(3|5|7|8|9)\d{9,9}$/,
                "power|4": [
                    {
                        "id|+1": ["index", "student", "absence", "editPwd"],
                        "name|+1": ["首页", "学生管理", "缺勤记录", "修改密码"]
                    }
                ]
            }
        ],
        "student|500": [
            {
                "id|+1": 1,
                "dorm_id|+1": [1, 2, 3, 4, 5],
                "student_ID|+1": 20191111,
                "password": "123456",
                "name": "@cname",
                "sex|1": ["男", "女"],
                "phone": /^1(3|5|7|8|9)\d{9,9}$/,
                "dorm_number": /^[1-6][1-2][0-9]$/,
                "power|3": [
                    {
                        "id|+1": ["index", "absence", "editPwd"],
                        "name|+1": ["首页", "缺勤记录", "修改密码"]
                    }
                ]
            }
        ],
        "dorm|5": [
            {
                "id|+1": [1, 2, 3, 4, 5],
                "name|+1": ["第一宿舍楼", "第二宿舍楼", "第三宿舍楼", "第四宿舍楼", "第五宿舍楼"],
                "intro": "1234567890"
            }
        ],
        "absence|100": [
            {
                "id|+1": 1,
                "student_id": "@integer(1, 10)",
                "create_date": "@datetime('2022-MM-dd HH:mm:ss')",
                "remark": "@cparagraph(1,1)"
            }
        ]
    })
    let dataStr = JSON.stringify(dataArr);
    localStorage.setItem("data", dataStr);
}

let data = JSON.parse(localStorage.getItem('data'));

