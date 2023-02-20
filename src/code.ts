import BrokenInstances from "./modules/broken-instances";
figma.showUI(__html__, { width: 500, height: 500 });

console.clear();

// init
const brokenInstances = new BrokenInstances();

function getUpdatedList() {
  // jank masters
  setTimeout(() => {
    brokenInstances.find()
    figma.ui.postMessage({ type: "found", found: brokenInstances.found });
  }, 100)
}
getUpdatedList()

// listeners
figma.on("selectionchange", () => {
  const selection =  figma.currentPage.selection.map(({id}) => id);
  figma.ui.postMessage({ type: "selectionchange", selection: selection });
});

figma.on("documentchange", () => {
  console.log("doc change");
  figma.ui.postMessage({ type: "user-action" });
  getUpdatedList();
});

figma.on("currentpagechange", () => {
  figma.ui.postMessage({ type: "user-action" });
  getUpdatedList();
});

figma.ui.onmessage = (msg) => {
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
