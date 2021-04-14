<template>
  <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary"
              class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{ Object.entries(this.data).length === 0 ? 'افزودن' : 'ویرایش' }} مدیر</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <perfect-scrollbar>

      <div class="p-6">

        <!-- Product Image -->
        <template v-if="dataAvatar == null">
          <!-- Image Container -->
          <div class="img-container w-64 mx-auto flex items-center justify-center">
            <img :src="defaultImage" alt="img" class="responsive">
          </div>
          <div class="modify-img flex justify-between mt-5">
            <input type="file" class="hidden" ref="updateImgInput" @change="updateCurrImg" accept="image/*">
            <vs-button class="mr-4" type="flat" @click="$refs.updateImgInput.click()">افزودن تصویر</vs-button>
          </div>

        </template>
        <template v-else>
          <!-- Image Container -->
          <div class="img-container w-64 mx-auto flex items-center justify-center">
            <img :src="dataAvatar" alt="img" class="responsive" ref="dataAvatar">
          </div>

          <!-- Image upload Buttons -->
          <!-- Image upload Buttons -->
          <div class="modify-img flex justify-between mt-5">
            <input type="file" class="hidden" ref="updateImgInput" @change="updateCurrImg" accept="image/*">
            <vs-button class="mr-4" type="flat" @click="$refs.updateImgInput.click()">Update Image</vs-button>
            <vs-button type="flat" color="#999" @click="dataAvatar = null">Remove Image</vs-button>
          </div>
        </template>
        <div class="vx-row">
          <div class="vs-col col-12 mt-5 w-1/2 px-2">
            <vs-input label="نام" v-model="dataFirstName" class="w-full" name="item-firstName" v-validate="'required'"/>
            <span class="text-danger text-sm" v-show="errors.has('item-firstName')">{{
                errors.first('item-firstName')
              }}</span>
          </div>
          <div class="vs-col col-12 mt-5 w-1/2 px-2">
            <vs-input label="نام خانوادگی" v-model="dataLastName" v-validate="'required'" class="w-full"
                      name="item-lastName"/>
            <span class="text-danger text-sm" v-show="errors.has('item-lastName')">{{
                errors.first('item-lastName')
              }}</span>
          </div>
        </div>
        <div class="vx-row">
          <div class="vs-col col-12 mt-5 w-1/2 px-2">
            <vs-input label="ایمیل" v-model="dataEmail" class="w-full" name="item-email" v-validate="'required'"/>
            <span class="text-danger text-sm" v-show="errors.has('item-email')">{{ errors.first('item-email') }}</span>
          </div>
          <div class="vs-col col-12 mt-5 w-1/2 px-2">
            <vs-input label="موبایل" v-model="dataPhone" v-validate="'required'" class="w-full"
                      name="item-phone"/>
            <span class="text-danger text-sm" v-show="errors.has('item-phone')">{{
                errors.first('item-phone')
              }}</span>
          </div>
        </div>
        <div class="vx-row">
          <div class="vs-col col-12 mt-5 w-1/2 px-2">
            <vs-select label="نقش" v-model="dataRoleId" class="w-full" name="item-role" v-validate="'required'">
              <vs-select-item label="انتخاب کنید" text="انتخاب کنید">انتخاب کنید</vs-select-item>
              <vs-select-item v-for="(item,index) in this.$parent.roles" :key="index" :value="item.id" :label="item.name" :text="item.description"  />
            </vs-select>
            <span class="text-danger text-sm" v-show="errors.has('item-role')">{{ errors.first('item-role') }}</span>
          </div>
          <div class="vs-col col-12 mt-5 w-1/2 px-2">
            <vs-select label="جنسیت" v-model="dataGender" class="w-full" name="item-gender" v-validate="'required'">
              <vs-select-item label="انتخاب کنید" text="انتخاب کنید"/>
              <vs-select-item label="آقا" text="آقا" value="1"/>
              <vs-select-item label="خانم" text="خانم" value="2"/>
            </vs-select>
            <span class="text-danger text-sm" v-show="errors.has('item-gender')">{{
                errors.first('item-gender')
              }}</span>
          </div>
        </div>

      </div>
    </perfect-scrollbar>

    <div class="flex flex-wrap items-center p-6" slot="footer">
      <vs-button class="mr-6" @click="submitData" :disabled="!isFormValid">ثبت</vs-button>
      <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">لغو</vs-button>
    </div>
  </vs-sidebar>
