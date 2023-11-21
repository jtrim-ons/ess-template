<script>

export let chosenId, name="", optionsArray, width = null, lowHeight = false;

</script>



<div class="ons-field" style={"width: "+width}>

    <select
    style="text-wrap: wrap;"
    id={name}
    name={name}
    class={"ons-input ons-input--select"+(lowHeight ? " low-height" : "") }
    bind:value="{chosenId}"
    >

    {#each optionsArray as option, i}

        <option value="{option}">{option}</option>
        
    {/each}

    </select>
</div>
  
<style>

.low-height {
  padding: 2px 2px 2px 5px;
}


.ons-input--select {
    border-color: currentColor;
    background-color: transparent;
}

</style>