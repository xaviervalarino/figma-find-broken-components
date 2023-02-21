- [ ] Update UI
  - [X] Migrate to Svelte?
  - [X] Make UI look like side panel?
  - [ ] Delete node from panel
  - [ ] multi select all items
- [X] store items in a new Map of maps
  - [mainComponentName]: {id: InstanceNode}[]
- [ ] Next broken components by the top level component set they are inside, or the topmost frame
  - Essentially three tiers
    -  The broken component [count]
      - Topmost component set or topmost frame
        - Broken component instance
- [ ] Ability to resize the panel

- [ ] Explore ideas
  - [ ] idea 1: a check for unused properties across all components. (like if you make a hide/show boolean property and then delete the thing that the boolean was toggling, but then the zombie property is just hanging out
  - [ ] idea 2: a check for conflicting properties in variants across all components. (like if you make two variants that have the exact same properties. usually happens to me when i'm making variants and just forget to set some of the values.)
  - [ ] idea 3: a check for consistent structure and naming for all variants of the same component. it's easy to accidentally fuck this up and when i do, it makes it so that content disappears when i change a property on a component

- [ ] Created tabbed list
  - Broken components in this file
  - Components that point to another file (not a design system library)

- [ ] OAuth to check if component exists in an external library?
  - Does this require an external server?
