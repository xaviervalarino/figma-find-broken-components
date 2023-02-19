figma.showUI(__html__, { width: 400, height: 500 });

const potentiallyBrokenNodes: Map<string, InstanceNode> = new Map();

function getTopMostParent(node: BaseNode & ChildrenMixin) {
  let parent = node.parent;
  while (parent && parent.parent && parent.parent.type !== "PAGE") {
    parent = parent.parent;
  }
  return parent;
}

function findBrokenNodes() {
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
      const parentName = getTopMostParent(node)?.name;
      const name = parentName ? `${parentName} / ${node.name}` : node.name;
      found.push([id, name]);
    }
    figma.ui.postMessage({ type: "found", found });
}

findBrokenNodes()

figma.on('currentpagechange', () => {
  potentiallyBrokenNodes.clear()
  findBrokenNodes()
})

figma.on('selectionchange', () => {
  figma.ui.postMessage({ type: 'selectionchange'})
})

figma.ui.onmessage = (msg) => {
  if (msg.type === "go-to-broken") {
    const node = <InstanceNode>potentiallyBrokenNodes.get(msg.id);
    figma.viewport.scrollAndZoomIntoView([node]);
    figma.currentPage.selection = [node];
  }
  if (msg.type === 'refresh') {
    findBrokenNodes()
  }
};
