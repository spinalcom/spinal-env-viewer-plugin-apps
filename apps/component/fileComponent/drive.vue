<template>
  <md-content class=" md-scrollbar"
              style="box-sizing: border-box; overflow-y:auto; height: 57vh">
    <span @click="goToPath(index)"
          v-for="(path,index) in pathTab"
          :key="index">{{path.name}} </span>
    <md-table v-model="tabDisplay"
              style="min-height: 50vh; height: 100%; max-height: 100%"
              @md-selected="onSelect">

      <!-- <md-table-row  @dblclick.native="clickPath(driveFiles)" v-for="(driveFiles, index) in tabDisplay" :key="index" md-auto-select md-selectable="multiple"> -->
      <md-table-row @dblclick.native="clickPath(driveFiles)"
                    slot="md-table-row"
                    slot-scope="{ item:driveFiles }"
                    md-auto-select
                    md-selectable="multiple">
        <md-table-cell>
          <md-icon>{{getIconFile(driveFiles)}}</md-icon>
        </md-table-cell>
        <md-table-cell md-numeric>{{driveFiles.name.get()}}</md-table-cell>
        <md-table-cell md-numeric>{{driveFiles._info.model_type.get()}}</md-table-cell>
      </md-table-row>
    </md-table>
    <!-- <md-list>
      <md-list-item @click="getPath" v-for="(driveFiles, index) in tabDisplay" :key="index" >{{driveFiles.name.get()}}</md-list-item>
    </md-list> -->

  </md-content>
</template>


<script>
var spinalSystem;
var viewer;

// import event from "./event.vue";
import event from "../../../componentGlobal/event.vue";

export default {
  name: "addGroup",

  data() {
    return {
      pathTab: [],
      currentPath: undefined,
      tabDisplay: [],
      selected: []
    };
  },
  components: {},
  props: ["selectedDirectory", "app", "selectedObject"],
  methods: {
    onSelect: function(items) {
      this.selected = items;
      // console.log(this.selected);
      event.$emit("getSelectionDrive", this.selected, this.pathTab);
    },
    getIconFile: function(driveFiles) {
      var fileType = driveFiles._info.model_type.get();
      if (fileType === "Directory") return "folder";
      else if (fileType === "Digital twin") return "location_city";
      else if (fileType === "Path") return "insert_drive_file";
      else return "not_listed_location";
    },
    clickPath: function(driveFiles) {
      var type = driveFiles._info.model_type.get();
      this.selected = [];
      // console.log(type);

      if (type == "Directory") {
        var name = "/ " + driveFiles.name.get();
        var mypath = this.currentPath + "/" + driveFiles.name.get();
        var route2 = {};
        route2.name = name;
        route2.path = mypath;
        this.pathTab.push(route2);
        this.currentPath = mypath;
        this.getPath();
      }
    },
    getPath: function() {
      // console.log(this.pathTab);

      // il faut que je mettre la route dans mounted, je push dans la list de path et
      //getPath devient la fonction associé au déplacement dans les folder
      // console.log(this.currentPath);
      spinalSystem.load(this.currentPath).then(directory => {
        this.tabDisplay = [];
        for (let i = 0; i < directory.length; i++) {
          const element = directory[i];
          this.tabDisplay.push(element);
        }
      });
      // console.log(this.selectedDirectory);

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
    },
    goToPath: function(indexPath) {
      this.currentPath = this.pathTab[indexPath].path;
      var deletenbr = this.pathTab.length - indexPath;
      this.pathTab.splice(indexPath + 1, this.pathTab.length - (indexPath + 1));
      // console.log(deletenbr);
      this.getPath();
    }
  },
  mounted() {
    viewer = window.spinal.ForgeViewer.viewer;
    spinalSystem = window.spinal.spinalSystem;
    var user = spinalSystem.getUser();
    var home = "/__users__/" + user.username;
    this.currentPath = home;
    var route = {};
    route.name = "home";
    route.path = home;
    this.pathTab.push(route);
    this.getPath();
  }
};
</script>