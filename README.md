# Multiplayer hangman frontend
This is a frontend for my [multiplayer-hangman-api](https://github.com/LarvenStein/multiplayer-hangman-api) project, made with svelte and routify.

[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)
![GitHub last commit](https://img.shields.io/github/last-commit/LarvenStein/multiplayer-hangman-frontend)


## 🔧 Running / Building 
If you want to set up this frontend yourself follow these steps: 

Requierments:
- nodeJs with NPM

1. Clone this repo
    ```sh
    git clone https://github.com/LarvenStein/https://github.com/LarvenStein/multiplayer-hangman-frontend.git
    cd multiplayer-hangman-frontend/
    ```
2. Install dependencies
    ```sh
    npm install
    ```
3. Edit `src/config.ts` according to your needs. 
    - You probatly want to change the `apiUrl` to a real instance of the [multiplayer-hangman-api](https://github.com/LarvenStein/multiplayer-hangman-api)
4. Now you can run or build the project
    - To run it, simply execute
        ```sh
        npm run dev
        ```
    - To build it, execute
        ```sh
        npm run build
        ```
        - The generated HTML files should be in the `/dist` folder

For instructions on how to set up the api server, go to the [multiplayer-hangman-api repository](https://github.com/LarvenStein/multiplayer-hangman-api).
