<script lang="ts">
  type Sizes =
    | "xxxsmall"
    | "xxsmall"
    | "xsmall"
    | "small"
    | "medium"
    | "large"
    | "xlarge"
    | "xxlarge"
    | "huge";

  export let padding: Sizes | undefined = undefined;
  export let paddingTop: Sizes | undefined = undefined;
  export let paddingRight: Sizes | undefined = undefined;
  export let paddingBottom: Sizes | undefined = undefined;
  export let paddingLeft: Sizes | undefined = undefined;
  export let margin: Sizes | undefined = undefined;
  export let marginTop: Sizes | undefined = undefined;
  export let marginRight: Sizes | undefined = undefined;
  export let marginBottom: Sizes | undefined = undefined;
  export let marginLeft: Sizes | undefined = undefined;

  export let fullHeight: boolean = false;
  export let fullWidth: boolean = false;

  const setValues = new Map(
    Object.entries({
      padding,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      margin,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
    }).filter(([_, v]) => v !== undefined)
  );

  let cssVars: string[] = [];
  for (const [key, value] of setValues) {
    cssVars.push(`--${key}: var(--size-${value})`)
  }
</script>

<div
  class="box"
  style={cssVars.join(';')}
  class:padding
  class:paddingTop
  class:paddingRight
  class:paddingBottom
  class:paddingLeft
  class:margin
  class:marginTop
  class:marginRight
  class:marginBottom
  class:marginLeft
  class:fullHeight
  class:fullWidth
>
  <slot />
</div>

<style>
  .box {
    --padding: 0;
    --paddingTop: 0;
    --paddingRight: 0;
    --paddingBottom: 0;
    --paddingLeft: 0;
    --margin: 0;
    --marginTop: 0;
    --marginRight: 0;
    --marginBottom: 0;
    --marginLeft: 0;
  }

  .fullHeight {
    height: 100%;
  }
  .fullWidth {
    width: 100%;
  }

  .padding {
    padding: var(--padding);
  }
  .padding {
    padding: var(--padding);
  }
  .paddingTop {
    padding-top: var(--paddingTop);
  }
  .paddingRight {
    padding-right: var(--paddingRight);
  }
  .paddingBottom {
    padding-bottom: var(--paddingBottom);
  }
  .paddingLeft {
    padding-left: var(--paddingLeft);
  }
  .margin {
    margin: var(--margin);
  }
  .marginTop {
    margin-top: var(--marginTop);
  }
  .marginRight {
    margin-right: var(--marginRight);
  }
  .marginBottom {
    margin-bottom: var(--marginBottom);
  }
  .marginLeft {
    margin-left: var(--marginLeft);
  }
</style>
