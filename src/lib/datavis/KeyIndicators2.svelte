<script>

import RoboSentences from "./RoboSentences.svelte";

export let data, keyIndicatorBlocks, countByGeoLevel, countOfNulls, areaType, mainAreaNameStyled, ukAreaNameStyle, countryAreaNameStyled, parentAreaNameStyle;

$: console.log(keyIndicatorBlocks)

</script>

<div class="keyIndicatorsContainer">

{#each keyIndicatorBlocks as block, i} 

<div class="indicatorContainer">

    <div class="left">

    <h3>{block.indicator.label}</h3>
    <h1>{("prefix" in block.indicator ? block.indicator.prefix : "")+Math.round(data.main.value[block.code+"_"+block.indicator.years[1]]).toLocaleString()+("suffix" in block.indicator ? block.indicator.suffix : "") }</h1>

    {#if block.indicator.subText} 

    <h5>{block.indicator.subText}</h5>

    {/if}



    </div>

    <div class="right">

    <RoboSentences
    {data}
    {countOfNulls}
    {areaType}
    {mainAreaNameStyled}
    {countryAreaNameStyled}
    {ukAreaNameStyle}
    {parentAreaNameStyle}
    {block}
    {countByGeoLevel}
    ></RoboSentences>
    
    
    </div>

    </div>

{/each}

</div>

<style>

.keyIndicatorsContainer {
    margin-bottom: 100px;
}

.indicatorContainer {
    margin-top: 15px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: solid black 1px;
    padding-bottom: 20px;
    align-content: space-between;
    
}

.left {
    margin-right: 35px;
    min-width: 40%;
}

.right {
}

h3 {
    margin-bottom: 0px;
    margin-top: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
}

h1 {
    line-height: 54px;
    font-size: 50px;
    margin-top: 0px;
    margin-bottom: 0px;
    padding-bottom: 0px;
    padding-top: 10px;
}


</style>