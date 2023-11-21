<script>

import ChooseSelection from "$lib/prototypeComponents/topics/keyIndicators/ChooseSelection.svelte";
import Key from "$lib/prototypeComponents/topics/keyIndicators/options/timeSeries/Key.svelte";
import Grid from "$lib/prototypeComponents/topics/keyIndicators/options/timeSeries/Grid.svelte";
import { getContext } from 'svelte';

export let indicatorsList, latestData, initialData, otherData, checkboxedRoles, chosenId0;

let chosenId1 = 0;
let chosenId2 = 2;
let chosenId3 = [];

let areasParentsLookup = getContext("areasParentsLookup");

let regions = areasParentsLookup.filter((e) => ["K02000001", "E92000001"].includes(e.parentcd) & e.areacd != "E92000001");

$: selectedAreas = chosenId1 === 0 ? regions: (checkboxedRoles.custom == null || checkboxedRoles.custom == undefined) ? [] : checkboxedRoles.custom;

</script>


<div class="key-indicators-dot-plot-boxes-option-2-container">

    <ChooseSelection
    radioName="timeSeriesRadio"
    {latestData}
    bind:checkboxedRoles={checkboxedRoles}
    bind:chosenId={chosenId1}
    ></ChooseSelection>

    <div class="key-and-selections-container">

        <Key
        ></Key>

    </div>

    <Grid
    {indicatorsList}
    {latestData}
    {initialData}
    {otherData}
    {selectedAreas}
    {chosenId1}
    {chosenId2}
    {chosenId3}
    {chosenId0}
    ></Grid>

</div>


<style>

.key-and-selections-container {
    display: flex;
    flex-direction: row;
    margin: 20px 0px 10px 0px;
}


</style>

<!-- 
<div class="key-indicators-coloured-boxes-option-1-container">

    <ChooseSelection
    {latestData}
    bind:checkboxedRoles={checkboxedRoles}
    bind:chosenId={chosenId1}
    ></ChooseSelection>

    <div class="key-and-selections-container">


        <Key
        chosenId=1
        ></Key>

    </div>

    <div class="grid-container">

        <div class="row headerRow">

            <div class="areasColumn" style={"width: 200px"}>


            </div>

            {#each indicatorsList as indicatorId, i}
            
                <div class={"headerCell column"+i}>

                    <p>{indicatorsMetadata.find((el) => el.code === indicators.find((e) => e.id === indicatorId).code).label}

                </div>
            
            {/each}

        </div>

        <div class="row headerRow">

            <div class="areasColumn" style={"width: 200px"}>
            </div>

            {#each indicatorsList as indicatorId, i}
                
                    <div class={"infoCell column"+i}>

                        <svg width=20 height=20 class="c h-16 w-16 inline svelte-nloqxl" viewBox="0 0 48 48" style="transform: rotate(0deg)"><path d="M24.15 34q.65 0 1.075-.425.425-.425.425-1.075v-9.05q0-.6-.45-1.025Q24.75 22 24.15 22q-.65 0-1.075.425-.425.425-.425 1.075v9.05q0 .6.45 1.025.45.425 1.05.425ZM24 18.3q.7 0 1.175-.45.475-.45.475-1.15t-.475-1.2Q24.7 15 24 15q-.7 0-1.175.5-.475.5-.475 1.2t.475 1.15q.475.45 1.175.45ZM24 44q-4.25 0-7.9-1.525-3.65-1.525-6.35-4.225-2.7-2.7-4.225-6.35Q4 28.25 4 24q0-4.2 1.525-7.85Q7.05 12.5 9.75 9.8q2.7-2.7 6.35-4.25Q19.75 4 24 4q4.2 0 7.85 1.55Q35.5 7.1 38.2 9.8q2.7 2.7 4.25 6.35Q44 19.8 44 24q0 4.25-1.55 7.9-1.55 3.65-4.25 6.35-2.7 2.7-6.35 4.225Q28.2 44 24 44Zm0-20Zm0 17q7 0 12-5t5-12q0-7-5-12T24 7q-7 0-12 5T7 24q0 7 5 12t12 5Z"></path></svg>

                    </div>
                
                {/each}

        </div>

        <div class="row headerRow">

            <div class="areasColumn" style={"width: 200px"}>
            </div>

            {#each indicatorsList as indicatorId, i}
            
                <div class={"yearCell column"+i}>

                    <p class="latest-year-label">{indicators.find((e) => indicatorId === e.id).latestPeriod}</p>

                    {#if indicators.find((e) => indicatorId === e.id).initialPeriod != null & (chosenId3.includes(1) || chosenId2 != 0)}

                        <p class="initial-year-label">{"(compared to "+indicators.find((e) => indicatorId === e.id).initialPeriod+")"}</p>

                    {/if}

                </div>
            
            {/each}

        </div>

        {#each selectedAreas as row, j}

            <div class={"row cellRow"+j}>

                <div class="areasColumn" style={"width: 200px"}>

                    <p>{areas.find((e) => e.areacd === row.areacd).areanm}</p>    
                
                
                </div>

                {#if chosenId1 == 0}

                    {#each indicatorsList as indicatorId, i}
                    
                        <div class={"cell column"+i}>

                            <Cell
                            rowNumb={j}
                            comparisonsId={chosenId2}
                            labelsArray={chosenId3}
                            initialPeriod={indicators.find((e) => indicatorId === e.id).initialPeriod}
                            indicatorMetadata={indicatorsMetadata.find((el) => el.code === indicators.find((e) => e.id === indicatorId).code)}
                            latestData={latestData.filter((e) => indicatorId === e.id & row.areacd === e.areacd)}
                            medianValue={indicators.find((e) => indicatorId === e.id).medianValue}
                            initialData={initialData[i].filter((e) => row.areacd === e.areacd)}
                            otherData={otherData[i].filter((e) => row.areacd === e.areacd)}
                            maxValueFromMedian={indicators.find((e) => indicatorId === e.id).maxValueFromMedian}
                            ></Cell>

                        </div>
                
                    {/each}

                {:else}

                    {#each indicatorsList as indicatorId, i}
                        
                            <div class={"cell column"+i}>

                                <Cell
                                rowNumb={j}
                                comparisonsId={chosenId2}
                                labelsArray={chosenId3}
                                initialPeriod={indicators.find((e) => indicatorId === e.id).initialPeriod}
                                indicatorMetadata={indicatorsMetadata.find((el) => el.code === indicators.find((e) => e.id === indicatorId).code)}
                                latestData={latestData.filter((e) => indicatorId === e.id & row.areacd === e.areacd)}
                                medianValue={indicators.find((e) => indicatorId === e.id).medianValue}
                                initialData={initialData[i].filter((e) => row.areacd === e.areacd)}
                                otherData={otherData[i].filter((e) => row.areacd === e.areacd)}
                                maxValueFromMedian={indicators.find((e) => indicatorId === e.id).maxValueFromMedian}
                                maxChange={indicators.find((e) => indicatorId === e.id).maxChange}
                                ></Cell>

                            </div>
                    
                    {/each}

                {/if}

            </div>

        {/each}

    </div>

</div> -->

