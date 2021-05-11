<template>
    <vx-card actionButtons  @refresh="fetch" title="همه عملکرد ها" class="routes-list mb-8">
        <v-tree ref='tree' :canDeleteRoot="false" :data='treeData' :draggable='false' :halfcheck='true'
                :multiple="true" @node-check="setFunction"/>
        <vs-button @click="saveFunctions" class="btn primary" :disabled="!isFormValid">ذخیره</vs-button>
    </vx-card>
</template>

<script>
    import {VTree, VSelectTree} from 'vue-tree-halower'
    import axios from './../../http/axios/index'

    export default {
        data() {
            return {
                selectedFunctions: [],
                treeData: [
                    {
                        title: 'عملکرد های ثبت شده',
                        expanded: true,
                        nocheck: true,
                        children: [],
                        selDisabled: true,
                        chkDisabled: true,


                    },
                ]
            }
        },
        computed: {
            isFormValid() {
                if (typeof this.selectedFunctions != "undefined"
                    && this.selectedFunctions != null
                    && this.selectedFunctions.length != null
                    && this.selectedFunctions.length > 0)
                    return true
            }
        },
        methods: {
            setFunction(node) {
                const index = this.selectedFunctions.indexOf(node.id);
                if (node.checked == true) {
                    this.selectedFunctions.push(
                        node.id
                    )
                } else {
                    this.selectedFunctions.splice(index, 1);
                }

            },
            fetch() {
                var roleId = this.$route.params.id;
                axios.get('/roles/'+roleId+'/functionalities')
                    .then((response) => {
                        for (var item in response.data.functions) {
                            this.treeData[0].children.push({
                                title: response.data.functions[item].name,
                                id: response.data.functions[item].id,
                                expanded: true,
                                checked: response.data.functions[item].checked,
                                selDisabled: true,
                            })
                        }

                    })
                    .catch((error) => {
                        reject(error)
                    })
            },
            saveFunctions() {
                this.$vs.loading()
                var roleId = this.$route.params.id;
                axios.post('/functionalityrole/'+roleId ,
                    {
                      functionality_id: this.selectedFunctions
                    }
                ).then(response => {
                    this.$vs.loading.close()
                    this.$vs.notify({
                        title: response.data.title,
                        text: response.data.message,
                        iconPack: 'feather',
                        icon: 'icon-' + response.data.icon + '-circle',
                        color: response.data.status
                    })
                })

            },
            // async asyncLoad() {
            //     var selectedNodes = this.$refs.tree.getCheckedNodes();
            //     for (var i in selectedNodes){
            //         for (var x in selectedNodes[i]){
            //             this.selectedFunctions.push(
            //                 {
            //                     name:selectedNodes[i][x],
            //                 }
            //             )
            //         }
            //     }
            // },
            SelectedNodes() {


            }
        },
        components: {
            VTree,
            VSelectTree
        },
        created() {
            this.SelectedNodes()
            this.fetch();
        },
        mounted() {
            this.asyncLoad;
        }

    }
</script>
<style lang="scss">
    @import "./../../assets/scss/vuexy/extraComponents/tree";

    button.btn-async {
        background: rgba(var(--vs-warning), 0.15);
    }

    button.btn-delete {
        background: rgba(var(--vs-danger), 0.15);
    }
</style>
