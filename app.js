/* TYPER */
const GameApp = function () {
  if (GameApp.instance) {
    return GameApp.instance
  }
  GameApp.instance = this

  this.routes = GameApp.routes
  this.currentRoute = null

  this.init()
}

GameApp.routes = {
  'introduction': {
    'render': function () {
      console.log('>>>> Introduction')
      let myArray = ['Kaspar Kaalikas', 'Juku Juurikas', 'Aune Arakas', 'Õnne Tulits', 'Jane Doe', 'John Doe']; 
      let rand = myArray[Math.floor(Math.random() * myArray.length)];
      document.getElementById("name").value = rand;
    }
  },
  'game': {
    'render': function () {
      console.log('>>>> Game')
      const typer = new TYPER() 
      window.typer = typer  

      //document.querySelector('#gameEnd').addEventListener('click', saveServer)
     
//Viide: https://github.com/eesrakenduste-arendamine-2018k/3.ea-loeng/blob/master/main.js
    }
  },
  'scores': {
      'render': function (){
        console.log('>>>> Scores')
        
        document.querySelector('#loadServer').addEventListener('click', loadServer)
      }
    }
}

GameApp.prototype = {
  init: function () {
    console.log('Rakendus läks tööle')
    window.addEventListener('hashchange', this.routeChange.bind(this))

    if (!window.location.hash) {
      window.location.hash = 'introduction'
    } else {
      this.routeChange()
    }
  },



  routeChange: function (event) {
    this.currentRoute = location.hash.slice(1)
    if (this.routes[this.currentRoute]) {
      this.updateMenu()

      this.routes[this.currentRoute].render()
    } else {
    }
  },

  updateMenu: function () {
    document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '')
    document.querySelector('.' + this.currentRoute).className += ' active-menu'
  }
}


//Viide: https://github.com/eesrakenduste-arendamine-2018k/3.ea-loeng/blob/master/main.js 



const TYPER = function () {
  if (TYPER.instance_) {
    return TYPER.instance_
  }
  TYPER.instance_ = this

  this.WIDTH = window.innerWidth
  this.HEIGHT = window.innerHeight
  this.canvas = null
  this.ctx = null

  this.words = []
  this.word = null
  this.wordMinLength = parseInt(document.getElementById("wordLength").value)  

  this.playerName = document.getElementById("name").value
  console.log(this.playerName)
  document.getElementById("userName").innerHTML = this.playerName
  

  this.guessedWords = 0
  this.secondsLeft = 10 
  
  this.gameCount = 10 
  this.gamePoints = 0  
  this.gameScore = 0  

  this.init()
}

window.TYPER = TYPER

