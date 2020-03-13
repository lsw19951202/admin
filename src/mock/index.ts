import dts from './datas'
import Setting from '@/setting'
import Mock from 'mockjs'

import VueCookie from 'vue-cookies'
import Vue from 'vue'

Vue.use(VueCookie)

Mock.setup({
    timeout: '200-400'
})

Mock.mock(/\/auth_auth\/full_menu[\s\S]*?/, 'get', () => {
    return dts["/auth_auth/full_menu"]
})

Mock.mock(/\/auth_user\/index[\s\S]*?/, 'get', () => {
    return dts["/auth_user/index"]
})

Mock.mock(/\/auth_user\/auth_user[\s\S]*?/, 'get', () => {
    return dts["/auth_user/auth_user"]
})

Mock.mock(/\/auth_role\/index[\s\S]*?/, 'get', () => {
    return dts["/auth_role/index"]
})

Mock.mock(/\/auth_role\/auth_list[\s\S]*?/, 'get', () => {
    return dts["/auth_role/auth_list"]
})

Mock.mock(/\/auth_auth\/index[\s\S]*?/, 'get', () => {
    return dts["/auth_auth/index"]
})

Mock.mock(/\/auth\/index[\s\S]*?/, 'get', () => {
    return dts["/auth/index"]
})

// Mock.mock('/login/login', 'get', () => {
//     return dts['/login/login']
// })

Mock.mock(/\/auth_user\/auth_tree[\s\S]*?/, 'get', () => {
    return dts['/auth_user/auth_tree']
})

Mock.mock(/\/api\/statistics\/pool[\s\S]*?/, 'get', () => {
    return dts['/api/statistics/pool']
})

Mock.mock(/\/api\/statistics\/yesterday[\s\S]*?/, () => {
    return dts['/api/statistics/yesterday']
})

Mock.mock(/\/api\/statistics\/yesterday[\s\S]*?/, () => {
    return dts['/api/statistics/yesterday?order_type=2']
})

Mock.mock(/\/api\/statistics\/detail[\s\S]*?/, 'get', () => {
    return dts['/api/statistics/detail']
})

Mock.mock(/\/api\/statistics\/robot\?[\s\S]*?/, 'get', () => {
    return dts['/api/statistics/robot']
})

Mock.mock(/\/api\/statistics\/robot-detail\?[\s\S]*?/, 'get', () => {
    return dts['/api/statistics/robot-detail']
})

Mock.mock(/\/api\/new\/robot\?[\s\S]*?order_type=2[\s\S]*?/, 'get', () => {
    return dts['/api/new/robot?order_type=2']
})

Mock.mock(/\/api\/new\/robot\?[\s\S]*?order_type=&[\s\S]*?/, 'get', () => {
    return dts['/api/new/robot?order_type=0']
})

Mock.mock(/\/api\/new\/robot\?[\s\S]*?order_type=1[\s\S]*?/, 'get', () => {
    return dts['/api/new/robot?order_type=1']
})

Mock.mock(/\/api\/new\/robot\?[\s\S]*?order_type=3[\s\S]*?/, 'get', () => {
    return dts['/api/new/robot?order_type=3']
})

Mock.mock(/\/api\/new\/field\?order_type=&[\s\S]*?/, 'get', () => {
    return dts['/api/new/field?order_type=0']
})

Mock.mock(/\/api\/new\/field\?order_type=1[\s\S]*?/, 'get', () => {
    return dts['/api/new/field?order_type=1']
})

Mock.mock(/\/api\/new\/field\?order_type=2[\s\S]*?/, 'get', () => {
    return dts['/api/new/field?order_type=2']
})

Mock.mock(/\/api\/new\/field\?order_type=3[\s\S]*?/, 'get', () => {
    return dts['/api/new/field?order_type=3']
})

Mock.mock(/\/api\/statistics\/capital\?[\s\S]*?page=1[\s\S]*?/, 'get', () => {
    return dts['/api/statistics/capital?page=1']
})

Mock.mock(/\/api\/statistics\/capital\?[\s\S]*?page=2[\s\S]*?/, 'get', () => {
    return dts['/api/statistics/capital?page=2']
})

Mock.mock(/\/api\/statistics\/capital-detail\?[\s\S]*?/, 'get', () => {
    return dts['/api/statistics/capital-detail']
})

Mock.mock(/\/api\/statistics\/all\?[\s\S]*?/, 'get', () => {
    return dts['/api/statistics/all']
})