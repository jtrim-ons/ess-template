<script>

import InfoButton from "$lib/prototypeComponents/general/info/InfoButton.svelte";
import { getContext } from 'svelte';

export let chosenId2, chosenId3, indicatorsCalculations;

let periodsLookup = getContext("periodsLookup");

</script>

<div class="row headerRow">

    <div class="areasColumn" style={"width: 200px"}>


    </div>

    {#each indicatorsCalculations as calculations, i}
    
        <div class={"headerCell column"+i}>

            <p>{calculations.label}

        </div>
    
    {/each}

</div>

<div class="row headerRow">

    <div class="areasColumn" style={"width: 200px"}>
    </div>

    {#each indicatorsCalculations as calculations, i}
        
            <InfoButton>


            </InfoButton>
        
    {/each}

</div>

<div class="row headerRow">

    <div class="areasColumn" style={"width: 200px"}>
    </div>

    {#each indicatorsCalculations as calculations, i}
    
        <div class={"yearCell column"+i}>

            <p class="latest-year-label">{periodsLookup.find((e) => e.xDomainNumb == calculations.maxXDomain).label}</p>

            {#if calculations.minXDomain != calculations.maxXDomain & (chosenId3.includes(1) || chosenId2 != 0)}

                <p class="initial-year-label">{"(compared to "+periodsLookup.find((e) => e.xDomainNumb == calculations.minXDomain).label+")"}</p>

            {/if}

        </div>
    
    {/each}

</div>




<style>

p {
    font-size: 18px;
    line-height: 20px;
}

.row {
    display: flex;
    flex-direction: row;
    margin: 5px 0px 0px 0px;
}

.cell {
    width: 60px;
    margin: 0px 10px 0px 10px;
}

.headerRow {
    margin: 0px 0px 10px 0px;
}

.headerCell {
    margin: 0px 10px 0px 10px;
    width: 60px;
    height: 220px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
    justify-content: flex-end;
}

.headerCell p {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(-180deg);
    margin: 0px;
    padding: 0px;
}

.yearCell {
    margin: 0px 10px 0px 10px;
    width: 60px;
    text-align: center;
}

.latest-year-label {
    font-size: 14px !important; 
    line-height: 14px !important;
    margin: 5px 0px 0px 0px;
    padding: 0px;
}

.initial-year-label {
    font-size: 10px !important;
    line-height: 10px !important;
    margin: 5px 0px 0px 0px;
    padding: 0px;
}

.areasColumn {
    display: flex;
    flex-direction: row;
    align-content: center;
    flex-wrap: wrap;
    justify-content: flex-end;
}

.areasColumn p {
    padding: 0px 10px 0px 0px;
    margin: 0px;
    text-align: end;
}






</style>