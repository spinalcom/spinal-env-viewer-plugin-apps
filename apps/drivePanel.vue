<template>
    <md-content style=" box-sizing: border-box; height: calc(100% - 50px)" class="md-scrollbar">
      <md-button @click="getPath" class=" slice">
        {{path}}
      </md-button>
        <div style="height: calc(100% - 40px)">
    <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-fixed-header>
      <md-table-toolbar style="width: calc(100% - 32px); height: 50px">
        <div class="md-toolbar-section-start">
          <h1 class="md-title">File</h1>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Search by name..." v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="No users found"
        :md-description="`No user found for this '${search}' query. Try a different search term or create a new user.`">
        <md-button class="md-primary md-raised" @click="newFolder">Create New Folder</md-button>
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item:test }" @click="open(test)">
        <md-table-cell md-label="Name" md-numeric>{{ test.name.get() }}</md-table-cell>
        <md-table-cell md-label="Type" >{{ test._info.model_type.get() }}</md-table-cell>
        <md-table-cell md-label="Email" >{{ test.name.get() }}</md-table-cell>
        <md-table-cell md-label="Gender" >{{ test.name.get() }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>

  </md-content>
</template>


<script>
var spinalSystem;
var viewer;
import event from "../componentGlobal/event.vue";
import Vue from "vue";
const toLower = text => {
  return text.toString().toLowerCase();
};

const searchByName = (items, term) => {
  if (term) {
    return items.filter(item =>
      toLower(item.name.get()).includes(toLower(term))
    );
  }

  return items;
};

export default {
  name: "filePanel",

  data() {
    return {
      currentPanel: {
        selectedObject: {},
        panel: {}
      },
      tabDisplay: [],
      search: null,
      searched: [],
      result: "",
      path: "file"
    };
  },
  components: {},
  props: [],
  methods: {
    getEvent: function() {
      event.$on("createDrivePanel", panel => {
        console.log("le panel files a été créer");
        this.currentPanel.panel = panel;
      });
      spinal.eventBus.$on("openDrivePanel", selectedObject => {
        // console.log(selectedObject.node.element);
        // console.log(this.files);
        if (this.currentPanel.selectedObject === selectedObject) {
          if (this.currentPanel.panel.isVisible()) {
            this.currentPanel.panel.setVisible(false);
          } else this.currentPanel.panel.setVisible(true);
        } else {
          this.currentPanel.selectedObject = selectedObject;
          // this.currentPanel.panel.setTitle(
          //   "files : " + selectedObject.node.element.name.get()
          // );
          if (!this.currentPanel.panel.isVisible()) {
            this.currentPanel.panel.setVisible(true);
          }
        }
      });
    },
    searchOnTable() {
      this.searched = searchByName(this.tabDisplay, this.search);
    },
    getPath: function() {
      // il faut que je mettre la route dans mounted, je push dans la list de path et
      //getPath devient la fonction associé au déplacement dans les folder
      var data = spinalSystem.getPath();
      var char = "";
      var i = data.length;
      while (char != "/") {
        char = data[i];
        i--;
      }
      this.result = data.slice(0, i + 1);
      this.result = this.result + "/" + "file";

      spinalSystem.load(this.result).then(res => {
        this.tabDisplay = [];
        for (let i = 0; i < res.length; i++) {
          const element = res[i];
          this.tabDisplay.push(element);
        }
        this.searched = this.tabDisplay;
        console.log(this.searched);
      });
      console.log(this.result);
    },
    newFolder: function() {},
    open: function(item) {
      console.log(item);
      if (item._info.model_type.get() === "Directory") {
        this.result = this.result + "/" + item.name.get();
        spinalSystem.load(this.result).then(res => {
          this.tabDisplay = [];
          for (let i = 0; i < res.length; i++) {
            const element = res[i];
            this.tabDisplay.push(element);
            // this.searched.push(element);
          }
          this.searched = this.tabDisplay;
        });
      }
    }
  },
  mounted() {
    viewer = window.spinal.ForgeViewer.viewer;
    spinalSystem = window.spinal.spinalSystem;
    // console.log(this.inspector);
    this.getEvent();
  }
};
</script>

<style>
.container-drive .md-content.md-table.md-theme-default {
  height: 100%;
}
</style>
