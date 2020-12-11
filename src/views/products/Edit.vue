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
  name: 'CreateProduct',
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
        price: {
          value: null,
          errorMessage: null
        },
        description: {
          value: null,
          errorMessage: null
        },
        categories: {
          items: [],
          errorMessage: null
        },
        variants: {
          items: [],
          errorMessage: null
        },
        disabled: false,
        errorMessage: null,
      }
    }
  },
  beforeMount() {
    axios({
      method: 'GET',
      url: `${this.$store.state.baseURL}/products/${this.$route.params.id}`
    })
    .then(data => {
      for (const key in data.data) {
        if (data.data.hasOwnProperty(key)) {
          const element = data.data[key];
          if (this.form.hasOwnProperty(key)) this.form[key].value = element;

          if (key == 'categories') {
            for (let i = 0; i < element.length; i++) {
              const category = element[i];

              this.form[key].items.push({
                value: category.id,
                label: category.name,
              })
            }
          }

          if (key == 'variants') {
            for (let i = 0; i < element.length; i++) {
              const variant = element[i];

              const variantOptions = [];
              for (let j = 0; j < variant.options.length; j++) {
                const variantOption = variant.options[j];
                variantOptions.push({
                  label: variantOption.name
                })
              }

              this.form[key].items.push({
                id: variant.id,
                name: variant.name,
                options: {
                  value: variantOptions,
                  errorMessage: null
                },
                errorMessage: null
              })
            }
          }
        }
      }
    })
    .catch(err => {
      console.log(err)
    })
  },
  methods: {
    cancel() {
      this.$router.push({path: '/products'})
    },
    submitEdit() {

      this.form.disabled = true;

      // Clean form error message
      this.form.errorMessage = null;
      this.form.name.errorMessage = null;
      this.form.price.errorMessage = null;
      this.form.description.errorMessage = null;
      this.form.categories.errorMessage = null;
      this.form.variants.errorMessage = null;
      for (let i = 0; i < this.form.variants.items.length; i++) {
        const variant = this.form.variants.items[i];
        variant.errorMessage = null;

        for (const key in variant.options) {
          if (variant.options.hasOwnProperty(key)) {
            variant.options.errorMessage = null;
          }
        }
      }
      
      // Prepare form data
      let formData = {
        name: this.form.name.value,
        price: this.form.price.value,
        description: this.form.description.value,
        categories: [],
        variants: []
      };

      for (let i = 0; i < this.form.categories.items.length; i++) {
        const category = this.form.categories.items[i];
        formData.categories.push({
          id: category.value
        });
      }

      for (let i = 0; i < this.form.variants.items.length; i++) {
        const variant = this.form.variants.items[i];
        const options = [];
        for (let j = 0; j < variant.options.value.length; j++) {
          const variantOption = variant.options.value[j];
          options.push({ name: variantOption.label ? variantOption.label : variantOption });
        }

        formData.variants.push({
          name: variant.name,
          options: options
        });
      }

      axios({
        method: 'PATCH',
        url: `${this.$store.state.baseURL}/products/${this.$route.params.id}`,
        data: formData
      })
      .then(data => {
        this.form.disabled = false;
        this.$router.push({path: '/products'})
        this.$toast.success('Product successfully edited');
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status == 422) {
            this.form.errorMessage = err.response.data.message;

            for (const key in err.response.data.errors) {
              if (err.response.data.errors.hasOwnProperty(key)) {
                const element = err.response.data.errors[key];
                if (this.form.hasOwnProperty(key)) this.form[key].errorMessage = element[0];

                // for dynamic element validation
                // case: variant name
                if (key.includes('.name')) {
                  let variantNamesKey = [];
                  for (let i = 0; i < key.split('.').length; i++) {
                    if (i == 1) {
                      variantNamesKey.push(key.split('.')[i]);
                    }
                  }

                  for (let j = 0; j < variantNamesKey.length; j++) {
                    const variantNameKey = variantNamesKey[j];
                    this.form.variants.items[variantNameKey].errorMessage = element[0]
                  }
                }

                // case: variant options
                if (key.includes('.options')) {
                  let variantOptionsKey = [];
                  for (let i = 0; i < key.split('.').length; i++) {
                    if (i == 1) {
                      variantOptionsKey.push(key.split('.')[i]);
                    }
                  }

                  for (let j = 0; j < variantOptionsKey.length; j++) {
                    const variantOptionKey = variantOptionsKey[j];
                    this.form.variants.items[variantOptionKey].options.errorMessage = element[0]
                  }
                }
              }
            }
          }

          if (err.response.status == 404) {
            this.form.errorMessage = err.response.data.message;
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
