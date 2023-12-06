<script>

export let optionsArray, chosenId, name, marginBottom = null, fontSize=null, width;

</script>

<div class="radio-container">

    {#each optionsArray as option,i}

        <label style="margin-bottom: {marginBottom}; max-width: {500}px">

            <input 
            style="display: none"
            type="radio" 
            value={i} 
            name={name} 
            bind:group={chosenId} 
            >

            <div class="optionLabel"
            style="background-color: {chosenId === i ? "white" : "#e3e3e3"}">

                <p style="font-size: {fontSize}">{option}</p>

            </div>
            
        </label>

    {/each}

</div>



<style>


.radio-container {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
    gap: 5px;
}



label {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

p {
    padding: 0px;
    margin: 0px;
    font-size: 18px;
    line-height: 24px;
}

.optionLabel {
    padding: 8px 10px 8px 10px;
    margin: 0px;
    border-radius: 5px 5px 0px 0px;
    border-style: solid;
    border-width: 1px 1px 0px 1px;
    border-color: rgb(128,128,128);
    height: 100%;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
}




</style>