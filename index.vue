
<script>
import Vue from "vue";
import appsManager from "./appsManager.vue";

require("spinal-env-viewer-plugin-panel_manager");
require("spinal-env-viewer-plugin-circularMenu");
const ComponentCtor = Vue.extend(appsManager);

const ClassName = "Apps";
const PanelTitle = "Apps";
const ButtonLabel = "Apps";
const ButtonIcon = "playlist_add";

const classExtention = class {
  constructor(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this.viewer = viewer;
    this.panel = null;
  }

  load() {
    if (this.viewer.toolbar) {
      this.createUI();
    } else {
      this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
      this.viewer.addEventListener(
        av.TOOLBAR_CREATED_EVENT,
        this.onToolbarCreatedBinded
      );
    }
    return true;
  }

  onToolbarCreated() {
    this.viewer.removeEventListener(
      av.TOOLBAR_CREATED_EVENT,
      this.onToolbarCreatedBinded
    );
    this.onToolbarCreatedBinded = null;
    this.createUI();
  }

  unload() {
    this.viewer.toolbar.removeControl(this.subToolbar);
    return true;
  }
  // This function is to create your button on viewer, it used autodesk forge api
  createUI() {
    this.panel = new PanelClass(this.viewer, PanelTitle);
    // var button1 = new Autodesk.Viewing.UI.Button(ButtonLabel);
    // button1.onClick = e => {
    //   if (!this.panel.isVisible()) {
    //     this.panel.setVisible(true);
    //   } else {
    //     this.panel.setVisible(false);
    //   }
    // };
    // var icon = button1.container.firstChild;
    // icon.className = "adsk-button-icon md-icon md-icon-font md-theme-default";
    // icon.innerHTML = ButtonIcon;
    // button1.setToolTip(ButtonLabel);

    // this.subToolbar = this.viewer.toolbar.getControl("spinalcom");
    // this.subToolbar.addClass("spinalColorButton");
    // if (!this.subToolbar) {
    //   this.subToolbar = new Autodesk.Viewing.UI.ControlGroup("spinalcom");
    //   this.viewer.toolbar.addControl(this.subToolbar);
    // }
    // this.subToolbar.addControl(button1);
    this.initialize();
  }

  initialize() {
    var _container = document.createElement("div");

    _container.className = this.panel.container.id + "-pannelcontainer";

    _container.style.height = "calc(100% - 45px)";
    _container.style.boxSizing = "border-box";
    _container.style.overflowY = "auto";
    this.panel.container.appendChild(_container);
    new ComponentCtor().$mount(_container);

    this.panel.container.style.minHeight = "150px";
  }
};

export default new class {
  constructor() {
    Autodesk.Viewing.theExtensionManager.registerExtension(
      ClassName,
      classExtention
    ); // this is the register of your class
    window.spinal.ForgeExtentionManager.addExtention(ClassName);
  }
}();
</script>
<style>
.spinalColorButton {
  background-color: rgba(17, 48, 223, 0.644);
}
/* .md-button .md-ripple {
  padding: unset;
} */
</style>