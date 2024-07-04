<script>
  import { nicknameKey, roomCodeKey, apiUrl, userIdKey } from '../../config.ts'
  import { goto } from '@roxi/routify'
  import { checkUser } from '../../components/checkUser.js'
  import Players from '../../components/players.svelte'
  import Snackbar from 'node-snackbar'
  import * as signalR from '@microsoft/signalr';
  import {connection} from '../../signalr.js'

  export let roomCode = localStorage.getItem(roomCodeKey)
  export let nickname = localStorage.getItem(nicknameKey)
  export let joinUrl = `${window.location.origin}/join/${roomCode}`
  let userId = localStorage.getItem(userIdKey)
  export let isGameLeader
  export let adminData
  export let players
  export let colWidth
  let wordListId = 1
  let killSwitch = false

  checkUser()


  connection.on("NewPlayer", data => {
    getPlayers(data)
  });

  connection.on("GameStarted", data => {
    checkGameStarted(data)
  })

  async function getPlayers(data = undefined) {
    checkGameStarted()
    if(data == undefined) {
    const res = await fetch(`${apiUrl}/games/${roomCode}/players`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'x-user-id': userId,
      },
    })
    data = await res.json()
    isGameLeader = data.isPlayerGameLeader
  }
    players = data

    // Loop it!
    if (!killSwitch) {
      // setTimeout(() => {
      //   getPlayers()
      // }, 10000)
    }
  }

  async function checkGameStarted(data = undefined) {
    if(data == undefined) {
      const res = await fetch(`${apiUrl}/games/${roomCode}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'x-user-id': userId,
      },
    })
    data = await res.json()
    }

    if (data.status == 'playing' || data.status == undefined) {
      $goto(`../round/${data.roundId}`)
      killSwitch = true
    }
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
        wordList: wordListId,
        newGameLeader: userId,
      }),
    })
    adminData = await res.json()
    Snackbar.show({
      pos: 'bottom-right',
      text: 'Updated game Settings',
      showAction: false,
    })
  }

  async function getWordlists() {
    const res = await fetch(`${apiUrl}/wordlists`)
    const json = await res.json()
    return json
  }

  async function startGame() {
    document.querySelector("button.top").disabled = true
    // const res = await fetch(`${apiUrl}/games/${roomCode}`, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'x-user-id': userId,
    //   },
    // })
    // const json = await res.json()
    connection.invoke("StartGame", roomCode, userId);
    Snackbar.show({
      pos: 'bottom-right',
      text: 'Starting game...',
      showAction: false,
    })
    //$goto(`../round/${json.roundId}`)
  }
</script>

{#await getPlayers() then}
<main>
  <div class="top">
    <!--Top Row-->
    <h2>The hangman game | {nickname}</h2>
    <h1 on:click={() => {
      navigator.clipboard.writeText(joinUrl)
      Snackbar.show({
        pos: 'bottom-right',
        text: 'Room link copied',
        showAction: false,
      })
    }}>
      Room code: {roomCode}
    </h1>
  </div>
  <div class="center">
      <div class="col" data-full={!isGameLeader} bind:clientWidth={colWidth}>
        <h2>Players</h2>
        <div class="content grid">
          {#key players}
            <Players {players} {colWidth} />
          {/key}
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
            <div class="content">
              {#await getWordlists() then wordLists}
                {#each wordLists as wordlist}
                  <div
                    class="wordlist wl-{wordlist.id}"
                    on:click={() => {
                      document.querySelector(`.wordlist.wl-${wordListId}`).classList.remove('selected')
                      wordListId = wordlist.id
                      updateGameSettings()
                      document.querySelector(`.wordlist.wl-${wordListId}`).classList.add('selected')
                    }}
                  >
                    <h3>{wordlist.name}</h3>
                  </div>
                {/each}
              {/await}
            </div>
          </div>
        {/await}
      {/if}
  </div>
  {#if isGameLeader}
    <button class="top" on:click={() => startGame()}>START THE GAME ➤</button>
  {/if}
</main>
{/await}

<style>
  button:hover {
    /* font-size: 40px; */
    letter-spacing: 0.5cap;
    transform: scale(1);
    background: black;
    color: white;
  }
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
  .top h1 {
    cursor: pointer;
    transition: all 0.5s;
    font-size: 28pt;

  }
  .top h1:hover {
    font-size: 32pt;
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
  @media only screen and (max-width: 768px) {
    main {
      justify-content: start !important;
    }
    .center {
      justify-content: start;
      flex-direction: column;
      max-height: none;
    }
    .col {
      width: 100% !important;
    }
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
  .wordlist {
    text-align: center;
    width: max;
    border: 2px solid gray;
    cursor: pointer;
    transition: all 0.5s;
    margin: 15px;
  }
  .wordlist h3 {
    transition: all 0.5s;
    margin: 5px;
  }
  .wordlist:hover > h3 {
    margin: 24px;
  }
  .wordlist.selected {
    background-color: black;
    color: white;
  }
</style>
