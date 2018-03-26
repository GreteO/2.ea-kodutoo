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
      
      const typer = new TYPER() /* ************** see on vist start funktsiooni tegelik käivitaja */
      window.typer = typer                       /*  <><  mingi kala on sees :P */

         // PHP faili salvestamise asi, ei toimi 
      document
      .querySelector('#gameEnd')
      .addEventListener('click', this.saveServer)
     //Viide: https://github.com/eesrakenduste-arendamine-2018k/3.ea-loeng/blob/master/main.js
    
    }
  },
  'scores': {
      'render': function (){
        console.log('>>>> Scores')
            document //Vist peaks olema sellel lehel, ei toimi
            .querySelector('#loadServer') 
            .addEventListener('click', loadServer) 
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
  this.wordMinLength = parseInt(document.getElementById("wordLength").value)  /** kui number liiga suureks läheb, tekib probleem ekraanile mahtuvusega */

  this.playerName = document.getElementById("name").value


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



		 document.getElementById("gameStart").addEventListener("click", typer.start()) /* ************** funktsiooni sulud muudavad kasutamise nulli ja tegelik alustaja on TYPER */
     document.getElementById("gameEnd").addEventListener("click", typer.end)
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
    timer = clearInterval(timer) /* *************** tuleks lisada andmete nullimine */
    console.log("ENDSCORE: ",typer.gamePoints, typer.playerName)
    window.location.hash = 'scores'
    document.getElementById("endScore").innerHTML = typer.playerName+ ", Teie mängu skoor on: " +typer.gamePoints

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

  keyPressed: function (event) { //*************** Otseselt pole seotud sellega aga kui lehel olles uuesti vajutada alusta mängu peaks uuesti laadima lehe */
    const letter = String.fromCharCode(event.which)
      if (letter === this.word.left.charAt(0)) {
        this.word.removeFirstLetter()
      } 
      else if(letter!=this.word.left.charAt(0)){
        this.word.changeLetterColor()

      }
      if (this.word.left.length === 0) {
        this.guessedWords += 1  
        //console.log(this.guessedWords)
        //this.gamePoints = this.gameCount
        this.gameScore = this.guessedWords + this.gameCount //
        console.log("ARVATUD SÕNAD",this.guessedWords)//
        console.log("GAMESKOOR",this.gameScore)//
        this.gamePoints += this.gameScore//
        console.log(this.gamePoints) //
        this.secondsLeft = 10 //
        this.gameCount = 10 //
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
    this.ctx.fillText(typer.gamePoints +  " punkti", 100, 300) //TRÜKIB SKOORI
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
function saveScore () {
  function saveServer () {
   const o = {
   text: window.app.input.value,
   date: new Date() 
  }

  let xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log('salvestatud')
    }
  }
  xhttp.open('POST', 'score.php', true)
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  xhttp.send('json=' + JSON.stringify(o))
}

function loadServer () {
  let xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log('laetud')
      console.log(JSON.parse(xhttp.responseText))
    }
  }

  xhttp.open('GET', 'score.php?latest', true)
  xhttp.send()
}
}
//PHP faili salvestamine lõpp



window.onload = function () {
  const app = new GameApp()
  window.app = app
}
