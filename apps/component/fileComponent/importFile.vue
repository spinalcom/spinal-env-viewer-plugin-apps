<template>
<div style="box-sizing: border-box; width: calc(49% - 16px)">
    
      <md-button style="box-sizing: border-box;width: calc(100%)" @click="activeTabs = true">Import File</md-button>      
      <md-dialog-alert
      :md-active.sync="importDirectoryBool"
      md-content="Inserting a circular directory is not allowed"/>

      <md-dialog :md-active.sync="activeTabs">

      <md-tabs md-dynamic-height md-alignment="fixed">
        <md-tab md-label="Upload">
          <md-field>
            <md-file ref="fileupload" @md-change="createFile" v-model="multipleFile" multiple  />
          </md-field>
        </md-tab>

        <md-tab md-label="Drive">
    <!-- <md-button class="md-primary md-raised" @click="getPath">Get Path</md-button> -->
          <drive :selectedDirectory="selectedDirectory" :app="app" :selectedObject="selectedObject"></drive>
        </md-tab>
      </md-tabs>

      <md-dialog-actions>
        <md-button class="md-primary" @click="activeTabs = false">Close</md-button>
        <md-button class="md-primary" @click="saveFile">Save</md-button>
      </md-dialog-actions>
    </md-dialog>

</div>
</template>


<script>
var spinalSystem;
var viewer;

import drive from "./drive.vue";
import event from "../../../componentGlobal/event.vue";

