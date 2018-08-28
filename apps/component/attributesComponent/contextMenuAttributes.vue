<template>
  <div>
    <md-menu md-direction="bottom-end">
      <md-button class="md-icon-button"
                 @click.stop
                 md-menu-trigger>
        <md-icon>more_vert</md-icon>
      </md-button>
      <md-menu-content>
        <md-menu-item @click="modify">
          <md-icon>border_color</md-icon>modify
        </md-menu-item>

        <md-menu-item @click="deleteAttributes">
          <md-icon>delete_forever</md-icon>Delete
        </md-menu-item>

      </md-menu-content>
    </md-menu>
    <md-dialog :md-active.sync="active">

      <h4 style="  margin-left: auto; margin-right: auto; width: 40px; margin-bottom: unset">attributes</h4>
      <md-field md-inline
                style="width: 80%; margin-left: auto; margin-right: auto;">
        <md-input v-model="nameAttributes"></md-input>
      </md-field>

      <h4 style="  margin-left: auto; margin-right: auto; width: 40px; margin-top: unset; margin-bottom: unset">Value</h4>
      <md-field md-inline
                style="width: 80%; margin-left: auto; margin-right: auto;">

        <md-input v-model="myAttributes"></md-input>
      </md-field>

      <md-dialog-actions>
        <md-button class="md-primary"
                   @click="active = false">Close</md-button>
        <md-button class="md-primary"
                   @click="myConfirm">Save</md-button>
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
      nameAttributes: "",
      myAttributes: ""
    };
  },
  components: {},
  props: ["attributes", "selectedObject"],
  methods: {
    modify: function() {
      console.log("modify");
      console.log(this.attributes);
      this.nameAttributes = this.attributes.name.get();
      this.myAttributes = this.attributes.value.get();
      this.active = true;
      // event.$emit("renameGroup", group);
    },
    deleteAttributes: function() {
      console.log("ICI EST LA SUPPRESSION DES ATTRIBUTES");
      console.log(this.attributes);
      console.log(this.selectedObject);
      var test = this.selectedObject.getRelationsByAppNameByType(
        "attributes",
        "hasAttributes"
      );
      // console.log(test[0]);
      for (let i = 0; i < test[0].nodeList2.length; i++) {
        test[0].nodeList2[i].element.load(allAttributes => {
          if (allAttributes === this.attributes)
            this.selectedObject.removeFromExistingRelationByApp(
              "attributes",
              "hasAttributes",
              test[0].nodeList2[i]
            );
        });
      }
    },
    myConfirm: function() {
      this.attributes.name.set(this.nameAttributes);
      this.attributes.value.set(this.myAttributes);
      this.active = false;
    }
  },
  mounted() {
    viewer = window.spinal.ForgeViewer.viewer;
    spinalSystem = window.spinal.spinalSystem;
  }
};
</script>