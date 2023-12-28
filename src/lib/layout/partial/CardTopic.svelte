<script>
  import { getContext } from "svelte";
  import Icon from "$lib/ui/Icon.svelte";

  export let colspan = 1; // 1, 2 or 3
  export let grow = false;
  export let title = "Title";
  export let description = "Description";
  export let href = "#";

  const cols = getContext("cols");
</script>

<article class="blank" style:grid-column="span {grow && $cols < 3 ? $cols : colspan == 1 ? 1 : colspan > $cols ? $cols : colspan}" style:grid-column-end={grow ? $cols + 1 : null}>
    <a {href}>
        <div class="title">
            <span>{title}</span>
            <Icon type="chevron"/>
        </div>
        <span class="description">{description}</span>
    </a>
</article>

<style>
  article {
    overflow: none;
    padding-bottom: 12px !important;
    border-bottom: 1px solid rgb(203 213 225);
  }
  h3 {
    font-size: 1.3rem;
    font-weight: bold;
  }
  .blank {
    padding: 0;
    line-height: 1;
  }
  .blank {
    color: black;
    margin: 4px 0 0;
  }
  :global(.tile__content h2) {
    margin: 0.4em 0 0;
  }
  :global(.tile__content p) {
    margin: 0.3em 0 0.8em;
  }
  article > a {
    text-decoration: none;
    color: unset;
    font-size: 1rem;
    line-height: 1.4;
  }
  a > .title {
    display: flex;
    justify-content: space-between;
    text-decoration: underline;
    font-weight: bold;
    color: rgb(32 96 149);
    margin-bottom: 5px;
  }
  a > .description {
    display: block;
    font-size: 0.8em;
  }
</style>