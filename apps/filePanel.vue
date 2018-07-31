<template>
  <md-content class="container-file" style=" box-sizing: border-box; height: calc(100% - 50px)">
    <!-- <md-field>
      <md-file ref="fileupload" @md-change="createFile" v-model="multiple" multiple  />
    </md-field> -->
    <md-toolbar  layout="row" layout-align="center center" style="box-sizing: border-box;">
    <import-file :arrivedPathTab="pathTab" :app="app" :selectedObject="currentPanel.selectedObject"></import-file>
    <md-button style="box-sizing: border-box;width: calc(49% - 16px); float: left" @click="exportDrive">Export Drive</md-button>      
    </md-toolbar>

    <span @click="goToPath(index)" v-for="(path,index) in pathTab" :key="index">{{path.name}} </span>

    <md-content class=" md-scrollbar" style="box-sizing: border-box; overflow-y:auto; height: calc(100% - 123px)">
      <md-table v-if="tabDisplay.length > 0" style="padding-right: 15px; padding-left: 20px;">
        <md-table-row @dblclick.native="clickPath(files)" v-for="(files, index) in tabDisplay" :key="index">
          <md-table-cell md-numeric>{{files.name.get()}}</md-table-cell>
          <md-table-cell>{{files._info.model_type.get()}}</md-table-cell>
          <md-table-cell>{{ files.name.get() }}</md-table-cell>
          <md-table-cell><context-menu-file-panel :selectedObject="currentPanel.selectedObject" :file="files"></context-menu-file-panel></md-table-cell>
        </md-table-row>
      </md-table>
    </md-content>


  </md-content>
</template>


<script>
var spinalSystem;
var viewer;
import event from "../componentGlobal/event.vue";
import contextMenuFilePanel from "./component/fileComponent/contextMenuFile.vue";
import importFile from "./component/fileComponent/importFile.vue";

import Vue from "vue";
// import { file } from "../model/model.js";

