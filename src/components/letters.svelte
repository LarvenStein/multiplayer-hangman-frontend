<script>
  export let roundState
</script>

<div class="letters">
  {#each roundState.guessedWord as letter}
    <div class="letter">
      {letter}
    </div>
  {/each}
</div>

<style>
  .letters {
    text-align: center;
    margin: 25px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .letter {
    font-size: 50px;
    width: auto;
    margin: 10px;
  }
</style>
