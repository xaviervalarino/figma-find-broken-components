<script lang="ts">
  import { GlobalCSS } from "figma-plugin-ds-svelte";
  import { Icon, IconSpinner, Type } from "figma-plugin-ds-svelte";
  import Box from "./ui/Box.svelte";
  import Flex from "./ui/Flex.svelte";
  import Content from "./components/Content.svelte";

  let loading = true;
</script>

<div class="main">
  <Flex direction="column" align="start" fullWidth fullHeight>
    <Box
      paddingLeft="xsmall"
      paddingTop="xxxsmall"
      paddingRight="xxxsmall"
      fullWidth
    >
      <Flex justify="between" align="center">
        <Box paddingTop="xxsmall" paddingBottom="xxsmall">
          <Type size="xlarge" weight="medium">Found on Current Page</Type>
        </Box>
        {#if loading}
          <Icon iconName={IconSpinner} spin />
        {/if}
      </Flex>
    </Box>
    <Content bind:loading />
  </Flex>
</div>

<style>
  :root {
    --container-background: inherit;
  }
  .main {
    margin: 2px;
    height: 100%;
  }
</style>
