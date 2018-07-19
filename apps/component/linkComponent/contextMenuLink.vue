<template>
<div>
<md-menu md-direction="bottom-end">
      <md-button class="md-icon-button" @click.stop md-menu-trigger>
        <md-icon>more_vert</md-icon>
      </md-button>
      <md-menu-content>
          <md-menu-item @click="modify">
            <md-icon>border_color</md-icon>modify
          </md-menu-item>

          <md-menu-item @click="deleteLink">
            <md-icon>delete_forever</md-icon>Delete
          </md-menu-item>
          
      </md-menu-content>
</md-menu>
           <md-dialog :md-active.sync="active">

                <h4 style="  margin-left: auto; margin-right: auto; width: 40px; margin-bottom: unset">Label</h4>
              <md-field md-inline style="width: 80%; margin-left: auto; margin-right: auto;">
                <md-input v-model="nameLabel"></md-input>
              </md-field>

                <h4 style="  margin-left: auto; margin-right: auto; width: 40px; margin-top: unset; margin-bottom: unset">Link</h4>
              <md-field md-inline style="width: 80%; margin-left: auto; margin-right: auto;">
                
                <md-input v-model="myLink"></md-input>
              </md-field>


                    <md-dialog-actions>
                    <md-button class="md-primary" @click="active = false">Close</md-button>
                    <md-button class="md-primary" @click="myConfirm">Save</md-button>
                  </md-dialog-actions>
           </md-dialog>
</div>
</template>


<script>
var spinalSystem;
var viewer;

// import event from "./event.vue";

export default {
  name: "addGroup",

  data() {
    return {
      active: false,
      nameLabel: "",
      myLink: ""
    };
  },
  components: {},
  props: ["links", "selectedObject"],
  methods: {
    modify: function() {
      console.log("modify");
      console.log(this.links);
      this.nameLabel = this.links.name.get();
      this.myLink = this.links.link.get();
      this.active = true;
      // event.$emit("renameGroup", group);
    },
    deleteLink: function() {
      console.log(this.file);
      console.log(this.selectedObject);
      for (
        let i = 0;
        i < this.selectedObject.relations["files" + "-"].length;
        i++
      ) {
        const element = this.selectedObject.relations["files" + "-"][i];
        if (this.file === element)
          this.selectedObject.relations["files" + "-"].splice(i, 1);
      }
    },
    myConfirm: function() {
      this.links.name.set(this.nameLabel);
      this.links.link.set(this.myLink);
      this.active = false;
    }
  },
  mounted() {
    viewer = window.spinal.ForgeViewer.viewer;
    spinalSystem = window.spinal.spinalSystem;
  }
};
</script>