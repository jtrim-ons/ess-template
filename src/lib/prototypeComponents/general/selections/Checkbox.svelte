<script>

export let optionsArray, chosenId, name, spacing = null;

</script>


<div class="radio-container">

    {#each optionsArray as option,i}

        <label style="margin-bottom: {spacing == null ? null : spacing};">

            <input 
            type="checkbox" 
            value={i} 
            name={name} 
            bind:group={chosenId} 
            >

            <p>{option}</p>
            
        </label>

    {/each}

</div>



<style>


.radio-container {
    display: flex;
    flex-direction: column;
}

label {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0px 0px 0px 10px;
}

p {
    padding: 0px 0px 0px 20px;
    margin: 0px;
    font-size: 16px;
    line-height: 20px;
}




</style>