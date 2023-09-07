<script>

export let optionsArray, chosenChart;


</script>

<div class="radioContainer">

    <p>Compare...</p>

    {#each optionsArray as option,i}

    <label>
        <input 
        style="display: none"
        type="radio" 
        value={i+1} 
        name="chosenChart" 
        bind:group={chosenChart} 
        >
        <div 
        class="optionLabel"
        style={"background-color: "+(chosenChart === i+1 ? "white" : "#d4d4d4")}
        >
            <p>{option.toLowerCase()}</p>
        </div>
    </label>

    {/each}
</div>

<style>

.radioContainer {
    display: flex;
    flex-direction: row;
}

p {
    font-size: 16px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 8px;
    margin: 0px 10px 0px 0px;

}

.optionLabel {
    font-size: 16px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 8px;
    padding-bottom: 8px;
    margin: 0px 10px 0px 0px;
    border-radius: 5px 5px 0px 0px;
    border-style: solid;
    border-width: 2px 2px 0px 2px;
    border-color: grey;
    cursor: pointer;
}

.optionLabel p {
    margin: 0px;
    padding: 0px;
}


</style>


