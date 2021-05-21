<template>
    <div id="user-edit-tab-avatar">
        <div class="vx-row">
            <div class="vx-col md:w-1/2 w-full">
                <div class="mt-12">
                    <label for="file" class="btn btn-upload-file">
                        <img id='output' class="con-img-upload" :src="data_local.user.avatar">
                    </label>
                    <input type='file' hidden id="file" ref="file" name="file" accept='image/*' @change='openFile'>
                </div>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col md:w-1/2 w-full">
                <div class="mt-4">
                    <vs-button class="ml-auto mt-2" @click="save_changes" :disabled="!validateAvatar">ویرایش تصویر</vs-button>
                    <vs-button class="ml-auto mt-2" color="warning" :disabled="disableDeleteAvatarButton" @click="deleteAvatarConfirm" >حذف تصویر</vs-button>

                </div>
            </div>

        </div>

    </div>
</template>

<script>
    import axios from "../../http/axios/index";
    import {store} from '../../store/store'

    export default {
        props: {
            data: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                file:'',
                image:this.data.avatar,
                data_local: JSON.parse(JSON.stringify(this.data)),
            }
        },
        computed: {
            validateAvatar() {
                return !this.file == ''
            },
            disableDeleteAvatarButton() {
                return this.image == 'avatardefault.png'
            }
        },
        methods: {
            openFile () {
                this.file = this.$refs.file.files[0];
                this.createImage(this.file);
            },
            createImage(file) {
                var reader = new FileReader();
                reader.onload = (e)=>{
                    var dataURL = reader.result;
                    var output = document.getElementById('output');
                    output.src = dataURL;
                };
                reader.readAsDataURL(file);
            },

            save_changes() {
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'primary',
                    title: `بروزرسانی تصویر`,
                    acceptText: 'تایید',
                    cancelText: 'لغو',
                    text: 'تصویر پروفایل به روز رسانی شود؟',
                    accept: this.doChanges
                })
            },
            doChanges() {
                this.$vs.loading()
                let formData = new FormData();
                formData.append('file', this.file);
                formData.append('token', localStorage.getItem('access_token'));
                axios.post( '/api/auth/admin/user/update/avatar',
                    formData,
                    {
                        // access_token: localStorage.getItem('access_token'),
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                            // 'Content-Type': 'multipart/form-data'
                        },
                    }
                ).then((response)=>{
                    this.$store.dispatch('updateUserInfo',response.data.user_data)
                    this.$vs.loading.close()
                    var output = document.getElementById('output');
                    output.src='/images/users-avatar/'+response.data.user_data.avatar
                    this.file=null
                    this.image=response.data.user_data.avatar
                    this.$vs.notify({
                        title: response.data.title,
                        text: response.data.message,
                        iconPack: 'feather',
                        icon: 'icon-'+response.data.icon+'-circle',
                        color: response.data.status
                    })
                })
                    .catch((error)=>{
                        this.$vs.loading.close()
                        this.$vs.notify({
                            title: 'خطا',
                            text: error,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    });
            },
            deleteAvatarConfirm() {
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'warning',
                    title: `حذف تصویر`,
                    acceptText: 'تایید',
                    cancelText: 'لغو',
                    text: 'تصویر پروفایل به حذف شود؟',
                    accept: this.deleteAvatar
                })
            },
            deleteAvatar() {
                this.$vs.loading()
                axios.post( '/api/auth/admin/user/delete/avatar',
                    {
                        token: localStorage.getItem('access_token'),
                        headers: {
                            'Authorization': 'Bearer' + localStorage.getItem('access_token'),
                            'Content-Type': 'multipart/form-data'
                        },
                    }
                ).then((response)=>{
                    this.$store.dispatch('updateUserInfo',response.data.user_data)
                    var output = document.getElementById('output');
                    output.src='/images/users-avatar/'+response.data.user_data.avatar
                    this.$vs.loading.close()
                    this.image='avatardefault.png'
                    this.$vs.notify({
                        title: response.data.title,
                        text: response.data.message,
                        iconPack: 'feather',
                        icon: 'icon-'+response.data.icon+'-circle',
                        color: response.data.status
                    })
                })
                    .catch((error)=>{
                        this.$vs.loading.close()
                        this.$vs.notify({
                            title: 'خطا',
                            text: error,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    });
            },
        },
    }
</script>

<style>
    .con-img-upload {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        background: rgba(0,80,0,.5);
        background: #fff;
        -webkit-box-shadow: 0 5px 20px 0 rgba(0,0,0,.1);
        box-shadow: 0 5px 20px 0 rgba(0,0,0,.1);
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
