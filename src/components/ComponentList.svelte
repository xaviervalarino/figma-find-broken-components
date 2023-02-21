<script lang="ts">
  export let componentName: string;
  export let instances: { txt: string; id: string }[];

  import {
    Icon,
    IconButton,
    IconCaretDown,
    IconCaretRight,
    IconComponent,
    Type,
  } from "figma-plugin-ds-svelte";
  import Box from "./Box.svelte";
  import Flex from "./Flex.svelte";
  import ListItem from "./ListItem.svelte";

  let closed = false;

  function toggleList() {
    closed = !closed;
  }
  const dangerStyle = `
    var(--figma-color-border-danger-strong) !important
  `;
</script>

<Box paddingTop="xsmall" fullWidth fullHeight>
  <div class="control">
    <Box>
      <Flex justify="between">
        <Flex align="center" justify="start">
          <IconButton
            iconName={closed ? IconCaretRight : IconCaretDown}
            on:click={toggleList}
          />
          <div style:fill="var(--figma-color-border-danger-strong) !important">
            <Icon iconName={IconComponent} />
          </div>
          <div />
          <Type weight="medium">{componentName}</Type>
        </Flex>
        <Type>
          <Type weight="medium"><span>{instances.length}</span></Type>
        </Type>
      </Flex>
    </Box>
  </div>
  {#each instances as instance}
    <div class:closed class="list">
      <ListItem {...instance} />
    </div>
  {/each}
</Box>

<style>
  .control:hover {
    outline: 1px solid var(--figma-color-bg-component-hover);
  }
  .list {
    --transition: 0.2s ease-out;
    max-height: 100vh;
    opacity: 1;
    transition: max-height var(--transition), opacity var(--transition);
  }
  .list.closed {
    max-height: 0;
    opacity: 0;
  }
  span {
    color: var(--figma-color-text-secondary);
    border: 1px solid var(--figma-color-text-secondary);
    padding-top: var(--size-xxxsmall);
    padding-bottom: var(--size-xxxsmall);
    padding-left: var(--size-xxsmall);
    padding-right: var(--size-xxsmall);
    border-radius: var(--border-radius-large);
    margin-right: var(--size-xxxsmall);
  }
  .broken * {
    fill: var(--figma-color-border-danger-strong) !important;
    color: var(--figma-color-border-danger-strong) !important;
  }
</style>
