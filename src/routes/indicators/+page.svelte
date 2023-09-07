<script>
    import { base } from "$app/paths";

    import Titleblock from "$lib/layout/Titleblock.svelte";
    import Headline from "$lib/layout/partial/Headline.svelte";
    import Subhead from "$lib/layout/partial/Subhead.svelte";
    import TopicNav from "./TopicNav.svelte";
</script>

<Titleblock breadcrumb={[{label: "Home", url: "/"}, {label: "Explore subnational statistics", url: `${base}/`}, {label: "Expore topics"}]}>
    <Headline>Explore topics</Headline>
    <Subhead>Discover national and regional trends with maps, charts and headline indicators</Subhead>
</Titleblock>
<TopicNav open/>
