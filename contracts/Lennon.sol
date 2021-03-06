pragma solidity >=0.5.0;

import "./Ownable.sol";

contract Lennon is Ownable {

    event newPreQuestion(uint prequestion_id, string question, string subtitle, string picture_ipfs, uint time, uint owner_id);
    event signed(uint prequestion_id, uint owner_id);
    event newQuestion(uint question_id, string question, string subtitle, string picture_ipfs, uint time, uint owner_id);
    event newAccount(uint id, string name, uint birth_day, uint birth_month, uint birth_year);
    event newReply(uint question_id, uint reply_id, string reply, bool endorse, uint time, uint owner_id);
    event liked(uint question_id, uint reply_id, uint owner_id);
    event modifyAccount(uint id, string new_name);

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
        string subtitle;
        string picture_ipfs;
        uint time;
        uint owner_id;
        uint[] replies;
    }

    struct PreQuestion {
        string question;
        string subtitle;
        string picture_ipfs;
        uint time;
        uint owner_id;
        uint[] petitions;
    }

    Account[] public Accounts;
    mapping (address => uint) owner_to_id;

    PreQuestion[] public PreQuestions;
    Question[] public Questions;
    Reply[] public Replies;

    uint petition_threshold;

    modifier needAccount() {
        require(owner_to_id[msg.sender] != 0, "Must create an account first");
        _;
    }

    constructor() public {
        Accounts.push(Account("admin", 0, 0, 0));
        petition_threshold = 3;

        Questions.push(Question("你支持反送中嗎?", "暴政，暴民?","QmbFwywTUQ5NPxeW2KwftL59FQ7UQFRuw31EYqFUWpBNot", 0, 0, new uint[](0)));
        Questions.push(Question("你滿意大選結果嗎?", "2020大選","QmSqBScM7EnyFhkmmGb5hGVYnSfC2eaNUqUCwAHi7QRrZN", 1, 0, new uint[](0)));
        Questions.push(Question("你支持以核養綠嗎?", "嗨", "QmbFwywTUQ5NPxeW2KwftL59FQ7UQFRuw31EYqFUWpBNot",3, 0, new uint[](0)));
    }

    // modify petition_threshold (only owner of the contract)
    function modify_petition_threshold(uint _t) public onlyOwner {
        petition_threshold = _t;
    }

    // create an account given name and birthday
    function create_account(string memory _name, uint8 _d, uint8 _m, uint16 _y) public {
        require(owner_to_id[msg.sender] == 0, "Cannot create more than one account");
        uint id = Accounts.push(Account(_name, _d, _m, _y)) - 1;
        owner_to_id[msg.sender] = id;
        emit newAccount(id, _name, _d, _m, _y);
    }

    function modify_account_info(string memory _new_name) public needAccount {
        Accounts[owner_to_id[msg.sender]].name = _new_name;
        emit modifyAccount(owner_to_id[msg.sender], _new_name);
    }

    // create a preQuestion waiting for petitions
    function create_prequestion(string memory _p, string memory _s, string memory _pic, uint _t) public needAccount {
        PreQuestions.push(PreQuestion(_p, _s, _pic, _t, owner_to_id[msg.sender], new uint[](0)));
        uint p_id = PreQuestions[PreQuestions.length-1].petitions.push(owner_to_id[msg.sender]);
        emit newPreQuestion(p_id, _p, _s, _pic, _t, owner_to_id[msg.sender]);
    }

    // sign a preQuestion
    function sign(uint _p_id) public needAccount {
        bool b = false;
        for(uint i = 0; i < PreQuestions[_p_id].petitions.length; i++){
            if(owner_to_id[msg.sender] == PreQuestions[_p_id].petitions[i]){
                b = true;
                break;
            }
        }
        require(!b, "Can only sign once");
        PreQuestions[_p_id].petitions.push(owner_to_id[msg.sender]);
        emit signed(_p_id, owner_to_id[msg.sender]);
    }

    // turn the _p_id(th) prequestion into question
    function create_question(uint _p_id, uint _t) public needAccount {
        PreQuestion memory p = PreQuestions[_p_id];
        require(owner_to_id[msg.sender] == p.owner_id, "Can only turn oneself's prequestion into a question");
        require(p.petitions.length >= petition_threshold, "Not enough people signed the question");
        uint id = Questions.push(Question(p.question, p.subtitle, p.picture_ipfs, _t, p.owner_id, new uint[](0)));
        PreQuestions[_p_id] = PreQuestions[PreQuestions.length-1];
        PreQuestions.length--;
        emit newQuestion(id, p.question, p.subtitle, p.picture_ipfs, _t, p.owner_id);
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
        emit liked(_q_id, _r_idx, owner_to_id[msg.sender]);
    }

    // get name and birthday of the user
    function get_account() external view needAccount returns(uint, string memory, uint8, uint8, uint16) {
        Account memory a = Accounts[owner_to_id[msg.sender]];
        return (owner_to_id[msg.sender], a.name, a.birth_day, a.birth_month, a.birth_year);
    }

    // get name and birthday of the user given id
    function get_account(uint _id) external view returns(string memory, uint8, uint8, uint16) {
        require(_id != 0, "id should not be 0");
        Account memory a = Accounts[_id];
        return (a.name, a.birth_day, a.birth_month, a.birth_year);
    }

    // get total number of prequestions
    function get_prequestion_length() external view returns(uint) {
        return PreQuestions.length;
    }

    // get prequestion given prequestionId (question, subtitle, picture_ipfs, create_time, owner_id, # sign, and whether the account had signed)
    function get_prequestion(uint _p_id) external view returns(string memory, string memory, string memory, uint, uint, uint, bool) {
        PreQuestion memory p = PreQuestions[_p_id];
        bool b = false;
        if(owner_to_id[msg.sender] != 0){
            for(uint i = 0; i < p.petitions.length; i++){
                if(owner_to_id[msg.sender] == p.petitions[i]){
                    b = true;
                    break;
                }
            }
        }
        return (p.question, p.subtitle, p.picture_ipfs, p.time, p.owner_id, p.petitions.length, b);
    }

    // get petition threshold for changing a question into a prequestion
    function get_petition_threshold() external view returns(uint) {
        return petition_threshold;
    }

    // get total number of questions
    function get_question_length() external view returns(uint) {
        return Questions.length;
    }

    // get question given questionId (question, subtitle, picture_ipfs, last_update_time, owner_id)
    function get_question(uint _q_id) external view returns(string memory, string memory, string memory, uint, uint) {
        Question memory q = Questions[_q_id];
        if( q.replies.length == 0 ) return (q.question, q.subtitle, q.picture_ipfs, q.time, q.owner_id);
        return (q.question, q.subtitle, q.picture_ipfs, Replies[q.replies[q.replies.length - 1]].time, q.owner_id);
    }

    // get total number of replies to a question
    function get_reply_length(uint _q_id) external view returns(uint) {
        return Questions[_q_id].replies.length;
    }

    // get _r_idx(th) reply to _q_id(th) question (reply, endorse, time, owner_id, #likes, and whether the account liked it)
    function get_reply(uint _q_id, uint _r_idx ) external view returns(string memory, bool ,uint ,uint ,uint, bool) {
        Reply memory r = Replies[Questions[_q_id].replies[_r_idx]];
        bool b = false;
        if( owner_to_id[msg.sender] != 0 ){
            for(uint i = 0; i < r.likes.length; i++) {
                if(r.likes[i] == owner_to_id[msg.sender]) {
                    b = true;
                    break;
                }
            }
        }
        return (r.reply, r.endorse, r.time, r.owner_id, r.likes.length, b);
    }

    // get all question of an account
    /*
        Usage: For the first time call get get_all_questions(-1) and get x, the first question.
               Then call get_all_questions(x) to get the next question iteratively until -1 returned.
    */
    function get_all_questions(int _q_id) external view needAccount returns(int) {
        for(uint i = uint(_q_id + 1); i < Questions.length; i++){
            if(Questions[i].owner_id == owner_to_id[msg.sender]) return int(i);
        }
        return -1;
    }

    // get all prequestion of an account
    /*
        Usage: For the first time call get get_all_prequestions(-1) and get x, the first prequestion.
               Then call get_all_prequestions(x) to get the next prequestion iteratively until -1 returned.
    */
    function get_all_prequestions(int _p_id) external view needAccount returns(int) {
        for(uint i = uint(_p_id + 1); i < PreQuestions.length; i++){
            if(PreQuestions[i].owner_id == owner_to_id[msg.sender]) return int(i);
        }
        return -1;
    }

    // get all replies of an account iteratively (_r_idx(th) reply to the question with id = _q_id)
    /*
        Usage:  For the first time call get_all_replies(-1,-1) and get (x, y), the first reply.
                Then call get_all_replies(x, y) to get the next reply iteratively until (-1, -1) returned.
    */
    function get_all_replies(int _q_id, int _r_idx) external view needAccount returns(int, int) {
        uint i = uint(_q_id == -1? 0 : _q_id);
        uint j = uint(_r_idx + 1);
        for(; i < Questions.length; i++){
            for(; j < Questions[i].replies.length; j++){
                if(Replies[Questions[i].replies[j]].owner_id == owner_to_id[msg.sender]) return (int(i), int(j));
            }
            j = 0;
        }
        return (-1, -1);
    }

}