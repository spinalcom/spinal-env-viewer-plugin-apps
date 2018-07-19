<template>
  <md-content class="md-scrollbar">
    test 
  </md-content>
</template>


<script>
var spinalSystem;
var viewer;
import Vue from "vue";
import event from "./componentGlobal/event.vue";

import commentsPanel from "./apps/commentsPanel.vue";
import filesPanel from "./apps/filePanel.vue";
import linkPanel from "./apps/linkPanel.vue";
import drivePanel from "./apps/drivePanel.vue";

const commentsComponentCtor = Vue.extend(commentsPanel);
const filesComponentCtor = Vue.extend(filesPanel);
const linkComponentCtor = Vue.extend(linkPanel);
const driveComponentCtor = Vue.extend(drivePanel);

export default {
  name: "appsManager",

  data() {
    return {
      tabPanel: [],
      apps: {}
    };
  },
  components: {},
  props: [],
  methods: {},
  mounted() {
    viewer = window.spinal.ForgeViewer.viewer;
    spinalSystem = window.spinal.spinalSystem;

    spinalSystem.getModel().then(forgeFile => {
      if (forgeFile) {
        if (forgeFile.apps) {
          this.apps = apps;
        } else {
          forgeFile.add_attr({
            apps: new Model()
          });
          this.apps = apps;
        }
      }
    });

    var check1 = false;
    var check2 = false;
    var check3 = false;
    var check4 = false;

    for (let i = 0; i < this.tabPanel.length; i++) {
      if (this.tabPanel[i].titleLabel.indexOf("comments :") > -1) {
        check1 = true;
      } else if (this.tabPanel[i].titleLabel.indexOf("files :") > -1) {
        check2 = true;
      } else if (this.tabPanel[i].titleLabel.indexOf("link :") > -1) {
        check3 = true;
      } else if (this.tabPanel[i].titleLabel.indexOf("drive :") > -1)
        check4 = true;
    }

    if (!check1) {
      let hideOrShow = new PanelClass(viewer, "comments :");
      var _container = document.createElement("div");
      _container.className = hideOrShow.container.id + "-pannelcontainer";
      _container.style.height = "300px";
      _container.style.overflowY = "auto";

      hideOrShow.container.style.minWidth = "300px";
      hideOrShow.container.style.width = "350px";
      hideOrShow.container.style.height = "300px";
      hideOrShow.container.style.minHeight = "200px";

      hideOrShow.container.style.left = "40%";
      hideOrShow.container.appendChild(_container);
      new commentsComponentCtor().$mount(_container);
      event.$emit("createCommentsPanel", hideOrShow);
      this.tabPanel.push(hideOrShow);
      window.spinal.panelManager.registerPanel(hideOrShow, "collaborator");
    }
    if (!check2) {
      let hideOrShow = new PanelClass(viewer, "files :");
      var _container = document.createElement("div");
      _container.className = hideOrShow.container.id + "-pannelcontainer";
      _container.style.height = "300px";
      _container.style.overflowY = "auto";

      hideOrShow.container.style.minWidth = "300px";
      hideOrShow.container.style.width = "350px";
      hideOrShow.container.style.height = "300px";
      hideOrShow.container.style.minHeight = "200px";

      hideOrShow.container.style.left = "40%";
      hideOrShow.container.appendChild(_container);
      new filesComponentCtor().$mount(_container);
      event.$emit("createFilesPanel", hideOrShow);
      this.tabPanel.push(hideOrShow);
      window.spinal.panelManager.registerPanel(hideOrShow, "collaborator");
    }
    if (!check3) {
      let hideOrShow = new PanelClass(viewer, "link :");
      var _container = document.createElement("div");
      _container.className = hideOrShow.container.id + "-pannelcontainer";
      _container.style.height = "300px";
      _container.style.overflowY = "auto";

      hideOrShow.container.style.minWidth = "300px";
      hideOrShow.container.style.width = "350px";
      hideOrShow.container.style.height = "300px";
      hideOrShow.container.style.minHeight = "200px";

      hideOrShow.container.style.left = "40%";
      hideOrShow.container.appendChild(_container);
      new linkComponentCtor().$mount(_container);
      event.$emit("createLinkPanel", hideOrShow);
      this.tabPanel.push(hideOrShow);

      window.spinal.panelManager.registerPanel(hideOrShow, "collaborator");
    }

    if (!check4) {
      let hideOrShow = new PanelClass(viewer, "drive :");
      var _container = document.createElement("div");
      _container.className = hideOrShow.container.id + "-pannelcontainer";
      _container.style.height = "300px";
      _container.style.overflowY = "auto";

      hideOrShow.container.style.minWidth = "300px";
      hideOrShow.container.style.width = "350px";
      hideOrShow.container.style.height = "300px";

      hideOrShow.container.style.left = "40%";
      hideOrShow.container.appendChild(_container);
      new driveComponentCtor().$mount(_container);
      event.$emit("createDrivePanel", hideOrShow);
      this.tabPanel.push(hideOrShow);

      window.spinal.panelManager.registerPanel(hideOrShow, "collaborator");
    }
    var button1 = new Autodesk.Viewing.UI.Button("collaborator");
    var icon = button1.container.firstChild;
    button1.setToolTip("collaborator");

    icon.className = "adsk-button-icon md-icon md-icon-font md-theme-default";
    icon.innerHTML = "playlist_add";
    window.spinal.panelManager.registerButton(button1, "collaborator");
  }
};
</script>