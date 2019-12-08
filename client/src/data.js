var items = [
[
  {
    id:'1574752132567',
    agree: 'y',
    text: "兩國的文化已經漸行漸遠，實屬沒必要強迫兩國統一。",
    age: 22,
    name: "石牌小雞雞",
    color: "green",
    border: "gradient",
    respond:{
      "positive":3,
      "negative":6
    }
  },
  {
    id:'1574752182674',
    agree: 'y',
    text: "我認為台灣擁有很多對岸沒有的，我實在不想被統一。",
    age: 16,
    name: '東區劉德華',
    color: "green",
    border: "fancy",
    respond:{
      "positive":17,
      "negative":2
    }
  },
  {
    id:'1574752232922',
    agree: 'f',
    text: "區區灣灣人民，別忘了你們的老祖先，都是從中國而來，現在回歸祖國懷抱，豈能不答應?",
    age: 53,
    name: "韓家軍100號子弟兵",
    color: "pink",
    border: null,
    respond:{
      "positive":10,
      "negative":9
    }
  }
],
[
  {
    id:'1574752232928',
    agree: 'f',
    text: "我就不吃啊?",
    age: 53,
    name: "韓家軍100號子弟兵",
    color: "pink",
    border: "",
    respond:{
      "positive":1,
      "negative":9
    }
  },
  {
    id:'1574752182675',
    agree: 'y',
    text: "我喜歡阿。",
    age: 16,
    name: '東區劉德華',
    color: "green",
    border: "fancy",
    respond:{
      "positive":70,
      "negative":28
    }
  },
],
[
  {
    id:'1574752232926',
    agree: 'f',
    text: "不要，好髒",
    age: 53,
    name: "韓家軍100號子弟兵",
    color: "pink",
    border: "",
    respond:{
      "positive":1,
      "negative":99
    }
  },
]
]

var questions = [
  {
    id: '0',
    genre: 'Politics',
    title:"你支持香菜英文嗎",
    subtitle: '此香菜非比香菜',
    num_comments: 11
  },
  {
    id: '1',
    genre: 'Life',
    title: '你吃香菜嗎',
    subtitle: '吃或不吃，這是個問題',
    num_comments: 2
  },
  {
    id: '2',
    genre: 'Life',
    title: '你吃布丁會舔包裝膜嗎',
    subtitle: '吃就要吃乾淨啊',
    num_comments: 0
  },
]

export default { items, questions };