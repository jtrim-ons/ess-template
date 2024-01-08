<script>
  import { base } from "$app/paths";

  import Titleblock from "$lib/layout/Titleblock.svelte";
  import Headline from "$lib/layout/partial/Headline.svelte";
  import Subhead from "$lib/layout/partial/Subhead.svelte";
  import SectionsWithNav from "$lib/layout/SectionsWithNav.svelte";
  import Placeholder from "$lib/layout/Placeholder.svelte";
  import { Table } from "@onsvisual/svelte-components";

  import { toProperCase } from "$lib/utils.js";
  import { getContext } from "svelte";

  export let data;

  const GLOBAL_DATA = getContext("GLOBAL_DATA");
  const indicators = getContext("indicators");
  const indicator = indicators.find(
    (d) => d.label === data.selectedIndicatorName
  );
  const sortedData = [...indicator.data].sort((a, b) => +a.value - +b.value);
  const tableColumns = [
    { key: "areanm", label: "Place" },
    { key: "value", label: "Value", numeric: true, sortable: true },
  ];

  let lookups = {
    areaCodeToName: Object.fromEntries(
      data.areas.map((d) => [d.areacd, d.areanm])
    ),
  };

  //let geogLevels = GLOBAL_DATA

  const tableData = sortedData.map(({ areacd, value }) => ({
    areanm: lookups.areaCodeToName[areacd],
    value,
  }));

  console.log({ GLOBAL_DATA, indicators, data, lookups, indicator });
</script>

<Titleblock
  breadcrumb={[
    { label: "Home", url: "/" },
    { label: "Explore subnational statistics", url: `${base}/` },
    { label: "Expore indicators", url: `${base}/indicators` },
    { label: "topic" },
  ]}
>
  <Headline>{""}</Headline>
  <Subhead>{"Topic information"}</Subhead>
</Titleblock>

<SectionsWithNav contentsLabel="Explore this indicator">
  <section title="Get the data">
    <h2 class="ons-u-mt-xl">Get the data</h2>
    <p>Here, you can find information and links to the data.</p>
  </section>

  <div>
    <Table data={tableData} columns={tableColumns} />
  </div>
</SectionsWithNav>

<style>
  section {
    margin-bottom: 80px;
  }
</style>
