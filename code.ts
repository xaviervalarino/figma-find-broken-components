figma.showUI(__html__, { width: 400, height: 500 });

console.clear();

class BrokenNodes {
  found: Map<string, InstanceNode>;
  constructor() {
    this.found = new Map();
  }
  find() {
    const instances = figma.currentPage.findAllWithCriteria<"INSTANCE"[]>({
      types: ["INSTANCE"],
    });
    this.found.clear();
    for (const node of instances) {
      const parent =
        node.mainComponent?.parent?.type === "COMPONENT_SET"
          ? node.mainComponent.parent.parent
          : node.mainComponent;

      // component has no parent and is not part of an external library
      if (!parent && !node.mainComponent?.remote) {
        // if (!node.mainComponent?.parent) {
        this.found.set(node.id, node);
      }
    }
  }
  instance(id: string) {
    return this.found.get(id);
  }
  get all() {
    const instances: [string, string][] = [];
    for (const [id, node] of this.found) {
      const parentName = getTopMostParent(node)?.name;
      const name = parentName ? `${parentName} → ${node.name}` : node.name;
      instances.push([id, name]);
    }
    return instances;
  }
}

function getTopMostParent(node: BaseNode & ChildrenMixin) {
  let parent = node.parent;
  while (parent && parent.parent && parent.parent.type !== "PAGE") {
    parent = parent.parent;
  }
  return parent;
}

function sendUpdatedList(found: [string, string][]) {
  figma.ui.postMessage({ type: "found", found });
}

// init
const brokenNodes = new BrokenNodes();
brokenNodes.find();
sendUpdatedList(brokenNodes.all);

// listeners
figma.on("selectionchange", () => {
  figma.ui.postMessage({ type: "selectionchange" });
});

figma.on("documentchange", () => {
  console.log("doc change");
  brokenNodes.find();
  figma.ui.postMessage({ type: "user-action" });
  sendUpdatedList(brokenNodes.all);
});

figma.on("currentpagechange", () => {
  brokenNodes.find();
  figma.ui.postMessage({ type: "user-action" });
  sendUpdatedList(brokenNodes.all);
});

figma.ui.onmessage = (msg) => {
  if (msg.type === "go-to-broken") {
    const node = brokenNodes.instance(msg.id);
    if (node) {
      figma.viewport.scrollAndZoomIntoView([node]);
      figma.currentPage.selection = [node];
    }
  }

  if (msg.type === "refresh") {
    brokenNodes.find();
    sendUpdatedList(brokenNodes.all);
  }
};
