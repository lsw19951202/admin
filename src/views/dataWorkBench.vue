<template>
  <div class="detail-container">
    <div class="detail-data-box">
      <div v-show="isShow=='record'">
        <new-users></new-users>
        <active-users @sleepDataList='lookType'></active-users>
        <order-users></order-users>
        <goods-share @shareTime='shareListTime'></goods-share>
      </div>
      <!-- 沉睡用户列表 -->
      <div v-if="isShow=='sleep'">
        <div class="sleepTopTips">
          <span class="sleepTitle">沉睡用户</span>
          <span class="goBack" @click="goBack">返回上一级</span>
        </div>
        <header class="search-header">
          <div class="search-group">
            <label>用户ID:</label>
            <input type="text" placeholder="请输入" v-model="id">
          </div>
          <div class="search-group">
            <label>用户昵称:</label>
            <input type="text" placeholder="请输入" v-model="nickName">
          </div>
          <div class="search-group">
            <label>电话号码:</label>
            <input type="text" placeholder="请输入" v-model="phone">
          </div>
          <div class="search-group">
            <label>团队ID:</label>
            <input type="text" placeholder="请输入" v-model="teamId">
          </div>
          <div class="search-group">
            <label>日期筛选:</label>
            <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeBegin" placeholder="起始时间"></flat-picker>
            <div class="split-line">
              <div></div>
            </div>
            <flat-picker class="search-time-picker" :config="dateConfig" v-model="createTimeEnd" placeholder="结束时间"></flat-picker>
          </div>
          <Select :selectParams="selectData" @selectOptsClicked="chooseOption"></Select>
        </header>
        <button class="search-btn" @click="getSleepTable(1)">搜索</button>
        <table>
          <thead>
            <tr>
              <th v-for="(item,index) in tableHead" :key="index">{{item.name}}</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,key,index) in tableBody" :key="index">
              <td v-for="(val,index) in tableHead" :key="index">
                <div v-if="val.field=='avatar'" style="display: flex;align-items: center;justify-content: center;">
                  <img :src="item[val.field]" alt="头像" style="width: 1.375rem; height: 1.375rem; border-radius: 50%;">
                </div>
                <div v-else>{{item[val.field]}}</div>
              </td>
              <td class="myTeam">我的团队</td>
            </tr>
          </tbody>
        </table>
        <Page :pageData="pageData" @loadList="getSleepTable"></Page>
      </div>
      <!-- 商品分享列表 -->
      <div v-if="isShow=='share'">
        <div class="sleepTopTips">
          <span class="sleepTitle">{{shareStatus}}分享商品列表</span>
          <span class="goBack" @click="goBack">返回上一级</span>
        </div>
        <header class="search-header">
          <div class="search-group">
            <label>所属平台:</label>
            <select name="" id="" class="selectOption" @change="choosePlatfrom">
              <option value="">全部</option>
              <option value="jd">京东</option>
              <option value="pdd">拼多多</option>
              <option value="tb">淘宝</option>
            </select>
          </div>
          <div class="search-group">
            <label>次数排序:</label>
            <select name="" id="" class="selectOption" :value="numSort" @change="chooseNumSort">
              <option value="0">全部</option>
              <option value="1">升序</option>
              <option value="2">降序</option>
            </select>
          </div>
          <div class="search-group">
            <label>转化率排序:</label>
            <select name="" id="" class="selectOption" :value="rateSort" @change="chooseRateSort">
              <option value="0">全部</option>
              <option value="1">升序</option>
              <option value="2">降序</option>
            </select>
          </div>
          <button class="search-btn" @click="getShareList()">搜索</button>
        </header>
        <table>
          <thead>
            <tr>
              <th>商品标题</th>
              <th>所属平台</th>
              <th>分享转化率</th>
              <th>分享次数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in shareTable" :key="index">
              <td>{{item.goods_title}}</td>
              <td>{{item.platform}}</td>
              <td>{{item.rate}}%</td>
              <td>{{item.share_num}}次</td>
            </tr>
          </tbody>
        </table>
        <Page :pageData="shareData" @loadList="getShareList"></Page>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/axios'
