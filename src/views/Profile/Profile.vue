<template>
    <div id="page-user-edit">

        <vs-alert color="danger" title="User Not Found" :active.sync="user_not_found">
            <span>User record with id: {{ $route.params.userId }} not found. </span>
            <span>
        <span>Check </span><router-link :to="{name:'page-user-list'}"
                                        class="text-inherit underline">All Users</router-link>
      </span>
        </vs-alert>

        <vx-card v-if="user_data">

            <div slot="no-body" class="tabs-container px-6 pt-6">

                <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
                    <vs-tab label="اطلاعات شخصی" icon-pack="feather" icon="icon-info">
                        <div class="tab-text">
                            <user-edit-tab-information class="mt-4" :data="user_data"/>
                        </div>
                    </vs-tab>
                    <vs-tab label="اطلاعات کاربری" icon-pack="feather" icon="icon-user">
                        <div class="tab-text">
                            <user-edit-tab-account class="mt-4" :data="user_data"/>
                        </div>
                    </vs-tab>
                    <vs-tab label="تغییر گذرواژه" icon-pack="feather" icon="icon-share-2">
                        <div class="tab-text">
                            <user-edit-tab-password class="mt-4" :data="user_data"/>
                        </div>
                    </vs-tab>
                    <vs-tab label="تصویر پروفایل" icon-pack="feather" icon="icon-share-2">
                        <div class="tab-text">
                            <user-edit-tab-avatar class="mt-4" :data="user_data"/>
                        </div>
                    </vs-tab>
                </vs-tabs>

            </div>

        </vx-card>
    </div>
</template>

<script>
    import UserEditTabAccount from "./UserEditTabAccount.vue"
    import UserEditTabInformation from "./UserEditTabInformation.vue"
    import UserEditTabPassword from "./UserEditTabPassword.vue"
    import UserEditTabAvatar from "./UserEditTabAvatar";
    import axios from './../../http/axios/index'
    import store from './../../store/store'
    export default {
        components: {
            UserEditTabAccount,
            UserEditTabInformation,
            UserEditTabPassword,
            UserEditTabAvatar
        },
        data() {
            return {
                user_data: null,
                user_not_found: false,
                permissionDenied: false,
                activeTab: 0,
            }
        },
        watch: {
            activeTab() {
                this.fetch(this.$route.params.userId)
            }
        },
        methods: {
            fetch() {
              axios.get("me")
                    .then(res => {
                        this.user_data = res.data
                    })
                    .catch(err => {
                        if (err.response.status === 404) {
                            this.user_not_found = true
                            return
                        }
                        console.error(err)
                    })
            }
        },
        created() {
            this.fetch()
        }
    }

</script>
