<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit="submitForm">
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <div class="mb-3 text-danger" v-show="errorMessage">{{ errorMessage }}</div>
                  <CInput
                    placeholder="Email"
                    autocomplete="email"
                    :invalid-feedback="form.email.errorMessage"
                    :is-valid="form.email.isValid"
                    v-model="form.email.value"
                  >
                    <template #prepend-content><CIcon name="cil-user"/></template>
                  </CInput>
                  <CInput
                    placeholder="Password"
                    type="password"
                    autocomplete="curent-password"
                    :invalid-feedback="form.password.errorMessage"
                    :is-valid="form.password.isValid"
                    v-model="form.password.value"
                  >
                    <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton color="primary" class="px-4" type="submit" :disabled="formDisabled">Login</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: {
          value: '',
          isValid: null,
          errorMessage: ''
        },
        password: {
          value: '',
          isValid: null,
          errorMessage: ''
        }
      },
      errorMessage: '',
      formDisabled: false
    }
  },
  methods: {
    submitForm() {

      this.errorMessage = '';
      this.form.email.isValid = null;
      this.form.email.errorMessage = '';
      this.form.password.isValid = null;
      this.form.email.errorMessage = '';
      this.formDisabled = true;

      axios({
        method: 'POST',
        url: this.$store.state.baseURL + '/auth/login',
        data: {
          email: this.form.email.value,
          password: this.form.password.value
        }
      })
      .then(data => {
        this.$store.commit("set", ["authenticated", true])
        this.$store.commit("set", ["copiedFromLocalStorage", true])
        this.$store.commit("set", ["user", data.data.data])
        this.$store.commit("set", ["token", data.data.access_token])
        this.$store.commit("set", ["baseURL", this.$store.state.baseURL])
        window.localStorage.setItem('fadiel', JSON.stringify({
          authenticated: true,
          user: data.data.data,
          token: data.data.access_token,
          baseURL: this.$store.state.baseURL
        }));
        
        this.$router.push({name: 'Dashboard'})

        this.formDisabled = false;
      })
      .catch(err => {
        if (err.response && (err.response.status == 422 || err.response.status == 401)) {
          this.errorMessage = err.response.data.message;

          if (err.response.data.errors) {
            for (const key in err.response.data.errors) {
              if (err.response.data.errors.hasOwnProperty(key)) {
                const element = err.response.data.errors[key];
                this.form[key].errorMessage = element[0];
                this.form[key].isValid = false
              }
            }
          }
        } else {
          console.log(err)
        }

        this.formDisabled = false;
      })
    }
  }
}
</script>
