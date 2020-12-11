<template>
  <CRow>
    <CCol col="12" class="mb-4"><h2>Viewing buyer: {{ order.buyer_name }}</h2></CCol>
    <CCol col="12">
      <CCard  accent-color="primary">
        <CCardHeader><strong>Order Information</strong></CCardHeader>
        <CCardBody>
          <table class="table table-borderless table-sm">
            <tr>
              <td width="100">Buyer Email</td>
              <td width="10">:</td>
              <td>{{ order.buyer_email }}</td>
            </tr>
            <tr>
              <td width="100">Total</td>
              <td width="10">:</td>
              <td>${{ order.total }}</td>
            </tr>
            <tr>
              <td width="100">Date Bought</td>
              <td width="10">:</td>
              <td>{{ parsedCreatedAt }}</td>
            </tr>
            <tr>
              <td width="100">Message</td>
              <td width="10">:</td>
              <td>{{ order.message }}</td>
            </tr>
          </table>
        </CCardBody>
        <CCardFooter>
            <CButton color="danger" @click="back">Back</CButton>
        </CCardFooter>
      </CCard>
    </CCol>
    <CCol col="12" v-if="order.products">
      <h2 class="mb-4">Products Bought</h2>
      <CRow>
        <CCol col="4" accent-color="primary" v-for="product in order.products" :key="product.id">
          <CCard>
            <CCardHeader><strong>Product Information: {{ product.name }}</strong></CCardHeader>
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
              <div class="mb-1"><strong>Choosen variant</strong></div>
              <div class="mb-2" v-for="variant in product.variants" :key="variant.variant_id">
                {{ variant.variant_name }}: {{ variant.variant_option_name }}
              </div>
              <div class="mb-1"><strong>Category</strong></div>
              <span class="badge badge-info mr-2 pt-1 pb-1 pl-1 pr-1" v-for="category in product.categories" :key="category.id">{{ category.name }}</span>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CCol>
  </CRow>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';

export default {
  name: 'DetailOrder',
  data () {
    return {
      order: {}
    }
  },
  beforeMount() {
    axios({
      method: 'GET',
      url: `${this.$store.state.baseURL}/orders/${this.$route.params.id}`
    })
    .then(data => {
      this.order = data.data;
      console.log(data.data)
    })
    .catch(err => {
      console.log(err)
    })
  },
  computed: {
    parsedCreatedAt() {
      return dayjs(this.order.created_at * 1000).format('DD MMMM, YYYY HH:mm:ss')
    }
  },
  methods: {
    back() {
      this.$router.push({path: '/orders'})
    },
  }
}
</script>
