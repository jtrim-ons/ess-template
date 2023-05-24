<script>
    export let height = 400;
    export let margin = 40;
</script>

<div class="placeholder-container" style:height="{height}px" style:margin-bottom="{margin}px">
    <slot/>
</div>

<style>
    .placeholder-container {
        display: block;
        width: 100%;
        background-color: #eee;
        color: grey;
        padding: 12px;
    }
</style>