/**
 * 所有配置信息
 */
export default {
    // baseUrl: 'http://tongji.chenlong.com',
    baseUrl: 'http://dash.yunzhanxinxi.com',
    // baseUrl: 'http://test.dash.yunzhanxinxi.com',
    urls: {
        // 用户管理-用户排行-表头数据+排序数据
        userRankTableHeader: '/app/field',
        // appFields
        appFields: '/app/field',
        // 用户管理-用户排行-列表
        userRankList: '/user/ranking',
        // 上传图片,视频
        uploadImage: '/upload',
        // 编辑素材
        // editMaterial: '/material/edit',
        editMaterial: '/material/modify',
        // 手工数据详情
        cpsHandDetail: '/api/excel/manualinfo',
        // 新增主菜单
        authMenu: '/auth_auth/menu',
        // 新增功能菜单
        authAdd: '/auth_auth/add',
        // 新增操作菜单
        authEffect: '/auth_auth/effect',
        // 编辑角色
        roleEdit: '/auth_role/edit',
        // 新增角色
        roleAdd: '/auth_role/add',
        // 获取团队列表
        teamAll: '/team/getAll',
        // 编辑用户
        userEdit: '/auth_user/edit_user',
        // 新增用户
        userAdd: '/auth_user/add_user',
        // 用户登出
        logout: '/index/logout',
        // 获取用户菜单
        authIndex: '/auth/index',
        // 获取验证码
        vcode: '/login/captcha',
        // 登陆
        login: '/login/login',
        // app统计订单数据
        appCountOrder: '/api/home/index-order',
        // app统计用户数据
        appCountUser: '/api/home/index-user',
        // 联盟账号订单默认参数
        cpsAccountOrderDefault: '/api/new/accounts-default',
        // 联盟账号订单表头和列表字段
        cpsAccountOrderField: '/api/new/field',
        // 联盟账号订单列表
        cpsAccountOrder: '/api/new/accounts',
        // 资金管理详情
        capitalDetail: '/api/statistics/capital-detail',
        // 资金管理表头和列表字段
        capitalField: '/api/new/field',
        // 资金管理列表数据
        capitalList: '/api/statistics/capital',
        // 资金池
        pool: '/api/statistics/pool',
        // cps昨日数据
        cpsYesterday: '/api/statistics/yesterday',
        // cps统计列表数据
        cpsCollect: '/api/statistics/detail',
        // cps提现
        cpsWithdraw: '/api/withdraw/index',
        // 公司账号订单默认参数
        companyDefault: '/api/new/company-default',
        // 公司账号订单表头和列表字段
        companyField: '/api/new/field',
        // 公司账号订单列表数据
        companyList: '/api/new/company',
        // cps今日数据
        cpsToday: '/api/statistics/today',
        // cps本月数据
        cpsMonth: '/api/statistics/thismonth',
        // cps上月
        cpsLastMonth: '/api/statistics/lastmonth',
        // 手工数据导入
        cpsHandImport: '/importexcel',
        // 手工数据列表
        cpsHandList: '/api/excel/manuallist',
        // 机器人统计数据 弹窗折线图数据
        robotDetail: '/api/statistics/robot-detail',
        // 机器人管理表格数据
        robtoList: '/api/statistics/robot',
        // 机器人订单 所有机器人
        robots: '/api/new/robot-default',
        // 机器人订单 表头和表格字段
        robotField: '/api/new/field',
        // 机器人订单 表格数据
        robotOrderList: '/api/new/robot',
        // cps汇总
        cpsAll: '/api/statistics/all',
        // 加载素材列表
        // materialList: '/material/query',
        materialList: '/material/list',
        // app订单列表
        appOrderList: '/order/getAll',
        // app商品销量排行
        appSaleRank: '/order/salesranking',
        // 权限管理父级菜单
        authParentMenu: '/auth_auth/parent_menu',
        // 编辑权限  权限树
        authTree: '/auth_auth/full_menu',
        // 删除权限
        authDel: '/auth_auth/delete',
        // 权限列表
        authList: '/auth_auth/index',
        // 删除角色
        roleDel: '/auth_role/delete',
        // 角色列表
        roleList: '/auth_role/index',
        // 角色界面 当前用户的权限树
        // 用户界面
        userAuthTree: '/auth_user/auth_tree',
        // 角色 权限信息
        roleAuthInfo: '/auth_role/auth_list',
        // 团队排行列表
        teamSort: '/team/ranking',
        // 用户管理 用户列表
        userList: '/user/getAll',
        // 用户权限管理 修改密码
        editPwd: '/auth_user/edit_password',
        // 用户权限管理 删除用户
        userDel: '/auth_user/delete',
        // 用户权限管理 用户列表
        userAuthList: '/auth_user/index',
        // 用户权限管理 用户信息
        userAuthInfo: '/auth_user/auth_user',
        // 提现列表
        withdrawList: '/cash/query',
        // cpsFields
        cpsFields: '/api/new/field',
        // cps交易月度交易
        cpsDealMonth: '/finance/cpsdeal/month',
        // cps交易年度交易
        cpsdealYear: '/finance/cpsdeal/year',
        // cps交易账户交易
        cpsdealAccounts: '/finance/cpsdeal/accounts',
        // cps业绩统计月汇总
        cpsperMonth: '/finance/cpsper/month',
        // cps业绩统计年汇总
        cpsperYear: '/finance/cpsper/year',
        // cps暂估月汇总
        cpsestMonth: '/finance/cpsest/month',
        // cps暂估年汇总
        cpsestYear: '/finance/cpsest/year',
        // cps代理人酬金月汇总
        cpsremMonth: '/finance/cpsrem/month',
        // cps代理人酬金年汇总
        cpsremYear: '/finance/cpsrem/year',
        // cps推广月汇总
        cpsgenMonth: '/finance/cpsgen/month',
        // cps推广年汇总
        cpsgenYear: '/finance/cpsgen/year',
        // cps资金管理导入提现日志
        cpsImportTx: '/wx/import',
        // cps代理人酬金账户-用户余额表-个人
        cpsamountPersonal: '/finance/cpsamount/person',
        // cps提现月提现
        cpswithdrawMonth: '/finance/cpswithdraw/month',
        // cps提现年提现
        cpswithdrawYear: '/finance/cpswithdraw/year',
        // 奖金池活动列表
        prizepoollist: '/ypj/prizepoollist',
        // 奖金池活动详情
        prizepoolinfo: '/ypj/prizepoolinfo',
        // 奖金池活动奖金列表
        prizeList: '/ypj/prizepoollog',
        // 标签列表
        collegeLabellist: '/college/labellist',
        // 新建标签
        collegeLabelAdd: '/college/labeladd',
        // 修改标签
        collegeLabelEdit: '/college/labeledit',
        // 修改标签状态
        collegeLabelStatus: '/college/labelstatus',
        // 文章列表
        collegeArticle: '/college/article',
        // 修改文章上架状态
        collegeArticleStatus: '/college/articlestatus',
        // 添加/修改文章
        collegeArticleModify: '/college/articlemodify',
        // 文章详情
        collegeArticleDetail: '/college/articledetail',
        // 提现
        cashCheck: '/cash/check',
        // 修改素材状态
        changeMaterialStatu: '/material/status',
        // 素材标签列表
        materialLabelList: '/material/labellist',
        // 新建素材标签
        materialLabelAdd: '/material/labeladd',
        // 修改素材标签
        materialLabelEdit: '/material/labeledit',
        // 修改素材标签状态
        materialLabelStatu: '/material/labelstatus',
        // 平台用户总数
        totalUser: '/ypj/workbench/totaluser',
        // 新增用户折线图
        totalUserChart: '/ypj/workbench/totaluserchart',
        // 活跃用户统计
        activeUser:'/ypj/workbench/activeuser',
        // 活跃用户折线图
        activeChart:'/ypj/workbench/activechart',
        // 沉睡用户折线图
        sleepChart:"/ypj/workbench/sleepuserchart",
        // 沉睡用户数据
        sleepUser:"/ypj/workbench/sleepuser",
        // 下单用户统计数据
        orderUser:'/ypj/workbench/orderuser',
        // 下单用户折线图
        orderUserChart:'/ypj/workbench/orderuserchart',
        // 商品分享数据
        goodsShare:'/ypj/workbench/goodsshare',
        // 商品分享折线图
        sharEchart:'/ypj/workbench/sharechart',
        // 沉睡用户列表
        sleepUserList:'/user/getAll',
        // 沉睡用户列表表头
        sleepUserHeader:'/app/field?field_type=userList',
        // 商品分享列表
        shareList:'/ypj/workbench/sharelist',
        // 定向佣金列表
        directList: '/ypj/directed/list',
        // 新增或修改定向佣金
        editDirect: '/ypj/directed/add',
        // 定向佣金导入
        importDirect: '/ypj/directed/import',
        // 修改定向佣金状态
        directStatu: '/ypj/directed/operate',
        // 定向佣金商品详情
        directGoodsInfo: '/ypj/directed/goodsinfo'
    },
    // 图片地址
    images: {
        menu: {
            权限管理: [
                require('@/assets/menu_cpm_normal.png'),
                require('@/assets/menu_cpm_normal.png')
            ],
            首页: [
                require('@/assets/home_selected.png'),
                require('@/assets/home_selected-1.png')
            ],
            数据工作台: [
                require('@/assets/menu_cps_selected.png'),
                require('@/assets/menu_cps_normal.png')
            ],
            cps管理: [
                require('@/assets/menu_cps_selected.png'),
                require('@/assets/menu_cps_normal.png')
            ],
            统计: [
                require('@/assets/statistical_selected.png'),
                require('@/assets/statistical_normal.png')
            ],
            用户管理: [
                require('@/assets/menu_user_selected.png'),
                require('@/assets/menu_user_normal.png')
            ],
            订单管理: [
                require('@/assets/menu_order_selected.png'),
                require('@/assets/menu_order_normal.png')
            ],
            提现管理: [
                require('@/assets/menu_withdrawal_selected.png'),
                require('@/assets/menu_withdrawal_normal.png')
            ],
            素材管理: [
                require('@/assets/menu_img_selected.png'),
                require('@/assets/menu_img_normal.png')
            ],
            CPS交易数据: [
                require('@/assets/menu_cps_selected.png'),
                require('@/assets/menu_cps_normal.png')
            ],
            CPS业绩统计: [
                require('@/assets/menu_cps_selected.png'),
                require('@/assets/menu_cps_normal.png')
            ],
            CPS暂估收入: [
                require('@/assets/menu_cps_selected.png'),
                require('@/assets/menu_cps_normal.png')
            ],
            CPS代理人酬金: [
                require('@/assets/menu_cps_selected.png'),
                require('@/assets/menu_cps_normal.png')
            ],
            CPS推广费用: [
                require('@/assets/menu_cps_selected.png'),
                require('@/assets/menu_cps_normal.png')
            ],
            CPS代理人酬金账户: [
                require('@/assets/menu_cps_selected.png'),
                require('@/assets/menu_cps_normal.png')
            ],
            CPS提现: [
                require('@/assets/menu_cps_selected.png'),
                require('@/assets/menu_cps_normal.png')
            ],
            活动统计: [
                require('@/assets/menu_cps_selected.png'),
                require('@/assets/menu_cps_normal.png')
            ],
            招商管理: [
                require('@/assets/menu_cps_selected.png'),
                require('@/assets/menu_cps_normal.png')
            ]
        },
        logo: {
            cps: require('@/assets/logo1.png'),
            app: require('@/assets/logo.png')
        }
    },
    // 表头
    tableHeader: {
        userManager: [
            [{ name: '账户名', colspan: 1 }, { name: '用户姓名', colspan: 1 }, { name: '用户角色', colspan: 1 }, { name: '管理员', colspan: 1 }, { name: '创建时间', colspan: 1 }, { name: '操作', colspan: 1 }]
        ],
        roleManager: [
            [{ name: '名称', colspan: 1 }, { name: '创建时间', colspan: 1 }, { name: '操作', colspan: 1 }]
        ],
        permissionManager: [],
        cpsCollect: [
            [{ name: '', colspan: 1 }, { name: '订单付款', colspan: 2 }, { name: '订单结算佣金', colspan: 2 }, { name: '预估佣金', colspan: 2 }, { name: '冻结订单', colspan: 2 }, { name: '维权订单', colspan: 2 }, { name: '退款订单', colspan: 2 }, { name: '', colspan: 7 }],
            [{ name: '日期', colspan: 1 }, { name: '订单成交额', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '结算佣金金额', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '订单预估金额', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '冻结佣金', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '维权佣金', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '退款佣金', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '预估返利金额', colspan: 1 }, { name: '结算返利金额', colspan: 1 }, { name: '新用户奖励', colspan: 1 }, { name: '签到奖励', colspan: 1 }, { name: '毛利', colspan: 1 }, { name: '毛利率', colspan: 1 }, { name: '技术服务费', colspan: 1 }]
        ],
        cpsTaobao: [
            [{ name: '', colspan: 1 }, { name: '订单付款', colspan: 2 }, { name: '订单结算佣金', colspan: 2 }, { name: '预估佣金', colspan: 2 }, { name: '冻结订单', colspan: 2 }, { name: '维权订单', colspan: 2 }, { name: '退款订单', colspan: 2 }, { name: '', colspan: 7 }],
            [{ name: '日期', colspan: 1 }, { name: '订单成交额', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '结算佣金金额', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '订单预估金额', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '冻结佣金', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '维权佣金', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '退款佣金', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '预估返利金额', colspan: 1 }, { name: '结算返利金额', colspan: 1 }, { name: '毛利', colspan: 1 }, { name: '毛利率', colspan: 1 }, { name: '技术服务费', colspan: 1 }]
        ],
        cpsJingdong: [
            [{ name: '', colspan: 1 }, { name: '订单付款', colspan: 2 }, { name: '订单结算佣金', colspan: 2 }, { name: '预估佣金', colspan: 2 }, { name: '冻结订单', colspan: 2 }, { name: '维权订单', colspan: 2 }, { name: '退款订单', colspan: 2 }, { name: '', colspan: 7 }],
            [{ name: '日期', colspan: 1 }, { name: '订单成交额', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '结算佣金金额', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '订单预估金额', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '冻结佣金', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '维权佣金', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '退款佣金', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '预估返利金额', colspan: 1 }, { name: '结算返利金额', colspan: 1 }, { name: '毛利', colspan: 1 }, { name: '毛利率', colspan: 1 }]
        ],
        cpsPdd: [
            [{ name: '', colspan: 1 }, { name: '订单付款', colspan: 2 }, { name: '订单结算佣金', colspan: 2 }, { name: '预估佣金', colspan: 2 }, { name: '冻结订单', colspan: 2 }, { name: '维权订单', colspan: 2 }, { name: '退款订单', colspan: 2 }, { name: '', colspan: 7 }],
            [{ name: '日期', colspan: 1 }, { name: '订单成交额', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '结算佣金金额', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '订单预估金额', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '冻结佣金', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '维权佣金', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '退款佣金', colspan: 1 }, { name: '订单数量', colspan: 1 }, { name: '预估返利金额', colspan: 1 }, { name: '结算返利金额', colspan: 1 }, { name: '毛利', colspan: 1 }, { name: '毛利率', colspan: 1 }]
        ],
        cpsRobot: [
            [{ name: '序号', colspan: 1 }, { name: '时间', colspan: 1 }, { name: '机器人微信号', colspan: 1 }, { name: '机器人名称', colspan: 1 }, { name: 'time1', colspan: 1 }, { name: 'time2', colspan: 1 }, { name: 'time3', colspan: 1 }, { name: 'time4', colspan: 1 }, { name: '新增人数', colspan: 1 }, { name: '订单总量', colspan: 1, canSort: true, sortBy: 'order_total_number' }, { name: '淘宝单量', colspan: 1 }, { name: '京东单量', colspan: 1 }, { name: '拼多多单量', colspan: 1 }]
        ],
        cpsCapitalDetail: [
            [{ name: '数据库', colspan: 1 }, { name: '首单奖励', colspan: 1 }, { name: '人为修改', colspan: 1 }, { name: '签到奖励', colspan: 1 }, { name: '提成奖励', colspan: 1 }, { name: '申请提现', colspan: 1 }, { name: '消费补贴', colspan: 1 }, { name: '维权扣除', colspan: 1 }, { name: '退回积分', colspan: 1 }, { name: '申请提现未打款', colspan: 1 }, { name: '提现成功', colspan: 1 }, { name: '提现拒绝退回', colspan: 1 }, { name: '提现拒绝没收', colspan: 1 }, { name: '用户余额', colspan: 1 }]
        ],
        cpsHandData: [
            [{ name: '时间', colspan: 1 }, { name: '平台', colspan: 1 }, { name: '预估收入', colspan: 1 }, { name: '结算收入', colspan: 1 }, { name: '数据库预估收入', colspan: 1 }, { name: '数据库结算收入', colspan: 1 }, { name: '预估差异', colspan: 1 }, { name: '结算差异', colspan: 1 }, { name: '操作', colspan: 1 }]
        ],
        cpsHandDetail: [
            [{ name: '时间', colspan: 1 }, { name: '平台', colspan: 1 }, { name: '联盟账号', colspan: 1 }, { name: '联盟ID', colspan: 1 }, { name: '预估收入', colspan: 1 }, { name: '结算收入', colspan: 1 }, { name: '数据库预估收入', colspan: 1 }, { name: '数据库结算收入', colspan: 1 }, { name: '预估差异', colspan: 1 }, { name: '结算差异', colspan: 1 }]
        ],
        userList: [
            [{ name: '', colspan: 1 }, { name: '用户ID', colspan: 1 }, { name: '级别', colspan: 1 }, { name: '头像', colspan: 1 }, { name: '昵称', colspan: 1 }, { name: '电话号码', colspan: 1 }, { name: '性别', colspan: 1 }, { name: '微信号', colspan: 1 }, { name: '邀请码', colspan: 1 }, { name: '余额', colspan: 1 }, { name: '已提现金额', colspan: 1 }, { name: '创建时间', colspan: 1 }, { name: '最后登陆时间', colspan: 1 }, { name: '操作', colspan: 1 }]
        ],
        teamList: [
            [{ name: '用户ID', colspan: 1 }, { name: '级别', colspan: 1 }, { name: '头像', colspan: 1 }, { name: '昵称', colspan: 1 }, { name: '微信号', colspan: 1 }, { name: '电话号码', colspan: 1 }, { name: '上级ID', colspan: 1 }, { name: '团长ID', colspan: 1 }, { name: '总监ID', colspan: 1 }, { name: '性别', colspan: 1 }, { name: '付款订单总金额', colspan: 1 }, { name: '付款订单总数量', colspan: 1 }, { name: '余额', colspan: 1 }, { name: '已提现金额', colspan: 1 }, { name: '团队总人数', colspan: 1 }, { name: '直邀人数', colspan: 1 }, { name: '其它直邀人数', colspan: 1 }, { name: '总返利' }, { name: '个人返利' }, { name: '团队返利' }, { name: '创建时间', colspan: 1 }, { name: '最后登陆时间', colspan: 1 }]
        ],
        orderList: [
            [{ name: '订单编号', colspan: 1 }, { name: '订单标题', colspan: 1 }, { name: '下单用户', colspan: 1 }, { name: '下单用户头像', colspan: 1 }, { name: '订单金额', colspan: 1 }, { name: '平台佣金', colspan: 1 }, { name: '用户佣金', colspan: 1 }, { name: '订单状态', colspan: 1 }, { name: '订单平台', colspan: 1 }, { name: '用户直接返佣', colspan: 1 }, { name: '用户间接返佣', colspan: 1 }, { name: '团长返佣', colspan: 1 }, { name: '总监返佣', colspan: 1 }, { name: '订单创建时间', colspan: 1 }, { name: '订单更新时间', colspan: 1 }, { name: '淘宝子订单号', colspan: 1 }, { name: '商品数量', colspan: 1 }, { name: '商品单价', colspan: 1 }, { name: '付款金额', colspan: 1 }, { name: '佣金比例', colspan: 1 }, { name: '佣金金额', colspan: 1 }, { name: '补贴比例', colspan: 1 }, { name: '补贴金额', colspan: 1 }, { name: '提成比例', colspan: 1 }, { name: '技术服务费比例', colspan: 1 }, { name: '技术服务费', colspan: 1 }, { name: '付款预估收益', colspan: 1 }, { name: '结算预估收益', colspan: 1 }, { name: '付定金时间', colspan: 1 }, { name: '定金淘客付款时间', colspan: 1 }, { name: '定金付款金额', colspan: 1 }]
        ],
        orderList1: [
            [{ name: '订单编号', colspan: 1 }, { name: '订单标题', colspan: 1 }, { name: '下单用户', colspan: 1 }, { name: '商品ID', colspan: 1 }, { name: '订单金额', colspan: 1 }, { name: '平台佣金', colspan: 1 }, { name: '用户佣金', colspan: 1 }, { name: '订单状态', colspan: 1 }, { name: '订单平台', colspan: 1 }, { name: '用户直接返佣', colspan: 1 }, { name: '用户间接返佣', colspan: 1 }, { name: '团长返佣', colspan: 1 }, { name: '总监返佣', colspan: 1 }, { name: '订单创建时间', colspan: 1 }, { name: '订单更新时间', colspan: 1 }, { name: '淘宝子订单号', colspan: 1 }, { name: '商品数量', colspan: 1 }, { name: '商品单价', colspan: 1 }, { name: '付款金额', colspan: 1 }, { name: '佣金比例', colspan: 1 }, { name: '佣金金额', colspan: 1 }, { name: '补贴比例', colspan: 1 }, { name: '补贴金额', colspan: 1 }, { name: '提成比例', colspan: 1 }, { name: '技术服务费比例', colspan: 1 }, { name: '技术服务费', colspan: 1 }, { name: '付款预估收益', colspan: 1 }, { name: '结算预估收益', colspan: 1 }, { name: '付定金时间', colspan: 1 }, { name: '定金淘客付款时间', colspan: 1 }, { name: '定金付款金额', colspan: 1 }]
        ],
        withdrawList: [
            [{ name: '序号', colspan: 1 }, { name: '提现用户', colspan: 1 }, { name: '提现金额', colspan: 1 }, { name: '提现状态', colspan: 1 }, { name: '提现平台', colspan: 1 }, { name: '提现创建时间', colspan: 1 }, { name: '提现变动时间', colspan: 1 }, { name: '操作', colspan: 1 }]
        ],
        materialList: [
            [{ name: '序号', colspan: 1 }, { name: '类别', colspan: 1 }, { name: '关键字', colspan: 1 }, { name: '标题', colspan: 1 }, { name: '状态', colspan: 1 }, { name: '内容', colspan: 1 }, { name: '图片', colspan: 1 }, { name: '创建人', colspan: 1 }, { name: '修改人', colspan: 1 }, { name: '创建时间', colspan: 1 }, { name: '修改时间', colspan: 1 }, { name: '操作', colspan: 1 }]
        ],
        orderSalesList: [
            [{ name: '' }, { name: '商品ID' }, { name: '商品名称' }, { name: '商品价格' }, { name: '销售数量' }, { name: '平台' }, { name: '付款预估收入' }, { name: '付款金额' }]
        ],
        teamSortList: [
            [{ name: '用户ID' }, { name: '级别' }, { name: '手机号' }, { name: '昵称' }, { name: '微信号' }, { name: '数量|金额' }, { name: '统计时间' }, { name: '上级ID' }, { name: '上级昵称' }]
        ],
        cpsDealMonth: [
            // [{name: '日期'}, {name: '订单笔数'}, {name: '订单金额'}, {name: '预估服务收入'}, {name: '预估代理人酬金'}, {name: '预估技术服务费'}, {name: '累计预估服务收入'}, {name: '累计预估代理人酬金'}, {name: '累积预估技术服务费'}, {name: '结算订单笔数'}, {name: '结算服务收入'}, {name: '结算代理人酬金'}, {name: '结算技术服务费'}, {name: '维权订单服务收入'}, {name: '维权订单代理人酬金'}, {name: '维权订单技术服务费'}, {name: '冻结订单服务收入'}, {name: '冻结订单代理人酬金'}, {name: '冻结订单技术服务费'}]
        ],
        cpsdealYear: [
            [{ name: '月份' }, { name: '订单笔数' }, { name: '订单金额' }, { name: '预估服务收入' }, { name: '预估代理人酬金' }, { name: '预估技术服务费' }, { name: '累计预估服务收入' }, { name: '累计预估代理人酬金' }, { name: '累积预估技术服务费' }, { name: '结算订单笔数' }, { name: '结算服务收入' }, { name: '结算代理人酬金' }, { name: '结算技术服务费' }, { name: '维权订单服务收入' }, { name: '维权订单代理人酬金' }, { name: '维权订单技术服务费' }, { name: '冻结订单服务收入' }, { name: '冻结订单代理人酬金' }, { name: '冻结订单技术服务费' }]
        ],
        cpsdealAccounts: [
            [{ name: '平台' }, { name: '账户' }, { name: '订单笔数' }, { name: '订单金额' }, { name: '预估服务收入' }, { name: '预估代理人酬金' }, { name: '预估技术服务费' }, { name: '累计预估服务收入' }, { name: '累计预估代理人酬金' }, { name: '累积预估技术服务费' }, { name: '结算订单笔数' }, { name: '结算服务收入' }, { name: '结算代理人酬金' }, { name: '结算技术服务费' }, { name: '维权订单服务收入' }, { name: '维权订单代理人酬金' }, { name: '维权订单技术服务费' }, { name: '冻结订单服务收入' }, { name: '冻结订单代理人酬金' }, { name: '冻结订单技术服务费' }]
        ],
        cpsdealAccountsByPlat: [
            [{ name: '公司' }, { name: '平台' }, { name: '订单笔数' }, { name: '订单金额' }, { name: '预估服务收入' }, { name: '预估代理人酬金' }, { name: '预估技术服务费' }, { name: '累计预估服务收入' }, { name: '累计预估代理人酬金' }, { name: '累积预估技术服务费' }, { name: '结算订单笔数' }, { name: '结算服务收入' }, { name: '结算代理人酬金' }, { name: '结算技术服务费' }, { name: '维权订单服务收入' }, { name: '维权订单代理人酬金' }, { name: '维权订单技术服务费' }, { name: '冻结订单服务收入' }, { name: '冻结订单代理人酬金' }, { name: '冻结订单技术服务费' }]
        ],
        cpsperMonth: [
            // [{name: '日期', rowspan: 2}, {name: '总订单量', rowspan: 2}, {name: ' 当日预估金额', colspan: 6}, {name: ' 结算金额', colspan: 5}, {name: '税前毛利率', colspan: 2}, {name: '税后毛利率', colspan: 3}],
            [{ name: '日期', rowspan: 2 }, { name: '总订单量', rowspan: 2 }, { name: '付款订单总金额（GMV）' }, { name: '预估服务收入' }, { name: '预估代理人酬金' }, { name: '预估技术服务费' }, { name: '预估毛利（税前）' }, { name: '预估毛利（税后）' }, { name: '结算服务收入' }, { name: '结算代理人酬金' }, { name: '技术服务费' }, { name: '毛利（税前）' }, { name: '毛利（税后）' }, { name: '预估毛利率' }, { name: '结算毛利率' }, { name: '预估毛利率' }, { name: '累计预估毛利' }, { name: '结算毛利率' }]
        ],
        cpsperYear: [
            // [{name: '日期', rowspan: 2}, {name: '总订单量', rowspan: 2}, {name: ' 当日预估金额', colspan: 6}, {name: ' 结算金额', colspan: 5}, {name: '税前毛利率', colspan: 2}, {name: '税后毛利率', colspan: 3}],
            [{ name: '日期', rowspan: 2 }, { name: '总订单量', rowspan: 2 }, { name: '付款订单总金额（GMV）' }, { name: '预估服务收入' }, { name: '预估代理人酬金' }, { name: '预估技术服务费' }, { name: '预估毛利（税前）' }, { name: '预估毛利（税后）' }, { name: '结算服务收入' }, { name: '结算代理人酬金' }, { name: '技术服务费' }, { name: '毛利（税前）' }, { name: '毛利（税后）' }, { name: '预估毛利率' }, { name: '结算毛利率' }, { name: '预估毛利率' }, { name: '累计预估毛利' }, { name: '结算毛利率' }]
        ],
        cpsestYear: [
            [{ name: '序号' }, { name: '平台' }, { name: '营销账号' }, { name: '收款账户' }, { name: '1月' }, { name: '2月' }, { name: '3月' }, { name: '4月' }, { name: '5月' }, { name: '6月' }, { name: '7月' }, { name: '8月' }, { name: '9月' }, { name: '10月' }, { name: '11月' }, { name: '12月' }, { name: '合计' }]
        ],
        cpsestYearAll: [
            [{ name: '公司' }, { name: '平台' }, { name: '1月' }, { name: '2月' }, { name: '3月' }, { name: '4月' }, { name: '5月' }, { name: '6月' }, { name: '7月' }, { name: '8月' }, { name: '9月' }, { name: '10月' }, { name: '11月' }, { name: '12月' }, { name: '合计' }]
        ],
        cpsestMonth: [
            [{ name: '序号' }, { name: '平台' }, { name: '营销账号' }, { name: '收款账户' }, { name: '预计结算(含税)' }, { name: '小计' }, { name: '税率' }, { name: '不含税金额' }, { name: '增值税金额' }, { name: '技术服务费' }, { name: '备注' }]
        ],
        cpsestMonthAll: [
            [{ name: '公司' }, { name: '平台' }, { name: '暂估结算(含税)' }, { name: '税率6%' }, { name: '不含税金额' }, { name: '增值税金额' }, { name: '技术服务费' }, { name: '备注' }]
        ],
        cpsremMonth: [
            [{ name: '序号' }, { name: '平台' }, { name: '账户' }, { name: '结算代理人酬金' }, { name: '维权订单酬金' }, { name: '维权失败订单酬金' }, { name: '维权失败订单酬金' }, { name: '备注' }]
        ],
        cpsremMonthAll: [
            [{ name: '公司' }, { name: '平台' }, { name: '结算代理人酬金' }, { name: '维权订单酬金' }, { name: '维权失败订单酬金' }, { name: '应付代理人酬金' }, { name: '备注' }]
        ],
        cpsremYear: [
            [{ name: '序号' }, { name: '平台' }, { name: '账户' }, { name: '1月' }, { name: '2月' }, { name: '3月' }, { name: '4月' }, { name: '5月' }, { name: '6月' }, { name: '7月' }, { name: '8月' }, { name: '9月' }, { name: '10月' }, { name: '11月' }, { name: '12月' }, { name: '合计' }, { name: '备注' }]
        ],
        cpsremYearAll: [
            [{ name: '公司' }, { name: '平台' }, { name: '1月' }, { name: '2月' }, { name: '3月' }, { name: '4月' }, { name: '5月' }, { name: '6月' }, { name: '7月' }, { name: '8月' }, { name: '9月' }, { name: '10月' }, { name: '11月' }, { name: '12月' }, { name: '合计' }, { name: '上年数' }]
        ],
        cpsgenYear: [
            [{ name: '序号' }, { name: '月份' }, { name: '推新奖励' }, { name: '签到奖励' }, { name: '首单奖励' }, { name: '免单金额' }, { name: '合计' }, { name: '备注' }]
        ],
        cpsgenMonth: [
            [{ name: '序号' }, { name: '日期' }, { name: '推新奖励' }, { name: '签到奖励' }, { name: '首单奖励' }, { name: '免单金额' }, { name: '合计' }, { name: '备注' }]
        ],
        cpsamountPersonal: [
            [{ name: '序号', rowspan: 3 }, { name: '用户名称', rowspan: 3 }, { name: '姓名', rowspan: 3 }, { name: '期初余额', colspan: 6 }, { name: '本期暂估增加', colspan: 8 }, { name: '本期提现', colspan: 3 }, { name: '期末已提未付金额', rowspan: 3 }, { name: '暂估提现余额', colspan: 3 }, { name: '可提现余额', rowspan: 3 }, { name: '应付余额', rowspan: 3 }, { name: '备注', rowspan: 3 }],
            [{ name: '已提未付', rowspan: 2 }, { name: '暂估提现余额', colspan: 3 }, { name: '可提现余额', rowspan: 2 }, { name: '应付提现余额', rowspan: 2 }, { name: '四川云瞻', colspan: 6 }, { name: '成都云瞻' }, { name: '本期暂估合计', rowspan: 2 }, { name: '申请提现', rowspan: 2 }, { name: '已提已付', rowspan: 2 }, { name: '已提未付', rowspan: 2 }, { name: '四川云瞻', rowspan: 2 }, { name: '成都云瞻', rowspan: 2 }, { name: '暂估提现合计', rowspan: 2 }],
            [{ name: '四川云瞻' }, { name: '成都云瞻' }, { name: '暂估提现合计' }, { name: '推新奖励' }, { name: '签到奖励' }, { name: '首单奖励' }, { name: '推广费合计' }, { name: '代理人酬金' }, { name: '四川云瞻小计' }, { name: '代理人酬金' }]
        ],
        cpswithdrawMonth: [
            [{ name: '序号', rowspan: 3 }, { name: '日期', rowspan: 3 }, { name: '本期暂估增加', colspan: 8 }, { name: '本期提现', colspan: 3 }, { name: '期末已提未付金额', rowspan: 3 }, { name: '暂估提现余额', colspan: 3 }, { name: '可提现余额', rowspan: 3 }, { name: '应付余额', rowspan: 3 }, { name: '备注', rowspan: 3 }],
            [{ name: '四川云瞻', colspan: 6 }, { name: '成都云瞻' }, { name: '本期暂估合计', rowspan: 2 }, { name: '申请提现', rowspan: 2 }, { name: '已提已付', rowspan: 2 }, { name: '已提未付', rowspan: 2 }, { name: '四川云瞻', rowspan: 2 }, { name: '成都云瞻', rowspan: 2 }, { name: '暂估提现合计', rowspan: 2 }],
            [{ name: '推新奖励' }, { name: '签到奖励' }, { name: '首单奖励' }, { name: '推广费合计' }, { name: '代理人酬金' }, { name: '四川云瞻小计' }, { name: '代理人酬金' }]
        ],
        cpswithdrawYear: [
            [{ name: '序号', rowspan: 3 }, { name: '日期', rowspan: 3 }, { name: '本期暂估增加', colspan: 8 }, { name: '本期提现', colspan: 3 }, { name: '期末已提未付金额', rowspan: 3 }, { name: '暂估提现余额', colspan: 3 }, { name: '可提现余额', rowspan: 3 }, { name: '应付余额', rowspan: 3 }, { name: '备注', rowspan: 3 }],
            [{ name: '四川云瞻', colspan: 6 }, { name: '成都云瞻' }, { name: '本期暂估合计', rowspan: 2 }, { name: '申请提现', rowspan: 2 }, { name: '已提已付', rowspan: 2 }, { name: '已提未付', rowspan: 2 }, { name: '四川云瞻', rowspan: 2 }, { name: '成都云瞻', rowspan: 2 }, { name: '暂估提现合计', rowspan: 2 }],
            [{ name: '推新奖励' }, { name: '签到奖励' }, { name: '首单奖励' }, { name: '推广费合计' }, { name: '代理人酬金' }, { name: '四川云瞻小计' }, { name: '代理人酬金' }]
        ],
        sxyTag: [
            [{ name: '标签名称' }, { name: '类型' }, { name: '排序' }, { name: '创建人' }, { name: '创建时间' }, { name: '修改时间' }, { name: '操作' }]
        ],
        sxyArticle: [
            [{ name: '序号' }, { name: '文章标题' }, { name: '封面图' }, { name: '状态' }, { name: '类型' }, { name: '标签' }, { name: '创建时间' }, { name: '修改时间' }, { name: '操作人' }, { name: '操作' }]
        ],
        prizeList: [
            [{ name: '序号' }, { name: '奖励详情' }]
        ]
    },
    views: {
        '/auth_user/index': {
            name: 'user-manager',
            title: '权限管理',
            subTitle1: '员工管理'
        },
        '/auth_role/index': {
            name: 'role-manager',
            title: '权限管理',
            subTitle1: '角色管理'
        },
        '/auth_auth/index': {
            name: 'permission-manager',
            title: '权限管理',
            subTitle1: '权限管理'
        },
        '/cps/statistics': {
            name: 'cps-count',
            title: '首页',
            subTitle1: 'CPS统计'
        },
        '/app/statistics': {
            name: 'app-count',
            title: '首页',
            subTitle1: 'APP统计'
        },
        '/cps/collect': {
            name: 'cps-collect',
            title: 'CPS管理',
            subTitle1: '数据汇总'
        },
        '/cps/taobao': {
            name: 'cps-taobao',
            title: 'CPS管理',
            subTitle1: '淘宝订单'
        },
        '/cps/jingdong': {
            name: 'cps-jingdong',
            title: 'CPS管理',
            subTitle1: '京东订单'
        },
        '/cps/pdd': {
            name: 'cps-pdd',
            title: 'CPS管理',
            subTitle1: '拼多多订单'
        },
        '/cps/robot': {
            name: 'cps-robot',
            title: 'CPS管理',
            subTitle1: '机器人管理'
        },
        '/cps/robot/order': {
            name: 'cps-robot-order',
            title: 'CPS管理',
            subTitle1: '机器人订单'
        },
        '/cps/accounts/order': {
            name: 'cps-accounts-order',
            title: 'CPS管理',
            subTitle1: '联盟账号订单'
        },
        '/cps/company/order': {
            name: 'cps-company-order',
            title: 'CPS管理',
            subTitle1: '公司账号订单'
        },
        '/cps/capital': {
            name: 'cps-capital',
            title: 'CPS管理',
            subTitle1: '资金管理'
        },
        '/cps/handdata': {
            name: 'cps-handdata',
            title: 'CPS管理',
            subTitle1: '淘宝手工数据'
        },
        '/cps/statistics/count': {
            name: 'cps-statistics-count',
            title: '统计',
            subTitle1: 'CPS统计'
        },
        '/user/list': {
            name: 'user-list',
            title: '用户管理',
            subTitle1: '用户列表'
        },
        '/order/list': {
            name: 'order-list',
            title: '订单管理',
            subTitle1: '订单列表'
        },
        '/order/saleslist': {
            name: 'order-saleslist',
            title: '订单管理',
            subTitle1: '销量排行'
        },
        '/cash/list': {
            name: 'withdraw-list',
            title: '提现管理',
            subTitle1: '提现列表'
        },
        '/material/list': {
            name: 'material-list',
            title: '素材管理',
            subTitle1: '素材列表'
        },
        '/material/label': {
            name: 'material-label',
            title: '素材管理',
            subTitle1: '素材标签列表'
        },
        '/team/list': {
            name: 'team-sort-list',
            title: '用户管理',
            subTitle1: '团队排行'
        },
        '/user/rank': {
            name: 'user-rank-list',
            title: '用户管理',
            subTitle1: '用户排行'
        },
        '/cpsdeal/accounts': {
            name: 'cpsdeal-accounts',
            title: 'CPS交易数据',
            subTitle1: '账户交易数据'
        },
        '/cpsdeal/month': {
            name: 'cpsdeal-month',
            title: 'CPS交易数据',
            subTitle1: '月交易数据'
        },
        '/cpsdeal/year': {
            name: 'cpsdeal-year',
            title: 'CPS交易数据',
            subTitle1: '年度交易数据'
        },
        '/cpsper/month': {
            name: 'cpsper-month',
            title: 'CPS业绩统计',
            subTitle1: '月业绩统计'
        },
        '/cpsper/year': {
            name: 'cpsper-year',
            title: 'CPS业绩统计',
            subTitle1: '年业绩统计'
        },
        '/cpsest/month': {
            name: 'cpsest-month',
            title: 'CPS暂估收入',
            subTitle1: '月暂估收入'
        },
        '/cpsest/year': {
            name: 'cpsest-year',
            title: 'CPS暂估收入',
            subTitle1: '年暂估收入'
        },
        '/cpsrem/month': {
            name: 'cpsrem-month',
            title: 'CPS代理人酬金',
            subTitle1: '月代理人酬金'
        },
        '/cpsrem/year': {
            name: 'cpsrem-year',
            title: 'CPS代理人酬金',
            subTitle1: '年代理人酬金'
        },
        '/cpsgen/month': {
            name: 'cpsgen-month',
            title: 'CPS推广费用',
            subTitle1: '月度推广费用'
        },
        '/cpsgen/year': {
            name: 'cpsgen-year',
            title: 'CPS推广费用',
            subTitle1: '年度推广费用'
        },
        '/cpsamount/personal': {
            name: 'cpsamount-personal',
            title: 'CPS代理人酬金账户',
            subTitle1: '个人账户'
        },
        '/cpswithdraw/month': {
            name: 'cpswithdraw-month',
            title: 'CPS提现',
            subTitle1: '月度提现统计'
        },
        '/cpswithdraw/year': {
            name: 'cpswithdraw-year',
            title: 'CPS提现',
            subTitle1: '年度提现统计'
        },
        '/activity/prizepoollist': {
            name: 'activity-prizepoollist',
            title: '活动统计',
            subTitle1: '奖金池统计'
        },
        '/college/label': {
            name: 'sxy-tag',
            title: '素材管理',
            subTitle1: '标签'
        },
        '/college/article': {
            name: 'sxy-article',
            title: '素材管理',
            subTitle1: '文章'
        },
        '/dashbord/operation':{
            name:'total-user',
            title:"数据工作台",
            subTitle1: '运营数据'
        },
        '/directed/list': {
            name: 'directed-list',
            title: '招商管理',
            subTitle1: '定向佣金列表'
        }
    }
}