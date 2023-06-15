<script>
	import Select from "./Select.svelte";
	import items from "./items.json";
	import { comparisonAreasArray } from "$lib/selectedAreasStore.js";

	export let areas;
	
	// Single select
	let selected = null;
	function doSelect(event) {
		selected = event.detail;
	}
	function doClear() {
		selected = null;
	}
	
	// Multi-select
	let selectedMulti = [];
	function doSelectMulti(event) {
		selectedMulti = event.detail ? event.detail : [];
	}
	
	// Postcode
	let selectedPostcode = null;
	let placeholder = "Type a place name or postcode";
	let filterText;
	
	async function getPostcodes(filterText) {
		if (filterText.length > 2 && /\d/.test(filterText)) {
			let res = await fetch(`https://api.postcodes.io/postcodes/${filterText}/autocomplete`);
			let json = await res.json();
			return json.result ? json.result.map(d => ({areacd: d, areanm: d, postcode: true})) : [];
		} else if (filterText.length > 2) {
			return items.filter(p => p.areanm.split(" ").some(t => t.toLowerCase().startsWith(filterText.toLowerCase())));
		}
		return [];
	}
	async function doSelectPostcode(e) {
		if (e.detail.postcode) {
			let res = await fetch(`https://api.postcodes.io/postcodes/${e.detail.areacd}`);
			let json = await res.json();
			if (json.result) {
				let place = items.find(item => item.areacd == json.result.codes.admin_district);
				if (place) {
					selectedPostcode = place;
					placeholder = "Type a place name or postcode";
				} else {
					selectedPostcode = null;
					placeholder = "Postcode must be in England or Wales";
				}
			}
		} else {
			selectedPostcode = items.find(item => item.areacd == e.detail.areacd);
			placeholder = "Type a place name or postcode";
		}
	}
	function doClearPostcode() {
		selectedPostcode = null;
	}

</script>

<form>
	<Select id="multi" idKey="areacd" labelKey="areanm" groupKey="parentnm" items={areas} on:select={doSelectMulti} bind:value={$comparisonAreasArray[4]} isMulti maxSelected={4} placeholder="Add additional comparison areas"/>
</form>


<style>
	form {
		padding-top: 15px;
		margin-left: 15px;
		padding-bottom: 15px;
		width: 90%;

	}

	@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');
	:global(body) {
		font-family: 'Open Sans', sans-serif;
	}
	label {
		margin: 20px 0 4px 0;
		font-weight: bold;
	}
	p {
		margin: 4px 0 20px 0;
	}
	.blue {
		margin: -8px;
		padding: 8px;
		background-color: #206095;
		color: white;
	}
</style>