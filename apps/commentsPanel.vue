<template>
  <div class="container-comments" id="app" style=" box-sizing: border-box; height: calc(100% - 50px)">


        <md-dialog :md-active.sync="active" v-model="value" md-confirm-text="Done" @md-confirm="myConfirm()">
          <md-field style="margin:unset">
            <label>Textarea</label>
            <md-textarea v-model="value"></md-textarea>
          </md-field>
        <md-dialog-actions>
        <md-button class="md-primary" @click="active = false">Close</md-button>
        <md-button class="md-primary" @click="myConfirm()">Confirm</md-button>
      </md-dialog-actions> 
        </md-dialog>
  

<md-content id="myList" class="md-scrollbar" style="box-sizing: border-box; overflow-y:auto; height: calc(75% - 20px)">
  <md-list>
    <md-list-item style="border-bottom: 1px solid grey; margin-top: 7px" v-for="(comment, index) in tabDisplay" :key="index">
      <div style="width: 88%">
      <div class="md-list-item-text">
        <span  style="font-size: 15px; color: #819FF7">{{comment.username.get()}}</span>
        <span style="font-size: 10px"> {{toDate(comment.date.get())}}</span>
      </div>
      <pre class="mt-3" :style="getStyle(comment)"> {{ getMessage(comment)}} </pre>
      </div>
      <md-button style="position: absolute;top: 0px;right: 10px;" class="md-icon-button" @click="editMessage(comment)">
          <md-icon>edit</md-icon>
      </md-button>
      <md-button style="position: absolute;top: 0px;right: 0px; margin: unset" @click="removeMessage(comment)">
        ×
      </md-button>
    </md-list-item>
  </md-list>

<!-- <div :style="getStyle(comment)" v-for="(comment, index) in onModelChange()" :key="index">
  <div>{{ comment.message.get()}}</div>
    <div>{{comment.username.get()}}</div>
  <div>{{toDate(comment.date.get())}}</div>
</div> -->
</md-content>

<md-field style="width: calc(100% - 5px);border-radius: 10px height: 23%; background-color: white; ">
      <label style="color: #819FF7">...</label>
      <md-textarea class="md-scrollbar" style="-webkit-text-fill-color: black; ;width: 100%; min-height: calc(100% - 10px); resize:unset; margin-top: 10px; padding-top: unset" v-model="message"></md-textarea>
    <md-button style="min-width: 15px; width: unset; min-height: 15px; height: unset; color: black" @click="addComments">
      <md-icon style="color: black">send</md-icon>
    </md-button>
    </md-field>


  </div>
</template>


<script>
var spinalSystem;
var viewer;
import event from "../componentGlobal/event.vue";
import { message } from "../model/model.js";
import Vue from "vue";
var moment = require("moment");

