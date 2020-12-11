<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CForm @submit="submitEdit">
          <CCardHeader>
            Edit Category
          </CCardHeader>
          <CCardBody>
          <CAlert :show="form.errorMessage ? true : false" color="danger">{{ form.errorMessage }}</CAlert>
          <Form :form="form" />
          </CCardBody>
          <CCardFooter>
            <CButton color="primary" type="submit" :disabled="form.disabled">Save</CButton>
            <CButton color="danger" @click="cancel" class="float-right">Cancel</CButton>
          </CCardFooter>
        </CForm>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import Form from './Form';
import axios from 'axios';

export default {
  name: 'CreateCategory',
  components: {
    Form
  },
  data () {
    return {
      form: {
        name: {
          value: null,
          errorMessage: null
        },
        disabled: false,
        errorMessage: null
      }
    }
  },
  beforeMount() {
    axios({
      method: 'GET',
      url: `${this.$store.state.baseURL}/categories/${this.$route.params.id}`
    })
    .then(data => {
      for (const key in data.data) {
        if (data.data.hasOwnProperty(key)) {
          const element = data.data[key];
          if (this.form.hasOwnProperty(key)) this.form[key].value = element;
        }
      }
    })
    .catch(err => {
      console.log(err)
    })
  },
  methods: {
    cancel() {
      this.$router.push({path: '/categories'})
    },
    submitEdit() {

      this.form.disabled = true;

      axios({
        method: 'PATCH',
        url: `${this.$store.state.baseURL}/categories/${this.$route.params.id}`,
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        },
        data: {
          name: this.form.name.value
        }
      })
      .then(data => {
        this.form.disabled = false;
        this.$router.push({path: '/categories'})
        this.$toast.success('Category successfully edited');
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status == 422) {
            this.form.errorMessage = err.response.data.message;

            for (const key in err.response.data.errors) {
              if (err.response.data.errors.hasOwnProperty(key)) {
                const element = err.response.data.errors[key];
                console.log(element)
                console.log(key)
                if (this.form.hasOwnProperty(key)) this.form[key].errorMessage = element[0];
              }
            }
          }
        } else {
          console.log(err)
        }

        this.form.disabled = false;
      })
    }
  }
}
</script>
