/**
 * 所有配置信息
 */
export default {
    baseUrl: 'http://tongji.chenlong.com',
    // baseUrl: 'http://dash.yunzhanxinxi.com',
    urls: {

    },
    // 图片地址
    images:{
        menu: {
            权限管理: [
                require('@/assets/menu_cpm_normal.png'),
                require('@/assets/menu_cpm_normal.png')
            ],
            首页: [
                require('@/assets/home_selected.png'),
                require('@/assets/home_selected-1.png')
            ],
            cps管理: [
                require('@/assets/menu_cps_selected.png'),
                require('@/assets/menu_cps_normal.png')
            ],
            统计: [
                require('@/assets/statistical_selected.png'),
                require('@/assets/statistical_normal.png')
            ]
        }
    },
    // 不同组件名称
    components: {

    },
    // 表头
    tableHeader: {
        userManager: [
            [{name:'账户名', colspan: 1},{name: '用户姓名', colspan: 1},{name: '用户角色', colspan: 1},{name: '管理员', colspan: 1},{name: '创建时间', colspan: 1},{name: '操作', colspan: 1}]
        ],
        roleManager: [
            [{name:'名称', colspan: 1},{name: '创建时间', colspan: 1},{name: '操作', colspan: 1}]
        ],
        permissionManager: [],
        cpsCollect: [
            [{name: '', colspan: 1}, {name: '订单付款', colspan: 2}, {name: '订单结算佣金', colspan: 2}, {name: '预估佣金', colspan: 2}, {name: '冻结订单', colspan: 2}, {name: '维权订单', colspan: 2},{name: '退款订单', colspan: 2}, {name: '', colspan: 7}],
            [{name: '日期', colspan: 1}, {name: '订单成交额', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '结算佣金金额', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '订单预估金额', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '冻结佣金', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '维权佣金', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '退款佣金', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '预估返利金额', colspan: 1}, {name: '结算返利金额', colspan: 1}, {name: '新用户奖励', colspan: 1}, {name: '签到奖励', colspan: 1}, {name: '毛利', colspan: 1}, {name:'毛利率', colspan: 1}, {name: '技术服务费', colspan: 1}]
        ],
        cpsTaobao: [
            [{name: '', colspan: 1}, {name: '订单付款', colspan: 2}, {name: '订单结算佣金', colspan: 2}, {name: '预估佣金', colspan: 2}, {name: '冻结订单', colspan: 2}, {name: '维权订单', colspan: 2},{name: '退款订单', colspan: 2}, {name: '', colspan: 7}],
            [{name: '日期', colspan: 1}, {name: '订单成交额', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '结算佣金金额', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '订单预估金额', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '冻结佣金', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '维权佣金', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '退款佣金', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '预估返利金额', colspan: 1}, {name: '结算返利金额', colspan: 1}, {name: '毛利', colspan: 1}, {name:'毛利率', colspan: 1}, {name: '技术服务费', colspan: 1}]
        ],
        cpsJingdong: [
            [{name: '', colspan: 1}, {name: '订单付款', colspan: 2}, {name: '订单结算佣金', colspan: 2}, {name: '预估佣金', colspan: 2}, {name: '冻结订单', colspan: 2}, {name: '维权订单', colspan: 2},{name: '退款订单', colspan: 2}, {name: '', colspan: 7}],
            [{name: '日期', colspan: 1}, {name: '订单成交额', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '结算佣金金额', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '订单预估金额', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '冻结佣金', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '维权佣金', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '退款佣金', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '预估返利金额', colspan: 1}, {name: '结算返利金额', colspan: 1}, {name: '毛利', colspan: 1}, {name:'毛利率', colspan: 1}]
        ],
        cpsPdd: [
            [{name: '', colspan: 1}, {name: '订单付款', colspan: 2}, {name: '订单结算佣金', colspan: 2}, {name: '预估佣金', colspan: 2}, {name: '冻结订单', colspan: 2}, {name: '维权订单', colspan: 2},{name: '退款订单', colspan: 2}, {name: '', colspan: 7}],
            [{name: '日期', colspan: 1}, {name: '订单成交额', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '结算佣金金额', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '订单预估金额', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '冻结佣金', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '维权佣金', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '退款佣金', colspan: 1}, {name: '订单数量', colspan: 1}, {name: '预估返利金额', colspan: 1}, {name: '结算返利金额', colspan: 1}, {name: '毛利', colspan: 1}, {name:'毛利率', colspan: 1}]
        ],
        cpsRobot: [
            [{name: '序号', colspan: 1}, {name: '时间', colspan: 1}, {name: '机器人微信号', colspan: 1}, {name: '机器人名称', colspan: 1}, {name: 'time1', colspan: 1}, {name: 'time2', colspan: 1}, {name: 'time3', colspan: 1}, {name: 'time4', colspan: 1}, {name: '新增人数', colspan: 1}, {name: '订单总量', colspan: 1, canSort: true, sortBy: 'order_total_number'}, {name: '淘宝单量', colspan: 1}, {name: '京东单量', colspan: 1}, {name: '拼多多单量', colspan: 1}]
        ],
        cpsCapitalDetail: [
            [{name: '数据库', colspan: 1}, {name: '首单奖励', colspan: 1}, {name: '人为修改', colspan: 1}, {name: '签到奖励', colspan: 1}, {name: '提成奖励', colspan: 1}, {name: '申请提现', colspan: 1}, {name: '消费补贴', colspan: 1}, {name: '维权扣除', colspan: 1}, {name: '退回积分', colspan: 1}, {name: '申请提现未打款', colspan: 1}, {name: '提现成功', colspan: 1}, {name: '提现拒绝退回', colspan: 1}, {name: '提现拒绝没收', colspan: 1}, {name: '用户余额', colspan: 1}]
        ],
        cpsHandData: [
            [{name: '时间', colspan: 1}, {name: '平台', colspan: 1}, {name: '预估收入', colspan: 1}, {name: '结算收入', colspan: 1}, {name: '数据库预估收入', colspan: 1}, {name: '数据库结算收入', colspan: 1}, {name: '操作', colspan: 1}]
        ],
        cpsHandDetail: [
            [{name: '时间', colspan: 1}, {name: '平台', colspan: 1}, {name: '联盟账号', colspan: 1}, {name: '联盟ID', colspan: 1}, {name: '预估收入', colspan: 1}, {name: '结算收入', colspan: 1}, {name: '数据库预估收入', colspan: 1}, {name: '数据库结算收入', colspan: 1}, {name: '预估差异', colspan: 1}, {name: '结算差异', colspan: 1}]
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
        }
    }
}