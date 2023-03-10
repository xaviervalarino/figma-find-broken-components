import BrokenInstances from "./modules/broken-instances";
figma.showUI(__html__, { width: 400, height: 400, themeColors: true });

console.clear();

// init
const brokenInstances = new BrokenInstances();

function getUpdatedList() {
  // jank masters
  setTimeout(() => {
    brokenInstances.find();
    figma.ui.postMessage({ type: "found", found: brokenInstances.found });
  }, 100);
}
getUpdatedList();

// listeners
figma.on("selectionchange", () => {
  const selection = figma.currentPage.selection.map(({ id }) => id);
  figma.ui.postMessage({ type: "selectionchange", selection: selection });
});

figma.on("documentchange", (e) => {
  for (const documentChange of e.documentChanges) {
    // work around since properties isn't typed
    const type = documentChange.type;
    const properties = documentChange.properties;

    if (properties) {
      console.log("properties", properties);
      const ignoreProps = [
        "locked",
        "visible",
        "relativeTransform",
        "width",
        "x",
        "y",
      ];
      const checkIgnore = properties.every((prop: string) => {
        return !ignoreProps.includes(prop);
      });
      if (type === "PROPERTY_CHANGE" && checkIgnore) {
        console.log("doc change --> updating the list");
        figma.ui.postMessage({ type: "user-action" });
        getUpdatedList();
      }
    }
  }
});

figma.on("currentpagechange", () => {
  figma.ui.postMessage({ type: "user-action" });
  getUpdatedList();
});

figma.ui.onmessage = (msg) => {
  if (msg.type === "toggle-locked") {
    const node = brokenInstances.instance(msg.id);
    if (node) {
      node.locked = !node.locked;
    }
  }
  if (msg.type === "toggle-visible") {
    const node = brokenInstances.instance(msg.id);
    if (node) {
      console.log("visible", node.visible);
      node.visible = !node.visible;
      console.log("visible after", node.visible);
    }
  }
  if (msg.type === "go-to-broken") {
    const node = brokenInstances.instance(msg.id);
    if (node) {
      figma.viewport.scrollAndZoomIntoView([node]);
      figma.currentPage.selection = [node];
    }
  }

  if (msg.type === "refresh") {
    getUpdatedList();
  }
};
