<script lang="ts">
  import ListItem from "./ListItem.svelte";

  let foundItems: any = [];

  let loading = true;
  $: if (foundItems) {
    setTimeout(() => loading = false, 500)
  }

  function handleOnMessage(e) {
    const { type, found } = e.data.pluginMessage;
    if (type === "user-action") {
      console.log("user action");
      loading = true;
      foundItems = [];
    }
    if (type === "found") {
      console.log("found", found);
      foundItems = Object.entries(found).map(([key, value]) => {
        return [key, value];
      });
    }
  }
</script>

<svelte:window on:message={handleOnMessage} />
<div>
  {#if loading}
    <div>Loading...</div>
  {:else}
    <ul>
      {#if !foundItems.length}
        <div>"🎉 No broken components"</div>
      {:else}
        {#each foundItems as [mainComponentName, instances]}
          <details>
            <summary
              ><div>
                {mainComponentName}<span>{instances.length}</span>
              </div></summary
            >
            <ul>
              {#each instances as instance}
                <ListItem {...instance} />
              {/each}
            </ul>
          </details>
        {/each}
      {/if}
    </ul>
  {/if}
</div>

<style>
  summary > div {
    display: flex;
    justify-content: space-between;
    padding: 8px 2px;
  }
  summary > div > span {
    background: salmon;
    padding: 2px 8px;
    border-radius: 50px;
  }
</style>
