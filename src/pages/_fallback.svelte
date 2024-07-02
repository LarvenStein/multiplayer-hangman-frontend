<script>
    import {userIdKey} from "../config"
    import { goto } from "@roxi/routify";
</script>
<main>
    <h1>404</h1>
    <h2>This page could not be found<br>Here are some things you can do:</h2>
    <div>
        <button on:click={$goto("/")}>Go to homepage</button>
        <button on:click={() => history.back()}>Go to last page</button>
        {#if localStorage.getItem(userIdKey) != undefined}
            <button on:click={$goto("/lobby")}>Rejoin game</button>
        {/if}
    </div>
</main>
<style>
    h1 {
        font-size: 90pt;
        margin: 0;
    }
    h2 {
        text-align: center;
    }
    button {
        border: 2px solid rgba(0, 0, 0, 0.5);
        margin: 25px;
        padding: 15px;
    }
</style>