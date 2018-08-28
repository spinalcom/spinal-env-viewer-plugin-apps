<template>
  <div>
    <md-menu md-direction="bottom-end">
      <md-button class="md-icon-button"
                 @click.stop
                 md-menu-trigger>
        <md-icon>more_vert</md-icon>
      </md-button>
      <md-menu-content>
        <md-menu-item @click="downloadFile">
          <md-icon>cloud_download</md-icon>download
        </md-menu-item>

        <!-- <md-menu-item @click="deleteFile">
            <md-icon>delete_forever</md-icon>Delete
          </md-menu-item> -->

      </md-menu-content>
    </md-menu>
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
      active: false
    };
  },
  components: {},
  props: ["file", "selectedObject"],
  methods: {
    rename: function(group) {
      console.log("rename");
      event.$emit("renameGroup", group);
    },
    deleteFile: function() {
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
    downloadFile: function() {
      console.log(this.file);
      this.file._ptr.load(path => {
        console.log(path);
        var element = document.createElement("a");
        element.setAttribute("href", "/sceen/_?u=" + path._server_id);
        element.setAttribute("download", this.file.name);
        element.click();
      });
      console.log(this.file);
    }
  },
  mounted() {
    viewer = window.spinal.ForgeViewer.viewer;
    spinalSystem = window.spinal.spinalSystem;
  }
};
</script>