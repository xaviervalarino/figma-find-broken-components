<script lang="ts">
  import { Type } from "figma-plugin-ds-svelte";
  import Flex from "../ui/Flex.svelte";
</script>

<Type size="xlarge">
  <Flex>
    <slot /><span class="dots"><span>.</span><span>.</span><span>.</span></span>
  </Flex>
</Type>

<style>
  /* prettier-ignore */
  @keyframes dots-1 {
    from { opacity: .3; } 33% { opacity: 1; }
    to   { opacity: 1; }  66% {opacity: 0; }
    to   { opacity: 0; } 100% {opacity: .3; }
  }
  /* prettier-ignore */
  @keyframes dots-2 {
    from { opacity: 0; }  33% { opacity: 1; }
    to   { opacity: 1; }  66% {opacity: .6; }
    to   { opacity: .6; } 100% {opacity: 0; }
  }

  /* prettier-ignore */
  @keyframes dots-3 {
    from { opacity: 0; }  66% { opacity: 1; }
    to   { opacity: 1; } 100% { opacity: 0; }
  }

  .dots span {
    animation: dots-1 1.5s infinite steps(1);
    animation-timing-function: ease;
  }

  .dots span:first-child + span {
    animation-name: dots-2;
  }

  .dots span:first-child + span + span {
    animation-name: dots-3;
  }
</style>
