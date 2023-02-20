<script lang="ts">
  export let id: string;
  export let txt: string;

  let selected = "";

  function onClickHandler(e: MouseEvent) {
    selected = id;
    parent.postMessage(
      { pluginMessage: { type: "go-to-broken", id: id } },
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
<li class:selected={selected === id}>
  <div>
    {txt} <button data-id={id} on:click={onClickHandler}>Go to</button>
  </div>
</li>

<style>
  li {
    padding: 8px;
    border-top: 1px solid rgba(10, 10, 10, 0.1);
  }
  li.selected {
    background: lightblue;
  }
  div {
    display: flex;
    justify-content: space-between;
  }
</style>
