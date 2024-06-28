<script>
  import { roomCodeKey, apiUrl, userIdKey } from '../../config.ts'
  import ResultCard from '../../components/resultCard.svelte'
  export let roundStates
  let roomCode = localStorage.getItem(roomCodeKey)
  let userId = localStorage.getItem(userIdKey)

  async function populatePage() {
    const res = await fetch(`${apiUrl}/games/${roomCode}/rounds/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'x-user-id': userId,
      },
    })
    const data = await res.json()
    roundStates = data
  }
</script>

<main>
  {#await populatePage() then}
    <header>
      <h2>The hangman game</h2>
      <h1>Game Summary</h1>
      <a href="/lobby" class="big">Back to the lobby</a>
      <!--TODO when API is updated-->
    </header>
    <h2>Rounds overview:</h2>
    {#each roundStates as roundState}
      <ResultCard {roundState} />
    {/each}
  {/await}
</main>

<style>
  main {
    justify-content: start;
    height: auto !important;
  }
  header {
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
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
</style>
