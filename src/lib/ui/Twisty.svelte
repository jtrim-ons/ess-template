<script>

export let cross = false
export let label = "Label";
export let blank = false;
export let open = false;

</script>

<details class={"ons-collapsible ons-js-collapsible"+(cross ? " details_styling_override": "")} {open}>
    {#if !open}
    <summary class="ons-collapsible__heading ons-js-collapsible-heading">

            <h3 class={"ons-collapsible__title"+(cross ? " title_styling_override": "")}>
                {label}
            </h3>

        <span class="ons-collapsible__icon">
            <svg
                class="ons-svg-icon"
                viewBox="0 0 8 13"
                xmlns="http://www.w3.org/2000/svg"
                focusable="false"
            >
                <path
                    class={(cross ? " path_styling_override": "")}
                    d={cross ? "M0 7.5 l8 0 M 4 3.5 l0 8": "M5.74,14.28l-.57-.56a.5.5,0,0,1,0-.71h0l5-5-5-5a.5.5,0,0,1,0-.71h0l.57-.56a.5.5,0,0,1,.71,0h0l5.93,5.93a.5.5,0,0,1,0,.7L6.45,14.28a.5.5,0,0,1-.71,0Z"}
                    transform={cross ? null : "translate(-5.02 -1.59)"}
                />
            </svg>
        </span>
    </summary>
    {/if}
    <div class="{!blank ? "ons-collapsible__content ons-js-collapsible-content"+(cross ? " beeswarm_padding": "") : ""}">
        <slot/>
    </div>
</details>

<style>

.details_styling_override[open] summary {
    display: none;
}

.ons-collapsible__content {

    border-left: 0px;
    display: block;
    margin: 0px;
    padding: 20px 0px 0px 0px;
}

.beeswarm_padding {
    padding: 0px;
}

.title_styling_override {
    font-size: 0.9rem;
}

.path_styling_override {
    stroke: #206095;
    fill: none;
    stroke-width: 1.5px;
}



</style>