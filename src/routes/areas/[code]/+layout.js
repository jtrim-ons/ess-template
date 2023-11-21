import { PUBLIC_APP_PATH } from "$env/static/public";

export const prerender =
    PUBLIC_APP_PATH &&
    (PUBLIC_APP_PATH.includes("ons") || PUBLIC_APP_PATH.includes("github"));
export const trailingSlash = "always";

import { base } from "$app/paths";
import { getData } from "$lib/utils";
import { get } from 'svelte/store';

export async function load({ fetch, params }) {


   return {areacd: params.code}
}
