<script>
  import { each } from 'svelte/internal'

  export let roundState
</script>

<div class="failed-guesses">
  <h2>Failed guesses:</h2>
  <ul>
    {#each roundState.wrongLetters as letter}
      <li>{letter}</li>
    {/each}
  </ul>
</div>

<style>
  .failed-guesses,
  h2 {
    font-size: 28px;
  }
</style>
