<template>
    <div id="user-edit-tab-info">
        <div class="vx-row">
            <div class="vx-col md:w-1/2 w-full">
                <div class="flex items-end">
                    <feather-icon icon="UserIcon" class="mr-2" svgClasses="w-5 h-5" />
                    <span class="leading-none font-medium">اطلاعات کاربری</span>
                </div>
                <div class="mt-4">
                    <vs-input class="w-full mt-4" label="ایمیل" v-model="data_local.user.email" type="email"
                              v-validate="'required|email'" name="email"/>
                    <span class="text-danger text-sm" v-show="errors.has('email')">{{ errors.first('email') }}</span>
                </div>
                <div class="mt-4">
                    <vs-input class="w-full mt-4" label="موبایل" v-model="data_local.user.phone" v-validate="{regex: '09(1[0-9]|3[1-9]|2[1-9])-?[0-9]{3}-?[0-9]{4}' }" name="phone" />
                    <span class="text-danger text-sm"  v-show="errors.has('phone')">{{ errors.first('phone') }}</span>
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
    import vSelect from 'vue-select'

    export default {
        components: {
            vSelect
        },
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
            validateForm() {
                return !this.errors.any()
            },

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
                    email:this.data_local.email,
                    phone:this.data_local.phone,
                    username:this.data_local.username,
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


<style>
    .con-img-upload {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        background: rgba(0, 80, 0, .5);
        background: #fff;
        -webkit-box-shadow: 0 5px 20px 0 rgba(0, 0, 0, .1);
        box-shadow: 0 5px 20px 0 rgba(0, 0, 0, .1);
        -webkit-transition: all .3s ease;
        transition: all .3s ease;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        width: 200px;
        height: 200px;
        margin: 5px;
        cursor: pointer;
    }
</style>
