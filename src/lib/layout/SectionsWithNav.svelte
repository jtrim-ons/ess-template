<script>
    import { onMount } from "svelte";
    import BackToContents from "./partial/BackToContents.svelte";
    export let contentsLabel = "Page contents";

    let container;
    let sections;
    let active;
    let links = [];
    let backlinks = [];
    let tocId;

    function init() {
        tocId = `toc-${Math.floor(Math.random() * 1e5)}`;
        const y = container.clientHeight / 2;
        const observer = new IntersectionObserver((entries, observer) => {
            for (let i = 0; i < entries.length; i ++) {
                if (entries[i].isIntersecting) {
                    active = entries[i].target.id;
                    break;
                }
            }
        }, {
            root: null,
            rootMargin: `0% 0% -70% 0%`,
            threshold: 0
        });
        
        sections = container.querySelectorAll("section");
        sections.forEach((section, i) => {
            const label = section.title;
            const slug = label.toLowerCase().replaceAll(" ", "-");
            section.id = slug;
            if (i === 0) active = slug;
            backlinks = [...backlinks, new BackToContents({props: {tocId}, target: section})];
            links = [...links, {label, slug}];
            observer.observe(section);
        });

        return {
            destroy() {
                backlinks.forEach(link => link.$destroy());
                links = [];
                backlinks = [];
            }
        }
    }

    onMount(init);
</script>

<div class="ons-page__container ons-container">
    <div class="ons-grid ons-js-toc-container ons-u-ml-no">
        <slot name="header"/>
        <div
            class="ons-grid__col ons-col-4@m ons-u-pl-no ons-grid__col--sticky@m"
            id="{tocId}"
        >
            <aside class="ons-toc-container" role="complementary">
                <nav class="ons-toc" aria-label="Pages in this guide">
                    {#if contentsLabel}
                    <h2 class="ons-toc__title ons-u-fs-r--b ons-u-mb-s">
                        {contentsLabel}
                    </h2>
                    {/if}
                    <ol class="ons-list ons-u-mb-m ons-list--dashed">
                        {#each links as link}
                        <li class="ons-list__item">
                            <a
                                href="#{link.slug}"
                                class="ons-list__link"
                                class:ons-toc__link-active={link.slug === active}>
                                {link.label}
                            </a>
                        </li>
                        {/each}
                    </ol>
                </nav>
            </aside>
        </div>
        <div class="ons-grid__col ons-col-8@m ons-u-pl-no" bind:this={container}>
            <slot/>
        </div>
        <slot name="footer"/>
    </div>
</div>
