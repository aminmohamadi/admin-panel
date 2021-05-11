<template>
  <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary"
              class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{ Object.entries(this.data).length === 0 ? 'افزودن' : 'ویرایش' }} دوره</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <perfect-scrollbar>

      <div class="p-6">

        <div class="vx-row">
          <div class="vs-col col-12 mt-5 w-1/3 px-2">
            <vs-input label="عنوان" v-model="dataTitle" class="w-full" name="item-title" v-validate="'required'"/>
            <span class="text-danger text-sm" v-show="errors.has('item-title')">{{
                errors.first('item-title')
              }}</span>
          </div>
          <div class="vs-col col-12 mt-5 w-1/3 px-2">
            <vs-input label="قیمت" v-model="dataPrice" class="w-full" name="item-price" v-validate="'required'"/>
            <span class="text-danger text-sm" v-show="errors.has('item-price')">{{
                errors.first('item-price')
              }}</span>
          </div>
          <div class="vs-col col-12 mt-5 w-1/3 px-2">
            <vs-input label="موجودی" v-model="dataInventory" class="w-full" name="item-inventory"
                      v-validate="'required'"/>
            <span class="text-danger text-sm" v-show="errors.has('item-inventory')">{{
                errors.first('item-inventory')
              }}</span>
          </div>
        </div>
        <div class="vx-row">
          <div class="vs-col col-12 mt-5 w-full px-2">
            <div class="quill-wrap">
              <vue-editor label="توضیح" name="item-description" id="editor" v-validate="'required'"
                          useCustomImageHandler @image-added="handleImageAdded" v-model="dataDescription"/>
            </div>
            <span class="text-danger text-sm" v-show="errors.has('item-description')">{{
                errors.first('item-description')
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
import {VueEditor, Quill} from 'vue2-editor'

export default {
  props: {
    isSidebarActive: {
      typuired: true
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
      dataTitle: null,
      dataDescription: null,
      dataPrice: null,
      dataInventory: null,
      settings: { // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: .60
      },
      editorOption: {
        imageUpload: this.handleImageAdded
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
          title,
          description,
          price,
          inventory
        } = JSON.parse(JSON.stringify(this.data))
        this.dataId = id
        this.dataTitle = title
        this.dataDescription = description
        this.dataPrice = price
        this.dataInventory = inventory
        this.initValues()
      }
      // Object.entries(this.data).length === 0 ? this.initValues() : { this.dataId, this.dataName, this.dataCategory, this.dataOrder_status, this.dataPrice } = JSON.parse(JSON.stringify(this.data))
    }
  },
  computed: {
    isFormValid () {
      return !this.errors.any() && this.dataTitle && this.dataDescription && this.dataPrice && this.dataInventory
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
      this.dataTitle = null
      this.dataDescription = null
      this.dataPrice = null
      this.dataInventory = null
    },
    submitData () {
      this.$validator.validateAll().then(result => {
        if (result) {
          let formData = new FormData()
          formData.append('title', this.dataTitle)
          formData.append('description', this.dataDescription)
          formData.append('price', this.dataPrice)
          formData.append('inventory', this.dataInventory)
          if (Object.entries(this.data).length === 0) {
            var customUrl = '/products'
          } else {
            customUrl = '/products/' + this.dataId
            formData.append('_method', 'patch')
          }
          axios.post(customUrl, formData).then((response) => {
            this.$parent.products = response.data.products
            // console.log(response.data.message)
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
                  duration:20,
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
    },
    handleImageAdded: function (file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData()
      formData.append('image', file)

      axios({
        url: 'upload',
        method: 'POST',
        data: formData
      })
          .then(result => {
            let url = result.data.url // Get url from response
            Editor.insertEmbed(cursorLocation, 'image', url)
            resetUploader()
          })
          .catch(err => {
            console.log(err)
          })
    }
  },
  components: {
    VueEditor
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

.ql-editor .ql-blank {
  height: 400px;
}
</style>
