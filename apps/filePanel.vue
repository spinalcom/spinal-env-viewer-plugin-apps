<template>
    <md-content class="container-file" style=" box-sizing: border-box; height: calc(100% - 50px)">
    <md-field>
      <!---->
      <md-file ref="fileupload" @md-change="createFile" v-model="multiple" multiple  />
    </md-field>

    <md-content class=" md-scrollbar" style="box-sizing: border-box; overflow-y:auto; height: calc(100% - 88px)">


    <md-list v-if="tabDisplay.length > 0">
      <md-list-item v-for="(files, index) in tabDisplay" :key="index">
        <div class="md-list-item-text" >{{files.name.get()}}</div>
        <context-menu-file-panel :selectedObject="currentPanel.selectedObject" :file="files"></context-menu-file-panel>
      </md-list-item>
    </md-list>
    </md-content>


  </md-content>
</template>


<script>
var spinalSystem;
var viewer;
import event from "../componentGlobal/event.vue";
import contextMenuFilePanel from "./component/fileComponent/contextMenuFile.vue";
import Vue from "vue";
// import { file } from "../model/model.js";

export default {
  name: "filePanel",

  data() {
    return {
      currentPanel: {
        selectedObject: {},
        panel: {}
      },
      multiple: [],
      files: {},
      app: undefined,
      tabDisplay: [],
      rel: "this.currentPanel.selectedObject.relations." + "files" + "-"
    };
  },
  components: {
    contextMenuFilePanel
  },
  props: [],
  methods: {
    getEvent: function() {
      event.$on("createFilesPanel", panel => {
        console.log("le panel files a été créer");
        this.currentPanel.panel = panel;
      });
      spinal.eventBus.$on("getNodeClick", node => {
        this.currentPanel.selectedObject = node;
      });
      spinal.eventBus.$on("openFilePanel", node => {
        // console.log(selectedObject.node.element);
        // console.log(selectedObject);
        console.log(this.files);

        if (this.currentPanel.selectedObject === node) {
          if (this.currentPanel.panel.isVisible()) {
            this.currentPanel.panel.setVisible(false);
            this.files.unbind(this.onModelChange);
          } else {
            this.currentPanel.panel.setVisible(true);
            this.files.bind(this.onModelChange);
          }
        } else {
          this.currentPanel.selectedObject = node;
          this.files.bind(this.onModelChange);

          this.currentPanel.selectedObject.element.load(item => {
            this.currentPanel.panel.setTitle("file : " + item.name.get());
          });
          if (!this.currentPanel.panel.isVisible()) {
            this.currentPanel.panel.setVisible(true);
          }
        }
      });
    },
    createFile: function(files) {
      // il faut push le fichier dans this.files
      // il faut ajouter this.currentPanel.selectedObject.node.element.spinalRelation.files.push()

      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        let filePath = new Path(element);
        let myFile = new File(element.name, filePath);
        this.currentPanel.selectedObject.addToExistingRelationByApp(
          "file",
          "file",
          myFile
        );
        // spinal.contextStudio.graph
        //   .addSimpleRelationAsync(
        //     "files",
        //     this.currentPanel.selectedObject,
        //     myFile
        //   )
        //   .then(relation => {
        //     this.files.push(relation);
        //   });
        // this.currentPanel.selectedObject.files.push(myFile);
      }
    },
    onModelChange: function() {
      this.tabDisplay = [];
      console.log("onModelChange comments");
      console.log(this.currentPanel.selectedObject);
      this.app
        .getAssociatedElementsByNodeByRelationType(
          this.currentPanel.selectedObject,
          "file"
        )
        .then(tabofAllFile => {
          this.tabDisplay = tabofAllFile;
          console.log(this.tabDisplay);
        });
      // if (this.currentPanel.selectedObject.relations) {
      //   if (this.currentPanel.selectedObject.relations["files" + "-"]) {
      //     for (
      //       let i = 0;
      //       i <
      //       this.currentPanel.selectedObject.relations["files" + "-"].length;
      //       i++
      //     ) {
      //       const relMess = this.currentPanel.selectedObject.relations[
      //         "files" + "-"
      //       ][i];
      //       console.log(relMess);
      //       for (let j = 0; j < relMess.nodeList2.length; j++) {
      //         const message = relMess.nodeList2[j];
      //         message.element.load(messObj => {
      //           console.log(messObj);
      //           this.tabDisplay.push(messObj);
      //         });
      //       }
      //     }
      //   }
      // }
      // console.log("tabDisplay");
      // console.log(this.tabDisplay);
      // return tab;
    },
    file: function(button) {
      console.log("file");
      // console.log(button);
      // console.log(this.currentPanel.selectedObject);
      spinal.eventBus.$emit("openFilePanel", this.currentPanel.selectedObject);
      // event.$emit("openResumePanel", this.data.dbIdArray[0], 2);
    }
  },
  mounted() {
    viewer = window.spinal.ForgeViewer.viewer;
    spinalSystem = window.spinal.spinalSystem;
    spinal.circularMenu.addButton(this.file, "attach_file");
    console.log(this.inspector);
    let interval = setInterval(() => {
      if (typeof spinal.contextStudio.graph != "undefined") {
        console.log("CREATION OF APP FILE");
        spinal.contextStudio.graph.getApp("file", ["file"]).then(myApp => {
          this.app = myApp;
          this.files = this.app.getCharacteristicElement();
        });
        console.log(this.app);
        clearInterval(interval);
      }
    }, 2000);
    // spinalSystem.getModel().then(forgeFile => {
    //   if (forgeFile) {
    //     if (forgeFile.apps) {
    //       if (forgeFile.apps.files) {
    //         forgeFile.apps.files.load(files => {
    //           this.files = files;
    //         });
    //       } else {
    //         var list = new Lst();
    //         forgeFile.apps.add_attr({
    //           files: new Ptr(list)
    //         });
    //         forgeFile.apps.files.load(files => {
    //           this.files = files;
    //         });
    //       }
    //     }
    //   }
    // });
    this.getEvent();
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
