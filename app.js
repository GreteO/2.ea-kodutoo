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
    }
  },
  'game': {
    'render': function () {
      console.log('>>>> Game')
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
      /// 404 - ei olnud
    }
  },

  updateMenu: function () {
    // http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
    document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '')
    document.querySelector('.' + this.currentRoute).className += ' active-menu'
  }
    //document.getElementById('gameStart').addEventListener('click', TYPER)
}


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
  this.wordMinLength = 5 //******************siduda input väljaga html-is et määrata alustuse sõna pikkus
  this.guessedWords = 0 //********************lisada skooriarvutusele

  this.secondsLeft = 10 //********************siduda skooriarvutusega

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
		
		document.getElementById('gameStart').addEventListener('click', typer.start)
        /*typer.start()*/
		document.getElementById('gameStart').addEventListener('click', typer.score)
      }
    }

    xmlhttp.open('GET', './lemmad2013.txt', true)
    xmlhttp.send()
  },
  
 score: function() {
	 
	  timer = 10
	  
	   while(timer>-1){
		  //timer = setInterval(timer, 1000)
		  timer--;
		console.log(timer)  
		this.secondsLeft = timer
	  }
	  /*timer = setInterval(this.loop.bind(this), 1000) 
	  scoreCounter = this.guessedWords + second*/
  },
 /*loop: function () {
	this.secondsLeft = 10
	
	this.secondsLeft -= 1
	if (this.secondsLeft <= 0){
		clearInterval(timer)
	}
	this.word.Draw()
  },*/

  start: function () {
    this.generateWord()  //**********************annab mingit errorit
    this.word.Draw()
	
    window.addEventListener('keypress', this.keyPressed.bind(this))
    
  },	
  
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

      if (this.word.left.length === 0) {
        this.guessedWords += 1  //*******************************siia siduda skooriosa
        //console.log(this.guessedWords)
        this.generateWord()
      }

      this.word.Draw()
    }
  }
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
    this.ctx.fillText(typer.secondsLeft, 100, 100)
  },

  removeFirstLetter: function () {  //*********************************tekitada changeWrongLetterColor() vmt.
    this.left = this.left.slice(1)
  }
  
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

window.onload = function () {
  const typer = new TYPER()
  window.typer = typer
  const app = new GameApp()
  window.app = app
}
