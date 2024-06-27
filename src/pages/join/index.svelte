<script>
  import { goto } from '@roxi/routify'
  import Snackbar from 'node-snackbar'

  function joinGame() {
    let roomCode = document.querySelector('input').value

    if (roomCode.length != 6) return alert('Provide a valid room code!')

    $goto(`./${roomCode}`)
  }
</script>

<main>
  <h1>Select a game to join</h1>
  <h2>Please specify a room code to join, or <a href="../">create a new game</a></h2>
  <div>
    <input placeholder="Room code" maxlength="6" minlength="6" />
    <button on:click={() => joinGame()}>Join ➤</button>
  </div>
</main>

<style>
  a:hover {
    cursor: pointer;
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
