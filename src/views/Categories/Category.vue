<template>
    <vx-card class="vx-card">
        <vs-row vs-type="flex" vs-justify="center" vs-align="center">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" class="m-5 w-1/4 md:w-1/4 sm:w-1">
                <vs-card  class="border-solid border-primary fixedHeight">
                    <div slot="header" class="flex justify-between align-middle">
                        <h3>
                            سطح اول
                        </h3>
                        <div >
                            <feather-icon icon="PlusIcon" svgClasses="w-5 h-5 hover:text-success stroke-current" class="cursor-pointer"
                                          @click="addNewData(1)"/>
                        </div>
                    </div>
                    <vs-list class="height-300">
                        <ul>
                            <li v-for="(item , index) in firstLevelCategories" :key="index" class="cursor-pointer hover:bg-primary" :class="[(firstLevelActiveIndex == item.id) ? 'active':'']"  @click="fetch_second_level_category(item.id)">
                                <vs-list-item icon="check"  :title="item.title" >
                                    <feather-icon icon="SlackIcon" svgClasses="w-5 h-5 hover:text-success stroke-current"
                                                  @click="attrRoute(item.id)"/>
                                    <feather-icon icon="EditIcon" svgClasses="w-5 h-5 hover:text-warning stroke-current"
                                                  @click.stop="editData(item)"/>
                                    <feather-icon icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current"
                                                   @click.stop="confirmDeleteRecord(item.id,1)"/>
                                </vs-list-item>
                            </li>
                        </ul>
                    </vs-list>
                </vs-card>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center"  class="m-5 w-1/4 md:w-1/4 sm:w-1">
                <vs-card class="border-solid border-primary fill-height">
                    <div slot="header" class="flex justify-between align-middle">
                        <h3>
                            سطح دوم
                        </h3>
                        <div v-if="firstLevelActiveIndex" >
                            <feather-icon icon="PlusIcon" svgClasses="w-5 h-5 hover:text-success stroke-current" class="cursor-pointer"
                                          @click="addNewData(firstLevelActiveIndex)"/>
                        </div>
                    </div>
                    <vue-perfect-scrollbar>
                        <vs-list class="height-300">
                            <ul>
                                <li  v-for="(item , index) in secondLevelCategories"  :key="index"  class="cursor-pointer hover:bg-primary" :class="[(secondLevelActiveIndex == item.id) ? 'active':'']" @click="fetch_third_level_category(item.id)">
                                    <vs-list-item icon="check" :title="item.title">
                                        <feather-icon icon="SlackIcon" svgClasses="w-5 h-5 hover:text-success stroke-current"
                                                      @click="attrRoute(item.id)"/>
                                        <feather-icon icon="EditIcon" svgClasses="w-5 h-5 hover:text-warning stroke-current"
                                                      @click.stop="editData(item,2)"/>
                                        <feather-icon icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current"
                                                      class="ml-2" @click.stop="confirmDeleteRecord(item.id,2)"/>
                                    </vs-list-item>
                                </li>
                            </ul>
                        </vs-list>
                    </vue-perfect-scrollbar>
                </vs-card>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" class="m-5 w-1/4 md:w-1/4 sm:w-1">
                <vs-card class="border-solid border-primary ">
                    <div slot="header" class="flex justify-between align-middle">
                        <h3>
                            سطح سوم
                        </h3>
                        <div v-if="secondLevelActiveIndex">
                            <feather-icon icon="PlusIcon" svgClasses="w-5 h-5 hover:text-success stroke-current" class="cursor-pointer"
                                          @click="addNewData(secondLevelActiveIndex)"/>
                        </div>
                    </div>
                    <vs-list class="height-300">
                        <ul>
                            <li  v-for="(item , index) in thirdLevelCategories"  :key="index"  class="cursor-pointer hover:bg-primary">
                                <vs-list-item icon="check" :title="item.title">
                                    <feather-icon icon="SlackIcon" svgClasses="w-5 h-5 hover:text-success stroke-current"
                                                  @click="attrRoute(item.id)"/>
                                    <feather-icon icon="EditIcon" svgClasses="w-5 h-5 hover:text-warning "
                                                  @click.stop="editData(item)"/>
                                    <feather-icon icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger "
                                                  class="ml-2" @click.stop="confirmDeleteRecord(item.id)"/>
                                </vs-list-item>
                            </li>
                        </ul>
                    </vs-list>
                </vs-card>
            </vs-col>
        </vs-row>
        <data-view-sidebar :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" :data="sidebarData"/>

    </vx-card>
</template>

<script>
    import DataViewSidebar from './CategorySidebar.vue'
    import axios from "../../http/axios/index";
    import VuePerfectScrollbar from 'vue-perfect-scrollbar'

    export default {
        components: {
            DataViewSidebar,
            VuePerfectScrollbar,
        },
        data() {
            return {
                isMounted: false,
                addNewDataSidebar: false,
                sidebarData: {},
                firstLevelCategories:[],
                secondLevelCategories:[],
                thirdLevelCategories:[],
                firstLevelActiveIndex: null,
                secondLevelActiveIndex: null,
                thirdLevelActiveIndex: null,
                settings: { // perfectscrollbar settings
                    maxScrollbarLength: 60,
                    wheelSpeed: .60,
                },
            }
        },
        computed: {

        },
        methods: {
            addNewData(parent_id) {
                this.sidebarData = {parent_id}
                this.toggleDataSidebar(true)
            },
            editData(data) {
                this.sidebarData = {
                    id:data.id,
                    title:data.title,
                    parent_id:data.parent_id,
                    }
                this.toggleDataSidebar(true)
            },
            toggleDataSidebar(val = false) {
                this.addNewDataSidebar = val
            },
            fetch(){
                axios.get(`categories`)
                    .then((response) => {
                        this.firstLevelCategories = response.data.categories
                    })
                    .catch((error) => {
                        reject(error)
                    })
            },
            fetch_second_level_category(id){
                this.firstLevelActiveIndex = id
                this.secondLevelActiveIndex = ''
                axios.get(`categories/` + id)
                    .then((response) => {
                        this.secondLevelCategories = response.data.categories
                        this.thirdLevelCategories=null
                    })
                    .catch((error) => {
                        reject(error)
                    })
            },
            fetch_third_level_category(id){
                this.secondLevelActiveIndex = id
                axios.get(`categories/` + id)
                    .then((response) => {
                        this.thirdLevelCategories = response.data.categories
                    })
                    .catch((error) => {
                        reject(error)
                    })
            },
            confirmDeleteRecord(id,level) {
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: ` حذف شود؟`,
                    text: `در صورت حذف امکان بازگشت اطلاعات وجود ندارد`,
                    acceptText: "حذف",
                    cancelText: "لغو",
                    accept:this.deleteRecord,
                    parameters: {id:id , level:level}
                })
            },
            deleteRecord(id) {
                axios.delete(`categories`+id.id)
                    .then((response) => {
                        if (id.level ===1){
                            this.firstLevelCategories = response.data.categories
                        }else if (id.level === 2){
                            this.secondLevelCategories = response.data.categories
                        }else if (id.level === 3) {
                            this.thirdLevelCategories = response.data.categories
                        }
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
            },
            attrRoute(id){
                this.$router.push('/admin/category/attribute/'+ id)
            }
        },
        created() {
            this.fetch()
        },
        mounted() {
            this.isMounted = true;
        }
    }
</script>

<style scoped lang="scss">
    .active {
        background-color: rgba(var(--vs-primary), 1);
    }
    .height-300{
        height: 300px !important;
    }
    .scroll-area--data-list-add-new {
        // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
        height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);
    }
</style>
