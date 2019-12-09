pragma solidity >=0.5.0;

import "./Ownable.sol";

contract Lennon is Ownable {

    event newAccount(uint id, string name, uint birth_day, uint birth_month, uint birth_year);
    event newReply(uint question_id, uint reply_id, string reply, bool endorse, uint time, uint owner_id);
    event liked(uint question_id, uint reply_id);

    struct Account {
        string name;
        uint8 birth_day;
        uint8 birth_month;
        uint16 birth_year;
    }

    struct Reply {
        string reply;
        bool endorse;
        uint time;
        uint owner_id;
        uint[] likes;
    }

    struct Question {
        string question;
        uint[] replies;
    }

    Account[] public Accounts;
    mapping (address => uint) owner_to_id;

    Question[] public Questions;
    Reply[] public Replies;

    modifier needAccount() {
        require(owner_to_id[msg.sender] != 0, "Must create an account first");
        _;
    }

    constructor() public {
        Accounts.push(Account("", 0, 0, 0));
        Questions.push(Question("你支持反送中嗎?", new uint[](0)));
        Questions.push(Question("你喜歡吃香菜嗎?", new uint[](0)));
        Questions.push(Question("2020。歸。投。韓下去?", new uint[](0)));
    }

    // only owner of the contract can create a question
    function create_question(string calldata _q) external onlyOwner {
        Questions.push(Question(_q, new uint[](0)));
    }

    // create an account given name and birthday
    function create_account(string memory _name, uint8 _d, uint8 _m, uint16 _y) public {
        require(owner_to_id[msg.sender] == 0, "Cannot create more than one account");
        uint id = Accounts.push(Account(_name, _d, _m, _y)) - 1;
        owner_to_id[msg.sender] = id;
        emit newAccount(id, _name, _d, _m, _y);
    }

    // create a reply of a question
    function create_reply(uint8 _q_id, string memory _reply, bool _endorse, uint _time) public needAccount {
        uint owner_id = owner_to_id[msg.sender];
        uint r_id = Replies.push(Reply(_reply, _endorse, _time, owner_id, new uint[](0))) - 1;
        Questions[_q_id].replies.push(r_id);
        emit newReply(_q_id, r_id, _reply, _endorse, _time, owner_id);
    }

    // like a reply (_r_idx(th) reply of the question)
    function like(uint8 _q_id, uint8 _r_idx) public needAccount {
        bool b = false;
        Reply storage r = Replies[Questions[_q_id].replies[_r_idx]];
        for(uint i = 0; i < r.likes.length; i++) {
            if(r.likes[i] == owner_to_id[msg.sender]) {
                b = true;
                break;
            }
        }
        require(!b, "Already liked");
        r.likes.push(owner_to_id[msg.sender]);
        emit liked(_q_id, _r_idx);
    }

    // get name and birthday of the user
    function get_account() external view needAccount returns(string memory, uint8, uint8, uint16) {
        Account storage a = Accounts[owner_to_id[msg.sender]];
        return (a.name, a.birth_day, a.birth_month, a.birth_year);
    }

    // get total number of questions
    function get_Question_length() external view returns(uint) {
        return Questions.length;
    }

    // get question and last update time given questionId
    function get_Question(uint _q_id) external view returns(string memory, uint) {
        return (Questions[_q_id].question, Replies[Questions[_q_id].replies[Questions[_q_id].replies.length - 1]].time);
    }

    // get total number of replies to a question
    function get_reply_length(uint _q_id) external view returns(uint) {
        return Questions[_q_id].replies.length;
    }

    // get reply, endorse, time, owner_id and #likes of _r_idx(th) reply to the question with id = _q_id
    function get_reply(uint _q_id, uint _r_idx ) external view returns(string memory, bool, uint, uint, uint) {
        Reply storage r = Replies[Questions[_q_id].replies[_r_idx]];
        return (r.reply, r.endorse, r.time, r.owner_id, r.likes.length);
    }

    // get all replies of an account iteratively (_r_idx(th) reply to the question with id = _q_id)
    /*
        Usage:  For the first time call get_all_replies(-1,-1) and get (x, y), the first reply.
                Then call get_all_replies(x, y) to get the next reply iteratively until (-1, -1) returned.
    */
    function get_all_replies(uint _q_id, uint _r_idx) external view needAccount returns(int, int) {
        for(uint i = uint(_q_id + 1); i < Questions.length; i++){
            for(uint j = uint(_r_idx + 1); j < Questions[i].replies.length; j++){
                if(Replies[Questions[i].replies[j]].owner_id == owner_to_id[msg.sender]) return (int(i), int(j));
            }
        }
        return (-1, -1);
    }
}