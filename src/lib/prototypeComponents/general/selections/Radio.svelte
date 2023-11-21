<script>

export let optionsArray, chosenId, name, marginBottom = null, fontSize=null, asButtons = false;

</script>

<div class="radio-container" style="flex-direction: {asButtons ? "row" : "column"}">

    {#each optionsArray as option,i}

        <label style="margin-bottom: {marginBottom}">

            <input 
            style={"display: "+(asButtons ? "none" : null)}
            type="radio" 
            value={i} 
            name={name} 
            bind:group={chosenId} 
            >

            {#if asButtons}

                <div class="optionLabel"
                style={"background-color: "+(chosenId === i ? "white" : "#e3e3e3")}>

                    <p style="font-size: {fontSize}">{option}</p>

                </div>

            {:else}

                <p style="font-size: {fontSize}">{option}</p>

            {/if}
            
        </label>

    {/each}

</div>



<style>


.radio-container {
    display: flex;
    flex-wrap: nowrap;
}



label {
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0px 5px 0px 0px;
}

p {
    padding: 0px 0px 0px 20px;
    margin: 0px;
    font-size: 18px;
}

.optionLabel {
    font-size: 16px;
    padding: 8px 10px 8px 10px;
    margin: 0px;
    border-radius: 5px 5px 0px 0px;
    border-style: solid;
    border-width: 1px 1px 0px 1px;
    border-color: rgb(128,128,128);
    cursor: pointer;
}

.optionLabel p {
    margin: 0px;
    padding: 0px;
}




</style>