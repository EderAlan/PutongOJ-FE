<template lang="html">
  <div class="home-wrap">
    <div class="news">NewsList</div>
    <Card v-for="(item, index) in list" :key="item.nid">
      <Row type="flex" align="middle">
        <Col :span="2">
          <Icon type="chatbox-working"></Icon>
        </Col>
        <Col :span="20">
          <router-link :to="{ name: 'newsInfo', params: { nid: item.nid } }">
            <span>{{ item.title }}</span>
          </router-link>
          <p>{{ item.create | timePretty }}</p>
        </Col>
        <Col :span="2">
          <Icon v-if="isAdmin" type="close-circled" @click.native="del(item.nid)"></Icon>
        </Col>
      </Row>
    </Card>
    <Page :total="sum" @on-change="pageChange" :page-size="pageSize" :current.sync="page" show-elevator></Page>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { purify } from '@/util/helper'
import only from 'only'

export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 5
    }
  },
  computed: {
    ...mapGetters({
      list: 'news/list',
      sum: 'news/sum',
      isAdmin: 'session/isAdmin'
    }),
    query () {
      const opt = only(this.$route.query, 'page pageSize')
      return purify(opt)
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    fetch () {
      this.$store.dispatch('news/find', this.query)
      const query = this.$route.query
      this.page = parseInt(query.page) || 1
      if (query.pageSize) this.pageSize = parseInt(query.pageSize)
    },
    reload (payload = {}) {
      const query = Object.assign(this.query, purify(payload))
      this.$router.push({
        name: 'home',
        query
      })
    },
    pageChange (val) {
      this.reload({ page: val })
    },
    del (nid) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>此操作将永久删除该消息, 是否继续?</p>',
        onOk: () => {
          this.$store.dispatch('news/delete', { nid }).then(() => {
            this.$Message.success(`成功删除 ${nid}！`)
            this.$router.push({
              name: 'home',
              query: { page: this.page }
            })
          })
        },
        onCancel: () => {
          this.$Message.info('已取消删除！')
        }
      })
    }
  },
  watch: { // 浏览器后退时回退页面
    '$route' (to, from) {
      if (to !== from) this.fetch()
    }
  }
}
</script>

<style lang="stylus">
.home-wrap
  margin: 0 10%
  .news
    font-size: 40px
    padding-bottom: 10px
    // margin-bottom: 20px
    // border-bottom: 1px solid #dfd8d8
  .content
    padding-left: 20px
    padding-bottom: 20px
    margin-bottom: 20px
    border-bottom: 1px solid #dfd8d8
  .ivu-card
    margin-bottom: 20px
    .ivu-icon-chatbox-working
      font-size: 24px
      margin-left: 30%
      color: rgba(201, 31, 242, 0.5)
    p
      margin-top: 10px
    .ivu-icon-close-circled
      line-height: 20px
      color: #c3c2c2
      cursor: pointer
      &:hover
        font-size: 20px
</style>
