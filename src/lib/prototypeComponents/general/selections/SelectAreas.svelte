<script>
	
import { getContext } from 'svelte';
import Select from "$lib/prototypeComponents/general/selections/blocks/Select.svelte";
import items from "$lib/prototypeComponents/general/selections/blocks/items.json";

export let areasWithData, checkboxedRoles, colors = 4, placeholderText = "Select areas";

let areasParentsLookup = getContext("areasParentsLookup");
let areas = getContext("areas");

let filteredAreasParentsLookup = areasParentsLookup.filter((e) => areasWithData.includes(e.areacd));

filteredAreasParentsLookup.forEach((el) => {

	el.areanm = areas.find((e) => e.areacd === el.areacd).areanm;
	el.parentnm = areas.find((e) => el.parentcd === e.areacd) === undefined ? "" : areas.find((e) => el.parentcd === e.areacd).areanm;
})

// Multi-select
let selectedMulti = [];
function doSelectMulti(event) {
	selectedMulti = event.detail ? event.detail : [];
}

</script>

<form>
	<Select id="multi" idKey="areacd" labelKey="areanm" groupKey="parentnm" items={filteredAreasParentsLookup} on:select={doSelectMulti} bind:value={checkboxedRoles.custom} isMulti maxSelected={colors.length} placeholder={placeholderText} {colors}/>
</form>


<style>

form {
	padding: 0px;
	margin: 5px 0px 5px 10px;
	width: calc(100% - 30px);
}

</style>