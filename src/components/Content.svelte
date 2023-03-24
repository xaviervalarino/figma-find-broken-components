<script lang="ts">
  export let loading = false;

  import {
    Type,
    Icon,
    IconSearch,
    OnboardingTip,
  } from "figma-plugin-ds-svelte";
  import Flex from "./Flex.svelte";
  import Box from "./Box.svelte";
  import ComponentList from "./ComponentList.svelte";
  import Loading from "./Loading.svelte";

  const storage = sessionStorage.getItem("foundItems");
  let foundItems: any = storage ? JSON.parse(storage) : [];

  $: if (foundItems) {
    if (foundItems.length) {
      sessionStorage.setItem("foundItems", JSON.stringify(foundItems));
    }
    setTimeout(() => (loading = false), 500);
  }

  function handleOnMessage(e: MessageEvent) {
    const { type, found } = e.data.pluginMessage;
    if (type === "user-action") {
      console.log("user action");
      loading = true;
      foundItems = [];
    }
    if (type === "found") {
      foundItems = Object.entries(found).map(([componentName, instances]) => {
        return { componentName, instances };
      });
    }
  }
</script>

<svelte:window on:message={handleOnMessage} />
{#if loading}
  <Flex direction="column" justify="center" fullWidth fullHeight>
    <Loading>
      <div style="margin-right: -6px">
        <Icon iconName={IconSearch} />
      </div>
      Searching
    </Loading>
  </Flex>
{:else if !foundItems || !foundItems.length}
  <Flex direction="column" justify="center" fullHeight fullWidth>
    <span style="font-size:28px">🎉</span>
    <Type size="xlarge" weight="medium">No broken components</Type>
  </Flex>
{:else}
  {#each foundItems as foundItem}
    <ComponentList {...foundItem} />
  {/each}
{/if}
