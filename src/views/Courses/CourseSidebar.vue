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

        <!-- Product Image -->
        <template v-if="dataImageUrl == null">
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
            <img :src="dataImageUrl" alt="img" class="responsive" ref="dataAvatar">
          </div>

          <!-- Image upload Buttons -->
          <!-- Image upload Buttons -->
          <div class="modify-img flex justify-between mt-5">
            <input type="file" class="hidden" ref="updateImgInput" @change="updateCurrImg" accept="image/*">
            <vs-button class="mr-4" type="flat" @click="$refs.updateImgInput.click()">Update Image</vs-button>
            <vs-button type="flat" color="#999" @click="dataImageUrl = null">Remove Image</vs-button>
          </div>
        </template>
        <div class="vx-row">
          <div class="vs-col col-12 mt-5 w-1/2 px-2">
            <vs-input label="عنوان" v-model="dataTitle" class="w-full" name="item-title" v-validate="'required'"/>
            <span class="text-danger text-sm" v-show="errors.has('item-title')">{{
                errors.first('item-title')
              }}</span>
          </div>
          <div class="vs-col col-12 mt-5 w-1/2 px-2">
            <vs-input label="توضیح" v-model="dataDescription" v-validate="'required'" class="w-full"
                      name="item-description"/>
            <span class="text-danger text-sm" v-show="errors.has('item-description')">{{
                errors.first('item-description')
              }}</span>
          </div>
        </div>
        <div class="vx-row">
          <div class="vs-col col-12 mt-5 w-1/3 px-2">
            <vs-input label="کلمات کلیدی" v-model="dataTags" class="w-full" name="item-tags" v-validate="'required'"/>
            <span class="text-danger text-sm" v-show="errors.has('item-tags')">{{ errors.first('item-tags') }}</span>
          </div>
          <div class="vs-col col-12 mt-5 w-1/3 px-2">
            <vs-select label="نوع دوره" v-model="dataType" v-validate="'required'" class="w-full"
                       name="item-phone">
              <vs-select-item value="" text="انتخاب کنید" label="انتخاب کنید" />
              <vs-select-item value="free" text="رایگان" label="رایگان" />
              <vs-select-item value="cash" text="نقدی" label="نقدی" />
              <vs-select-item value="vip" text="اعضای ویژه" label="اعضای ویژه" />
            </vs-select>
            <span class="text-danger text-sm" v-show="errors.has('item-phone')">{{
                errors.first('item-phone')
              }}</span>
          </div>
          <div class="vs-col col-12 mt-5 w-1/3 px-2">
            <vs-input label="قیمت" v-model="dataPrice" class="w-full" name="item-price" v-validate="'required'"/>
            <span class="text-danger text-sm" v-show="errors.has('item-price')">{{ errors.first('item-price') }}</span>
          </div>

        </div>
        <div class="vx-row">
          <div class="vs-col col-12 mt-5 w-full px-2">
            <template>
              <template>
                <div class="quill-wrap">
                  <vue-editor id="editor" useCustomImageHandler @image-added="handleImageAdded" v-model="dataBody"/>
                </div>
              </template>
            </template>
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
      dataId :null,
      dataTitle :null,
      dataDescription :null,
      dataBody :null,
      dataTags :null,
      dataPrice :null,
      dataType :null,
      dataImageUrl :null,
      file:null,
      defaultImage: 'http://shop.test/images/defaults/ArticleDefault.jpg',
      settings: { // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: .60
      },
      editorOption: {
        imageUpload : this.handleImageAdded
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
          body,
          tags,
          price,
          type,
          image_url
        } = JSON.parse(JSON.stringify(this.data))
        this.dataId = id
        this.dataTitle = title
        this.dataDescription = description
        this.dataBody = body
        this.dataTags = tags
        this.dataPrice = price
        this.dataType = type
        this.dataImageUrl = image_url
        this.initValues()
      }
      // Object.entries(this.data).length === 0 ? this.initValues() : { this.dataId, this.dataName, this.dataCategory, this.dataOrder_status, this.dataPrice } = JSON.parse(JSON.stringify(this.data))
    }
  },
  computed: {
    isFormValid () {
      return !this.errors.any() && this.dataTitle && this.dataDescription && this.dataBody
          && this.dataTags  && this.dataPrice  && this.dataType && this.dataImageUrl
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
      this.dataBody = null
      this.dataTags = null
      this.dataPrice = null
      this.dataType = null
      this.dataImageUrl = null
    },
    submitData () {
      this.$validator.validateAll().then(result => {
        if (result) {
          let formData = new FormData();
          formData.append('title',this.dataTitle)
          formData.append('description',this.dataDescription)
          formData.append('body',this.dataBody)
          formData.append('tags',this.dataTags)
          formData.append('type',this.dataType)
          formData.append('price',this.dataPrice)
          if (this.file == null){
            formData.append('image_url',this.dataImageUrl)
          }else {
            formData.append('image_url',this.file)
          }
          if (Object.entries(this.data).length === 0 ){
            var customUrl = "/courses"
          }
          else {
            customUrl = "courses/"+ this.dataId
            formData.append('_method','patch')
          }
          axios.post(customUrl,formData).then((response) => {
            this.$parent.courses = response.data.courses
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
          this.dataImageUrl = e.target.result
          this.file = this.$refs.updateImgInput.files[0];
          this.$refs.dataAvatar.src = this.$refs.updateImgInput.files[0];
        }
        reader.readAsDataURL(input.target.files[0])
      }
    },
    handleImageAdded: function (file, Editor, cursorLocation, resetUploader) {
      // An example of using FormData
      // NOTE: Your key could be different such as:
      // formData.append('file', file)

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
