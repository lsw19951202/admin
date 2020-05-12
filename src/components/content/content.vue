<template>
    <div class="content">
        <content-header v-bind:title="title" v-bind:subTitle1="subTitle1" v-bind:subTitle2="subTitle2"></content-header>
        <component :is="currentView" v-if="isContentAlive" ref="contentView"></component>
    </div>
</template>
<script>
import Header from '../content/header.vue'
import CardContainer from '../content/cardContainer.vue'
import Setting from '@/setting'
import UserManager from '@/views/userManager.vue'
import RoleManager from '@/views/roleManager.vue'
import PermissionManager from '@/views/permissionManager.vue'
import CpsCount from '@/views/cpsCount.vue'
import AppCount from '@/views/appCount.vue'
import CpsCollect from '@/views/cpsCollect.vue'
import CpsTaobao from '@/views/cpsTaobao.vue'
import CpsJingdong from '@/views/cpsJingdong.vue'
import cpsPddVue from '../../views/cpsPdd.vue'
import cpsRobotVue from '../../views/cpsRobot.vue'
import cpsRobotOrderVue from '../../views/cpsRobotOrder.vue'
import cpsAccountsOrderVue from '../../views/cpsAccountsOrder.vue'
import cpsCompanyOrderVue from '../../views/cpsCompanyOrder.vue'
import cpsCapitalVue from '../../views/cpsCapital.vue'
import cpsStatisticsCount from '../../views/cpsStatisticsCount.vue'
import cpsHandData from '../../views/cpsHandData.vue'
import userList from '../../views/userList.vue'
import orderList from '../../views/orderList.vue'
import withdrawListVue from '../../views/withdrawList.vue'
import materialListVue from '../../views/materialList.vue'
import orderSalesListVue from '../../views/orderSalesList.vue'
import teamSortListVue from '../../views/teamSortList.vue'
import userRankListVue from '../../views/userRankList.vue'
import cpsDealMonthVue from '../../views/cpsDealMonth.vue'
import cpsDealYearVue from '../../views/cpsDealYear.vue'
import cpsperMonthVue from '../../views/cpsPerMonth.vue'
import cpsperYearVue from '../../views/cpsPerYear.vue'
import cpsDealAccountsVue from '../../views/cpsDealAccounts.vue'
import cpsestYearVue from '../../views/cpsEstYear.vue'
import cpsestMonthVue from '../../views/cpsEstMonth.vue'
import cpsRemMonthVue from '../../views/cpsRemMonth.vue'
import cpsRemYearVue from '../../views/cpsRemYear.vue'
import cpsGenMonthVue from '../../views/cpsGenMonth.vue'
import cpsGenYearVue from '../../views/cpsGenYear.vue'
import cpsAmountPersonalVue from '../../views/cpsAmountPersonal.vue'
import cpsWithdrawMonthVue from '../../views/cpsWithdrawMonth.vue'
import cpsWithdrawYearVue from '../../views/cpsWithdrawYear.vue'

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
        'cpswithdraw-year': cpsWithdrawYearVue
    }
}
</script>