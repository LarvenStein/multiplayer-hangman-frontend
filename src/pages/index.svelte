<script>
  import { apiUrl, nicknameKey, roomCodeKey, userIdKey } from '../config.ts'
  import { goto } from '@roxi/routify'

  export let exsistingRoomCode
  exsistingRoomCode = localStorage.getItem(roomCodeKey)

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
  {#if exsistingRoomCode != undefined}
    <a class="join-again" href="/join/{exsistingRoomCode}">
      Do you want to join {exsistingRoomCode} again?
    </a>
  {/if}
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
  @media only screen and (max-width: 768px) {
  h1 {
    font-size: 96px !important;
  }
}
  .buttons:hover > .big:hover {
    padding: 25px 75px 25px 75px;
  }
  .buttons:hover > .big:not(:hover) {
    font-size: 0;
    padding: 0;
  }
  a:hover {
    cursor: pointer;
  }
  h1 {
    font-size: 128px;
    text-align: center;
  }
  .join-again {
    font-size: 18pt;
    text-align: center;
    padding: 15px;
    margin-bottom: -35px;
    border: 3px solid gray;
    border-top-left-radius: 255px 15px;
    border-top-right-radius: 15px 225px;
    border-bottom-right-radius: 225px 15px;
    border-bottom-left-radius: 15px 255px;
    transition: all 0.5s;
    text-decoration: none;
  }
  .join-again:hover {
    /* font-size: 40px; */
    letter-spacing: 0.5cap;
    transform: scale(1);
    background: black;
    color: white;
  }
</style>
