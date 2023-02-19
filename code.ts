figma.showUI(__html__, { width: 400, height: 500 });

const potentiallyBrokenNodes: Map<string, InstanceNode> = new Map();

function getTopMostParentName(node: BaseNode & ChildrenMixin) {
  let parent = node.parent;
  while (parent && parent.parent && parent.parent.type !== "PAGE") {
    parent = parent.parent;
  }
  return parent;
}

figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === "find-broken") {
    const instanceNodes = figma.currentPage.findAllWithCriteria<"INSTANCE"[]>({
      types: ["INSTANCE"],
    });
    for (let node of instanceNodes) {
      if (!node.mainComponent?.parent) {
        potentiallyBrokenNodes.set(node.id, node);
      }
    }
    const found = [];
    for (const [id, node] of potentiallyBrokenNodes) {
      const parentName = getTopMostParentName(node)?.name;
      const name = parentName ? `${parentName} / ${node.name}` : node.name;
      found.push([id, name]);
    }
    figma.ui.postMessage({ type: "found", found });
  }
  if (msg.type === "go-to-broken") {
    const node = <InstanceNode>potentiallyBrokenNodes.get(msg.id);
    figma.viewport.scrollAndZoomIntoView([node]);
    figma.currentPage.selection = [node];
  }
};
