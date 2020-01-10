## Environment
    Linux
    The following packages are required:
    ganache, truffle, metamask, npm

## Installation

1. Install packages
    ```s
    cd client/
    npm install
    ```
2. Prepare environment
    Create a workspace of private chain with quick start in ganache.
    Connect it with metamask account.
    Modify ../truffle-box.json to the right port corresponding to the block chain.

3. Migrate the code
    ```js
    truffle compile
    truffle migrate
    ```
4. Run
    ```js
    npm run start
    ```
5. A React App would be opened in browser. You can use the cryptoLennon finally.