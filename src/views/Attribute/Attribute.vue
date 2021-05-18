<template>
  <div id="data-list-list-view" class="data-list-container">
    <data-view-sidebar :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" :data="sidebarData"/>
    <vx-card actionButtons @refresh="fetch" title="همه ویژگی ها" class="roles-list mb-8">
      <vs-table ref="table" multiple v-model="selected" pagination :max-items="itemsPerPage" :data="resultQuery"
                noDataText="موردی برای نمایش وجود ندارد">
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <div class="flex flex-wrap-reverse items-center data-list-btn-container">
            <!-- ADD NEW -->
            <button class="p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base
                          text-primary border border-solid border-primary " style="background-color: #fff"
                    @click="addNewData">
              <span class="">افزودن</span>
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4"/>
            </button>
          </div>

          <!-- ITEMS PER PAGE -->
          <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
            <div
                class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
              <span class="mr-2">{{
                  currentPage * itemsPerPage - (itemsPerPage - 1)
                }} - {{
                  resultQuery.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : resultQuery.length
                }} از {{ queriedItems }} آیتم</span>
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4"/>
            </div>
            <!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->
            <vs-dropdown-menu>

              <vs-dropdown-item @click="itemsPerPage=4">
                <span>4</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage=10">
                <span>10</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage=15">
                <span>15</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage=20">
                <span>20</span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>

        <template slot="thead">
          <vs-th sort-key="title">نام</vs-th>
          <vs-th sort-key="type">نوع</vs-th>
          <vs-th sort-key="attribute_group">گروه ویژگی</vs-th>
          <vs-th sort-key="required">الزامی</vs-th>
          <vs-th sort-key="searchable">قابل جست و جو</vs-th>
          <vs-th sort-key="selectable">قابل انتخاب</vs-th>
          <vs-th sort-key="multi_select">چند انتخابی</vs-th>
          <vs-th>عملیات</vs-th>
        </template>
        <template slot-scope="{data}">
          <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

            <vs-td class="text-center">
              <p class="product-name font-medium truncate">{{ tr.title }}</p>
            </vs-td>
            <vs-td class="text-center">
              <p class="product-name font-medium truncate">{{ trType(tr.type) }}</p>
            </vs-td>
            <vs-td class="text-center">
              <p class="product-name font-medium truncate">{{ tr.attributeGroupName }}</p>
            </vs-td>
            <vs-td class="text-center">
              <p class="product-name font-medium truncate">{{ required(tr.required) }}</p>
            </vs-td>
            <vs-td class="text-center">
              <p class="product-name font-medium truncate">{{ searchable(tr.searchable) }}</p>
            </vs-td>
            <vs-td class="text-center">
              <p class="product-name font-medium truncate">{{ selectable(tr.selectable) }}</p>
            </vs-td>
            <vs-td class="text-center">
              <p class="product-name font-medium truncate">{{ multiSelect(tr.multi_select) }}</p>
            </vs-td>
            <vs-td class="whitespace-no-wrap text-center">
              <feather-icon icon="EditIcon" svgClasses="w-5 h-5 hover:text-warning stroke-current"
                            @click.stop="editData(tr)"/>
              <feather-icon icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current"
                            class="ml-2" @click.stop="confirmDeleteRecord(tr.id)"/>
              <vx-tooltip text="مقدار دهی به این ویژگی" style="display: inline">
                <feather-icon v-if="tr.type == 2" icon="EyeIcon" svgClasses="w-5 h-5 hover:text-success stroke-current"
                              class="ml-2" @click.stop="attributeValuePopUp(tr)"/>
              </vx-tooltip>

            </vs-td>

          </vs-tr>
          </tbody>
        </template>
      </vs-table>
      <vs-popup classContent="attributeValuePopUp" background-color-popup="primary" title="مقدار دهی به ویژگی"
                :active.sync="attributeValuePopUpStatus" @close="initValues">
        <vx-input-group class="mb-base">
          <vs-input v-model="attribute_value"/>
          <template slot="append">
            <div class="append-text btn-addon">
              <vs-button color="primary" @click.stop="addAttributeValue()">افزودن</vs-button>
            </div>
          </template>
        </vx-input-group>
        <vs-list>
          <template v-for="(item , key) in values">
            <vs-list-item icon="check" :title="item.value">
              <feather-icon :key="key" icon="TrashIcon" cursor="pointer"
                            svgClasses="w-5 h-5 hover:text-danger stroke-current"
                            @click="deleteValue(item.id)"/>
            </vs-list-item>
          </template>
        </vs-list>
      </vs-popup>
    </vx-card>

  </div>
</template>

<script>
import DataViewSidebar from './AttributeSidebar'
import axios from '../../axios'
import vSelect from 'vue-select'
import Button from '../components/vuesax/button/Button'