export default {
  name: "filePanel",

  data() {
    return {
      currentPanel: {
        selectedObject: undefined,
        panel: {}
      },
      newNode: undefined,
      multiple: [],
      files: {},
      pathTab: [],
      app: undefined,
      tabDisplay: [],
      myBind: undefined,
      inDirectory: undefined,
      rel: "this.currentPanel.selectedObject.relations." + "files" + "-"
    };
  },
  components: {
    contextMenuFilePanel,
    importFile
  },
  props: ["myNodeProps"],
  methods: {
    getEvent: function() {
      // createDirectoryFile;
      event.$on("createDirectoryFile", Directory => {
        console.log("BIND EVENT");
        this.inDirectory = Directory;
        this.pathTab[0].path = this.inDirectory;
        console.log("BIND 3");
        this.myBind = this.inDirectory.bind(this.onModelChange);
      });
      spinal.eventBus.$on("getNodeClick", node => {
        this.currentPanel.selectedObject = node;
        this.onModelChange();

        if (this.myBind != undefined) {
          console.log("UNBIND 4");
          this.inDirectory.unbind(this.myBind);
          this.myBind = undefined;
        }
        if (this.myBind == undefined) {
          // console.log(this.currentPanel.selectedObject);
          this.app
            .getAssociatedElementsByNodeByRelationType(
              this.currentPanel.selectedObject,
              "Files-"
            )
            .then(tabofAllFile => {
              this.pathTab = [];
              // console.log(tabofAllFile);
              if (tabofAllFile[0] != undefined) {
                this.inDirectory = tabofAllFile[0];
                event.$emit("getCurrentDirectory", this.inDirectory);
                var obj = {};
                // console.log(this.inDirectory);
                obj.name = "home /";
                obj.path = this.inDirectory;
                this.pathTab.push(obj);

                // console.log(this.inDirectory);
                if (this.inDirectory.length != 0)
                  this.myBind = this.inDirectory.bind(this.onModelChange);
                console.log("BIND 4");
              } else {
                if (this.myBind != undefined) {
                  this.inDirectory.unbind(this.myBind);
                  console.log("UNBIND 5");

                  this.myBind = undefined;
                }
                this.inDirectory = [];
                var obj = {};
                // console.log(this.inDirectory);
                obj.name = "home /";
                obj.path = this.inDirectory;
                this.pathTab.push(obj);
                this.onModelChange();
              }
              // this.onModelChange();
            });
        }
        // console.log(this.currentPanel.selectedObject);
      });
    },

    onModelChange: function() {
      this.tabDisplay = [];
      // if (this.tabDisplay.length > 0)
      //   this.tabDisplay.splice(0, this.tabDisplay.length);
      console.log("ON MODEL CHANGE");
      console.log(this.inDirectory);
      if (this.currentPanel.selectedObject != undefined) {
        if (this.inDirectory != undefined)
          for (let i = 0; i < this.inDirectory.length; i++) {
            const element = this.inDirectory[i];
            // console.log(element);
            this.tabDisplay.push(element);
          }
      }

      // console.log(this.app);
      /////////////////////////////////////////////////////////
      //        old on  model change
      /////////////////////////////////////////////////////////
      // if (this.currentPanel.selectedObject != undefined) {
      //   this.app
      //     .getAssociatedElementsByNodeByRelationType(
      //       this.currentPanel.selectedObject,
      //       "Files"
      //     )
      //     .then(tabofAllFile => {
      //       // console.log(tabofAllFile);
      //       if (tabofAllFile[0] != undefined)
      //         for (let i = 0; i < tabofAllFile[0].length; i++) {
      //           const element = tabofAllFile[0][i];
      //           // console.log(element);
      //           this.tabDisplay.push(element);
      //         }
      //       // console.log(this.tabDisplay);
      //     });
      // }
      //////////////////////////////////////////////////////////////
    },
    exportDrive: function() {
      // console.log(spinalSystem);

      var data = spinalSystem.getPath();

      var char = "";
      var i = data.length;
      while (char != "/") {
        char = data[i];
        i--;
      }
      var nameRevit = data.slice(i + 2, data.length);
      // console.log(nameRevit);
      data = data.slice(0, i + 1);
      this.result = data + "/Files: " + nameRevit;

      spinalSystem.load(this.result).then(
        res => {
          // callback success
          console.log("callback success");
          console.log(res);

          var BIMObjectName;
          var tab = this.app.getRelationsByType("Files");

          for (let i = 0; i < tab.length; i++) {
            const relation = tab[i];
            let myCheck = false;
            relation.nodeList1[0].element.load(BIMObjectNode => {
              BIMObjectName = BIMObjectNode.name.get();
              for (let j = 0; j < res.length; j++) {
                const driveFile = res[j];
                if (driveFile.name.get() == BIMObjectName) {
                  myCheck = true;
                }
              }
              if (myCheck === false) {
                // l'element n'est pas dans le drive
                relation.nodeList2[0].element.load(file => {
                  // console.log(myDirectory);
                  var newObject = new File(BIMObjectName, file, {
                    model_type: "Directory"
                  });
                  res.push(newObject);
                });
              }
            });
          }
        },
        () => {
          // callback error
          console.log("callback error");
          // console.log(data);
          spinalSystem.load(data).then(success => {
            // console.log("create the directory in the drive");
            // console.log(this.app);

            var tab = this.app.getRelationsByType("Files");
            var tmp = new Directory("Files: " + nameRevit);
            // console.log(tab);
            var BIMObjectName;
            for (let i = 0; i < tab.length; i++) {
              const relation = tab[i];
              // console.log(relation);
              relation.nodeList1[0].element.load(BIMObjectNode => {
                BIMObjectName = BIMObjectNode.name.get();
                // console.log(BIMObjectName);
              });
              for (let j = 0; j < relation.nodeList2.length; j++) {
                const node = relation.nodeList2[j];
                node.element.load(myOject => {
                  // console.log(myOject);

                  var newObject = new File(BIMObjectName, myOject, {
                    model_type: "Directory"
                  });
                  tmp.push(newObject);
                  // console.log(myOject);
                  // success.push(myOject);
                  if (i == tab.length - 1) {
                    // console.log(tmp);
                    var myDirectory = new File("Files: " + nameRevit, tmp, {
                      model_type: "Directory"
                    });
                    success.push(myDirectory);
                    this.myDirectory = myDirectory;
                  }
                });
              }
            }
          });
        }
      );
    },
    //////////////////////////////////////////////////////
    //                Moove in directory
    //////////////////////////////////////////////////////
    clickPath: function(directoryFiles) {
      var type = directoryFiles._info.model_type.get();
      this.selected = [];
      console.log(type);

      if (type == "Directory") {
        // console.log(directoryFiles);
        directoryFiles._ptr.load(enterDirectory => {
          // console.log(enterDirectory);
          if (this.myBind != undefined) {
            console.log("UNBIND 1");
            this.inDirectory.unbind(this.myBind);
            this.myBind = undefined;
          }
          this.inDirectory = enterDirectory;
          console.log("BIND 1");
          this.myBind = this.inDirectory.bind(this.onModelChange);
          var obj = {};
          obj.name = directoryFiles.name.get() + " /";
          obj.path = this.inDirectory;
          this.pathTab.push(obj);
          event.$emit("getCurrentDirectory", this.inDirectory);
        });

        // this.inDirectory;
        // var name = "/   " + driveFiles.name.get();
        // var mypath = this.currentPath + "/" + driveFiles.name.get();
        // var route2 = {};
        // route2.name = name;
        // route2.path = mypath;
        // this.pathTab.push(route2);
        // this.currentPath = mypath;
        // this.getPath();
      }
    },
    goToPath: function(indexPathTab) {
      console.log(indexPathTab);
      var currentPath = this.pathTab[indexPathTab];
      console.log(currentPath);
      if (this.myBind != undefined) {
        console.log("UNBIND 2");
        this.inDirectory.unbind(this.myBind);
        this.myBind = undefined;
      }
      this.inDirectory = currentPath.path;
      console.log("BIND 2");
      this.myBind = this.inDirectory.bind(this.onModelChange);
      // this.pathTab.splice(indexPathTab, this.pathTab.length);
      this.pathTab.splice(
        indexPathTab + 1,
        this.pathTab.length - (indexPathTab + 1)
      );
      event.$emit("getCurrentDirectory", this.inDirectory);

      this.onModelChange();
    }
  },
  mounted() {
    viewer = window.spinal.ForgeViewer.viewer;
    spinalSystem = window.spinal.spinalSystem;
    this.currentPanel.selectedObject = this.myNodeProps;
    let interval = setInterval(() => {
      if (typeof spinal.contextStudio.graph != "undefined") {
        spinal.contextStudio.graph.getApp("file", ["Files"]).then(myApp => {
          this.app = myApp;
          // console.log(this.app);
        });
        clearInterval(interval);
      }
      // var user = spinalSystem.getUser();
      // var home = "/__users__/" + user.username;
      // this.currentPath = home;
    }, 100);

    this.getEvent();
  },
  beforeDestroy() {
    console.log("UNBIND 3");
    this.inDirectory.unbind(this.myBind);
    console.log(this.myBind);
    this.myBind = undefined;
  }
};
</script>

<style>
.container-file .md-list-item-content.md-ripple.md-disabled {
  box-sizing: border-box;
}

.md-ripple {
  box-sizing: border-box;
}
</style>
