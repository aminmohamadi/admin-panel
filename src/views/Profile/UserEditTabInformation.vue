<template>
    <div id="user-edit-tab-info">
        <div class="vx-row">
            <div class="vx-col w-full md:w-1/2">

                <!-- Col Header -->
                <div class="flex items-end">
                    <feather-icon icon="UserIcon" class="mr-2" svgClasses="w-5 h-5"/>
                    <span class="leading-none font-medium">اطلاعات شخصی</span>
                </div>
                <div>
                    <div class="mt-4">
                        <vs-input class="w-full mt-4" label="نام" v-model="data_local.user.first_name"
                                  v-validate="'required|alpha_spaces'" name="first_name"/>
                        <span class="text-danger text-sm"
                              v-show="errors.has('first_name')">{{ errors.first('first_name') }}</span>
                    </div>

                    <div class="mt-4">
                        <vs-input class="w-full mt-4" label="نام خانوادگی" v-model="data_local.user.last_name"
                                  v-validate="'required|alpha_spaces'" name="last_name"/>
                        <span class="text-danger text-sm"
                              v-show="errors.has('last_name')">{{ errors.first('last_name') }}</span>
                    </div>

                    <!-- Gender -->
                    <div class="mt-4">
                        <label class="text-sm">جنسیت</label>
                        <div class="mt-2">
                            <vs-radio  vs-value="man" class="mr-4" v-model="data_local.user.gender">آقا</vs-radio>
                            <vs-radio vs-value="woman" class="mr-4" v-model="data_local.user.gender">خانم</vs-radio>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- Save & Reset Button -->
        <div class="vx-row">
            <div class="vx-col w-full">
                <div class="mt-8 flex flex-wrap items-center justify-end">
                    <vs-button class="ml-auto mt-2" @click="save_changes" :disabled="!validateForm">ذخیره</vs-button>
                    <vs-button class="ml-4 mt-2" type="border" color="warning" @click="reset_data">بازنشانی</vs-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        components: {},
        props: {
            data: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                data_local: JSON.parse(JSON.stringify(this.data)),

            }
        },
        computed: {
            status_local: {
                get() {
                    return this.data_local.user.gender
                },
                set(obj) {
                    this.data_local.user.gender = obj.value
                }
            },
            validateForm() {
                return !this.errors.any()
            },
            userGender() {
                return this.data_local.user.gender
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
                const payload = {
                 first_name:this.data_local.first_name,
                 last_name:this.data_local.last_name,
                  birthday:this.data_local.birthday,
                 gender:this.data_local.gender,
                 id:this.data_local.id,
                }
                this.$store.dispatch('userManagement/editUser', payload)
                    .then(() => {
                        this.$vs.loading.close()
                        this.$vs.notify({
                            title: 'موفق',
                            text: "عملیات با موفقیت انجام شد",
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'success'
                        })
                    })
                    .catch(error => {
                        this.$vs.loading.close()
                        this.$vs.notify({
                            title: 'خطا',
                            text:error,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    })
            },

            reset_data() {
                this.data_local = Object.assign({}, this.data)
            }
        },
    }
</script>
