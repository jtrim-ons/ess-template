<script>
	
import { getContext } from 'svelte';
import Select from "./Select.svelte";
import items from "./items.json";

export let areasWithData, checkboxedRoles, selectedAreas;

let areasParentsLookup = getContext("areasParentsLookup");
let areas = getContext("areas");

let filteredAreasParentsLookup = areasParentsLookup.filter((e) => areasWithData.includes(e.areacd) & !selectedAreas.map((el) => el.data.areacd).includes(e.areacd));

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
	<Select id="multi" idKey="areacd" labelKey="areanm" groupKey="parentnm" items={filteredAreasParentsLookup} on:select={doSelectMulti} bind:value={checkboxedRoles.custom} isMulti maxSelected={4} placeholder="Add additional comparison areas"/>
</form>


<style>

form {
	padding-top: 15px;
	margin-left: 15px;
	padding-bottom: 15px;
	width: 90%;
}

</style>