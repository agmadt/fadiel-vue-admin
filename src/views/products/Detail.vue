<template>
  <CRow>
    <CCol col="12" class="mb-4"><h2>Viewing: {{ product.name }}</h2></CCol>
    <CCol col="4">
      <CCard  accent-color="primary">
        <CCardHeader>
          <strong>Product Information</strong>
          <CButton class="float-right" color="primar">Check</CButton>
        </CCardHeader>
        <CCardBody>
          <table class="table table-borderless table-sm">
            <tr>
              <td width="100">Name</td>
              <td width="10">:</td>
              <td>{{ product.name }}</td>
            </tr>
            <tr>
              <td width="100">Price</td>
              <td width="10">:</td>
              <td>${{ product.price }}</td>
            </tr>
            <tr>
              <td width="100">Description</td>
              <td width="10">:</td>
              <td>{{ product.description }}</td>
            </tr>
          </table>
        </CCardBody>
        <CCardFooter>
            <CButton color="danger" @click="back">Back</CButton>
            <CButton color="primary" @click="edit" class="float-right">Edit</CButton>
        </CCardFooter>
      </CCard>
    </CCol>
    <CCol col="8">
      <CCard accent-color="primary">
        <CCardHeader><strong>Product Variants</strong></CCardHeader>
        <CCardBody>
          <table class="table table-borderless table-sm">
            <tr>
              <td colspan="2"><strong>Variant Name</strong></td>
              <td><strong>Variant Options</strong></td>
            </tr>
            <tr v-for="variant in product.variants" :key="variant.id">
              <td width="200"><strong><u>{{ variant.name }}</u></strong></td>
              <td width="10">:</td>
              <td>
                <span class="badge badge-success mr-2 pt-1 pb-1 pl-1 pr-1" v-for="option in variant.options" :key="option.id">{{ option.name }}</span>
              </td>
            </tr>
          </table>
        </CCardBody>
      </CCard>
      <CCard  accent-color="primary">
        <CCardHeader><strong>Product Categories</strong></CCardHeader>
        <CCardBody>
          <span class="badge badge-info mr-2 pt-1 pb-1 pl-1 pr-1" v-for="category in product.categories" :key="category.id">{{ category.name }}</span>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import axios from 'axios';
import Form from './Form';

export default {
  name: 'DetailProduct',
  components: {
    Form
  },
  data () {
    return {
      product: {}
    }
  },
  beforeMount() {
    axios({
      method: 'GET',
      url: `${this.$store.state.baseURL}/products/${this.$route.params.id}`
    })
    .then(data => {
      this.product = data.data;
    })
    .catch(err => {
      console.log(err)
    })
  },
  methods: {
    back() {
      this.$router.push({path: '/products'})
    },
    edit() {
      this.$router.push({path: `/products/${this.product.id}/edit`})
    },
  }
}
</script>
