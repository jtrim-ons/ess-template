<script>

import ColouredBoxes from "$lib/prototypeComponents/topics/keyIndicators/options/ColouredBoxes.svelte";
import DotPlot from "$lib/prototypeComponents/topics/keyIndicators/options/DotPlot.svelte";
import TimeSeries from "$lib/prototypeComponents/topics/keyIndicators/options/TimeSeries.svelte";
import Radio from "$lib/prototypeComponents/general/selections/Radio.svelte";

export let indicatorsList, latestData, initialData, checkboxedRoles, otherData;

let chosenId0 = 0;

</script>


<div class="key-indicators-container">

    <ColouredBoxes
    {indicatorsList}
    {latestData}
    {initialData}
    bind:checkboxedRoles={checkboxedRoles}
    ></ColouredBoxes>

</div>

<div class="temporary-difference-options-container">

    <Radio
    optionsArray={["Scaling compared to all areas", "Scaling compared to selected areas"]}
    name="chosenComparison"
    bind:chosenId={chosenId0}
    marginBottom="0px"
    fontSize="16px"
    ></Radio>

</div>


<div class="key-indicators-container">

    <DotPlot
    {indicatorsList}
    {latestData}
    {initialData}
    bind:checkboxedRoles={checkboxedRoles}
    {chosenId0}
    ></DotPlot>

</div>


<div class="key-indicators-container">

    <TimeSeries
    {chosenId0}
    {indicatorsList}
    {latestData}
    {initialData}
    {otherData}
    bind:checkboxedRoles={checkboxedRoles}
    ></TimeSeries>

</div>

<style>

.key-indicators-container {
    margin: 0px 0px 50px 0px;
    padding: 10px 10px 15px 10px;
    border-radius: 5px;
    border-style: solid;
    border-width: 2px;
    border-color: grey;
}

.temporary-difference-options-container {
    margin: 30px 0px 10px 0px;
    padding: 10px 10px 15px 10px;
    border-radius: 5px;
    border-style: solid;
    border-width: 2px;
    border-color: grey;
}




</style>