export default {
  components: {
    Button,
    DataViewSidebar,
    vSelect
  },
  data () {
    return {
      attributeValuePopUpStatus: false,
      selected: [],
      attributes: [],
      attributeGroups: [],
      itemsPerPage: 15,
      isMounted: false,
      addNewDataSidebar: false,
      sidebarData: {},
      attribute_value: '',
      attribute_id: '',
      values: ''

    }
  },
  computed: {

    currentPage () {
      if (this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0
    },
    queriedItems () {
      return this.$refs.table ? this.$refs.table.queriedResults.length : this.attributes.length
    },
    resultQuery () {
      return this.attributes
    }
  },
  methods: {
    searchable (item) {
      if (item === true)
        return 'میباشد'
      else
        return 'نمیباشد'
    },
    selectable (item) {
      if (item === true)
        return 'میباشد'
      else
        return 'نمیباشد'
    },
    required (item) {
      if (item === true)
        return 'میباشد'
      else
        return 'نمیباشد'
    },
    multiSelect (item) {
      if (item === true)
        return 'میباشد'
      else
        return 'نمیباشد'
    },
    trType (item) {
      if (item == 1)
        return 'متنی'
      else if (item == 2)
        return 'انتخابی'
      else if (item == 3)
        return 'متن بلند'
      else if (item == 4)
        return 'چک باکس'
      else if (item == 5)
        return 'عدد'
    },
    addNewData () {
      this.sidebarData = {}
      this.toggleDataSidebar(true)
    },
    editData (data) {
      this.sidebarData = data
      this.toggleDataSidebar(true)
    },
    toggleDataSidebar (val = false) {
      this.addNewDataSidebar = val
    },
    fetch (id) {
      axios.get(`attributes/` + id)
          .then((response) => {
            this.attributes = response.data.attributes
            this.attributeGroups = response.data.attributeGroups
          })
          .catch((error) => {
            reject(error)
          })
    },
    confirmDeleteRecord (id) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: ` حذف شود؟`,
        text: `در صورت حذف امکان بازگشت اطلاعات وجود ندارد`,
        acceptText: 'حذف',
        cancelText: 'لغو',
        accept: this.deleteRecord,
        parameters: id

      })
    },
    deleteRecord (id) {
      axios.delete(`attributes/` + id)
          .then((response) => {
            this.attributes = response.data.attributes
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
    },
    attributeValuePopUp (item) {
      this.attributeValuePopUpStatus = true
      this.attribute_id = item.id
      axios.get(`attributes/values/` + item.id)
          .then((response) => {
            this.values = response.data
          })
    },
    addAttributeValue () {
      axios.post(`attributes/values/` + this.attribute_id, {
        value: this.attribute_value
      })
          .then((response) => {
            this.attribute_value = ''
            this.values = response.data.items
          })
    },
    deleteValue (id) {
      axios.delete(`attributes/values/` + id)
          .then((response) => {
            this.values = response.data
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

    },
    initValues () {
      this.values = []
    }
  },
  created () {
    this.fetch(this.$route.params.id)
  },
  mounted () {
    this.isMounted = true
  }
}
</script>

<style lang="scss">
#data-list-list-view {
  .vs-con-table {

    @media (max-width: 689px) {
      .vs-table--search {
        margin-left: 0;
        max-width: unset;
        width: 100%;

        .vs-table--search-input {
          width: 100%;
        }
      }
    }

    @media (max-width: 461px) {
      .items-per-page-handler {
        display: none;
      }
    }

    @media (max-width: 341px) {
      .data-list-btn-container {
        width: 100%;

        .dd-actions,
        .btn-add-new {
          width: 100%;
          margin-right: 0 !important;
        }
      }
    }

    .product-name {
      max-width: 23rem;
    }

    .vs-table--header {
      display: flex;
      flex-wrap: wrap;
      margin-left: 1.5rem;
      margin-right: 1.5rem;

      > span {
        display: flex;
        flex-grow: 1;
      }

      .vs-table--search {
        padding-top: 0;

        .vs-table--search-input {
          padding: 0.9rem 2.5rem;
          font-size: 1rem;

          & + i {
            left: 1rem;
          }

          &:focus + i {
            left: 1rem;
          }
        }
      }
    }

    .vs-table {
      border-collapse: separate;
      border-spacing: 0 1.3rem;
      padding: 0 1rem;

      tr {
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .05);

        td {
          padding: 20px;

          &:first-child {
            border-top-left-radius: .5rem;
            border-bottom-left-radius: .5rem;
          }

          &:last-child {
            border-top-right-radius: .5rem;
            border-bottom-right-radius: .5rem;
          }
        }

        td.td-check {
          padding: 20px !important;
        }
      }
    }

    .vs-table--thead {
      th {
        padding-top: 0;
        padding-bottom: 0;

        .vs-table-text {
          text-transform: uppercase;
          font-weight: 600;
        }
      }

      th.td-check {
        padding: 0 15px !important;
      }

      tr {
        background: none;
        box-shadow: none;
      }
    }

    .vs-table--pagination {
      justify-content: center;
    }
  }
}
</style>
