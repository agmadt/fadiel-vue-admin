<template>
  <div>
    <CInput
      placeholder="Category name"
      label="Name"
      :invalid-feedback="this.form.name.errorMessage"
      :is-valid="this.form.name.errorMessage == null ? null : this.form.name.errorMessage ? false : true"
      v-model="form.name.value"
    >
    </CInput>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FormCategory',
  props: ['form'],
}
</script>
