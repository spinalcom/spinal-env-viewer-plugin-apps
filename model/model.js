var exports = (module.exports = {});
var spinalCore = require("spinal-core-connectorjs");
import model from "spinal-models-bim_forge";

var group = class group extends Model {
  constructor(name = "group Alert", color = "blue") {
    super();

    this.add_attr({
      name: name,
      type: "",
      username: "",
      owner: "",
      create: Date.now(),
      allObject: [],
      group: []
    });
    var newgroup = new model.SpinalBIMGroupForge(
      "unclassified",
      [],
      false,
      color
    );
    this.group.push(newgroup);
  }
};
exports.group = group;
spinalCore.register_models(group);

var apps = class apps extends Model {
  constructor(name = "apps") {
    super();

    this.add_attr({
      name: name,
      type: "",
      username: "",
      owner: "",
      create: Date.now(),
      inspector: []
    });
  }
};

exports.apps = apps;
spinalCore.register_models(apps);

var message = class message extends Model {
  constructor(name = "message") {
    super();

    this.add_attr({
      username: "",
      owner: "",
      date: Date.now(),
      message: ""
    });
  }
};

exports.message = message;
spinalCore.register_models(message);

var link = class link extends Model {
  constructor(name = "link") {
    super();

    this.add_attr({
      name: "",
      username: "",
      owner: "",
      date: Date.now(),
      link: ""
    });
  }
};

exports.link = link;
spinalCore.register_models(link);

var inspectorTemplate = class inspectorTemplate extends Model {
  constructor() {
    super();

    this.add_attr({
      app: {
        defaultName: "",
        themeList: [],
        statusRef: [],
        statutPanelName: "",
        objectPanelName: ""
      }
    });
  }
};

exports.inspectorTemplate = inspectorTemplate;
spinalCore.register_models(inspectorTemplate);