</template>

<script>
import axios from './../../http/axios/index'
export default {
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      default: () => {
      }
    }
  },
  data () {
    return {
      dataId: null,
      dataFirstName: null,
      dataLastName: null,
      dataEmail: null,
      dataPhone: null,
      dataRoleId: null,
      dataGender: null,
      dataAvatar: null,
      file:null,
      defaultImage: 'http://shop.test/images/defaults/UserDefault.jpg',
      settings: { // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: .60
      }
    }
  },
  watch: {
    isSidebarActive (val) {
      if (!val) return
      if (Object.entries(this.data).length === 0) {
        this.initValues()
        this.$validator.reset()
      } else {
        const {
          id,
          first_name,
          last_name,
          email,
          phone,
          role_id,
          gender,
          status,
          avatar
        } = JSON.parse(JSON.stringify(this.data))
        this.dataId = id
        this.dataFirstName = first_name
        this.dataLastName = last_name
        this.dataEmail = email
        this.dataPhone = phone
        this.dataRoleId = role_id
        this.dataGender = gender
        this.dataAvatar = avatar
        this.initValues()
      }
      // Object.entries(this.data).length === 0 ? this.initValues() : { this.dataId, this.dataName, this.dataCategory, this.dataOrder_status, this.dataPrice } = JSON.parse(JSON.stringify(this.data))
    }
  },
  computed: {
    isFormValid () {
      return !this.errors.any() && this.dataFirstName && this.dataLastName && this.dataEmail
          && this.dataPhone  && this.dataRoleId  && this.dataGender && this.dataAvatar
    },
    isSidebarActiveLocal: {
      get () {
        return this.isSidebarActive
      },
      set (val) {
        if (!val) {
          this.$emit('closeSidebar')
          // this.$validator.reset()
          // this.initValues()
        }
      }
    },

    scrollbarTag () {
      return this.$store.getters.scrollbarTag
    }
  },
  methods: {
    initValues () {
      if (this.data.id) return
      this.dataId = null
      this.dataFirstName = null
      this.dataLastName = null
      this.dataEmail = null
      this.dataPhone = null
      this.dataRoleId = null
      this.dataGender = null
      this.dataAvatar = null
    },
    submitData () {
      this.$validator.validateAll().then(result => {
        if (result) {
          let formData = new FormData();
          formData.append('first_name',this.dataFirstName)
          formData.append('last_name',this.dataLastName)
          formData.append('email',this.dataEmail)
          formData.append('phone',this.dataPhone)
          formData.append('role_id',this.dataRoleId)
          formData.append('gender',this.dataGender)
          if (Object.entries(this.data).length === 0 ){
            var customUrl = "/admins"
            formData.append('avatar',this.file)

          }
          else {
            customUrl = "admins/"+ this.dataId
            formData.append('_method','patch')
            formData.append('avatar',this.dataAvatar)
          }
          axios.post(customUrl,formData).then((response) => {
                this.$parent.admins = response.data.admins
                this.$vs.notify({
                  title: response.data.title,
                  text: response.data.message,
                  iconPack: 'feather',
                  icon: 'icon-'+response.data.icon+'-circle',
                  color: response.data.status
                })
              })
              .catch((error) => {
                this.$vs.notify({
                  title: 'خطا',
                  text: error,
                  iconPack: 'feather',
                  icon: 'icon-alert-circle',
                  color: 'danger'
                })
              })
          this.$emit('closeSidebar')
          this.initValues()
        }
      })
    },
    updateCurrImg (input) {
      if (input.target.files && input.target.files[0]) {
        const reader = new FileReader()
        reader.onload = e => {
          this.dataAvatar = e.target.result
          this.file = this.$refs.updateImgInput.files[0];
          this.$refs.dataAvatar.src = this.$refs.updateImgInput.files[0];
        }
        reader.readAsDataURL(input.target.files[0])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
    z-index: 52010;
    width: 400px;
    max-width: 90vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }
}

.scroll-area--data-list-add-new {
  // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
  height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);

  &:not(.ps) {
    overflow-y: auto;
  }
}

.ps {
  height: 100%;
}
</style>
