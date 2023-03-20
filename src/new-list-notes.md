
### data structure
```
interface FoundNode {
  id: string
  name: string
  type: 'COMPONENT' | 'COMPONENT_SET' | 'INSTANCE' | 'FRAME',
  visible: boolean,
  locked: boolean,
  missing: boolean,
  children: FoundNode
}

<script lang='ts'>
  export local foundNodes: FoundNode[]
</script>

<ul>
  {#each node of FoundNodes}
    <li style:broken>
      <button>
        <IconType>{name}<IconButtonGroup {visible} {locked} {onDelete}/>
      </button>
      {#if children}
        {#each children as child}
          <svelte:self {child} />
        {/each}
      {/if}
    </li>
  {/each}
<ul>

<style>
  ul > li > button {
    padding-left: var(--size-xxxsmall)
  }

</style>
```
