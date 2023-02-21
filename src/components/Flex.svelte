<script lang="ts">
  export let direction: "row" | "column" = "row";
  export let align: "start" | "center" | "end" | "stretch" | "baseline" =
    "center";
  export let justify:
    | "start"
    | "end"
    | "center"
    | "around"
    | "between"
    | "evenly" = "evenly";
  export let gap = "0px";

  export let fullWidth = false;
  export let fullHeight = false;

  const classNames = Object.entries({
    direction,
    align,
    justify,
  }).map(([k, v]) => k + "-" + v);

  console.log(classNames);
</script>

<div
  class="flex {classNames.join(' ')}"
  class:fullWidth
  class:fullHeight
  style:gap
>
  <slot />
</div>

<style>
  .flex {
    display: flex;
  }

  .fullHeight {
    height: 100%;
  }
  .fullWidth {
    width: 100%;
  }

  .direction-row {
    flex-direction: row;
  }
  .direction-column {
    flex-direction: column;
  }

  .align-start {
    align-items: flex-start;
  }
  .align-center {
    align-items: center;
  }
  .align-end {
    align-items: flex-end;
  }

  .justify-start {
    justify-content: flex-start;
  }
  .justify-end {
    justify-content: flex-end;
  }
  .justify-center {
    justify-content: center;
  }
  .justify-around {
    justify-content: space-around;
  }
  .justify-between {
    justify-content: space-between;
  }
  .justify-evenly {
    justify-content: space-evenly;
  }
</style>
