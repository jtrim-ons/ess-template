<script>

import Twisty from "$lib/ui/Twisty.svelte";
import Selections from "./SelectComparisonComponents/Selections.svelte";

export let selectedAreas, areasWithData, checkboxedRoles, includeSiblings = true, selectedArea, parentArea;

let comparisonAreaOptionsArray = selectedAreas.map((e) => e.role);

let open = false;

$: console.log(selectedAreas)


</script>


<div class={"twisty-container"}>

    <Twisty label={"Add areas to compare to "+selectedArea} {open}>

        <div class="comparisonInputContainer">

            <p>Parent areas</p>

            {#each selectedAreas as input, i}
        
                <label>
                    <input type="checkbox" bind:checked={checkboxedRoles[input.role]} />{input.areanm}
                </label>
        
            {/each}

            {#if includeSiblings}

            <p>Related areas</p>

                {#each ["neighbour", "cluster"] as input,i}

                    <label>
                        <input type="checkbox" bind:checked={checkboxedRoles[input]} />{input === "neighbour" ? "Other areas in "+parentArea : "Statistically similar areas"}
                    </label>
            
                {/each}

            {/if}

            <Selections
            {selectedAreas}
            {areasWithData}
            bind:checkboxedRoles={checkboxedRoles}
            ></Selections>


        
        </div>

    </Twisty>

</div>

<style>


.twisty-container {
    padding: 5px 0px 0px 10px;
    margin: 10px 0px 15px 0px;

}

p {
    margin: 0px;
    padding: 10px 0px 0px 10px;
}

.comparisonInputContainer :global() {
    margin-left: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
    padding-left: 20px;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    flex-direction: column;
    background-color:#F5F5F6;
    border-radius: 10px;
    margin-top: 0px;
    padding-bottom: 10px;

}

label {
    padding-left: 20px;
    padding-top: 10px;
    font-size: 18px;
    cursor: pointer;


}

input[type="checkbox"] 
{ 
    margin-right: 10px; 
    transform: scale(1.2);
    cursor: pointer;
}




</style>