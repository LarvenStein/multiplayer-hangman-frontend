<script>
  export let players
  export let colWidth
</script>

{#each players.players as player}
  {#key colWidth}
    <div style="min-width: {(colWidth - 85) / 3}px">
      <img src="https://api.multiavatar.com/{player}.svg" alt="avatar" />
      <h3>{player}</h3>
    </div>
  {/key}
{/each}

<style>
  div {
    display: flex;
    align-items: center;
    border: 2px solid gray;
    margin: 10px;
  }
  h3 {
    font-size: 18pt;
  }
  img {
    height: 50px;
    margin: 15px;
  }
</style>
