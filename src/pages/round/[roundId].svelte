<script>
  import { nicknameKey, roomCodeKey, apiUrl, userIdKey } from '../../config.ts'
  import { goto } from '@roxi/routify'
  import { checkUser } from '../../components/checkUser.js'
  import * as signalR from '@microsoft/signalr';
  import Letters from '../../components/letters.svelte'
  import FalseGuesses from '../../components/falseGuesses.svelte'
  import {connection} from '../../signalr.js'
  import Snackbar from 'node-snackbar'
  export let roundId
  export let roundState
  let roomCode = localStorage.getItem(roomCodeKey)
  let userId = localStorage.getItem(userIdKey)
  let firstRender = true
  let killSwitch = false
  let datarecieved = false

  checkUser()

  connection.on("GameState", data => {
    datarecieved = true
    getRoundState(data);
  });

  async function getRoundState(data = undefined, noLoop = true) {
    
    if(data == null) {
    const res = await fetch(`${apiUrl}/games/${roomCode}/rounds/${roundId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'x-user-id': userId,
      },
    })
    data = await res.json()
        if(firstRender) {
      connection.start()
        .then(() => connection.invoke("InitRound", roomCode, userId, roundId).then(result => {
          data = result
      }));
    }
  }


    console.log(data)

    roundState = data

    if (!firstRender) {
      buildHangman()
    }

    firstRender = false

    if (data.status != 'active') {
      $goto(`/round/summary/${roundId}`)
    }
    if (data.message != undefined) {
      killSwitch = true
      $goto('../lobby/summary')
    }
    if (!killSwitch && !noLoop) {
      setTimeout(() => {
        getRoundState()
      }, 3000)
    }
  }

  function buildHangman() {
    for (let index = 1; index <= roundState.falseGuesses; index++) {
      document.getElementById(`img${index}`).style.clipPath = 'inset(0)'
    }
  }

  async function submitGuess() {
    let guess = document.querySelector('.guess input').value
    /*
    const response = await fetch(`${apiUrl}/games/${roomCode}/rounds/${roundId}/guess`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-user-id': userId,
      },
      body: JSON.stringify({
        guess: guess,
      }),
    })*/
    connection.invoke("MakeGuess", userId, guess, roomCode, roundId);
    document.querySelector('.guess input').value = ''
    Snackbar.show({
      pos: 'bottom-right',
      text: 'Guess submitted',
      showAction: false,
    })
    //getRoundState(true)
  }
</script>

<div class="guess">
  <input
    placeholder="Guess"
    on:keypress={(e) => {
      if (e.key == 'Enter') {
        submitGuess()
      }
    }}
  />
  <button id="send" on:click={() => submitGuess()}>Send ➤</button>
</div>
{#await getRoundState() then}
  {#key roundState}
    <Letters {roundState} />
  {/key}

  <main class="main">
    <div class="hangman">
      <div class="image">
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
          <defs></defs>
          <path
            id="img1"
            style="stroke: rgb(42, 42, 42); fill: rgb(41, 41, 41)"
            d="M 70.523 455.269 L 72.957 455.573 L 101.249 456.486 L 128.629 454.66 L 153.271 452.531 L 175.174 452.226 L 198.599 451.314 L 205.596 450.705 L 208.943 449.184 L 210.16 446.75 L 210.464 441.883 L 207.726 440.362 L 204.38 437.624 L 181.259 437.32 L 167.873 438.537 L 158.442 437.624 L 148.403 438.232 L 141.102 438.841 L 123.761 440.362 L 101.857 441.579 L 89.993 441.579 L 81.171 442.491 L 77.216 441.579 L 64.134 442.796 L 62.917 445.534 L 61.396 450.097 C 61.396 450.097 63.83 453.139 64.134 453.139 C 64.438 453.139 67.785 454.052 67.785 454.052"
          ></path>
          <path
            id="img2"
            style="fill: rgb(42, 42, 42); stroke: rgb(41, 41, 41)"
            d="M 122.24 439.754 L 125.891 438.841 L 128.02 433.669 L 128.629 392.6 L 127.412 381.648 L 129.237 357.918 L 129.541 350.617 L 130.454 340.882 C 130.454 340.882 131.671 335.102 132.279 335.102 C 132.887 335.102 135.017 326.888 135.017 326.888 L 132.584 318.978 L 133.801 305.897 L 134.105 283.689 C 134.105 283.689 135.93 270.506 135.93 269.593 C 135.93 268.68 138.06 249.819 138.06 249.819 L 138.364 225.786 L 139.885 203.273 L 139.581 191.409 L 139.581 180.457 L 140.493 170.418 L 139.885 155.511 L 139.581 143.477 L 136.843 132.83 L 136.843 119.748 L 135.017 94.599 L 133.801 81.045 L 133.192 77.09 L 131.975 71.31 L 132.279 63.096 L 133.496 57.316 L 138.668 50.319 L 144.144 47.716 L 148.403 50.454 L 148.099 55.93 L 148.403 60.797 L 148.403 67.186 L 149.012 74.791 L 149.316 85.439 L 149.62 88.177 L 150.533 95.782 L 151.141 101.563 C 151.141 101.563 151.445 108.256 151.445 109.472 C 151.445 110.688 152.662 120.12 152.662 120.12 L 153.271 130.159 L 154.183 133.81 L 154.792 142.768 L 155.704 147.027 L 155.704 154.632 L 154.487 163.759 L 154.792 168.018 L 153.879 179.882 L 154.183 184.141 L 154.487 190.226 L 154.487 214.428 L 153.271 232.986 L 153.271 238.462 L 152.966 250.63 L 152.054 268.444 L 150.228 280.309 L 149.924 292.782 L 150.837 305.39 L 151.141 315.429 L 149.316 319.384 L 149.012 327.902 L 147.186 340.172 L 144.448 350.516 L 143.232 391.822 L 144.187 421.403 L 146.672 434.749 L 150.228 435.934"
          ></path>
          <path
            id="img3"
            style="fill: rgb(48, 48, 48); stroke: rgb(47, 47, 47)"
            d="M 144.752 47.614 L 161.18 48.223 L 187.952 46.702 L 200.729 45.181 L 211.681 45.485 L 226.892 47.006 L 237.844 44.876 L 250.621 43.051 L 261.877 41.53 L 275.263 41.834 L 288.953 43.964 L 302.338 45.485 L 307.51 45.485 L 323.634 42.747 L 329.11 42.443 L 342.191 41.53 L 347.059 46.093 L 347.971 50.352 L 348.275 57.958 L 332.456 57.349 L 328.197 57.958 L 319.679 58.87 L 303.251 61 L 295.95 59.479 L 286.823 57.045 L 281.651 56.741 L 262.181 55.22 L 257.314 57.045 L 246.97 57.958 L 235.41 60.087 L 218.982 59.783 L 212.898 60.087 L 201.642 60.392 L 185.822 61 L 176.696 61.608 L 154.792 61.913 L 148.099 61.304"
          ></path>
          <path
            id="img4"
            style="fill: rgb(41, 41, 41); stroke: rgb(43, 43, 43)"
            d="M 334.281 57.079 L 333.977 78.07 L 333.977 94.498 L 332.152 97.844 L 352.23 97.54 L 349.797 95.106 L 349.492 77.157 L 348.884 57.992"
          ></path>
          <path
            id="img5"
            style="
              fill-rule: nonzero;
              fill: rgba(216, 216, 216, 0);
              stroke-width: 17px;
              stroke: rgb(41, 41, 41);
            "
            d="M 333.209 104.875 L 321.507 105.135 L 316.047 106.175 L 310.065 108.254 L 302.524 113.451 L 297.843 117.349 L 293.422 124.365 L 292.902 127.484 L 292.122 137.619 L 291.082 144.896 L 291.602 151.653 L 293.942 159.708 L 297.324 172.182 L 302.264 179.199 L 308.765 184.656 L 313.706 186.995 L 318.127 189.073 L 322.548 189.594 L 324.888 190.113 L 327.488 191.673 L 341.791 193.751 L 344.131 193.751 L 349.333 193.232 L 352.193 194.011 L 361.034 193.492 L 367.536 191.153 L 374.557 189.073 L 377.938 184.656 L 381.578 179.199 L 383.398 170.103 L 385.219 161.528 L 385.999 152.952 L 385.739 145.416 L 384.959 138.659 L 384.179 135.02 L 381.578 130.863 L 380.018 126.965 L 378.197 123.587 L 375.076 119.689 L 372.217 115.789 L 370.657 111.112 L 369.616 108.254 L 366.235 105.915 L 354.013 105.915 L 330.947 105.135"
          ></path>
          <path
            id="img6"
            style="fill: rgb(38, 38, 38); stroke: rgb(37, 37, 37)"
            d="M 324.085 198.834 L 326.78 200.493 L 326.573 205.261 L 327.402 211.066 L 328.231 219.567 L 329.683 225.165 L 330.927 235.324 L 332.585 243.617 L 334.659 251.288 L 335.281 257.3 L 337.354 279.691 L 338.183 287.455 L 337.768 302.912 L 336.317 315.144 L 336.525 321.571 L 336.732 324.888 L 354.977 324.474 L 352.696 321.156 L 351.867 314.315 L 352.696 304.985 L 353.525 295.863 L 353.525 287.362 L 352.696 277.203 L 352.281 257.093 L 350.208 252.531 L 350.623 250.873 L 350.623 249.422 L 349.793 247.348 L 348.342 241.336 L 346.269 230.762 L 345.854 224.542 L 344.818 219.152 L 343.159 213.14 L 342.537 208.993 L 342.537 205.261 L 343.366 202.359 L 345.232 201.944"
          ></path>
          <path
            id="img7"
            style="fill: rgb(38, 38, 38); stroke: rgb(41, 41, 41)"
            d="M 334.995 259.049 L 334.576 261.141 L 331.876 262.928 L 329.67 262.776 L 326.324 263.118 L 312.595 263.727 L 298.714 262.624 L 291.374 261.437 L 286.052 261.077 L 282.443 261.888 L 280.098 263.422 L 279.196 265.226 L 278.564 266.85 L 278.474 268.113 L 278.384 269.286 L 279.466 271.271 C 279.466 271.271 279.917 272.353 279.827 272.443 C 279.737 272.533 281.631 274.428 281.631 274.428 L 283.977 275.15 L 285.511 275.51 L 288.848 276.142 L 293.359 276.503 C 293.359 276.503 300.666 278.397 301.117 278.127 C 301.568 277.857 304.094 278.487 304.094 278.487 L 308.605 278.217 L 314.469 278.668 L 319.971 278.307 L 326.319 277.685 L 333.244 277.505 L 335.53 278.208 L 337.202 279.48"
          ></path>
          <path
            id="img8"
            style="fill: rgb(42, 42, 42); stroke: rgb(39, 39, 39)"
            d="M 352.348 257.421 L 353.309 258.303 L 356.451 258.193 L 363.215 257.2 L 365.138 256.648 L 369.057 255.95 L 373.973 255.03 L 376.524 254.736 L 380.135 254.385 L 384.814 253.658 L 387.007 253.222 L 392.563 251.476 L 396.512 250.676 L 399.655 249.876 L 402.141 249.585 L 403.823 249.658 L 405.863 250.145 L 406.674 250.531 L 407.551 251.112 L 408.502 252.422 L 409.745 254.167 L 409.964 255.185 L 410.33 257.295 L 410.33 258.749 L 409.598 261.004 L 407.771 262.967 L 404.188 264.131 L 399.582 265.368 L 396.293 266.168 L 391.906 267.113 L 388.762 267.986 L 385.911 268.64 L 383.351 269.077 L 380.281 269.659 L 376.552 269.95 L 373.701 270.24 L 369.899 270.895 C 369.899 270.895 367.779 271.186 367.706 271.186 C 367.632 271.186 364.123 271.695 364.123 271.695 L 361.199 271.55 L 359.445 271.768 L 357.982 272.204 L 356.154 272.568 L 355.058 273.077 L 353.668 273.659 L 352.864 274.895"
          ></path>
          <path
            id="img9"
            style="fill: rgb(41, 41, 41); stroke: rgb(39, 39, 39)"
            d="M 336.157 324.727 L 335.783 326.222 L 334.242 328.931 L 331.439 331.734 L 329.664 333.182 L 326.721 335.611 L 324.152 338.227 L 321.582 340.796 L 319.06 344.092 L 314.669 351.52 L 310.324 359.134 L 308.269 363.619 L 303.831 371.139 L 301.402 375.998 L 300.421 381.697 L 298.833 389.078 L 297.151 394.169 L 295.656 398.14 L 294.535 401.877 L 294.115 406.175 L 294.068 409.024 L 294.815 410.799 L 295.796 412.014 L 297.058 412.995 L 298.412 413.696 L 300.795 413.929 L 302.383 413.976 C 302.383 413.976 304.905 413.275 304.952 413.275 C 304.999 413.275 307.054 411.921 307.054 411.921 L 309.063 409.164 L 309.81 405.754 L 309.437 403.232 L 309.997 401.877 L 311.539 398.747 L 313.828 392.628 L 313.968 390.245 L 314.201 387.676 L 314.622 383.472 L 316.724 379.034 L 318.312 376.745 L 320.228 373.428 L 321.395 371.093 L 324.432 365.067 L 327.188 359.975 C 327.188 359.975 330.271 354.977 330.318 354.977 C 330.365 354.977 334.475 350.025 334.475 350.025 L 338.166 346.148 L 340.595 344.373 L 342.417 341.57 L 344.565 339.281 L 345.687 338.206 L 345.748 324.642"
          ></path>
          <path
            id="img10"
            style="fill: rgb(38, 38, 38); stroke: rgb(38, 38, 38)"
            d="M 345.527 324.76 L 345.945 338.271 L 347.198 338.411 L 348.591 339.455 L 351.377 342.171 L 353.397 343.982 L 355.834 346.768 L 360.509 351.435 L 364.533 355.727 L 367.645 359.59 L 370.381 363.346 L 371.722 366.511 L 373.761 370.636 L 375.585 374.714 L 377.409 378.147 L 379.716 382.171 L 382.291 385.551 L 383.633 386.785 L 385.081 388.77 L 387.764 393.17 L 390.178 395.96 L 392.753 397.891 L 394.095 398.75 L 397.475 402.612 L 402.947 408.89 L 404.61 410.606 L 407.239 412.484 C 407.239 412.484 409.278 412.967 409.546 413.074 C 409.814 413.181 411.692 413.128 411.692 413.128 L 414.053 413.074 L 415.823 412.001 L 417.916 409.802 L 418.238 408.621 L 418.399 406.207 L 418.399 404.168 L 418.13 402.934 L 413.999 398.481 L 406.595 390.541 L 400.533 383.834 L 395.758 377.504 C 395.758 377.504 392.056 372.031 391.788 371.817 C 391.52 371.603 389.588 367.149 389.588 367.149 L 386.154 361.569 L 381.379 352.77 L 377.785 347.191 L 374.834 343.918 L 370.595 339.948 L 368.61 337.48 L 363.889 333.241 L 360.241 329.271 L 358.417 327.179 L 356.431 325.194 L 355.68 324.442"
          ></path>
        </svg>
      </div>
      <h2>Lives left: {roundState.lifesLeft}</h2>
    </div>
    <div>
      <FalseGuesses {roundState} />
    </div>
  </main>
{/await}

<style>
  div.guess {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
  }
  .guess input {
    width: 75%;
    height: 50px;
    font-size: 35px;
    border-bottom: 1px soild gray;
    border-top: none;
    border-left: none;
    border-right: none;
    font-weight: bolder;
  }
  .guess button {
    font-size: 35px;
    background: none;
    border: none;
    border-radius: 5px;
    font-weight: bolder;
  }

  .main {
    display: flex;
    justify-content: center;
    align-items: normal;
    flex-direction: row;
    height: auto;
  }
  .main .hangman {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .image {
    border: 2px solid gray;
    border-radius: 25px;
  }
  svg path {
    /*display: none;*/
    clip-path: inset(100% 0 0 0);
    transition: all 0.5s;
    object-fit: cover;
  }

  div {
    width: 50%;
  }
</style>
