<script lang="ts">
  export let id: string;
  export let txt: string;
  export let locked: boolean;
  export let visible: boolean;

  import {
    Icon,
    IconButton,
    IconInstance,
    IconHidden,
    IconVisible,
    IconTrash,
    Type,
  } from "figma-plugin-ds-svelte";
  import IconLocked from "../icons/locked.svg";
  import IconUnlocked from "../icons/unlocked.svg";

  import Flex from "./Flex.svelte";

  let selected = "";

  function onClickHandler(e: MouseEvent) {
    selected = id;
    parent.postMessage(
      { pluginMessage: { type: "go-to-broken", id: id } },
      "*"
    );
  }

  function handleLockedButton() {
    locked = !locked;
    parent.postMessage(
      { pluginMessage: { type: "toggle-locked", id: id } },
      "*"
    );
  }
  function handleVisibilityButton() {
    visible = !visible;
    parent.postMessage(
      { pluginMessage: { type: "toggle-visible", id: id } },
      "*"
    );
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
      <div style="pointer-events:none">
        <Type color="red">{txt}</Type>
      </div>
    </Flex>
    <Flex>
      <div class:hide={!locked}>
        <IconButton
          iconName={locked ? IconLocked : IconUnlocked}
          on:click={handleLockedButton}
        />
      </div>
      <div class:hide={visible}>
        <IconButton
          iconName={visible ? IconVisible : IconHidden}
          on:click={handleVisibilityButton}
        />
      </div>
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
    padding-right: var(--size-xxxsmall);
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
  .hide {
    opacity: 0;
    transition: opacity 0.1s ease;
  }
  li:hover .hide {
    opacity: 1;
  }
</style>
