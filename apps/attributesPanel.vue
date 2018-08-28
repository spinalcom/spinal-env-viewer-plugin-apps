<template>
  <md-content class="container-link"
              style=" box-sizing: border-box; height: calc(100% - 50px)">
    <md-dialog :md-active.sync="active">
      <md-dialog-title>Add attributes</md-dialog-title>

      <md-field md-inline
                style="width: 80%; margin-left: auto; margin-right: auto;">
        <label>attributes</label>
        <md-input v-model="nameAttributes"></md-input>
      </md-field>

      <md-field md-inline
                style="width: 80%; margin-left: auto; margin-right: auto;">
        <label>Value</label>
        <md-input v-model="valueAttributes"></md-input>
      </md-field>

      <md-dialog-actions>
        <md-button class="md-primary"
                   @click="active = false">Close</md-button>
        <md-button class="md-primary"
                   @click="addAttributes">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-toolbar style="box-sizing: border-box;">
      <md-button style="width: 100%"
                 @click="active = true"> Add attributes</md-button>
    </md-toolbar>

    <md-content class="md-scrollbar"
                style="box-sizing: border-box; overflow-y:auto; height: calc(100% - 60px)">
      <md-list>
        <md-list-item style="padding-right: 15px; padding-left: 20px;"
                      v-if="tabDisplay.length > 0"
                      v-for="(attributes, index) in tabDisplay"
                      :key="index">
          <div>
            {{attributes.name.get()}}
          </div>
          <div>{{attributes.value.get()}}</div>
          <context-menu-attributes :selectedObject="currentPanel.selectedObject"
                                   :attributes="attributes"></context-menu-attributes>
        </md-list-item>
      </md-list>
    </md-content>

  </md-content>
</template>


<script>
var spinalSystem;
var viewer;
import event from "../componentGlobal/event.vue";
import { attributes } from "../model/model.js";
import contextMenuAttributes from "./component/attributesComponent/contextMenuAttributes.vue";

export default {
  name: "attributesPanel",

  data() {
    return {
      currentPanel: {
        selectedObject: {},
        panel: {}
      },
      app: undefined,
      active: false,
      nameAttributes: undefined,
      valueAttributes: undefined,
      tabDisplay: []
    };
  },
  components: { contextMenuAttributes },
  props: ["myNodeProps"],
  methods: {
    getEvent: function() {
      spinal.eventBus.$on("getNodeClick", node => {
        console.log("get node click LINK PANEL");
        this.currentPanel.selectedObject = node;
        console.log(this.currentPanel.selectedObject);
        this.onModelChange();
      });
    },
    addAttributes: function() {
      console.log("submit");
      // console.log(this.link);
      let myAttributes = new attributes();
      myAttributes.value.set(this.valueAttributes);
      myAttributes.name.set(this.nameAttributes);
      myAttributes.username.set(spinalSystem.getUser().username);
      myAttributes.owner.set(spinalSystem.getUser().id);
      this.currentPanel.selectedObject.addToExistingRelationByApp(
        "attributes",
        "hasAttributes",
        myAttributes
      );
      this.active = false;
    },
    onModelChange: function() {
      console.log(this.currentPanel.selectedObject);
      if (this.currentPanel.selectedObject != undefined) {
        this.app
          .getAssociatedElementsByNodeByRelationType(
            this.currentPanel.selectedObject,
            "hasAttributes"
          )
          .then(tabofAllLink => {
            console.log(tabofAllLink);
            this.tabDisplay = tabofAllLink;
            // console.log(this.tabDisplay);
          });
      }
    }
  },
  mounted() {
    viewer = window.spinal.ForgeViewer.viewer;
    spinalSystem = window.spinal.spinalSystem;
    this.currentPanel.selectedObject = this.myNodeProps;
    console.log("MOUNTED");
    console.log("attributes PANEL");
    let interval = setInterval(() => {
      if (typeof spinal.contextStudio.graph != "undefined") {
        spinal.contextStudio.graph
          .getApp("attributes", ["hasAttributes"])
          .then(app => {
            console.log("CREATE APP LINK");
            this.app = app;
            this.allAttributes = this.app.getCharacteristicElement();
            this.myBind = this.allAttributes.bind(this.onModelChange);
            console.log(this.app);
            // JsonProcess.create_JsonProcess(this.app, true).then(json => {
            //   this.allLinksJson = json;
            //   console.log(this.allLinksJson);
            // });
          });
        clearInterval(interval);
      }
    }, 100);
    this.getEvent();
  },
  beforeDestroy() {
    this.allAttributes.unbind(this.myBind);
  }
};
</script>

<style>
.container-link * {
  box-sizing: border-box;
}
.container-link .md-ripple.md-list-item-content {
  box-sizing: border-box;
  min-height: 20px;
  height: 36px;
  font-size: 14px;
  border-bottom: 1px solid #212121;
}
</style>