export default {
  name: "commentsPanel",
  data() {
    return {
      currentPanel: {
        selectedObject: {},
        panel: {}
      },
      newNode: undefined,
      message: "",
      value: "",
      active: false,
      app: undefined,
      myEditMessage: {},
      newMessage: {},
      allComments: {},
      tabDisplay: []
    };
  },

  components: {},
  props: [],
  methods: {
    getEvent: function() {
      // spinalSystem.getModel().then(forgeFile => {
      //   if (forgeFile) {
      //     if (forgeFile.apps) {
      //       // console.log(forgeFile.apps);
      //       if (typeof forgeFile.apps.comments !== "undefined") {
      //         forgeFile.apps.comments.load(commentsList => {
      //           this.allComments = commentsList;
      //           // this.allComments.bind(this.onModelChange);
      //         });
      //       } else {
      //         var list = new Lst();
      //         forgeFile.apps.add_attr({
      //           comments: new Ptr(list)
      //         });
      //         forgeFile.apps.comments.load(commentsList => {
      //           this.allComments = commentsList;
      //           // this.allComments.bind(this.onModelChange);
      //         });
      //       }
      //     }
      //   }
      // });

      event.$on("createCommentsPanel", panel => {
        console.log("le panel commentaire a été créer");
        this.currentPanel.panel = panel;
      });
      spinal.eventBus.$on("getNodeClick", node => {
        // IL FAUT CORRIGER LA RECEPTION DU NODE ET NE PAS REMPLACER LE SELECTED OBJECT
        console.log("le panel files a été créer");
        this.newNode = node;
      });
      spinal.eventBus.$on("openCommentsPanel", node => {
        console.log(node);

        if (this.currentPanel.selectedObject === node) {
          if (this.currentPanel.panel.isVisible()) {
            this.currentPanel.panel.setVisible(false);
            this.allComments.unbind(this.onModelChange);
          } else {
            this.currentPanel.panel.setVisible(true);
            this.allComments.bind(this.onModelChange);
          }
        } else {
          // console.log("verif if currentpanel.selectedObject exist");
          // if (typeof this.currentPanel.selectedObject !== "undefined")
          //   this.currentPanel.selectedObject.unbind(this.onModelChange);
          this.currentPanel.selectedObject = node;
          this.allComments.bind(this.onModelChange);
          // console.log(node);

          this.currentPanel.selectedObject.element.load(item => {
            console.log(item);
            console.log(item.name.get());
            this.currentPanel.panel.setTitle("comments : " + item.name.get());
          });
          if (!this.currentPanel.panel.isVisible()) {
            this.currentPanel.panel.setVisible(true);
          }
        }
      });
    },
    onModelChange: function() {
      this.tabDisplay = [];
      console.log("onModelChange comments");
      console.log(this.currentPanel.selectedObject);
      this.app
        .getAssociatedElementsByNodeByRelationType(
          this.currentPanel.selectedObject,
          "comments"
        )
        .then(tabofAllComments => {
          this.tabDisplay = tabofAllComments;
          console.log(this.tabDisplay);
        });
      // if (this.currentPanel.selectedObject.relations) {
      //   if (this.currentPanel.selectedObject.relations["messages" + "-"]) {
      //     for (
      //       let i = 0;
      //       i <
      //       this.currentPanel.selectedObject.relations["messages" + "-"].length;
      //       i++
      //     ) {
      //       const relMess = this.currentPanel.selectedObject.relations[
      //         "messages" + "-"
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
    toDate: function(date) {
      let newDateFormat = moment(date);
      let newDateFormat2 = moment();
      newDateFormat2.subtract(1, "days");
      if (newDateFormat.isBefore(newDateFormat2)) {
        return newDateFormat.format("L , LT");
      } else return newDateFormat.fromNow();
      // "DD MM YY, HH:mm:ss a"
      // return convert.toLocaleDateString("fr-fr", { timeZone: "UTC" });
    },
    addComments: function() {
      console.log("ceci est la allcommentsList");
      // console.log(this.allComments);
      let user = spinalSystem.getUser();
      if (this.message) {
        let newMessage = new message();
        newMessage.username.set(user.username);
        newMessage.owner.set(user.id);
        newMessage.message.set(this.message);
        this.currentPanel.selectedObject.addToExistingRelationByApp(
          "comments",
          "comments",
          newMessage
        );
        // spinal.contextStudio.graph
        //   .addSimpleRelationAsync(
        //     "messages",
        //     this.currentPanel.selectedObject,
        //     this.newMessage
        //   )
        //   .then(relation => {
        //     this.allComments.push(relation);
        //   });
        // console.log(this.allComments);
      }
      console.log(this.allComments);
      this.message = "";
    },
    removeMessage: function(comment) {
      console.log(comment.message.get());
      for (let i = 0; i < this.currentPanel.selectedObject.note.length; i++) {
        const element = this.currentPanel.selectedObject.note[i];
        if (element === comment)
          this.currentPanel.selectedObject.note.splice(i, 1);
      }
    },
    editMessage: function(comment) {
      this.myEditMessage = comment;
      this.value = comment.message.get();
      this.active = true;
    },
    getMessage: function(comment) {
      return comment.message.get();
    },
    myConfirm: function() {
      this.myEditMessage.message.set(this.value);
      this.active = false;
    },
    getStyle: function(comment) {
      var myStyle = {
        border: "",
        "padding-bottom": "3%",
        "border-radius": "10px",
        overflow: "hidden",
        "white-space": "pre-line",
        "margin-left": "14px"
        // "word-spacing": "100vw"
      };
      // if (comment.username.get() === spinalSystem.getUser().username) {
      //   // myStyle.border = "1px solid blue";
      //   myStyle.right = "0";
      // } else {
      //   myStyle.border = "1px solid red";
      //   myStyle.left = "0";
      // }
      return myStyle;
    },
    comments: function(button) {
      console.log("comments");
      // console.log(button);
      spinal.eventBus.$emit("openCommentsPanel", this.newNode);

      // event.$emit("openResumePanel", this.data.dbIdArray[0], 2);
    }
  },
  updated() {
    var container = this.$el.querySelector("#myList");
    container.scrollTop = container.scrollHeight;
    // this.onModelChange();
  },
  mounted() {
    viewer = window.spinal.ForgeViewer.viewer;
    spinalSystem = window.spinal.spinalSystem;
    spinal.circularMenu.addButton(this.comments, "border_color");

    // console.log(this.inspector);
    let interval = setInterval(() => {
      if (typeof spinal.contextStudio.graph != "undefined") {
        console.log("CREATION OF APP FILE");
        spinal.contextStudio.graph
          .getApp("comments", ["comments"])
          .then(myApp => {
            this.app = myApp;
            this.allComments = this.app.getCharacteristicElement();
          });
        console.log(this.app);
        clearInterval(interval);
      }
    }, 2000);
    this.getEvent();
  }
};
</script>

<style lang="scss" scoped>
.md-card {
  width: 200px;
  // height: 150px;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
  // background: blue;
}

.words {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.container-comments button.md-button.md-theme-default {
  min-width: 15px;
  width: 15px;
  min-height: 15px;
  height: 15px;
}
</style>
