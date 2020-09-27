<template>
    <div class="content">
        <content-header v-bind:title="title" v-bind:subTitle1="subTitle1" v-bind:subTitle2="subTitle2"></content-header>
        <component :is="currentView" v-if="isContentAlive" ref="contentView"></component>
    </div>
</template>
<script>
const robotListVue = () => import('@/views/robotList.vue')
const zsLogListVue = () => import('@/views/zsLogList.vue')
const servicegoodslListVue = () => import('@/views/servicegoodslList.vue')
const directedgoodsListVue = () => import('@/views/directedgoodsList.vue')
const activegoodsListVue = () => import('@/views/activegoodsList.vue')
const dailygoodsListVue = () => import('@/views/dailygoodsList.vue')
const zsgoodsListVue = () => import('@/views/zsgoodsList.vue')
const channerListVue = () => import('@/views/channerList.vue')
const pushListVue = () => import('@/views/pushList.vue')
const Setting = () => import('@/setting')
const Header = () => import('../content/header.vue')
const CardContainer = () => import('../content/cardContainer.vue')
const UserManager = () => import('@/views/userManager.vue')
const RoleManager = () => import('@/views/roleManager.vue')
const PermissionManager = () => import('@/views/permissionManager.vue')
const CpsCount = () => import('@/views/cpsCount.vue')
const AppCount = () => import('@/views/appCount.vue')
const CpsCollect = () => import('@/views/cpsCollect.vue')
const CpsTaobao = () => import('@/views/cpsTaobao.vue')
const CpsJingdong = () => import('@/views/cpsJingdong.vue')
const cpsPddVue = () => import('../../views/cpsPdd.vue')
const cpsRobotVue = () => import('../../views/cpsRobot.vue')
const cpsRobotOrderVue = () => import('../../views/cpsRobotOrder.vue')
const cpsAccountsOrderVue = () => import('../../views/cpsAccountsOrder.vue')
const cpsCompanyOrderVue = () => import('../../views/cpsCompanyOrder.vue')
const cpsCapitalVue = () => import('../../views/cpsCapital.vue')
const cpsStatisticsCount = () => import('../../views/cpsStatisticsCount.vue')
const cpsHandData = () => import('../../views/cpsHandData.vue')
const userList = () => import('../../views/userList.vue')
const orderList = () => import('../../views/orderList.vue')
const withdrawListVue = () => import('../../views/withdrawList.vue')
const materialListVue = () => import('../../views/materialList.vue')
const orderSalesListVue = () => import('../../views/orderSalesList.vue')
const teamSortListVue = () => import('../../views/teamSortList.vue')
const userRankListVue = () => import('../../views/userRankList.vue')
const cpsDealMonthVue = () => import('../../views/cpsDealMonth.vue')
const cpsDealYearVue = () => import('../../views/cpsDealYear.vue')
const cpsperMonthVue = () => import('../../views/cpsPerMonth.vue')
const cpsperYearVue = () => import('../../views/cpsPerYear.vue')
const cpsDealAccountsVue = () => import('../../views/cpsDealAccounts.vue')
const cpsestYearVue = () => import('../../views/cpsEstYear.vue')
const cpsestMonthVue = () => import('../../views/cpsEstMonth.vue')
const cpsRemMonthVue = () => import('../../views/cpsRemMonth.vue')
const cpsRemYearVue = () => import('../../views/cpsRemYear.vue')
const cpsGenMonthVue = () => import('../../views/cpsGenMonth.vue')
const cpsGenYearVue = () => import('../../views/cpsGenYear.vue')
const cpsAmountPersonalVue = () => import('../../views/cpsAmountPersonal.vue')
const cpsWithdrawMonthVue = () => import('../../views/cpsWithdrawMonth.vue')
const cpsWithdrawYearVue = () => import('../../views/cpsWithdrawYear.vue')
const activityPrizepoollistVue = () => import('../../views/activityPrizepoollist.vue')
const sxyArticleVue = () => import('../../views/sxyArticle.vue')
const sxyTagVue = () => import('../../views/sxyTag.vue')
const materialLabelVue = () => import('../../views/materialLabel.vue')
// const totalUserVue = () => import('../../views/dataWorkBench.vue')
const totalUserVue = () => import('../../views/benchEarchs.vue')
const directedListVue = () => import('../../views/directedList.vue')
const goodsMaterialVue = () => import('../../views/goodsMaterial.vue')
const posterMaterialVue = () => import('../../views/posterMaterial.vue')
const popupListVue = () => import('../../views/popupList.vue')
const YfdRobotListVue = () => import('../../views/YfdRobotList.vue')

export default {
    props: ['currentView', 'title', 'subTitle1', 'isContentAlive'],
    data: () => {
        return {
            subTitle2: ''
        }
    },
    methods: {
        reload: function(){
            this.$children[1].reload()
        }
    },
    components: {
        'content-header': Header,
        'card-container': CardContainer,
        'user-manager': UserManager,
        'role-manager': RoleManager,
        'permission-manager': PermissionManager,
        'cps-count': CpsCount,
        'app-count': AppCount,
        'cps-collect': CpsCollect,
        'cps-taobao': CpsTaobao,
        'cps-jingdong': CpsJingdong,
        'cps-pdd': cpsPddVue,
        'cps-robot': cpsRobotVue,
        'cps-robot-order': cpsRobotOrderVue,
        'cps-accounts-order': cpsAccountsOrderVue,
        'cps-company-order':cpsCompanyOrderVue,
        'cps-capital': cpsCapitalVue,
        'cps-statistics-count': cpsStatisticsCount,
        'cps-handdata': cpsHandData,
        'user-list': userList,
        'order-list': orderList,
        'withdraw-list': withdrawListVue,
        'material-list': materialListVue,
        'order-saleslist': orderSalesListVue,
        'team-sort-list': teamSortListVue,
        'user-rank-list': userRankListVue,
        'cpsdeal-month': cpsDealMonthVue,
        'cpsdeal-year': cpsDealYearVue,
        'cpsdeal-accounts': cpsDealAccountsVue,
        'cpsper-month': cpsperMonthVue,
        'cpsper-year': cpsperYearVue,
        'cpsest-year': cpsestYearVue,
        'cpsest-month': cpsestMonthVue,
        'cpsrem-month': cpsRemMonthVue,
        'cpsrem-year': cpsRemYearVue,
        'cpsgen-month': cpsGenMonthVue,
        'cpsgen-year': cpsGenYearVue,
        'cpsamount-personal': cpsAmountPersonalVue,
        'cpswithdraw-month': cpsWithdrawMonthVue,
        'cpswithdraw-year': cpsWithdrawYearVue,
        'activity-prizepoollist': activityPrizepoollistVue,
        'sxy-tag': sxyTagVue,
        'sxy-article': sxyArticleVue,
        'material-label': materialLabelVue,
        'total-user':totalUserVue,
        'directed-list': directedListVue,
        'goods-material': goodsMaterialVue,
        'poster-material': posterMaterialVue,
        'popup-list': popupListVue,
        'robot-index': YfdRobotListVue,
        'push-list': pushListVue,
        'channer-list': channerListVue,
        'servicegoodsl-list': servicegoodslListVue,
        'directedgoods-list': directedgoodsListVue,
        'activegoods-list': activegoodsListVue,
        'dailygoods-list': dailygoodsListVue,
        'zsgoods-list': zsgoodsListVue,
        'zslog-list': zsLogListVue,
        'robot-list': robotListVue
    }
}
</script>