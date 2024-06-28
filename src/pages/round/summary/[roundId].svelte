<script>
  import { FallingConfetti } from 'svelte-canvas-confetti'
  import { roomCodeKey, apiUrl, userIdKey } from '../../../config.ts'
  import ResultCard from '../../../components/resultCard.svelte'
  import { goto } from '@roxi/routify'
  export let roundId
  export let roundState
  let roomCode = localStorage.getItem(roomCodeKey)
  let userId = localStorage.getItem(userIdKey)

  async function populatePage() {
    const res = await fetch(`${apiUrl}/games/${roomCode}/rounds/${roundId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'x-user-id': userId,
      },
    })
    const data = await res.json()
    roundState = data
  }
</script>

{#await populatePage() then}
  <main>
    <header>
      <h2 id="emoji">
        {#if roundState.status == 'won'}
          🥳
          <FallingConfetti particleCount={200} />
        {:else}
          ☹️
        {/if}
      </h2>
      <h1 id="header">You {roundState.status}</h1>
      <a href="../{Number(roundId) + 1}" class="big" alt="Next round">Next round ➤</a>
    </header>
    <h2>Detailed result:</h2>
    <ResultCard {roundState} />
  </main>
{/await}

<style>
  header {
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  main {
    justify-content: flex-start !important;
  }

  h1 {
    font-size: 128px;
    margin-top: 0;
    text-align: center;
  }
  @media only screen and (max-width: 768px) {
  h1 {
    font-size: 96px !important;
  }
  header {
    height: auto;
    justify-content: unset;
  }
}
  #emoji {
    margin-bottom: -35px;
    font-size: 64px;
  }
</style>
