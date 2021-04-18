<template>
  <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary"
              class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{ Object.entries(this.data).length === 0 ? 'افزودن' : 'ویرایش' }} ویدیو</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <perfect-scrollbar>

      <div class="p-6">
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
          <div class="vs-col col-12 mt-5 w-1/2 px-2">
            <vs-input label="کلمات کلیدی" v-model="dataTags" class="w-full" name="item-tags" v-validate="'required'"/>
            <span class="text-danger text-sm" v-show="errors.has('item-tags')">{{ errors.first('item-tags') }}</span>
          </div>
          <div class="vs-col col-12 mt-5 w-1/2 px-2">
            <vs-input label="لینک ویدیو" v-model="dataVideoUrl" class="w-full" name="item-videoUrl"
                      v-validate="'required'"/>
            <span class="text-danger text-sm" v-show="errors.has('item-videoUrl')">{{
                errors.first('item-videoUrl')
              }}</span>
          </div>
        </div>
        <div class="vx-row">
          <div class="vs-col col-12 mt-5 w-1/3 px-2">
            <vs-select label="نوع ویدیو" v-model="dataType" v-validate="'required'" class="w-full"
                       name="item-phone">
              <vs-select-item value="" text="انتخاب کنید" label="انتخاب کنید"/>
              <vs-select-item value="free" text="رایگان" label="رایگان"/>
              <vs-select-item value="cash" text="نقدی" label="نقدی"/>
            </vs-select>
            <span class="text-danger text-sm" v-show="errors.has('item-phone')">{{
                errors.first('item-phone')
              }}</span>
          </div>
          <div class="vs-col col-12 mt-5 w-1/3 px-2">
            <vs-input label="زمان ویدیو" v-model="dataVideoTime" class="w-full" name="item-videoTime"
                      v-validate="'required'"/>
            <span class="text-danger text-sm" v-show="errors.has('item-videoTime')">{{
                errors.first('item-videoTime')
              }}</span>
          </div>
          <div class="vs-col col-12 mt-5 w-1/3 px-2">
            <vs-input label="شماره ویدیو" v-model="dataVideoNumber" class="w-full" name="item-videoNumber"
                      v-validate="'required'"/>
            <span class="text-danger text-sm"
                  v-show="errors.has('item-videoNumber')">{{ errors.first('item-videoNumber') }}</span>
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
      dataTags: null,
      dataVideoUrl: null,
      dataVideoNumber: null,
      dataVideoTime: null,
      dataType: null,
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
          title,
          description,
          tags,
          type,
          url,
          time,
          number

        } = JSON.parse(JSON.stringify(this.data))
        this.dataId = id
        this.dataTitle = title
        this.dataDescription = description
        this.dataTags = tags
        this.dataType = type
        this.dataVideoUrl = url
        this.dataVideoNumber = number
        this.dataVideoTime = time
        this.initValues()
      }
    }
  },
  computed: {
    isFormValid () {
      return !this.errors.any() && this.dataTitle && this.dataDescription && this.dataTags
          && this.dataType && this.dataVideoUrl && this.dataVideoNumber && this.dataVideoTime
    },
    isSidebarActiveLocal: {
      get () {
        return this.isSidebarActive
      },
      set (val) {
        if (!val) {
          this.$emit('closeSidebar')
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
      this.dataTags = null
      this.dataType = null
      this.dataVideoUrl = null
      this.dataVideoNumber = null
      this.dataVideoTime = null
    },
    submitData () {
      this.$validator.validateAll().then(result => {
        if (result) {
          let formData = new FormData()
          formData.append('title', this.dataTitle)
          formData.append('description', this.dataDescription)
          formData.append('video_url', this.dataVideoUrl)
          formData.append('tags', this.dataTags)
          formData.append('type', this.dataType)
          formData.append('time', this.dataVideoTime)
          formData.append('number', this.dataVideoNumber)
          if (Object.entries(this.data).length === 0) {
            var customUrl = '/course/'+this.$route.params.id+'/episode'
          } else {
             customUrl = '/course/'+this.$route.params.id+'/episode/'+this.dataId
            formData.append('_method', 'patch')
          }
          axios.post(customUrl, formData).then((response) => {
            this.$parent.episodes = response.data.episodes
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
    },
  },

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
