<template>
  <div id="data-list-list-view" class="data-list-container">
    <vx-card ref="filterCard" title="جست و جو" class="users-list-filters mb-8">
      <div class="vx-row">
        <div class="vx-col md:w-1/3 sm:w-1/3 w-full">
          <label for="name" class="text-sm opacity-75">نام</label>
          <vs-input id="name" v-model="searchQuery.firstName" class="w-full mt-4" placeholder="نام"/>
        </div>
        <div class="vx-col md:w-1/3 sm:w-1/3 w-full">
          <label for="lastName" class="text-sm opacity-75">نام</label>
          <vs-input id="lastName" v-model="searchQuery.lastName" class="w-full mt-4" placeholder=" نام خانوادگی"/>
        </div>
        <div class="vx-col md:w-1/3 sm:w-1/3 w-full">
          <label for="email" class="text-sm opacity-75">ایمیل</label>
          <vs-input id="email" v-model="searchQuery.email" class="w-full mt-4" placeholder="ایمیل"/>
        </div>
        <div class="vx-col md:w-1/3 sm:w-1/3 w-full">
          <label for="phone" class="text-sm opacity-75">موبایل</label>
          <vs-input id="phone" v-model="searchQuery.phone" class="w-full mt-4" placeholder="موبایل"/>
        </div>
        <div class="vx-col md:w-1/3 sm:w-1/3 w-full">
          <label for="status" class="text-sm opacity-75">نقش</label>
          <vs-select id="status" v-model="searchQuery.role" class="w-full mt-4">
            <vs-select-item label="همه" text="همه" value=""/>
            <vs-select-item v-for="(item, index) in roles" :key="index" :label="item.description" :text="item.description" :value="item.description"/>
          </vs-select>
        </div>
        <div class="vx-col md:w-1/3 sm:w-1/3 w-full">
          <label for="gender" class="text-sm opacity-75">جنسیت</label>
          <vs-select id="gender" v-model="searchQuery.gender" class="w-full mt-4">
            <vs-select-item label="همه" text="همه" value=""/>
            <vs-select-item label="آقا" text="آقا" value="man"/>
            <vs-select-item label="خانم" text="خانم" value="woman"/>
          </vs-select>
        </div>
      </div>
    </vx-card>
    <data-view-sidebar :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" :data="sidebarData"/>
    <vx-card actionButtons @refresh="fetch" title="همه مدیز ها" class="roles-list mb-8">
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
          <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler ">
            <div
                class="text-base text-primary p-4 border border-solid border-primary d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
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

        <template class="flex  flex-row-reverse" slot="thead">
          <vs-th class="text-center" sort-key="name">نام و نام خانوادگی</vs-th>
          <vs-th class="text-center">ایمیل</vs-th>
          <vs-th class="text-center" sort-key="role">نقش</vs-th>
          <vs-th class="text-center">تصویر</vs-th>
          <vs-th class="text-center">عملیات</vs-th>
        </template>

        <template slot-scope="{data}">
          <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td class="text-center">
              <p class="product-name font-medium truncate">{{ tr.first_name }} {{ tr.last_name }}</p>
            </vs-td>
            <vs-td class="text-center">
              <p class="product-category">{{ tr.email }}</p>
            </vs-td>

            <vs-td class="text-center">
              <p class="product-category">{{ tr.role }}</p>
            </vs-td>
            <vs-td class="text-center">
              <vs-avatar size="large" :src="tr.avatar"/>
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
import DataViewSidebar from './AdminSidebar.vue'
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
      searchQuery: {
        firstName: '',
        lastName:'',
        email:'',
        gender:'',
        phone:'',
        role:''
      },
      selected: [],
      admins: [],
      roles: [],
      itemsPerPage: 4,
      isMounted: false,
      addNewDataSidebar: false,
      sidebarData: {}

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
      return this.$refs.table ? this.$refs.table.queriedResults.length : this.admins.length
    },
    resultQuery () {
      if (this.searchQuery.firstName !== '' || this.searchQuery.lastName !== '' || this.searchQuery.email !== ''
          || this.searchQuery.role !== '' || this.searchQuery.gender !== '') {
        return this.admins.filter((item) => {
          return this.searchQuery.firstName.toLowerCase().split(' ').every(v => item.first_name.toLowerCase().includes(v)) &&
              this.searchQuery.lastName.toLowerCase().split(' ').every(v => item.last_name.toLowerCase().includes(v)) &&
              this.searchQuery.email.toLowerCase().split(' ').every(v => item.email.toLowerCase().includes(v)) &&
              this.searchQuery.phone.toLowerCase().split(' ').every(v => item.phone.toLowerCase().includes(v)) &&
              this.searchQuery.role.toLowerCase().split(' ').every(v => item.role.toLowerCase().includes(v)) &&
              this.searchQuery.gender.toLowerCase().split(' ').every(v => item.gender.toLowerCase().includes(v))
        })
      } else {
        return this.admins
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
    fetch (card) {
      axios.get(`/admins`)
          .then((response) => {
            this.admins = response.data.admins
            this.roles = response.data.roles
            card.removeRefreshAnimation()

          })
          .catch((error) => {
            console.log(error)
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
      axios.delete(`admins/` + id, {
        headers: {
          'Authorization': 'Bearer' + localStorage.getItem('access_token')
        }

      })
          .then((response) => {
            this.admins = response.data.admins
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
    }
  },
  created () {
    this.fetch()
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
          text-align: center !important;
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

.vs-sidebar {
  width: 84% !important;
}
</style>
