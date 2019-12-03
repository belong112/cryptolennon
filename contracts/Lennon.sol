pragma solidity >=0.5.0;

contract Lennon {

    event newAccount(uint id, string name, uint birth_day, uint birth_month, uint birth_year);
    event newPost(uint post_id, uint owner_id, string post);

    struct Account {
        string name;
        uint8 birth_day;
        uint8 birth_month;
        uint16 birth_year;
    }

    struct Post{
        string post;
        uint8 lace_type;
        uint owner_id;
        uint[] likes;
    }

    Account[] public Accounts;
    mapping (address => uint) owner_to_id;

    Post[] public Posts;


    uint8 lace_threshold = 10;    // a post need >= lace_threshold of likes to be decorated with lace

    constructor() public {
        Accounts.push(Account("", 0, 0, 0));
    }

    function createAccount(string memory _name, uint8 _d, uint8 _m, uint16 _y) public {
        require(keccak256(abi.encodePacked(_name)) != keccak256(abi.encodePacked("")), "Name cannot be empty");
        require(owner_to_id[msg.sender] == 0, "Cannot create more than one account");
        uint id = Accounts.push(Account(_name, _d, _m, _y)) - 1;
        owner_to_id[msg.sender] = id;
        emit newAccount(id, _name, _d, _m, _y);
    }

    function createPost(string memory _post) public {
        uint owner_id = owner_to_id[msg.sender];
        uint id = Posts.push(Post(_post, 0, owner_id, new uint[](0))) - 1;
        emit newPost(id, owner_id, _post);
    }

    function like(uint16 _post_id) public {
        bool like_already = false;
        for(uint i = 0; i < Posts[_post_id].likes.length; i++) {
            if(Posts[_post_id].likes[i] == owner_to_id[msg.sender]) {
                like_already = true;
                break;
            }
        }
        require(!like_already, "Can only like once");
        Posts[_post_id].likes.push(owner_to_id[msg.sender]);
    }

    function get_num_likes(uint _post_id) external view returns(uint) {
        return Posts[_post_id].likes.length;
    }

    function set_lace(uint _post_id, uint8 _lace_type) public {
        require(Posts[_post_id].owner_id == owner_to_id[msg.sender], "Can only set lace to own post");
        require(Posts[_post_id].likes.length >= lace_threshold, "Not enough likes to decorate with lace");
        Posts[_post_id].lace_type = _lace_type;
    }
}