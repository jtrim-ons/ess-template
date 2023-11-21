<script>

export let optionsArray, chosenId, name, marginBottom = null, fontSize=null;

</script>


<div class="radio-container">

    {#each optionsArray as option,i}

        <label style="margin-bottom: {marginBottom}">

            <input 
            type="checkbox" 
            value={i} 
            name={name} 
            bind:group={chosenId} 
            >

            <p style="font-size: {fontSize}">{option}</p>
            
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
    margin: 0px 0px 5px 10px;
}

p {
    padding: 0px 0px 0px 20px;
    margin: 0px;
    font-size: 18px;
}




</style>