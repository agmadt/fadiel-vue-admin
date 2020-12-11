<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CCardHeader>All Order</CCardHeader>
        <CCardBody>
          <CDataTable
            hover
            striped
            :items="items"
            :fields="fields"
            :responsive="false"
          >
            <template #created_at="{item}">
              <td>
                {{ parseTimestamp(item) }}
              </td>
            </template>
            <template #total="{item}">
              <td>
                ${{ item.total }}
              </td>
            </template>
            <template #action="{item}">
              <td>
                <CDropdown
                  placement="bottom-end"
                  toggler-text="Action"
                  color="primary"
                  class="d-inline-block float-right"
                >
                  <CDropdownItem @click="viewItem(item)">View</CDropdownItem>
                </CDropdown>
              </td>
            </template>
          </CDataTable>
          <CPagination
            :active-page.sync="currentPage"
            align="center"
            :pages="totalPage"
            :page-change="pageChange"
            @update:activePage="pageChange"
          />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';

export default {
  name: 'IndexProduct',
  data () {
    return {
      items: [],
      fields: [
        { 
          key: 'created_at', label: 'Bought Date',
        },
        { 
          key: 'buyer_name', label: 'Buyer Name'
        },
        { 
          key: 'buyer_email', label: 'Buyer Email'
        },
        { 
          key: 'total', label: 'Total'
        },
        { 
          key: 'action',
          label: '',
          sorter: false,
          filter: false,
        },
      ],
      currentPage: 1,
      totalPage: 1
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler (route) {
        if (route.query && route.query.page) {
          this.activePage = Number(route.query.page)
        }
      }
    }
  },
  beforeMount() {
    this.fetchOrders(1, this.$route.query.page);
  },
  methods: {
    pageChange (val) {
      this.fetchCategories(val);
      this.$router.push({ query: { page: val }});
    },
    viewItem(item) {
      this.$router.push({path: `/orders/${item.id}`});
    },
    fetchOrders(page, currentPage) {

      if (currentPage) {
        this.currentPage = parseInt(currentPage, 10);
      }

      axios({
        method: 'GET',
        url: `${this.$store.state.baseURL}/orders?page=${page}&timestamp=${new Date().getTime()}`,
      })
      .then(data => {
        this.items = data.data.orders;
        this.totalPage = Math.ceil(data.data.total/data.data.limit);
      })
      .catch(err => {
        console.log(err)
      })
    },
    parseTimestamp(item) {
      return dayjs(item.created_at * 1000).format('DD MMMM, YYYY')
    }
  }
}
</script>
