<template>
  <div id="data-list-list-view" class="data-list-container">
    <vx-card ref="filterCard" title="جست و جو" class="roles-list-filters mb-8">
      <div class="vx-row">
        <div class="vx-col md:w-1/2 sm:w-1/2 w-full">
          <label for="roleName" class="text-sm opacity-75">نقش</label>
          <vs-input id="roleName" v-model="searchQuery.title" class="w-full mt-4" placeholder="نقش"/>
        </div>
        <div class="vx-col md:w-1/2 sm:w-1/2 w-full">
          <label for="roleDescription" class="text-sm opacity-75">عنوان</label>
          <vs-input id="roleDescription" v-model="searchQuery.description" class="w-full mt-4" placeholder="عنوان"/>
        </div>
      </div>
    </vx-card>
    <data-view-sidebar :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" :data="sidebarData"/>
    <vx-card actionButtons @refresh="fetch_roles" title="همه نقش ها" class="roles-list mb-8">
      <vs-table ref="table" multiple v-model="selected" pagination :max-items="itemsPerPage" :data="resultQuery"
                noDataText="موردی برای نمایش وجود ندارد">

        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">

          <div class="flex flex-wrap-reverse items-center data-list-btn-container">

            <!-- ACTION - DROPDOWN -->
            <vs-dropdown vs-trigger-click class="dd-actions cursor-pointer mr-4">
              <div class=" p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base
                          text-primary border border-solid border-primary">
                <span class="mr-2">عملیات گروهی</span>
                <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4"/>
              </div>

              <vs-dropdown-menu>

                <vs-dropdown-item @click="confirmDeleteSelectedRecords">
                <span class="flex items-center">
                  <feather-icon icon="TrashIcon" svgClasses="h-4 w-4" class="mr-2"/>
                  <span>حذف</span>
                </span>
                </vs-dropdown-item>

              </vs-dropdown-menu>
            </vs-dropdown>

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
          <vs-th sort-key="name">نقش</vs-th>
          <vs-th sort-key="description">عنوان</vs-th>
          <vs-th>دسترسی های نقش</vs-th>
          <vs-th>عملیات</vs-th>
        </template>

        <template slot-scope="{data}">
          <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

            <vs-td class="text-center">
              <p class="product-name font-medium truncate">{{ tr.title }}</p>
            </vs-td>

            <vs-td class="text-center">
              <p class="product-category">{{ tr.description }}</p>
            </vs-td>
            <vs-td class="text-center">
              <button @click.stop="$router.push('/role/'+tr.id+'/functionality')">دسترسی های نقش</button>
            </vs-td>

            <vs-td class="whitespace-no-wrap text-center">
              <feather-icon icon="EditIcon" svgClasses="w-5 h-5 hover:text-warning stroke-current"
                            @click.stop="editData(tr)"/>
              <feather-icon icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current"
                            class="ml-2" @click.stop="confirmDeleteRecord(tr.id)"/>
            </vs-td>

          </vs-tr>
          </tbody>
        </template>
      </vs-table>
    </vx-card>

  </div>
</template>

<script>
import DataViewSidebar from './RolesSidebar.vue'
import axios from './../../http/axios/index'
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
      searchQuery: {
        title: '',
        description: ''
      },
      selected: [],
      roles: [],
      itemsPerPage: 4,
      isMounted: false,
      addNewDataSidebar: false,
      sidebarData: {},
      roleDescriptionSearch: '',
      roleNameSearch: ''
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
      return this.$refs.table ? this.$refs.table.queriedResults.length : this.roles.length
    },
    resultQuery () {
      if (this.searchQuery.title != '' || this.searchQuery.description != '') {
        return this.roles.filter((item) => {
          return this.searchQuery.title.toLowerCase().split(' ').every(v => item.title.toLowerCase().includes(v)) &&
              this.searchQuery.description.toLowerCase().split(' ').every(v => item.description.toLowerCase().includes(v))
        })
      } else {
        return this.roles
      }
    }
  },
  methods: {
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
    fetch_roles (card) {
      axios.get(`/roles`)
          .then((response) => {
            this.roles = response.data.roles
            card.removeRefreshAnimation()

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
      axios.delete(`/api/auth/admin/role/` + id, {
        token: localStorage.getItem('access_token'),
        headers: {
          'Authorization': 'Bearer' + localStorage.getItem('access_token')
        }
      })
          .then((response) => {
            this.roles = response.data.roles
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
    confirmDeleteSelectedRecords () {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: ` حذف گروهی`,
        text: `موارد انتخاب شده حذف شوند؟`,
        acceptText: 'حذف',
        cancelText: 'لغو',
        accept: this.deleteSelectedRecords

      })
    }
  },
  created () {
    this.fetch_roles()
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
