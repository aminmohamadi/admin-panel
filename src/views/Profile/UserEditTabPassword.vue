<template>
    <div id="user-edit-tab-info">
        <div class="vx-row">


            <div class="vx-col w-full md:w-1/2">
                <div class="mt-4">
                    <vs-input class="w-full mt-4" label="گذرواژه قبلی" type="password" v-validate="'required|min:6|max:10'"
                              v-model="oldPassword"
                              name="oldPassword"/>
                    <span class="text-danger text-sm" v-show="errors.has('oldPassword')">{{ errors.first('oldPassword') }}</span>
                </div>
                <div class="mt-4">
                    <vs-input
                        ref="password"
                        type="password"
                        v-validate="'required|min:6|max:10'"
                        name="password"
                        label="گذرواژه جدید"
                        v-model="password"
                        class="w-full mt-6"/>
                    <span class="text-danger text-sm">{{ errors.first('password') }}</span>
                </div>
                <div class="mt-4">
                    <vs-input
                        type="password"
                        v-validate="'required|min:6|max:10|confirmed:password'"
                        data-vv-as="password"
                        name="confirm_password"
                        label="تایید گذرواژه جدید"
                        v-model="confirm_password"
                        class="w-full mt-6"/>
                    <span class="text-danger text-sm">{{ errors.first('confirm_password') }}</span>
                </div>
            </div>
        </div>

        <!-- Save & Reset Button -->
        <div class="vx-row">
            <div class="vx-col w-full">
                <div class="mt-8 flex flex-wrap items-center justify-end">
                    <vs-button class="ml-auto mt-2" @click="save_changes" :disabled="!validateForm">ذخیره</vs-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "../../http/axios/index";
    export default {
        props: {
            data: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                oldPassword: '',
                password: '',
                confirm_password: '',
                data_local: JSON.parse(JSON.stringify(this.data)),
            }
        },
        computed: {
            validateForm() {
                return !this.errors.any() && this.oldPassword != '' && this.password != '' && this.confirm_password != '';

            }
        },
        methods: {
            save_changes() {
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'primary',
                    title: `ثبت تغییرات`,
                    acceptText: 'تایید',
                    cancelText: 'لغو',
                    text: 'در صورت تایید اطلاعات وارد شده دکمه ثبت را بزنید',
                    accept: this.doChanges
                })
            },
            doChanges() {
                this.$vs.loading()
                return new Promise((resolve, reject) => {
                    axios.post(`/api/auth/admin/user/update/password`, {
                        token: localStorage.getItem('access_token'),
                        oldPassword: this.oldPassword,
                        password: this.password,
                        confirm_password: this.confirm_password,
                        headers: {
                            'Authorization': 'Bearer' + localStorage.getItem('access_token')
                        }
                    })
                        .then((response) => {
                            resolve(response)
                            this.$vs.loading.close()
                            this.oldPassword = null
                                this.password = null
                                this.confirm_password = null
                            this.$vs.notify({
                                title: response.data.title,
                                text: response.data.message,
                                iconPack: 'feather',
                                icon: 'icon-'+response.data.icon+'-circle',
                                color: response.data.status
                            })
                        })
                        .catch((error) => {
                            reject(error)
                            this.$vs.loading.close()
                            this.$vs.notify({
                                title: 'خطا',
                                text: error,
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'danger'
                            })
                        });
                })
            },
        },
    }
</script>
