<script>

export let topic;

import { getContext } from 'svelte';

let selectedArea = getContext("selectedArea");


</script>

<p>[This is dummy text]</p>

<p>{selectedArea.areanm} scores below average on more than half of {topic.name} indicators, as do neighbouring areas XXX and YYY.</p>
    
<p>{selectedArea.areanm}'s gross domestic household income per person is £400 below the national average, and is the lowest among all local authorities in the North East.</p>


<style>






</style>