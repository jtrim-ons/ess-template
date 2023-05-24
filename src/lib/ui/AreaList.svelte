<script>
    import { createEventDispatcher } from "svelte";
    import { base } from "$app/paths";
    import { geoCodesLookup } from "$lib/config";
    import { makePath, capitalise } from "$lib/utils";
    import { analyticsEvent } from "$lib/layout/AnalyticsBanner.svelte";
    import Icon from "$lib/ui/Icon.svelte";

    const dispatch = createEventDispatcher();

    export let postcode;
</script>

<table class="tbl-results">
    <tbody>
        <tr>
            <td>Areas covering <strong>{postcode.postcd}</strong></td>
            <td style:text-align="right"
                ><button
                    class="btn-link no-border"
                    title="Close area list"
                    on:click={() => dispatch("clear")}
                    ><Icon type="close" /></button
                ></td
            >
        </tr>
        {#each postcode.areas as area}
            <tr>
                <td><strong>{capitalise(area.typenm)}</strong></td>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <td
                    ><a
                        href="{base}/{makePath(area.areacd)}"
                        on:click={() =>
                            analyticsEvent({
                                event: "postcodeSelect",
                                areaCode: area.areacd,
                                areaName: area.areanm,
                                areaType:
                                    geoCodesLookup[area.areacd.slice(0, 3)].label,
                            })}>{area.areanm}</a
                    ></td
                >
            </tr>
        {/each}
    </tbody>
</table>
