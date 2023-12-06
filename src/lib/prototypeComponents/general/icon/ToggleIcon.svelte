<script>

export let twistyOpen, hover;


</script>



<div class="infoCell">

    <svg width=20 height=20 viewBox="0 0 20 20">

        {#if twistyOpen}

            <path
            d="M0 5 L10 15 L20 5"
            stroke="#222"
            fill="none"
            stroke-width="3px"
            ></path>  

        {:else} 

            <path
            d="M5 0 L15 10 L5 20"
            stroke={hover ? "#222" : "#206095"}
            fill="none"
            stroke-width="3px"
            ></path>

        {/if}
    
    </svg>

</div>





<style>


.infoCell {
    margin: 0px 5px 0px 0px;
    width: 25px;
    height: 25px;
    display: inline-block;
    position: relative;
}

svg {
    vertical-align: middle;
    overflow: visible;
}






</style>