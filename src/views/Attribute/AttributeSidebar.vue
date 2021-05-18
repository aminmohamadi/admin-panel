<template>
  <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary"
              class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{ Object.entries(this.data).length === 0 ? 'افزودن ' : 'ویرایش' }} ویژگی</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <VuePerfectScrollbar class="scroll-area--data-list-add-new">
      <div class="p-6">
        <vs-input label="نام" v-model="dataTitle" class="mt-5 w-full" name="item-title"
                  v-validate="'required'"/>
        <span class="text-danger text-sm"
              v-show="errors.has('item-title')">{{ errors.first('item-title') }}</span>

        <vs-select label="نوع" v-model="dataType" class="mt-5 w-full" name="item-type" v-validate="'required'">
          <vs-select-item label="انتخاب کنید" text="انتخاب کنید"></vs-select-item>
          <vs-select-item label="متن" text="متن" value="1"></vs-select-item>
          <vs-select-item label="انتخابی" text="انتخابی" value="2"></vs-select-item>
          <vs-select-item label="متن بلند" text="متن بلند" value="3"></vs-select-item>
          <vs-select-item label="چک باکس" text="چک باکس" value="4"></vs-select-item>
          <vs-select-item label="عدد" text="عدد" value="5"></vs-select-item>
        </vs-select>
        <span class="text-danger text-sm"
              v-show="errors.has('item-type')">{{ errors.first('item-type') }}</span>


        <vs-input label="راهنما" v-model="dataHelp" class="mt-5 w-full" name="item-help"/>
        <vs-input label="پسوند" v-model="dataSuffix" class="mt-5 w-full" name="item-suffix"/>
        <vs-select label="گروه ویژگی ها" v-model="dataAttributeGroup" class="mt-5 w-full"
                   name="item-attribute-group" v-validate="'required'">
          <vs-select-item label="انتخاب کنید" text="انتخاب کنید"></vs-select-item>
          <vs-select-item v-for="(item ,key) in attribute_groups" :label="item.title" :text="item.title"
                          :key="key" :value="item.id"></vs-select-item>
        </vs-select>
        <span class="text-danger text-sm"
              v-show="errors.has('item-attribute-group')">{{ errors.first('item-attribute-group') }}</span>
        <vs-row>
          <div class="mt-5 w-1/2">
            <vx-tooltip text="فقط ویژگی های انتخابی و رنگ ها" style="display: inline">
              <vs-checkbox :value="1" v-model="dataSearchable" :disabled="!canSelectSearchable">
                قابل جست و جو
              </vs-checkbox>
            </vx-tooltip>
          </div>
          <div class="mt-5 w-1/2">
            <vx-tooltip text="فقط ویژگی های انتخابی و رنگ ها" style="display: inline">
              <vs-checkbox :value="1" v-model="dataSelectable" :disabled="!canSelectSearchable">
                قابل انتخاب
              </vs-checkbox>
            </vx-tooltip>
          </div>
          <div class="mt-5 w-1/2">
            <vx-tooltip text="فقط ویژگی های انتخابی" style="display: inline">
              <vs-checkbox :value="1" v-model="dataMultiSelect" :disabled="!isMultiSelect">
                چند انتخابی
              </vs-checkbox>
            </vx-tooltip>
          </div>

          <div class="mt-5 w-1/2">
            <vs-checkbox :value="1" v-model="dataRequired">
              الزامی
            </vs-checkbox>
          </div>
        </vs-row>

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
          title,
          help,
          type,
          suffix,
          searchable,
          selectable,
          multiSelect,
          required,
          attributeGroupId
        } = JSON.parse(JSON.stringify(this.data))
        this.dataId = id
        this.dataTitle = title
        this.dataHelp = help
        this.dataType = type
        this.dataSuffix = suffix
        this.dataSearchable = searchable
        this.dataSelectable = selectable
        this.dataMultiSelect = multiSelect
        this.dataRequired = required
        this.dataAttributeGroup = attributeGroupId
        this.initValues()
      }
      // Object.entries(this.data).length === 0 ? this.initValues() : { this.dataId, this.dataName, this.dataCategory, this.dataOrder_status, this.dataPrice } = JSON.parse(JSON.stringify(this.data))
    },
    dataType (val) {
      if (val !== 2 || val !== 4) {
        this.dataSearchable = false
            this.dataSelectable = false
            this.dataMultiSelect = false
      }
    }
  },
  data () {
    return {

      dataId: '',
      dataTitle: '',
      dataHelp: '',
      dataType: '',
      dataSuffix: '',
      dataSearchable: false,
      dataSelectable: false,
      dataMultiSelect: false,
      dataRequired: false,
      dataAttributeGroup: '',
      settings: { // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: .60
      }
    }
  },
  computed: {
    canSelectSearchable () {
      return this.dataType == 2 || this.dataType == 4 || this.dataType == 5
    },
    isMultiSelect () {
      return this.dataType == 2
    },
    attribute_groups () {
      return this.$parent.attributeGroups
    },
    isSidebarActiveLocal: {
      get () {
        return this.isSidebarActive
      },
      set (val) {
        if (!val) {
          this.$emit('closeSidebar')
          this.$validator.reset()
          this.initValues()
        }
      }
    },
    isFormValid () {
      return !this.errors.any() && this.dataTitle && this.dataType && this.dataAttributeGroup
    }
  },
  methods: {
    initValues () {
      if (this.data.id) return
      this.dataId = null
      this.dataTitle = null
      this.dataHelp = null
      this.dataType = null
      this.dataSuffix = null
      this.dataSearchable = false
      this.dataSelectable = false
      this.dataMultiSelect = false
      this.dataRequired = false
      this.dataAttributeGroup = null

    },
    submitData () {

      this.$validator.validateAll().then(result => {
        if (result) {
          var formData = new FormData()
          formData.append('title', this.dataTitle)
          formData.append('help', this.dataHelp)
          formData.append('type', this.dataType)
          formData.append('suffix', this.dataSuffix)
          formData.append('searchable', this.dataSearchable)
          formData.append('selectable', this.dataSelectable)
          formData.append('multi_select', this.dataMultiSelect)
          formData.append('required', this.dataRequired)
          formData.append('attribute_group_id', this.dataAttributeGroup)
          var myform = {
            title: this.dataTitle,
            help: this.dataHelp,
            type: this.dataType,
            suffix: this.dataSuffix,
            searchable: this.dataSearchable,
            selectable: this.dataSelectable,
            multi_select: this.dataMultiSelect,
            required: this.dataRequired,
            attribute_group_id: this.dataAttributeGroup
          }
          if (Object.entries(this.data).length === 0) {
            var customUrl = 'attributes/' + this.$route.params.id
          } else {
            customUrl = 'attributes/' + this.dataId
            myform._method = 'patch'
          }
          axios.post(customUrl, myform)
              .then((response) => {
                this.$parent.attributes = response.data.attributes
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
