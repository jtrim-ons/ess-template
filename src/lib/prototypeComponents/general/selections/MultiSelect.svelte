<script>
	
import { getContext } from 'svelte';
import Select from "./blocks/Select.svelte";
import items from "./blocks/items.json";

export let globalVisibleAreasTracker;

let areasParentsLookup = getContext("areasParentsLookup");
let areas = getContext("areas");
let selectedAndRelatedAreas = getContext("selectedAndRelatedAreas");

let filteredAreasParentsLookup = areasParentsLookup.filter((e) => !selectedAndRelatedAreas.map((el) => el.areacd).includes(e.areacd));

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
	<Select id="multi" idKey="areacd" labelKey="areanm" groupKey="parentnm" items={filteredAreasParentsLookup} on:select={doSelectMulti} bind:value={globalVisibleAreasTracker.custom} isMulti maxSelected={4} placeholder={"Add additional comparison areas"}/>
</form>


<style>

form {
	padding: 0px;
	margin: 0px;
	width: 100%;
	font-size: 16px;
	line-height: 20px;
}

</style>