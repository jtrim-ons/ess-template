<script>
  import { base } from "$app/paths";

  import Titleblock from "$lib/layout/Titleblock.svelte";
  import Headline from "$lib/layout/partial/Headline.svelte";
  import Subhead from "$lib/layout/partial/Subhead.svelte";
  import SectionsWithNav from "$lib/layout/SectionsWithNav.svelte";
  import Placeholder from "$lib/layout/Placeholder.svelte";
  import { Dropdown, Table } from "@onsvisual/svelte-components";
  import { LineChart } from "@onsvisual/svelte-charts";

  import { toProperCase } from "$lib/utils.js";
  import { getContext } from "svelte";

  export let data;

  const GLOBAL_DATA = getContext("GLOBAL_DATA");
  const indicators = getContext("indicators");
  const indicatorsCalculations = getContext("indicatorsCalculations");
  const indicator = indicators.find(
    (d) => d.label === data.selectedIndicatorName
  );
  const indicatorCalculations = indicatorsCalculations.find(
    (d) => d.code === indicator.code
  );

  let lookups = {
    areaCodeToName: Object.fromEntries(
      data.areas.map((d) => [d.areacd, d.areanm])
    ),
  };

  const geogLevels = [
    ...new Set(GLOBAL_DATA.areasGeogLevel.map((d) => d.level)),
  ];
  lookups.geogLevels = Object.fromEntries(geogLevels.map((d) => [d, []]));
  GLOBAL_DATA.areasGeogLevel.forEach((d) =>
    lookups.geogLevels[d.level].push(d.areacd)
  );
  lookups.areaToGeogLevel = Object.fromEntries(
    GLOBAL_DATA.areasGeogLevel.map((d) => [d.areacd, d.level])
  );

  const indicatorAreaCodes = [...new Set(indicator.data.map((d) => d.areacd))];
  const indicatorDates = [];
  for (
    let i = +indicatorCalculations.minXDomain;
    i <= +indicatorCalculations.maxXDomain;
    i++
  ) {
    indicatorDates.push("" + i);
  }
  const indicatorDataLookupByPlaceAndDate = {};
  for (let d of indicator.data) {
    indicatorDataLookupByPlaceAndDate[`${d.areacd}::${d.xDomainNumb}`] = d;
  }

  const tableColumns = [{ key: "areanm", label: "Place" }];
  for (
    let i = +indicatorCalculations.minXDomain;
    i <= +indicatorCalculations.maxXDomain;
    i++
  ) {
    tableColumns.push({
      key: "" + i,
      label: "" + i,
      numeric: true,
      sortable: true,
    });
  }

  const tableData = [];
  for (let areacd of indicatorAreaCodes) {
    const tableRow = { areacd, areanm: lookups.areaCodeToName[areacd] };
    for (let date of indicatorDates) {
      tableRow[date] =
        indicatorDataLookupByPlaceAndDate[`${areacd}::${date}`]?.value;
    }
    tableData.push(tableRow);
  }

  const lineChartData = [];
  for (let areacd of indicatorAreaCodes) {
    for (let date of indicatorDates) {
      if (indicatorDataLookupByPlaceAndDate[`${areacd}::${date}`] != null) {
        lineChartData.push({
          date: +date,
          areacd,
          areanm: lookups.areaCodeToName[areacd],
          value: +indicatorDataLookupByPlaceAndDate[`${areacd}::${date}`].value,
        });
      }
    }
  }

  const geogLevelOptions = geogLevels.map((d) => ({ id: d, label: d }));
  let selectedAreaType; // = geogLevelOptions[0];
  $: console.log(selectedAreaType);
  $: filteredTableData = selectedAreaType
    ? tableData.filter(
        (d) => lookups.areaToGeogLevel[d.areacd] === selectedAreaType.id
      )
    : tableData;
  $: filteredLineChartData = selectedAreaType
    ? lineChartData.filter(
        (d) => lookups.areaToGeogLevel[d.areacd] === selectedAreaType.id
      )
    : lineChartData;
  $: console.log(filteredTableData);

  console.log({
    GLOBAL_DATA,
    indicators,
    data,
    lookups,
    indicator,
    indicatorCalculations,
  });
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

  <section title="Time series">
    <h2 class="ons-u-mt-xl">Time series</h2>
    <div>
      <Dropdown options={geogLevelOptions} bind:value={selectedAreaType} />
      {filteredLineChartData.length}
      <!-- TODO: remove the unnecessary key block around this -->
      {console.log({ filteredLineChartData })}
      {#if filteredLineChartData.length < 100}
        {#key filteredLineChartData}
          <div class="chart-container">
            <!-- <LineChart
              data={[filteredLineChartData[10], filteredLineChartData[11]]}
              xKey="date"
              yKey="value"
              zKey="areanm"
              title="Line chart example"
              footer="Source: ONS."
              legend={true}
            /> -->
          </div>
        {/key}
      {/if}
    </div>
  </section>

  <div class="chart-container">
    <LineChart
      data={[
        { year: 2017, value: 320, group: "apples" },
        { year: 2017, value: 480, group: "bananas" },
        { year: 2017, value: 640, group: "cherries" },
        { year: 2017, value: 400, group: "dates" },
        { year: 2018, value: 640, group: "apples" },
        { year: 2018, value: 960, group: "bananas" },
        { year: 2018, value: 640, group: "cherries" },
        { year: 2018, value: 400, group: "dates" },
        { year: 2019, value: 1600, group: "apples" },
        { year: 2019, value: 1440, group: "bananas" },
        { year: 2019, value: 960, group: "cherries" },
        { year: 2019, value: 400, group: "dates" },
        { year: 2020, value: 3840, group: "apples" },
        { year: 2020, value: 1920, group: "bananas" },
        { year: 2020, value: 960, group: "cherries" },
        { year: 2020, value: 400, group: "dates" },
      ]}
      xKey="year"
      yKey="value"
      zKey="group"
      title="Simple line chart"
      footer="Source: ONS."
      mode="default"
      legend
    />
  </div>

  <section title="Table">
    <h2 class="ons-u-mt-xl">Table</h2>
    <div>
      <Dropdown options={geogLevelOptions} bind:value={selectedAreaType} />
      {filteredTableData.length}
      {#key filteredTableData}
        <!-- A hack to re-create the table -->
        <Table data={filteredTableData} columns={tableColumns} />
      {/key}
    </div>
  </section>
</SectionsWithNav>

<style>
  section {
    margin-bottom: 80px;
  }

  .chart-container {
    height: 500px;
  }
</style>
