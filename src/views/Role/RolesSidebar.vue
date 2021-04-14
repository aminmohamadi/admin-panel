<template>
  <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary"
              class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{ Object.entries(this.data).length === 0 ? 'افزودن ' : 'ویرایش' }} نقش</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <VuePerfectScrollbar class="scroll-area--data-list-add-new">
      <div class="p-6">
        <div class="vx-row">
          <div class="vx-col md:w-1/2 sm:w-1/2 w-full">
            <vs-input label="نقش" v-model="dataTitle" class="mt-5 w-full" name="item-title" v-validate="'required'"/>
            <span class="text-danger text-sm" v-show="errors.has('item-title')">{{ errors.first('item-title') }}</span>
          </div>
          <div class="vx-col md:w-1/2 sm:w-1/2 w-full">
            <vs-input label="عنوان" v-model="dataDescription" class="mt-5 w-full" v-validate="'required'"
                      name="description"/>
            <span class="text-danger text-sm" v-show="errors.has('description')">{{
                errors.first('description')
              }}</span>
          </div>
        </div>
      </div>
    </VuePerfectScrollbar>

    <div class="flex flex-wrap items-center p-6" slot="footer">
      <vs-button class="mr-6" @click="submitData" :disabled="!isFormValid">ذخیره</vs-button>
      <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">لغو</vs-button>
    </div>
  </vs-sidebar>
</template>
<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import axios from '../../axios'

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
  watch: {
    isSidebarActive (val) {
      if (!val) return
      if (Object.entries(this.data).length === 0) {
        this.initValues()
        this.$validator.reset()
      } else {
        let {
          id,
          name,
          description
        } = JSON.parse(JSON.stringify(this.data))
        this.dataId = id
        this.dataDescription = description
        this.dataTitle = name
        this.initValues()
      }
      // Object.entries(this.data).length === 0 ? this.initValues() : { this.dataId, this.dataTitle, this.dataCategory, this.dataOrder_status, this.dataPrice } = JSON.parse(JSON.stringify(this.data))
    }
  },
  data () {
    return {

      dataId: null,
      dataTitle: '',
      dataDescription: null,
      settings: { // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: .60
      }
    }
  },
  computed: {
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
    isFormValid () {
      return !this.errors.any() && this.dataTitle && this.dataDescription
    }
  },
  methods: {
    initValues () {
      if (this.data.id) return
      this.dataId = null
      this.dataTitle = ''
      this.dataDescription = null
    },
    submitData () {
      this.$validator.validateAll().then(result => {
        if (result) {
          let formData = new FormData()
          formData.append('title', this.dataTitle)
          formData.append('description', this.dataDescription)
          if (Object.entries(this.data).length === 0) {
            var customUrl = '/roles'
          } else {
            customUrl = 'roles/' + this.dataId
            formData.append('_method', 'patch')
          }
          axios.post(customUrl, formData).then((response) => {
            this.$parent.roles = response.data.roles
            this.$vs.notify({
              title: response.data.title,
              text: response.data.message,
              iconPack: 'feather',
              icon: 'icon-' + response.data.icon + '-circle',
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
    }
  },
  components: {
    VuePerfectScrollbar
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
}
</style>