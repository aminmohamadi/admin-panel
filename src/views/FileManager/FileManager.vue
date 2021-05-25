<template>
  <vx-card class="users-list-filters mb-8">
    <div class="vx-row">
      <div class="vx-col col-12">
        <file-manager :settings="settings"></file-manager>
      </div>
    </div>
  </vx-card>
</template>

<script>
export default {
  data() {
      return {
        settings: {
          headers: {
            Authorization: localStorage.getItem('access_token'),
          },
          baseUrl: 'http://shop.test/api/admin/v1/file-manager/',
          windowsConfig: 2,
          lang: 'fa',
        },
      }
  },
}
</script>

<style>
.fm-body{
  height: 500px!important;
}
</style>