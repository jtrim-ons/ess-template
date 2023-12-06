<script>

import { getContext } from 'svelte';
import Dropdown from "$lib/prototypeComponents/general/selections/Dropdown.svelte";

let selectedArea = getContext("selectedArea");

export let chosenId, optionsArray, name, text, width;

</script>

<div class="paragraph-container">

    <p>{@html text}</p>

    <div class="dropdown-container">

        <Dropdown
        {name}
        bind:chosenId={chosenId}
        width="{Math.min(width-20, chosenId.toString().length*20)}px"
        {optionsArray}
        lowHeight={true}
        ></Dropdown>

    </div>

</div>



<style>

p {
    margin: 0px;
    padding: 0px;
    font-size: 16px;
}

.dropdown-container {
    margin: 0px;
    padding: 0px 2px 0px 2px;
}

.paragraph-container {
    width: 100%;
    margin: 0px 0px 0px 0px;
    padding: 5px 0px 5px 0px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;  
    gap: 10px;
}




</style>