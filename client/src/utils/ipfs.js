

var ipfs = {
    ipfs_node: null,
    posts:[
        {
            image_hash:'QmPV2smUoQZEfWXpeXmxjhr2uS6xicdm9Hkk4fv6gXG5ep'
        }
    ],

    async setUp() {
        
        // // Setup ipfs node
        const IPFS = require("ipfs");
        this.ipfs_node = await IPFS.create();
        const version = await this.ipfs_node.version()
        if(version){
            console.log('Connected IPFS succeed!, Version:', version.version)
        } else {
            console.log('Couldn\'t find ipfs version!');

        }
    },

    async addFile(path,content) {
        const filesAdded = await this.ipfs_node.add({
            path: 'ivan.txt',
            content: 'ivan 102'
        })
        
        console.log('Added file Succeed ! Path:', filesAdded[0].path, filesAdded[0].hash)
        this.posts.push({
            image_haseh:filesAdded[0].hash
        });
    },

    async getFile() {
        const post = (await this.ipfs_node.cat(this.posts[0].image_hash)).toString();
        console.log(post);
    }

}

export {ipfs};

window.ipfs = ipfs;


