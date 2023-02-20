type Instance = { id: string; txt: string };
interface List {
  [key: string]: Instance[];
}

function getTopMostAncestor(
  node: BaseNode & ChildrenMixin,
  type: NodeType,
  before = false
) {
  let next = node;
  let traverse = true;

  while (next.parent && traverse) {
    traverse = before ? next.parent.type !== type : next.type !== type;
    if (traverse) next = next.parent;
  }
  return next;
}

export default class BrokenInstances {
  brokenComponents: Map<string, InstanceNode>;
  collection: Map<string, Instance[]>;
  constructor() {
    this.brokenComponents = new Map();
    this.collection = new Map();
  }
  createInstanceName(node: InstanceNode) {
    const parentName = getTopMostAncestor(node, "PAGE", true)?.name;
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
          this.collection.set(mainComponent.name, []);
        }
        this.collection.get(mainComponent.name)!.push({
          id: node.id,
          txt: this.createInstanceName(node),
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
