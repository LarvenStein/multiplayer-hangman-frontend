<script>
  import { apiUrl, userIdKey, roomCodeKey, nicknameKey } from '../../config.ts'
  import { goto } from '@roxi/routify'
  import * as signalR from '@microsoft/signalr';
  import {connection} from '../../signalr.js'

  export let roomCode

  if (roomCode.length != 6) $goto('/')

  async function joinGame() {
    let nickname = document.querySelector('input').value

    if (nickname.replace(/\s/g, '').length < 3 || nickname.replace(/\s/g, '').length > 25) return alert('Please input a username.\nSpaces will be deleted.')

    connection.start()
    .then(() => connection.invoke("JoinGame", roomCode, nickname));
  }

  connection.on("PlayerData", data => {
    onRegistration(data);
  });

  async function onRegistration(resp) {
    let userId
    let nickname

    userId = resp.id
    nickname = resp.nickname

    localStorage.setItem(userIdKey, userId)
    localStorage.setItem(roomCodeKey, roomCode)
    localStorage.setItem(nicknameKey, nickname)

    $goto('../lobby')
  }
</script>

<main>
  <h1>You're about to join "{roomCode}"!</h1>
  <h2>Before that, I need your name. Please input it here:</h2>
  <div>
    <input placeholder="Nickname" minlength="3" maxlength="25" />
    <button on:click={() => joinGame()}>Join ➤</button>
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
  h1 {
    text-align: center;
  }
  div {
    width: 75%;
    display: flex;
    justify-content: space-evenly;
  }
  input {
    width: 75%;
    height: 50px;
    font-size: 35px;
    border-top: none;
    border-left: none;
    border-right: none;
    font-weight: bolder;
  }
</style>
