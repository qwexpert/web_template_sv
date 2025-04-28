<script lang="ts">
	import { onMount } from "svelte";
	import { scale } from "svelte/transition";
	import AuthForm from "$lib/components/AuthForm.svelte";
	import Draggable from "$lib/components/Draggable.svelte";
	import { authStore } from "$lib/stores/Auth";

    let isPortrait = false

    function checkScreenRatio() {
        isPortrait = window.innerHeight > window.innerWidth
    }

	onMount(() => {
		authStore.checkAuth();
        checkScreenRatio()

        window.addEventListener('resize', checkScreenRatio);
		
		return () => window.removeEventListener('resize', checkScreenRatio)
    })

</script>

{#if !isPortrait}
    {#if !$authStore.authenticated}
        <Draggable initialX={400} initialY={150}>
            <div transition:scale>
                <AuthForm />
            </div>
        </Draggable>  
    {/if}
{:else}
    {#if !$authStore.authenticated}
        <div transition:scale>
            <AuthForm />
        </div>
            
    {/if}
{/if}
