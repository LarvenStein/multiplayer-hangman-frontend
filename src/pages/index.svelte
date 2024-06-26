<script>
  import { apiUrl } from '../config.ts'
  import { goto } from '@roxi/routify'

  async function generateRoom() {
    let roomCode
    await fetch(`${apiUrl}/games`, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((json) => (roomCode = json.roomCode))
    $goto(`./join/${roomCode}`)
  }
</script>

<main>
  <h1>The hangman game</h1>
  <div class="buttons">
    <a class="big" on:click={() => generateRoom()}>Create room</a>
    <a class="big" href="join">Join room</a>
  </div>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
  }
  a:hover {
    cursor: pointer;
  }
  h1 {
    font-size: 128px;
    text-align: center;
  }
</style>
