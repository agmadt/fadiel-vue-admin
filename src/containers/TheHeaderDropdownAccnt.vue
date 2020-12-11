<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
          Hello, {{ $store.state.user.name }}
      </CHeaderNavLink>
    </template>
    <CDropdownItem @click="logout()">
      <CIcon name="cil-lock-locked" /> Logout
    </CDropdownItem>
  </CDropdown>
</template>

<script>

import { logout } from './../helpers/logout';

export default {
  name: 'TheHeaderDropdownAccnt',
  data () {
    return { 
      itemsCount: 42
    }
  },
  methods: {
    logout() {
      if (!confirm('You sure want to log out?')) {
        return;
      }

      logout();
      this.$router.push({name: 'Login'})
    }
  }
}
</script>