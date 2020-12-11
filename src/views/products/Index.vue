<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CCardHeader>
          <div class="float-left">All Product</div>
          <div class="float-right">
            <CButton color="primary" @click="create" class="float-right">New Product</CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <CDataTable
            hover
            striped
            :items="items"
            :fields="fields"
            :responsive="false"
          >
            <template #price="{item}">
              <td>
                ${{ item.price }}
              </td>
            </template>
            <template #categories="{item}">
              <td>
                <CBadge v-for="category in item.categories" :key="category.id" color="primary" class="mr-2">{{ category.name }}</CBadge>
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
                  <CDropdownItem @click="editItem(item)">Edit</CDropdownItem>
                  <CDropdownItem @click="deleteItem(item)">Delete</CDropdownItem>
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

export default {
  name: 'IndexProduct',
  data () {
    return {
      items: [],
      fields: [
        { 
          key: 'name', label: 'Name',
        },
        { 
          key: 'price', label: 'Price'
        },
        { 
          key: 'categories', label: 'Categories'
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
    this.fetchProducts(1, this.$route.query.page);
  },
  methods: {
    pageChange (val) {
      this.fetchProducts(val);
      this.$router.push({ query: { page: val }});
    },
    create() {
      this.$router.push({path: '/products/create' });
    },
    viewItem(item) {
      this.$router.push({path: `/products/${item.id}`});
    },
    editItem(item) {
      this.$router.push({path: `/products/${item.id}/edit`});
    },
    deleteItem(item) {
      if (!confirm('Are you sure you want to delete this item?')) {
        return;
      }

      axios({
        method: 'DELETE',
        url: `${this.$store.state.baseURL}/products/${item.id}`
      })
      .then(data => {
        this.$toast.success(data.data.message);
        this.fetchProducts(1, 1);
      })
      .catch((err) => {
        if (err.response.status == 404 || err.response.status == 403) {
          this.$toast.success(err.response.data.message);
        }
      })
    },
    fetchProducts(page, currentPage) {

      if (currentPage) {
        this.currentPage = parseInt(currentPage, 10);
      }

      axios({
        method: 'GET',
        url: `${this.$store.state.baseURL}/products?page=${page}&timestamp=${new Date().getTime()}`,
      })
      .then(data => {
        this.items = data.data.products;
        this.totalPage = Math.ceil(data.data.total/data.data.limit);
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