TYPER.prototype = {
  init: function () {
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.ctx = this.canvas.getContext('2d')

    this.canvas.style.width = this.WIDTH + 'px'
    this.canvas.style.height = this.HEIGHT + 'px'

    this.canvas.width = this.WIDTH * 2
    this.canvas.height = this.HEIGHT * 2

    this.loadWords()
  },

  loadWords: function () {
    const xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 0)) {
        const response = xmlhttp.responseText
        const wordsFromFile = response.split('\n')
		
        typer.words = structureArrayByWordLength(wordsFromFile)

		 //document.getElementById("gameStart").addEventListener("click", typer.start()) /* ************** funktsiooni sulud muudavad kasutamise nulli ja tegelik alustaja on TYPER */
     //document.getElementById("gameStart").innerHTML = typer.start()
     document.getElementById("gameEnd").addEventListener("click", typer.end)
     document.querySelector('#gameEnd').addEventListener('click', saveServer)
      }
    }
                                                                                               
    xmlhttp.open('GET', './lemmad2013.txt', true)                                
    xmlhttp.send()
  },
 
  start: function () {
      this.generateWord()  //**********************annab mingit errorit kui ülevalt sulud eemaldada ja seda funktsiooni sihipäraselt kasutada
      this.word.Draw()
	

      this.secondsLeft = 10  
      timer = 10 //
      this.gameScore = 0 // 

      window.addEventListener('keypress', this.keyPressed.bind(this))  
      timer = setInterval(this.loop.bind(this), 1000)         
  },	

  end: function () {
      timer = clearInterval(timer) 
      console.log("ENDSCORE: ",typer.gamePoints, typer.playerName)
      
      window.location.hash = 'scores'
      document.getElementById("endScore").innerHTML = typer.playerName+ ", Teie mängu skoor on " +typer.gamePoints+ " ja jõudsite trükkida "+typer.guessedWords+" sõna!"
    
 },

 //Aja ja skoori algus
 loop: function() {

  this.gameCount -=1 
  this.secondsLeft -= 1

	  if (this.secondsLeft <= -1){    
      clearInterval(timer)
      this.secondsLeft = 10
      timer = setInterval(this.loop.bind(this), 1000)
      this.generateWord()    
    }
    console.log("Punktid aja eest", this.gameCount)
    if(this.gameCount<=-0){
      this.gameCount = 11
    }

    this.word.Draw()
 }, 
 //lõpp

  generateWord: function () {
    const generatedWordLength = this.wordMinLength + parseInt(this.guessedWords / 5) 
    const randomIndex = (Math.random() * (this.words[generatedWordLength].length - 1)).toFixed()
    const wordFromArray = this.words[generatedWordLength][randomIndex]

    this.word = new Word(wordFromArray, this.canvas, this.ctx)
  },

  keyPressed: function (event) { 
    const letter = String.fromCharCode(event.which)
      if (letter === this.word.left.charAt(0)) {
        this.word.removeFirstLetter()
      } 
      else if(letter!=this.word.left.charAt(0)){
        this.word.changeLetterColor()
        console.log("vale täht AP",this.gameScore)
        this.gameScore=0
        console.log("nulli",this.gameScore)

      }
      if (this.word.left.length === 0) {
        this.guessedWords += 1  
        this.gameScore += this.gameCount 
        console.log("ARVATUD SÕNAD",this.guessedWords)
        console.log("AJAPUNKTID",this.gameScore)
        this.gamePoints = this.guessedWords+this.gameScore
        console.log("KOKKU",this.gamePoints) 
        this.secondsLeft = 10 
        this.gameCount = 10 
        this.generateWord()

      }
      this.word.Draw()
  },
}

/* WORD */
const Word = function (word, canvas, ctx) {
  this.word = word
  this.left = this.word
  this.canvas = canvas
  this.ctx = ctx
}

Word.prototype = {
  Draw: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.textAlign = 'center'
    this.ctx.font = '140px Courier'
    this.ctx.fillText(this.left, this.canvas.width / 2, this.canvas.height / 2)

    this.ctx.textAlign = 'left'
    this.ctx.font = '60px Courier'
    
    this.ctx.fillText(typer.secondsLeft +  " sekundit", 100, 100 ) //TRÜKIB AEGA
    this.ctx.fillText(typer.guessedWords +  " sõna", 100, 200) //TRÜKIB ARVATUD SÕNU
    this.ctx.fillText(typer.gameScore +  " punkti", 100, 300) //TRÜKIB SKOORI
  },

  changeLetterColor: function (){
    this.left = this.left.slice(0)
    this.ctx.fillStyle= 'red'
  },

  removeFirstLetter: function () { 
    this.left = this.left.slice(1)
    this.ctx.fillStyle = 'black'
  },  
}

/* HELPERS */
function structureArrayByWordLength (words) {
  let tempArray = []

  for (let i = 0; i < words.length; i++) {
    const wordLength = words[i].length
    if (tempArray[wordLength] === undefined)tempArray[wordLength] = []

    tempArray[wordLength].push(words[i])
  }

  return tempArray
}

// PHP faili salvestamine:
function saveServer () {
  if (typer.gamePoints != 0){
    const scoreInfo = 'Mängija: ' + typer.playerName + ", punktide arvuga: "+typer.gamePoints+'<br>'
    

    let xhttp = new XMLHttpRequest()
    xhttp.open('POST', 'score.php', true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log('salvestatud')
        console.log(this.responseText)
      }
    }
    xhttp.send('json=' + JSON.stringify(scoreInfo))
    //xhttp.send(scoreInfo)
    console.log(scoreInfo) 
  }
}

function loadServer () {
  let xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log('laetud')
      //console.log(JSON.parse(xhttp.response))
      console.log(xhttp.responseText)

      document.getElementById("playerInfoDB").innerHTML=this.responseText
    }
  }
  xhttp.open('GET', 'score.php?latest', true)
  xhttp.send()
}
//PHP faili salvestamine lõpp

window.onload = function () {
  const app = new GameApp()
  window.app = app
}
