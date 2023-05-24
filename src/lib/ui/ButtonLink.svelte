<script>
    export let mode = "primary";
    export let icon = null;
    export let href = "#";
</script>

<a {href} role="button" class="ons-btn ons-btn--link ons-js-submit-btn" class:ons-btn--secondary={mode === "secondary"} class:ons-btn--ghost={mode === "ghost"}>
    <span class="ons-btn__inner">
        <span class="ons-btn__text">
            <slot/>
        </span>
        {#if icon}
        <svg
            class="ons-svg-icon ons-u-ml-xs"
            viewBox="0 0 17 13"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            fill="currentColor">
            {#if icon === "arrow"}
            <path
                d="m10 .2-.9.9c-.1.1-.1.4 0 .5l4 4H.6c-.2 0-.4.2-.4.4v1.2c0 .2.2.4.4.4h12.5l-3.9 3.7c-.2.2-.2.4 0 .6l.8.9c.2.2.4.2.6 0L16.8 7c.2-.2.2-.4 0-.6L10.7.3c-.3-.2-.5-.2-.7-.1z" />
            {:else if icon === "external"}
            <path
                d="M13.5,9H13a.5.5,0,0,0-.5.5v3h-9v-9h3A.5.5,0,0,0,7,3V2.5A.5.5,0,0,0,6.5,2h-4a.5.5,0,0,0-.5.5v11a.5.5,0,0,0,.5.5h11a.5.5,0,0,0,.5-.5v-4A.5.5,0,0,0,13.5,9Z"
                transform="translate(-2 -1.99)" />
            <path
                d="M8.83,7.88a.51.51,0,0,0,.71,0l2.31-2.32,1.28,1.28A.51.51,0,0,0,14,6.49v-4a.52.52,0,0,0-.5-.5h-4A.51.51,0,0,0,9,2.52a.58.58,0,0,0,.14.33l1.28,1.28L8.12,6.46a.51.51,0,0,0,0,.71Z"
                transform="translate(-2 -1.99)" />
            {:else if icon === "signout"}
            <path
                d="M13.85,7.65l-2.5-2.5a.5.5,0,0,0-.71,0,.48.48,0,0,0-.15.36V7h-3a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5h3v1.5A.49.49,0,0,0,11,11a.48.48,0,0,0,.34-.14l2.51-2.5a.49.49,0,0,0,0-.68Z"
                transform="translate(-2 -2)" />
            <path
                d="M8.5,14h-6a.5.5,0,0,1-.5-.5V2.5A.5.5,0,0,1,2.5,2h6a.5.5,0,0,1,.5.5V3a.5.5,0,0,1-.5.5h-5v9h5A.5.5,0,0,1,9,13v.5A.5.5,0,0,1,8.5,14Z"
                transform="translate(-2 -2)" />
            {/if}
        </svg>
        {/if}
    </span>
</a>
