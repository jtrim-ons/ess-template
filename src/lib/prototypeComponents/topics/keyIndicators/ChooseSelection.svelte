<script>

import SelectAreas from "$lib/prototypeComponents/general/selections/SelectAreas.svelte";
import Radio from "$lib/prototypeComponents/general/selections/Radio.svelte";

export let latestData, checkboxedRoles, chosenId, radioName;

let optionsArray = ["Compare countries and regions of the UK", "Select local areas of interest"];

let areasWithData = [...new Set(latestData.map((e) => e.areacd))];

</script>

<div class="selection-box-container">

    <Radio
    {optionsArray}
    name={radioName}
    bind:chosenId={chosenId}
    ></Radio>

    {#if chosenId === 1} 

        <div class="select-areas-container">

            <SelectAreas
            {areasWithData}
            bind:checkboxedRoles={checkboxedRoles}
            colors={Array.from({ length: 8 }, () => "#003C57")}
            ></SelectAreas>



        </div>
    {/if}

</div>




    
<style>

.selection-box-container {
    margin: 0px;
    padding: 10px 0px 10px 10px;
    display: flex;
    flex-direction: column;
    background-color:#F5F5F6;
    border-radius: 10px;
}

</style>