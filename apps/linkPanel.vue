<template>
    <md-content class="container-link" style=" box-sizing: border-box; height: calc(100% - 50px)">
           <md-dialog :md-active.sync="active">
             <md-dialog-title>Add Link</md-dialog-title>


              <md-field md-inline style="width: 80%; margin-left: auto; margin-right: auto;">
                <label>Label</label>
                <md-input v-model="nameLink"></md-input>
              </md-field>

              <md-field md-inline style="width: 80%; margin-left: auto; margin-right: auto;">
                <label>Link</label>
                <md-input v-model="link"></md-input>
              </md-field>


                    <md-dialog-actions>
                    <md-button class="md-primary" @click="active = false">Close</md-button>
                    <md-button class="md-primary" @click="addLink">Save</md-button>
                  </md-dialog-actions>
           </md-dialog>
  <md-toolbar style="box-sizing: border-box;">
    <md-button style="width: 100%" @click="active = true"> Add Link</md-button>
    </md-toolbar>

    <md-content class="md-scrollbar" style="box-sizing: border-box; overflow-y:auto; height: calc(100% - 60px)">
    <md-list>
      <md-list-item v-if="tabDisplay.length > 0" v-for="(links, index) in tabDisplay" :key="index">
        <a :href="links.link.get()" target="_blank">{{links.name.get()}}
          <md-tooltip>{{ links.link.get()}}</md-tooltip>
        </a>
        <!-- add context menu for delete link -->
        <contextMenuLink :links="links" :selectedObject="currentPanel.selectedObject"></contextMenuLink>
      </md-list-item>
    </md-list>
    </md-content>

  </md-content>
</template>


<script>
var spinalSystem;
var viewer;
import event from "../componentGlobal/event.vue";
import { link } from "../model/model.js";
import contextMenuLink from "./component/linkComponent/contextMenuLink.vue";

export default {
  name: "linkPanel",

  data() {
    return {
      currentPanel: {
        selectedObject: {},
        panel: {}
      },
      newNode: undefined,
      multiple: [],
      tabDisplay: [],
      link: "",
      nameLink: "",
      active: false,
      allLinks: {},
      allLinksJson: {},
      app: undefined
    };
  },
  components: { contextMenuLink },
  props: [],
  methods: {
    getEvent: function() {
      event.$on("createLinkPanel", panel => {
        console.log("le panel files a été créer");
        this.currentPanel.panel = panel;
      });
      spinal.eventBus.$on("getNodeClick", node => {
        console.log("le panel files a été créer");
        this.newNode = node;
      });
      spinal.eventBus.$on("openLinkPanel", node => {
        // console.log(selectedObject);

        if (this.currentPanel.selectedObject === node) {
          if (this.currentPanel.panel.isVisible()) {
            this.currentPanel.panel.setVisible(false);
            this.allLinks.unbind(this.onModelChange);
          } else {
            this.currentPanel.panel.setVisible(true);
            this.allLinks.bind(this.onModelChange);
          }
        } else {
          // this.allLinks.bind(this.onModelChange);
          if (this.app !== undefined) {
            console.log(this.app);
            this.currentPanel.selectedObject = node;
            this.allLinks.bind(this.onModelChange);
          }
          console.log(this.currentPanel.selectedObject);
          this.currentPanel.selectedObject.element.load(item => {
            this.currentPanel.panel.setTitle("link : " + item.name.get());
          });

          if (!this.currentPanel.panel.isVisible()) {
            this.currentPanel.panel.setVisible(true);
          }
        }
      });
    },
    addLink: function() {
      console.log("submit");
      // console.log(this.link);
      let myLink = new link();
      myLink.link.set(this.link);
      myLink.name.set(this.nameLink);
      myLink.username.set(spinalSystem.getUser().username);
      myLink.owner.set(spinalSystem.getUser().id);

      this.currentPanel.selectedObject.addToExistingRelationByApp(
        "link",
        "link",
        myLink
      );
      // spinal.contextStudio.graph
      //   .addSimpleRelationAsync(
      //     "links",
      //     this.currentPanel.selectedObject,
      //     myLink
      //   )
      //   .then(relation => {
      //     this.allLinks.push(relation);
      //   });

      this.active = false;
    },
    onModelChange: function() {
      // var init = 0;

      // console.log(this.allLinks);
      // console.log(this.app);
      // let tab = this.app.getRelationsByType("link");
      this.app
        .getAssociatedElementsByNodeByRelationType(
          this.currentPanel.selectedObject,
          "link"
        )
        .then(tabofAllLink => {
          this.tabDisplay = tabofAllLink;
          console.log(this.tabDisplay);
        });
      // let array = [];
      // console.log(tab);
      // if (tab != undefined) {
      // for (let i = 0; i < tab.length; i++) {
      //   const element = tab[i];
      // tri par item

      // for (let j = 0; j < element.nodeList2.length; j++) {
      //   const message = element.nodeList2[j];
      //   message.element.load(linkObj => {
      //     // console.log(init);
      //     init++;
      //     // console.log(linkObj);
      //     array.push(linkObj);
      //     // console.log(element);
      //   });
      // }
      // }
      // }

      // if (this.currentPanel.selectedObject.relations["link" + "-"]) {
      //   // console.log(this.currentPanel.selectedObject);
      //   for (
      //     let i = 0;
      //     i < this.currentPanel.selectedObject.relations["link" + "-"].length;
      //     i++
      //   ) {
      //     const element = this.currentPanel.selectedObject.relations[
      //       "link" + "-"
      //     ][i];
      //     for (let j = 0; j < element.nodeList2.length; j++) {
      //       const message = element.nodeList2[j];
      //       message.element.load(linkObj => {
      //         console.log(linkObj);
      //         this.tabDisplay.push(linkObj);
      //       });
      //     }
      //   }
      // }
    },
    openLink: function(button) {
      console.log("link");
      // console.log(button);
      spinal.eventBus.$emit("openLinkPanel", this.newNode);

      // event.$emit("openResumePanel", this.data.dbIdArray[0], 2);
    }
  },
  mounted() {
    viewer = window.spinal.ForgeViewer.viewer;
    spinalSystem = window.spinal.spinalSystem;
    // console.log(this.inspector);
    spinal.circularMenu.addButton(this.openLink, "insert_link");

    console.log("LINK PANEL");
    // console.log(window.spinal.contextStudio);
    let interval = setInterval(() => {
      if (typeof spinal.contextStudio.graph != "undefined") {
        spinal.contextStudio.graph.getApp("link", ["link"]).then(app => {
          console.log("CREATE APP LINK");
          this.app = app;
          this.allLinks = this.app.getCharacteristicElement();

          console.log(this.app);
          JsonProcess.create_JsonProcess(this.app, true).then(json => {
            this.allLinksJson = json;
            console.log(this.allLinksJson);
          });
        });

        // console.log(this.app);
        clearInterval(interval);
      }
    }, 2000);
    // this.app = spinal.contextStudio;

    // spinalSystem.getModel().then(forgeFile => {
    //   if (forgeFile) {
    //     if (forgeFile.apps) {
    //       if (forgeFile.apps.links) {
    //         forgeFile.apps.links.load(links => {
    //           this.allLinks = links;
    //         });
    //       } else {
    //         var list = new Lst();
    //         forgeFile.apps.add_attr({
    //           links: new Ptr(list)
    //         });
    //         forgeFile.apps.links.load(links => {
    //           this.allLinks = links;
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