import qs from 'qs'
import setting from '@/setting'
import flatPicker from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Mandarin } from 'flatpickr/dist/l10n/zh.js'
import newUsers from "../components/content/newUsers.vue"
import activeUsers from "../components/content/activeUsers.vue"
import orderUsers from "../components/content/orderUser.vue"
import goodsShare from "../components/content/goodsShare.vue"
import select from '../components/common/select.vue'
import page from '../components/content/page.vue'
export default {
  inject: ['reload', 'alert', 'showLoading', 'hideLoading'],
  components:{
    "new-users":newUsers,
    "active-users":activeUsers,
    "order-users":orderUsers,
    "goods-share":goodsShare,
    'flat-picker': flatPicker,
    'Select': select,
    'Page':page
  },
  data(){
    const now = new Date();
    let nStr = '';
    nStr += now.getFullYear() + '-'
    nStr += ((now.getMonth() < 9) ? '0' : '') + (now.getMonth() + 1) + '-'
    nStr += ((now.getDate() < 10) ? '0' : '') + now.getDate()
    return{
      dateConfig: {
        'time_24hr': true,
        maxDate: nStr,
        locale: Mandarin
      },
      isShow:'record',// record运营数据页面    sleep沉睡用户列表页面   share分享商品列表页面
      rank:'',//1会员 2团长 3总监 （沉睡用户列表只能传2或者3）
      id:'',
      nickName:'',
      phone:'',
      teamId:'',
      createTimeBegin:'',
      createTimeEnd:'',
      selectData: {
        label: '职级',
        // placeholder: '请选择',
        options: [{
          value: '',
          text: '请选择'
        }, {
          value: '2',
          text: '团长'
        }, {
          value: '3',
          text: '总监'
        }]
      },
      tableHead:[],//沉睡用户 表头
      tableBody:[],//沉睡用户列表
      pageData: {
        total: 0,
        page: 1,
        'total_page': 0
      },
      shareTable:[],//分享商品列表
      shareData:{
        total: 0,
        page: 1,
        'total_page': 0
      },
      platfrom:'',//平台   tb 淘宝 jd京东 pdd拼多多
      rateSort:0,// 转换率排序  0全部 1升序 2降序
      numSort:2,//	分享次数排序  0全部 1升序 2降序
      shareStartTime:'',
      shareEndTime:'',
      shareStatus:'',//今日  昨日  本月   上月
    }
  },
  created(){
    // this.getSleepTable()
    // this.getShareList(1)
  },
  watch:{
    rank(e){
      console.log(e,"点击了++++++")
      this.isShow = 'sleep'
      this.getSleepTable(1)
    },
    shareStatus(e){
      this.isShow = 'share';
      this.getShareList(1);
    }
  },
  methods:{
    goBack(){//返回上一级
      this.isShow = 'record'
    },
    lookType(sleepType){//区别团长、总监
      this.rank = sleepType;
    },
    chooseOption(e){//选择职级
      console.log(e,"选择职级 2团长 3总监")
      this.rank = e;
    },
    getSleepTable(pageNum){//沉睡用户表头
      this.showLoading()
      request({
        url:setting.urls.sleepUserHeader,
        method:'get',
        params:{}
      }).then(res=>{
        // console.log(res,"沉睡用户表头")
        if(res.status == 200){
          if(res.data.code == 200){
            this.tableHead = res.data.data;
            this.getSleepList(pageNum);
          }
        }
      }).catch((error) => {
        this.alert('加载沉睡用户表头失败')
      }).then(() => {
        this.hideLoading()
      })
    },
    getSleepList(pageNum){//沉睡用户列表
      this.showLoading()
      request({
        url:setting.urls.userList,
        method:'get',
        params:{
          page: pageNum || 1,
          rank:this.rank,
          id:this.id,
          nickName:this.nickName,
          phone:this.phone,
          teamId:this.teamId,
          'is_sleep':1,
          createTimeBegin:this.createTimeBegin,
          createTimeEnd:this.createTimeEnd,
        }
      }).then(res=>{
        console.log(res,"沉睡用户列表")
        if(res.status == 200){
          const rest = res.data;
          if(rest.code == 200){
            this.pageData.total = rest.data.total;
            this.pageData.page = rest.data.page;
            this.pageData['total_page'] = rest.data.pageCount;
            this.tableBody = rest.data.data;
          }
        }
      }).catch((error) => {
        this.alert('加载沉睡用户列表失败')
      }).then(() => {
        this.hideLoading()
      })
    },
    getShareList(pageNum){//分享商品列表
      this.showLoading()
      request({
        url:setting.urls.shareList,
        method:'get',
        params:{
          'page': pageNum || 1,
          'platform':this.platfrom,
          'rate_sort'	:this.rateSort,
          'num_sort':this.numSort,
          'start_time':this.shareStartTime,
          'end_time':this.shareEndTime
        }
      }).then(res=>{
        console.log(res,"分享商品列表")
        if(res.status == 200){
          const reslt = res.data.data;
          if(res.data.code==200){
            if(reslt.data.length<=0){
              this.alert('分享商品列表无数据')
            }
            this.shareData.total = reslt.total;
            this.shareData.page = reslt.page;
            this.shareData['total_page'] = reslt.pageCount;
            this.shareTable = reslt.data;
          }
        }
      }).catch((error) => {
        this.alert('加载分享商品列表失败')
      }).then(() => {
        this.hideLoading()
      })
    },
    chooseRateSort(e){//转换率排序
      const val = e.target.value;
      if(val != 0){
        this.numSort = 0
      }
      this.rateSort = val;
    },
    chooseNumSort(e){//分享次数排序
      const valu = e.target.value;
      if(valu != 0){
        this.rateSort = 0;
      }
      this.numSort = valu;
    },
    choosePlatfrom(e){//筛选平台
      this.platfrom = e.target.value;
    },
    shareListTime(e){
      this.shareStatus = e;
      switch (e) {
        case '本月':
          this.shareStartTime = this.getMonth('s',0)
          this.shareEndTime = this.getMonth('e',0)
          this.getShareList()
          break;
        case '上月':
          this.shareStartTime = this.getMonth('s',-1)
          this.shareEndTime = this.getMonth('e',-1)
          this.getShareList()
          break;
        case '今日':
          this.shareStartTime = this.getDay(1)
          this.shareEndTime = this.getDay(1)
          this.getShareList()
          break;
        case '昨日':
          this.shareStartTime = this.getDay(2)
          this.shareEndTime = this.getDay(2)
          this.getShareList()
          break;
        default:
          break;
      }
    },
    getMonth(type, months) {// 获取时间段函数 ==> type为字符串类型，有两种选择，"s"代表开始,"e"代表结束。months为数字类型，不传或0代表本月，-1代表上月，1代表下月
        const data = new Date();
        let year = data.getFullYear();
        let month = data.getMonth() + 1;
        if (Math.abs(months) > 12) {
            months = months % 12;
        }
        if (months != 0) {
            if (month + months > 12) {
                year++;
                month = (month + months) % 12;
            } else if (month + months < 1) {
                year--;
                month = 12 + month + months;
            } else {
                month = month + months;
            }
        }
        month = month < 10 ? "0" + month: month;
        const date = data.getDate();
        const firstday = year + "-" + month + "-" + "01";
        let lastday = "";
        if (month == "01" || month == "03" || month == "05" || month == "07" || month == "08" || month == "10" || month == "12") {
            lastday = year + "-" + month + "-" + 31;
        } else if (month == "02") {
            if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
                lastday = year + "-" + month + "-" + 29;
            } else {
                lastday = year + "-" + month + "-" + 28;
            }
        } else {
            lastday = year + "-" + month + "-" + 30;
        }
        let day = "";
        if (type == "s") {
            day = firstday;
        } else {
            day = lastday;
        }
        return day;
    },
    getDay(num){//1为今日   2为昨日
      if(num == 1){
        const day2 = new Date();
        day2.setTime(day2.getTime());
        const s2 = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day2.getDate();
        return s2
      }else if(num == 2){
        const day1 = new Date();
        day1.setTime(day1.getTime()-24*60*60*1000);
        const s1 = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
      }
    }
  }
}
</script>

<style scoped>
.detail-container,.detail-data-box{padding: 0;}
.detail-data-box{overflow-y: auto;min-width: 1200px;}
.detail-container{margin-left: 0;}
/* 沉睡列表 */
.sleepTopTips{height: 50px;display: flex;align-items: center;}
.sleepTitle{font-size: 18px;font-weight: bold;color: #52c7f2;}
.goBack{font-size: 16px;font-weight: 600;color: #52c7f2;cursor: pointer;margin-left: 30px;}
.myTeam{font-weight: bold;color: #52c7f2;cursor: pointer;}
table{margin-top: 20px;}
.selectOption{width: 5rem; height: 1rem;line-height: 1rem;border-radius: .125rem !important;border: 1px solid #D9D9D9;box-sizing: border-box;font-size: .4375rem;vertical-align: top;padding-left: .3125rem;padding-right: .3125rem;margin-left: .2rem;cursor: pointer;
}
</style>