export default {
  name: "addGroup",

  data() {
    return {
      activeTabs: false,
      multipleFile: [],
      multipleFileTmp: [],
      selectedDirectory: undefined,
      pathTab: undefined,
      importDirectoryBool: false
    };
  },
  components: { drive },
  props: ["app", "selectedObject", "arrivedPathTab"],
  methods: {
    getEvent: function() {
      event.$on("getSelectionDrive", (fileList, pathTab) => {
        this.pathTab = pathTab;
        // console.log(pathTab);
        // console.log(fileList);
        // console.log("path d'arrivé");
        // console.log(this.arrivedPathTab);
        this.multipleFileTmp = fileList;
      });

      event.$on("getCurrentDirectory", directory => {
        this.selectedDirectory = directory;
      });
    },
    createFile: function(files) {
      // il faut push le fichier dans this.files
      // il faut ajouter this.currentPanel.selectedDirectory.node.element.spinalRelation.files.push()
      this.multipleFileTmp = [];
      this.multipleFile = [];
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        let filePath = new Path(element);
        let myFile = new File(element.name, filePath);
        this.multipleFileTmp.push(myFile);
        // spinal.contextStudio.graph
        //   .addSimpleRelationAsync(
        //     "files",
        //     this.currentPanel.selectedDirectory,
        //     myFile
        //   )
        //   .then(relation => {
        //     this.files.push(relation);
        //   });
        // this.currentPanel.selectedDirectory.files.push(myFile);
      }
    },
    saveFile: function() {
      // LES DERNIERE MODIFICATION SE PASSE A CE NIVEAU LA

      this.app
        .getAssociatedElementsByNodeByRelationType(
          this.selectedObject,
          "Files-"
        )
        .then(tabofAllFile => {
          // console.log(tabofAllFile);
          if (tabofAllFile.length == 0) {
            this.app
              .getAssociatedElementsByNodeByRelationType(
                this.selectedObject,
                "Files"
              )
              .then(tabofAllFile => {
                // console.log(tabofAllFile);
                // console.log(tabofAllFile.length);
                if (tabofAllFile.length == 0) {
                  var tmp = new Directory("Files");
                  this.selectedDirectory = tmp;
                  if (this.multipleFileTmp.length > 0) {
                    for (let i = 0; i < this.multipleFileTmp.length; i++) {
                      const element = this.multipleFileTmp[i];
                      console.log(
                        "il faut checker les directory parent pour eviter une inclusion circulaire"
                      );
                      this.promiseLoadForgeDirectory().then(
                        blockThisDirectory => {
                          console.log("WAZZZZZZZA");
                          console.log(blockThisDirectory);
                          this.checkChildDirectory(
                            element,
                            this.arrivedPathTab[this.arrivedPathTab.length - 1]
                              .path,
                            blockThisDirectory
                          ).then(bool => {
                            let existingDirectoryBool = bool;
                            console.log(existingDirectoryBool);
                            if (existingDirectoryBool)
                              this.selectedDirectory.push(element);
                            else this.importDirectoryBool = true;
                          });
                        }
                      );
                    }
                  }
                  // console.log(myDirectory);
                  this.selectedObject.addToExistingRelationByApp(
                    "file",
                    "Files",
                    tmp
                  );
                  // send de la création du directory for bind
                  event.$emit("createDirectoryFile", this.selectedDirectory);
                }
              });
          } else {
            if (this.selectedDirectory == undefined)
              this.selectedDirectory = tabofAllFile[0];

            if (this.multipleFileTmp.length > 0) {
              for (let i = 0; i < this.multipleFileTmp.length; i++) {
                const element = this.multipleFileTmp[i];
                // il faut checker les directory parent pour eviter une inclusion circulaire
                // console.log(element);
                console.log(
                  "il faut checker les directory parent pour eviter une inclusion circulaire"
                );
                console.log(element);
                this.promiseLoadForgeDirectory().then(blockThisDirectory => {
                  console.log("WAZZZZZZZA");
                  console.log(blockThisDirectory);
                  this.checkChildDirectory(
                    element,
                    this.arrivedPathTab[this.arrivedPathTab.length - 1].path,
                    blockThisDirectory
                  ).then(bool => {
                    let existingDirectoryBool = bool;
                    console.log(existingDirectoryBool);
                    if (existingDirectoryBool)
                      this.selectedDirectory.push(element);
                    else this.importDirectoryBool = true;
                  });
                });
                // console.log(existingDirectoryBool);
                ///////////////////////////////////////////////////////////////////////////////////////////////////
                // for (let j = 0; j < this.arrivedPathTab.length; j++) {
                //   let arrivedPath = this.arrivedPathTab[j];
                //   // arrivedPath = arrivedPath.splice(
                //   //   arrivedPath.length - 2,
                //   //   arrivedPath.length
                //   // );
                //   console.log(arrivedPath);
                // }
                //////////////////////////////////////////////////////////////////////////////////////////////////:
                // this.selectedDirectory.push(element);
              }
            }
          }
        });

      this.activeTabs = false;
    },
    promiseLoadForgeDirectory() {
      return new Promise((resolve, reject) => {
        var data = spinalSystem.getPath();

        var char = "";
        var i = data.length;
        while (char != "/") {
          char = data[i];
          i--;
        }

        // console.log(nameRevit);
        data = data.slice(0, i + 1);
        this.result = data;
        spinalSystem.load(this.result).then(resolve);
      });
    },
    promiseLoad(ptr) {
      return new Promise((resolve, reject) => {
        ptr.load(resolve);
      });
    },
    checkChildDirectory: async function(
      file,
      comparedDirectory,
      blockThisDirectory
    ) {
      let tmpDirectory = await this.promiseLoad(file._ptr);
      console.log(tmpDirectory._server_id, comparedDirectory._server_id);
      if (
        tmpDirectory._server_id == comparedDirectory._server_id ||
        tmpDirectory._server_id == blockThisDirectory._server_id
      ) {
        console.log("WAZZA ON A TROUVER LE MEME FICHIER BOOM FALSE");
        console.log(this.arrivedPathTab);
        return false;
      } else {
        let res = [];
        for (let i = 0; i < tmpDirectory.length; i++) {
          const childFile = tmpDirectory[i];
          if (childFile._info.model_type.get() == "Directory")
            res.push(
              this.checkChildDirectory(
                childFile,
                comparedDirectory,
                blockThisDirectory
              )
            );
        }
        return Promise.all(res).then(arr => {
          console.log(arr);
          for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            if (element === false) return false;
          }
          return true;
        });
      }
    },
    getPath: function() {
      // il faut que je mettre la route dans mounted, je push dans la list de path et
      //getPath devient la fonction associé au déplacement dans les folder
      var user = spinalSystem.getUser();
      var home = "/__users__/" + user.username;
      spinalSystem.load(home).then(directory => {
        // console.log(directory);
      });

      // spinalSystem.load(this.result).then(res => {
      //   this.tabDisplay = [];
      //   for (let i = 0; i < res.length; i++) {
      //     const element = res[i];
      //     this.tabDisplay.push(element);
      //   }
      //   this.searched = this.tabDisplay;
      //   console.log(this.searched);
      // });
      // console.log(this.result);
    }
  },
  mounted() {
    viewer = window.spinal.ForgeViewer.viewer;
    spinalSystem = window.spinal.spinalSystem;
    this.getEvent();
  }
};
</script>