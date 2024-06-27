<script>
  export let roundState
</script>

<div id="results">
  <div class="flex">
    <div>
      <div class="detail">
        <span class="material-symbols-outlined"> abc </span>
        <div>
          <label for="word">Word</label>
          <p id="word">
            {#each roundState.guessedWord as letter}
              {letter}
            {/each}
          </p>
        </div>
      </div>
      <div class="detail">
        <span class="material-symbols-outlined"> trophy </span>
        <div>
          <label for="result">Result</label>
          <p id="result">{roundState.status}</p>
        </div>
      </div>
      <div class="detail">
        <span class="material-symbols-outlined"> favorite </span>
        <div>
          <label for="lives">Lives left:</label>
          <p id="lives">{roundState.lifesLeft}</p>
        </div>
      </div>
    </div>
    <div>
      <div class="detail">
        <span class="material-symbols-outlined"> 123 </span>
        <div>
          <label for="guesses">Total guesses:</label>
          <p id="guesses">{roundState.correctGuesses + roundState.falseGuesses}</p>
        </div>
      </div>
      <div class="detail">
        <span class="material-symbols-outlined"> 123 </span>
        <div>
          <label for="guesses">Correct guesses:</label>
          <p id="guesses">{roundState.correctGuesses}</p>
        </div>
      </div>
      <div class="detail">
        <span class="material-symbols-outlined"> close </span>
        <div>
          <label for="false-guesses">Wrong guesses:</label>
          <ul id="false-guesses">
            {#each roundState.wrongLetters as letter}
              <li>{letter}</li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @import url(https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200);
  .detail {
    display: flex;
    text-align: left;
    align-items: center;
  }
  div {
    margin-left: 10px;
  }

  p,
  ul {
    font-weight: 900;
    margin: 0;
    font-size: 24px;
  }
  #results {
    padding: 25px;
    border: 2px solid gray;
    border-radius: 25px;
    margin: 15px;
  }

  .flex {
    display: flex;
    justify-content: space-between;
  }
</style>
