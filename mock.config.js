module.exports = {
    //使用mock生成数据
    '/test1': {
        "string|1-10": "★"
    },
    '/test2': {
        "string|1-10": "★a*"
    },
    //使用回调函数形式手动返回数据
    '/commentList': function (req, res, next, Mock) {
        //手动调用Mockjs生成数据
        //const Mock = require('mock');
        const query = req.query;
        console.log(query.pageNum, query.pageSize);

        res.json(Mock.mock({
            code:1,
            msg:'success',
            data: {
                total: 20,
                pageNum: parseInt(query.pageNum),
                pageSize: parseInt(query.pageSize),
                'list|0-5': [
                    {
                        nickname: Mock.Random.cname(),
                        icon: Mock.Random.image('45x45', Mock.Random.color(), '#FFF', Mock.Random.cname()),
                        time: Mock.Random.date('yyyy-MM-dd hh:mm:ss'),
                        content: Mock.Random.cparagraph()
                    }
                ]
            }
        }))
    }
}
