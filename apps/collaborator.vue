<template>
  <md-content class="md-scrollbar myTabs" style="box-sizing: border-box; height: calc(100% - 50px)">
    <!-- <transition name="spinalTab"> -->
      <md-button style="width: 45%" @click="activeTab = 0" :style="activeTabColor()" class="md-raised">Files</md-button>
      <md-button style="width: 45%" @click="activeTab = 1" :style="activeTabColor2()" class="md-raised">Links</md-button>
    <!-- </transition>   -->

      <!-- <transition name="spinalTab"> -->
        <files-panel v-if="activeTab == 0" :myNodeProps="currentPanel.selectedObject"></files-panel>    
        <links-panel v-else :myNodeProps="currentPanel.selectedObject"></links-panel>
      <!-- </transition>   -->

  </md-content>
</template>


<script>
var spinalSystem;
var viewer;
import Vue from "vue";
import event from "../componentGlobal/event.vue";

import linksPanel from "./linkPanel.vue";
import filesPanel from "./filePanel.vue";
import commentsPanel from "./commentsPanel.vue";

export default {
  name: "appsManager",

  data() {
    return {
      currentPanel: {
        selectedObject: undefined,
        panel: {}
      },
      activeTab: 0
    };
  },
  components: { linksPanel, filesPanel, commentsPanel },
  props: [],
  methods: {
    getEvent: function() {
      spinal.eventBus.$on("getNodeClick", node => {
        console.log("get node click");
        this.currentPanel.selectedObject = node;
        console.log(this.currentPanel.selectedObject);
        // this.onModelChange();
      });
      event.$on("createCollaboratorPanel", panel => {
        console.log("le panel files a été créer");
        this.currentPanel.panel = panel;
      });
      spinal.eventBus.$on("openCollaboratorPanel", selectedTabs => {
        // console.log(selectedObject.node.element);
        // console.log(this.files);
        // this.currentPanel.selectedObject = node;

        // if (this.currentPanel.selectedObject === selectedObject) {
        if (this.currentPanel.panel.isVisible()) {
          this.currentPanel.panel.setVisible(false);
        } else this.currentPanel.panel.setVisible(true);
        this.activeTab = 0;
        // } else {
        // this.currentPanel.selectedObject = selectedObject;
        // this.currentPanel.panel.setTitle(
        //   "files : " + selectedObject.node.element.name.get()
        // );
        // if (!this.currentPanel.panel.isVisible()) {
        //   this.currentPanel.panel.setVisible(true);
        // }
        // }
      });
    },
    openCollaborator: function(button) {
      spinal.eventBus.$emit("openCollaboratorPanel", "link");
      // this.onModelChange();

      // event.$emit("openResumePanel", this.data.dbIdArray[0], 2);
    },
    activeTabColor: function() {
      if (this.activeTab == 0) return { background: "#356BaB" };
      else return { background: "unset" };
    },
    activeTabColor2: function() {
      if (this.activeTab == 1) return { background: "#356BaB" };
      else return { background: "unset" };
    },
    checkNewPosts: function() {
      console.log(this.currentPanel.selectedObject);
    },
    getCurrentTabsStyle: function() {
      if (this.activeTab == 0) {
        return { background: "#e6e6ff" };
      } else return { background: "#fff" };
    }
  },
  mounted() {
    viewer = window.spinal.ForgeViewer.viewer;
    spinalSystem = window.spinal.spinalSystem;
    spinal.circularMenu.addButton(this.openCollaborator, "folder");

    this.getEvent();
    console.log("COLLABORATOR PANEL POWER");
  }
};
</script>

<style>
.myTabs * .button.md-button.md-theme-default.md-active {
  min-width: unset;
}
.spinalTab-enter-active {
  transition: all 0.3s ease;
}
.spinalTab-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.spinalTab-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>

