<script lang="ts">
  export let id: string;
  export let txt: string;

  import {
    Icon,
    IconButton,
    IconInstance,
    IconHidden,
    IconTrash,
    Type,
  } from "figma-plugin-ds-svelte";
  import IconLocked from "../icons/locked.svg";

  import Flex from "./Flex.svelte";

  let selected = "";

  function onClickHandler(e: MouseEvent) {
    selected = id;
    parent.postMessage(
      { pluginMessage: { type: "go-to-broken", id: id } },
      "*"
    );
  }

  function handleHiddenButton() {
    console.log("clicked hidden icon");
  }

  function onMessageHandler(e: MessageEvent) {
    const { type, selection } = e.data.pluginMessage;
    if (type === "selectionchange") {
      if (!selection.some((selectedId: string) => selectedId === id)) {
        selected = "";
      }
    }
  }
</script>

<svelte:window on:message={onMessageHandler} />
<li class="broken" class:selected={selected === id} on:click={onClickHandler}>
  <Flex justify="between">
    <Flex>
      <Icon iconName={IconInstance} color="red" />
      <Type color="red">{txt}</Type>
    </Flex>
    <Flex>
      <IconButton iconName={IconLocked} on:click={handleHiddenButton} />
      <IconButton iconName={IconHidden} on:click={handleHiddenButton} />
      <!-- TODO -->
      <!-- <IconButton iconName={IconTrash} on:click={handleHiddenButton} /> -->
    </Flex>
  </Flex>
</li>

<style>
  li {
    list-style-type: none;
    padding-left: var(--size-medium);
    opacity: inherit;
  }
  li:hover {
    /* background: var(--figma-color-bg-component-tertiary); */
    outline: 1px solid var(--figma-color-bg-component-hover);
  }
  li.selected {
    background: var(--selection-a);
  }
  li.broken {
    fill: var(--figma-color-border-danger-strong) !important;
    color: var(--figma-color-border-danger-strong);
    /* background: var(--figma-color-bg-danger-tertiary); */
  }
</style>
