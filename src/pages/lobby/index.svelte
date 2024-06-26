<script>
  import { nicknameKey, roomCodeKey, apiUrl, userIdKey } from '../../config.ts'
  export let roomCode = localStorage.getItem(roomCodeKey)
  export let nickname = localStorage.getItem(nicknameKey)
  export let joinUrl = `${window.location.origin}/join/${roomCode}`
  let userId = localStorage.getItem(userIdKey)
  export let isGameLeader
  export let adminData
  let wordList = 1 // tempoary

  async function getPlayers() {
    const res = await fetch(`${apiUrl}/games/${roomCode}/players`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'x-user-id': userId,
      },
    })
    const data = await res.json()
    isGameLeader = data.isPlayerGameLeader
    return data
  }

  async function getAdminData() {
    if (adminData != undefined) return adminData
    const res = await fetch(`${apiUrl}/games/${roomCode}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'x-user-id': userId,
      },
    })
    const data = await res.json()
    adminData = data
    return data
  }

  async function updateGameSettings() {
    let maxPlayers = document.querySelectorAll('.content div input')[0].value
    let rounds = document.querySelectorAll('.content div input')[1].value
    const res = await fetch(`${apiUrl}/games/${roomCode}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-user-id': userId,
      },
      body: JSON.stringify({
        rounds: rounds,
        maxPlayers: maxPlayers,
        wordList: wordList,
        newGameLeader: userId,
      }),
    })
    adminData = await res.json()
  }
</script>

<main>
  <div class="top">
    <!--Top Row-->
    <h2>{nickname}</h2>
    <h1>The hangman game | <span on:click={() => navigator.clipboard.writeText(joinUrl)}>{roomCode}</span></h1>
  </div>
  <div class="center">
    {#await getPlayers()}
      <div class="col full">
        <p>loading...</p>
      </div>
    {:then players}
      <div class="col" data-full={!isGameLeader}>
        <h2>Players</h2>
        <div class="content grid">
          {#each players.players as player}
            <h3>{player}</h3>
          {/each}
        </div>
      </div>
      {#if isGameLeader}
        {#await getAdminData()}
          <div class="col">
            <p>loading...</p>
          </div>
        {:then adminData}
          <div class="col">
            <h2>Settings</h2>
            <div class="content">
              <div>
                <label for="">Room Size</label><br />
                <input type="number" max="25" value={adminData.maxPlayers} />
              </div>
              <div>
                <label for="">Rounds</label><br />
                <input type="number" max="25" value={adminData.rounds} />
              </div>
              <div>
                <button on:click={() => updateGameSettings()}>Save</button>
              </div>
            </div>
          </div>
          <div class="col">
            <h2>Wordlist</h2>
          </div>
        {/await}
      {/if}
    {/await}
  </div>
</main>

<style>
  main {
    width: 100%;
  }
  .top {
    width: 75%;
    text-align: center;
    border: 3px solid gray;
    border-top-left-radius: 255px 15px;
    border-top-right-radius: 15px 225px;
    border-bottom-right-radius: 225px 15px;
    border-bottom-left-radius: 15px 255px;
    /* border-image: url(https://chr15m.github.io/DoodleCSS/border.svg) 10 10 10 10 stretch stretch; */
  }
  h1 {
    margin-top: 0;
  }

  .top h2 {
    margin-bottom: 0;
    text-align: center;
  }
  .top span {
    cursor: pointer;
    transition: all 0.5s;
  }
  .top span:hover {
    font-size: 20pt;
  }
  .center {
    width: 75%;
    max-height: 50%;
    display: flex;
    justify-content: center;
    border: 3px solid gray;
    border-top-left-radius: 255px 15px;
    border-top-right-radius: 15px 225px;
    border-bottom-right-radius: 225px 15px;
    border-bottom-left-radius: 15px 255px;
  }
  .col {
    width: 33%;
    border-right: 3px solid gray;
    border-top-right-radius: 15px 225px;
    border-bottom-right-radius: 225px 15px;
  }
  .col[data-full='true'] {
    width: 100% !important;
  }
  .col .content {
    margin: 25px;
    max-height: 75%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));

    /* grid-template-columns: 50% 100%; */
  }
  .content h3 {
    font-size: 18pt;
  }
  .col h2 {
    text-align: center;
    border-bottom: 3px solid gray;
    border-bottom-right-radius: 225px 15px;
    border-bottom-left-radius: 15px 255px;
  }
  div button,
  div input {
    width: 100%;
    margin-top: 25px;
  }
  input {
    height: 50px;
    font-size: 35px;
    border-top: none;
    border-left: none;
    border-right: none;
    font-weight: bolder;
  }
</style>
