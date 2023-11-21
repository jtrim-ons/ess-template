<script>

import { getContext } from 'svelte';
import Dropdown from "$lib/prototypeComponents/general/selections/Dropdown.svelte";

let selectedArea = getContext("selectedArea");

export let chosenId, optionsArray, name, text, dropdownWidth;

let componentWidth = 500;

</script>

<div class="paragraph-container" bind:clientWidth={componentWidth}>

    <p style="max-width: {componentWidth-dropdownWidth-20}px">{text}</p>

    <div class="dropdown-container">

        <Dropdown
        {name}
        bind:chosenId={chosenId}
        {optionsArray}
        width={dropdownWidth+"px"}
        lowHeight={true}
        ></Dropdown>

    </div>

</div>



<style>

p {
    margin: 0px;
    padding: 0px;
    text-wrap: balance;
}

.dropdown-container {
    margin: 0px 0px 0px 10px;
    padding: 0px 2px 0px 2px;
}

.paragraph-container {
    margin: 0px 0px 0px 0px;
    padding: 5px 0px 5px 0px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;  
    align-items: center;  
}




</style>