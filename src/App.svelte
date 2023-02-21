<script lang="ts">
  import { GlobalCSS } from "figma-plugin-ds-svelte";
  import { Icon, IconSpinner, Type } from "figma-plugin-ds-svelte";
  import Box from "./components/Box.svelte";
  import Flex from "./components/Flex.svelte";
  import List from "./components/List.svelte";

  let loading = true;
</script>

<Flex direction="column" align="start" fullWidth fullHeight>
  <Box paddingLeft="xsmall" paddingTop="xxxsmall" paddingRight="xxxsmall" fullWidth>
    <Flex justify="between" align="center">
      <Type size="xlarge" weight="medium">Found on Current Page</Type>
      {#if loading}
        <Icon iconName={IconSpinner} spin />
      {/if}
    </Flex>
  </Box>
  <List bind:loading />
</Flex>

<style>
  :root {
    --container-background: inherit;
  }
</style>
