<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CCardHeader>
          <div class="float-left">All Category</div>
          <div class="float-right">
            <CButton color="primary" @click="create" class="float-right">New Category</CButton>
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
            <template #action="{item}">
              <td>
                <CDropdown
                  placement="bottom-end"
                  toggler-text="Action"
                  color="primary"
                  class="d-inline-block float-right"
                >
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
  name: 'IndexCategory',
  data () {
    return {
      items: [],
      fields: [
        { 
          key: 'name', label: 'Name'
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
    console.log(this.$store.state)
    this.fetchCategories(1, this.$route.query.page);
  },
  methods: {
    pageChange (val) {
      this.fetchCategories(val);
      this.$router.push({ query: { page: val }});
    },
    create() {
      this.$router.push({path: '/categories/create' })
    },
    editItem(item) {
      this.$router.push({path: `/categories/${item.id}/edit`})
    },
    deleteItem(item) {
      if (!confirm('Are you sure you want to delete this item?')) {
        return
      }

      axios({
        method: 'DELETE',
        url: `${this.$store.state.baseURL}/categories/${item.id}`
      })
      .then(data => {
        this.$toast.success(data.data.message);
        this.fetchCategories(1, 1);
      })
      .catch((err) => {
        if (err.response.status == 404 || err.response.status == 403) {
          this.$toast.success(err.response.data.message);
        }
      })
    },
    fetchCategories(page, currentPage) {

      if (currentPage) {
        this.currentPage = parseInt(currentPage, 10);
      }

      axios({
        method: 'GET',
        url: `${this.$store.state.baseURL}/categories?page=${page}&timestamp=${new Date().getTime()}`,
      })
      .then(data => {
        this.items = data.data.categories;
        this.totalPage = Math.ceil(data.data.total/data.data.limit);
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
