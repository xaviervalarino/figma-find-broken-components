figma.showUI(__html__, { width: 500, height: 500 });

console.clear();

type Instance = { id: string; txt: string };
interface List {
  [key: string]: Instance[];
}

class BrokenNodes {
  brokenComponents: Map<string, InstanceNode>;
  collection: Map<string, Instance[]>;
  constructor() {
    this.brokenComponents = new Map();
    this.collection = new Map();
  }
  #getTopMostParent(node: BaseNode & ChildrenMixin) {
    let parent = node.parent;
    while (parent && parent.parent && parent.parent.type !== "PAGE") {
      parent = parent.parent;
    }
    return parent;
  }
  #createInstanceName(node: InstanceNode) {
    const parentName = this.#getTopMostParent(node)?.name;
    return parentName ? `${parentName} → ${node.name}` : node.name;
  }
  find() {
    const instances = figma.currentPage.findAllWithCriteria<"INSTANCE"[]>({
      types: ["INSTANCE"],
    });
    this.brokenComponents.clear();
    this.collection.clear();
    for (const node of instances) {
      const mainComponent =
        node.mainComponent?.parent?.type === "COMPONENT_SET"
          ? node.mainComponent.parent
          : node.mainComponent;

      // component has no parent and is not part of an external library
      if (mainComponent && !mainComponent.parent && !mainComponent.remote) {
        // if (!node.mainComponent?.parent) {
        this.brokenComponents.set(node.id, node);
        if (!this.collection.has(mainComponent.name)) {
          this.collection.set(mainComponent.name, [])
        }
        this.collection.get(mainComponent.name)!.push({
          id: node.id,
          txt: this.#createInstanceName(node),
        });
      }
    }
  }
  instance(id: string) {
    return this.brokenComponents.get(id);
  }
  get found() {
    const list: List = {};
    for (const [componentName, instances] of this.collection) {
      list[componentName] = instances;
    }
    return list;
  }
}

function sendUpdatedList(found: List) {
  figma.ui.postMessage({ type: "found", found });
}

// init
const brokenNodes = new BrokenNodes();
brokenNodes.find();
sendUpdatedList(brokenNodes.found);

// listeners
figma.on("selectionchange", () => {
  figma.ui.postMessage({ type: "selectionchange" });
});

figma.on("documentchange", () => {
  console.log("doc change");
  brokenNodes.find();
  figma.ui.postMessage({ type: "user-action" });
  sendUpdatedList(brokenNodes.found);
});

figma.on("currentpagechange", () => {
  brokenNodes.find();
  figma.ui.postMessage({ type: "user-action" });
  sendUpdatedList(brokenNodes.found);
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
    sendUpdatedList(brokenNodes.found);
  }
};
