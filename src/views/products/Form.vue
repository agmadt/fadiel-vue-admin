<template>
  <div>
    <CInput
      placeholder="Product name"
      label="Name"
      :invalid-feedback="form.name.errorMessage"
      :is-valid="form.name.errorMessage == null ? null : form.name.errorMessage ? false : true"
      v-model="form.name.value"
    >
    </CInput>
    <CInput
      placeholder="Product price"
      label="Price"
      :invalid-feedback="form.price.errorMessage"
      :is-valid="form.price.errorMessage == null ? null : form.price.errorMessage ? false : true"
      v-model="form.price.value"
    >
    </CInput>
    <CTextarea
      placeholder="Product description"
      label="Description"
      :invalid-feedback="form.description.errorMessage"
      :is-valid="form.description.errorMessage == null ? null : form.description.errorMessage ? false : true"
      v-model="form.description.value"
    >
    </CTextarea>
    <hr />
    <div role="group" class="form-group">
      <label for="product-category">Categories</label>
      <v-select :options="categoryItems" id="product-category" multiple v-model="form.categories.items" />
      <div class="invalid-feedback d-block" v-show="form.categories.errorMessage">{{ form.categories.errorMessage }}</div>
    </div>
    <hr />
    <div class="group">
      <div class="invalid-feedback d-block" v-show="form.variants.errorMessage">{{ form.variants.errorMessage }}</div>
      <div class="row" v-for="(variant, key) in form.variants.items" :key="key">
        <div class="col-md-5">
          <CInput
            placeholder="Product variants"
            label="Variants"
            :invalid-feedback="form.variants.items[key].errorMessage"
            :is-valid="form.variants.items[key].errorMessage == null ? null : form.variants.items[key].errorMessage ? false : true"
            v-model="form.variants.items[key].name"
          >
          </CInput>
        </div>
        <div class="col-md-6">
          <div role="group" class="form-group">
            <label for="product-variant-options">Product variant options</label>
            <v-select id="product-variant-options" multiple taggable v-model="form.variants.items[key].options.value" />
            <div class="invalid-feedback d-block" v-show="form.variants.items[key].options.errorMessage">{{ form.variants.items[key].options.errorMessage }}</div>
          </div>
        </div>
        <div class="col-md-1">
          <label for="product-variant-options" style="visibility: hidden; display: block;">Delete</label>
          <CButton color="danger" size="sm" @click="deleteProductVariant(variant, key)">Delete</CButton>
        </div>
      </div>
      <CButton color="primary" size="sm" class="mb-2" @click="addProductVariant()">Add product variant</CButton>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FormProduct',
  props: ['form'],
  data() {
    return {
      categoryItems: [],
    }
  },
  beforeMount() {
    axios({
      method: 'GET',
      url: `${this.$store.state.baseURL}/categories?limit=9999&timestamp=${new Date().getTime()}`,
    })
    .then(data => {
      let categories = [];
      for (let i = 0; i < data.data.categories.length; i++) {
        const category = data.data.categories[i];
        categories.push({
          label: category.name,
          value: category.id
        })
      }

      this.categoryItems = categories;
    })
    .catch(err => {
      console.log(err)
    })
  },
  methods: {
    addProductVariant() {
      this.form.variants.items.push({
        name: null,
        options: {
          value: [],
          errorMessage: null
        },
        errorMessage: null
      });
    },
    deleteProductVariant(variant, key) {
      this.form.variants.items.splice(key, 1)
    }
  }
}
</script>
