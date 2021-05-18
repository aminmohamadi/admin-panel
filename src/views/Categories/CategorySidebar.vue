<template>
  <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary"
              class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{ this.data.hasOwnProperty('id') ? 'ویرایش' : 'افزودن' }} دسته</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <VuePerfectScrollbar class="scroll-area--data-list-add-new">
      <div class="p-6">
        <vs-input label="نام دسته" v-model="dataTitle" class="mt-5 w-full" name="item-name" v-validate="'required'"/>
        <span class="text-danger text-sm" v-show="errors.has('item-title')">{{ errors.first('item-title') }}</span>
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
      console.log(this.data.level)
      let {
        parent_id,
          level
      } = JSON.parse(JSON.stringify(this.data))
      this.dataParentId = parent_id
      this.dataLevel = level
      if (!val) return
      if (!this.data.hasOwnProperty('id')) {
        this.initValues()
        this.$validator.reset()
      } else {
        let {
          parent_id,
          id,
          title,
            level
        } = JSON.parse(JSON.stringify(this.data))
        this.dataParentId = parent_id
        this.dataId = id
        this.dataTitle = title
        this.dataLevel = level

        this.initValues()
      }
      // Object.entries(this.data).length === 0 ? this.initValues() : { this.dataId, this.dataTitle, this.dataCategory, this.dataOrder_status, this.dataPrice } = JSON.parse(JSON.stringify(this.data))
    }
  },
  data () {
    return {
      dataId: null,
      dataTitle: '',
      dataParentId:'',
      dataLevel:'',
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
      return !this.errors.any() && this.dataTitle
    }
  },
  methods: {
    initValues () {
      if (this.data.id) return
      this.dataId = null
      this.dataTitle = ''
    },
    submitData () {
      this.$validator.validateAll().then(result => {
        if (result) {
          let formData = new FormData()
          formData.append('title', this.dataTitle)
          formData.append('parent_id', this.dataParentId)
          if (this.data.id !== null) {
            var customUrl = 'categories'
          } else {
            customUrl = 'categories/' + this.dataId
            formData.append('_method', 'patch')
          }
          axios.post(customUrl, formData).then((response) => {
            if (this.data.level == 1) {
              this.$parent.$parent.firstLevelCategories = response.data.categories
            } else if (this.data.level == 2) {
              this.$parent.$parent.secondLevelCategories = response.data.categories
            } else if (this.data.level == 3) {
              this.$parent.$parent.thirdLevelCategories = response.data.categories
            }
            this.$vs.notify({
              title: response.data.title,
              text: response.data.message,
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: response.data.status
            })
          })
              .catch((error) => {
                console.log(error)
                this.$vs.notify({
                  duration: 20,
                  title: 'خطا',
                  text: error.response.data.message,
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
