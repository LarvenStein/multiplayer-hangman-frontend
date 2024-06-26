<script>
  import { apiUrl, userIdKey, roomCodeKey, nicknameKey } from '../../config.ts'
  import { goto } from '@roxi/routify'
  export let roomCode

  if (roomCode.length != 6) $goto('/')

  async function joinGame() {
    let nickname = document.querySelector('input').value
    let userId

    if (nickname.replace(/\s/g, '').length < 1) return alert('Please input a username.\nSpaces will be deleted.')

    let response = await fetch(`${apiUrl}/games/${roomCode}/players`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname: nickname,
      }),
    })
    let responseArray = await response.json()
    userId = responseArray.id

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
    <input placeholder="Nickname" maxlength="25" />
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
