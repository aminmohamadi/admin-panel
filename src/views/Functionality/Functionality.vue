<template>
    <vx-card actionButtons title="همه عملکرد ها" class="routes-list mb-8">
        <v-tree ref='tree' :canDeleteRoot="false" :data='treeData' :draggable='false' :halfcheck='true'
                :multiple="true" @node-check="setFunction"/>
        <vs-button @click="saveFunctions" class="btn primary" :disabled="!isFormValid">ذخیره</vs-button>
    </vx-card>
</template>

<script>
    import {VTree, VSelectTree} from 'vue-tree-halower'
    import axios from "../../axios";

    export default {
        data() {
            return {
                selectedFunctions: [],
                treeData: [
                    {
                        title: 'همه عملکرد ها',
                        expanded: true,
                        nocheck: true,
                        children: [],
                        selDisabled:true,
                        chkDisabled:true,


                    },
                ]
            }
        },
        computed:{
            isFormValid() {
                if (typeof this.selectedFunctions != "undefined"
                    && this.selectedFunctions != null
                    && this.selectedFunctions.length != null
                    && this.selectedFunctions.length > 0)
                 return true
            }
        },
        methods: {
            setFunction(node){
                const index = this.selectedFunctions.indexOf(node.title);
                if (node.checked == true){
                    this.selectedFunctions.push(
                       node.title
                    )
                }
                else{
                    this.selectedFunctions.splice(index, 1);
                }

            },
            fetch_functionalities() {
                axios.get(`/functionalities`)
                    .then((response) => {
                        for (var key in response.data.functionalities) {
                            if (response.data.functionalities[key] != "") {
                                var a = {
                                    title: key,
                                    expanded: true,
                                    nocheck: true,
                                    children: [],
                                    checked: false,
                                    selDisabled:true,
                                    chkDisabled:true,

                                }
                                this.treeData[0].children.push(a)
                                for (var val in response.data.functionalities[key]) {
                                    a.children.push({
                                        title: response.data.functionalities[key][val].gate,
                                        expanded: true,
                                        scoped: true,
                                        checked: response.data.functionalities[key][val].checked,
                                        id: response.data.functionalities[key][val].gate
                                    })
                                }
                            }
                        }

                    })
                    .catch((error) => {
                        reject(error)
                    })
            },
            saveFunctions(){
                axios.post('/functionalities',
                    {
                        headers:{
                            'authentication':localStorage.getItem('access_token')
                        },
                        functions:this.selectedFunctions
                    }
                ).then(response=>{
                    this.$vs.notify({
                        title: response.data.title,
                        text: response.data.message,
                        iconPack: 'feather',
                        icon: 'icon-'+response.data.icon+'-circle',
                        color: response.data.status
                    })
                })

            },
            SelectedNodes() {


            }
        },
        components: {
            VTree,
            VSelectTree
        },
        created() {
            this.SelectedNodes()
            this.fetch_functionalities();
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
