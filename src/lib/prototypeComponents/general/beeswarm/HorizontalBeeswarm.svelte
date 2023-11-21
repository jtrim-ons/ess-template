<script>

import HorizontalBeeswarmSVG from "$lib/prototypeComponents/general/beeswarm/HorizontalBeeswarmSVG.svelte";

export let data, name, medianValue, metadata, index, checkboxedRoles, deviations, medianAbsoluteDeviation, col1Width, outerPadding, chartWidth, chartHeight, spaceForAreasBeyondScale, y, yDomain, xDomainArray, xDomainGlobal, x, height, width, hoverIndex, chosenId3;

let rowHeight = 100;

</script>

<div class="row" bind:clientHeight={rowHeight} style="background-color: {index % 2 === 0 ? "#fafafa" : "#ffffff"}">

    <p class="col1" style="width: {col1Width}">{name}</p>

    <HorizontalBeeswarmSVG
    width={width-col1Width}
    {index}
    {outerPadding}
    {data}
    {medianValue}
    {medianAbsoluteDeviation}
    {metadata}
    {y}
    {x}
    {height}
    bind:xDomainGlobal={xDomainGlobal}
    {checkboxedRoles}
    bind:hoverIndex={hoverIndex}
    {chartHeight}
    {chartWidth}
    {spaceForAreasBeyondScale}
    showGroupMedianLine={true}
    {rowHeight}
    {chosenId3}
    ></HorizontalBeeswarmSVG>

</div>




<style>

.row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    border-top-style: solid;
    border-top-color: #cbd5e1;
    border-top-width: 1px;
    
}


.col1 {
    padding: 20px 0px 20px 5px;
    font-size: 16px;
    line-height: 20px;
    margin: auto 0px auto 0px;
}





</style>
