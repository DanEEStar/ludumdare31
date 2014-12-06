(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  SCREEN_WIDTH: 960,
  SCREEN_HEIGHT: 540,
  DEBUG: false
};



},{}],2:[function(require,module,exports){
var EnemySpawner,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = EnemySpawner = (function() {
  function EnemySpawner(enemyFactory, framerate, difficulty) {
    this.enemyFactory = enemyFactory;
    this.framerate = framerate;
    this.difficulty = difficulty;
    this.maybeCreateNewEnemy = __bind(this.maybeCreateNewEnemy, this);
    this.update = __bind(this.update, this);
    this.calculateProbability = __bind(this.calculateProbability, this);
    this.calculateProbability();
    this.minDifficultyToSpawnMediumEnemies = 2;
    this.minDifficultyToSpawnLargeEnemies = 3;
    this.probabilityOfSpawningMediumEnemy = 0.5;
    this.probabilityOfSpawningLargeEnemy = 0.2;
  }

  EnemySpawner.prototype.calculateProbability = function() {
    return this.frameProbability = 0.2 / this.framerate * this.difficulty;
  };

  EnemySpawner.prototype.update = function() {
    return this.maybeCreateNewEnemy();
  };

  EnemySpawner.prototype.maybeCreateNewEnemy = function() {
    if (Math.random() < this.frameProbability) {
      if (this.difficulty < this.minDifficultyToSpawnMediumEnemies) {
        return this.enemyFactory.createSmall();
      } else if (this.difficulty < this.minDifficultyToSpawnLargeEnemies) {
        if (Math.random() < this.probabilityOfSpawningMediumEnemy) {
          return this.enemyFactory.createMedium();
        } else {
          return this.enemyFactory.createSmall();
        }
      } else {
        if (Math.random() < this.probabilityOfSpawningLargeEnemy) {
          return this.enemyFactory.createLarge();
        } else if (Math.random() < this.probabilityOfSpawningMediumEnemy) {
          return this.enemyFactory.createMedium();
        } else {
          return this.enemyFactory.createSmall();
        }
      }
    }
  };

  return EnemySpawner;

})();



},{}],3:[function(require,module,exports){
var Enemy, EnemyFactory, G,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

G = require('./constants');

Enemy = (function(_super) {
  __extends(Enemy, _super);

  function Enemy(game, x, y, key, health) {
    this.damage = __bind(this.damage, this);
    this.pointAtSecret = __bind(this.pointAtSecret, this);
    this.update = __bind(this.update, this);
    Enemy.__super__.constructor.call(this, game, x, y, key);
    this.health = health;
    this.anchor.setTo(0.5, 0.5);
    game.physics.p2.enable(this, G.DEBUG);
    this.body.clearShapes();
    this.body.addCircle(this.width / 2);
    this.body.setCollisionGroup(game.collisionGroups.enemy);
    this.body.collides([game.collisionGroups.enemy, game.collisionGroups.tower, game.collisionGroups.secret]);
    game.add.existing(this);
    this.healthText = new Phaser.Text(game, 0, 0, this.health, {
      font: '10px Arial',
      fill: 'black',
      align: 'center'
    });
    this.addChild(this.healthText);
  }

  Enemy.prototype.update = function(secret) {
    this.secret = secret;
    return this.pointAtSecret(this.secret);
  };

  Enemy.prototype.pointAtSecret = function(secret) {
    this.secret = secret;
    return console.log(this.secret);
  };

  Enemy.prototype.damage = function(damage) {
    Enemy.__super__.damage.call(this, damage);
    this.healthText.text = this.health;
    if (this.health <= 0) {
      return G.events.onEnemyKilled.dispatch(this);
    }
  };

  return Enemy;

})(Phaser.Sprite);

module.exports = EnemyFactory = (function() {
  function EnemyFactory(game) {
    this.game = game;
    this.createLarge = __bind(this.createLarge, this);
    this.createMedium = __bind(this.createMedium, this);
    this.createSmall = __bind(this.createSmall, this);
    this.getY = __bind(this.getY, this);
    this.preload = __bind(this.preload, this);
  }

  EnemyFactory.prototype.preload = function() {
    this.game.load.image('enemy-small', 'assets/enemy-small.png');
    this.game.load.image('enemy-medium', 'assets/enemy-medium.png');
    return this.game.load.image('enemy-large', 'assets/enemy-large.png');
  };

  EnemyFactory.prototype.getY = function() {
    return this.game.rnd.integerInRange(0, G.SCREEN_HEIGHT);
  };

  EnemyFactory.prototype.createSmall = function() {
    var enemy;
    enemy = new Enemy(this.game, 0, this.getY(), 'enemy-small', 10);
    enemy.body.moveRight(300);
    this.game.groups.enemy.add(enemy);
    return enemy;
  };

  EnemyFactory.prototype.createMedium = function() {
    var enemy;
    enemy = new Enemy(this.game, 0, this.getY(), 'enemy-medium', 20);
    enemy.body.moveRight(300);
    this.game.groups.enemy.add(enemy);
    return enemy;
  };

  EnemyFactory.prototype.createLarge = function() {
    var enemy;
    enemy = new Enemy(this.game, 0, this.getY(), 'enemy-large', 30);
    enemy.body.moveRight(300);
    this.game.groups.enemy.add(enemy);
    return enemy;
  };

  return EnemyFactory;

})();



},{"./constants":1}],4:[function(require,module,exports){
var EnemyFactory, EnemySpawner, G, LoseOverlay, PlayState, Secret, Stats, Store, TowerFactory,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

G = require('./constants');

EnemySpawner = require('./enemy-spawner');

EnemyFactory = require('./enemy');

TowerFactory = require('./tower');

LoseOverlay = require('./lose-overlay');

Store = require('./store');

Secret = require('./secret');

Stats = require('./stats');

PlayState = (function(_super) {
  __extends(PlayState, _super);

  function PlayState() {
    this.render = __bind(this.render, this);
    this.update = __bind(this.update, this);
    this.handleGameOver = __bind(this.handleGameOver, this);
    this.handlePointerDownOnBackground = __bind(this.handlePointerDownOnBackground, this);
    this.initializeBackground = __bind(this.initializeBackground, this);
    this.initializeEvents = __bind(this.initializeEvents, this);
    this.initializeGroups = __bind(this.initializeGroups, this);
    this.initializePhysicsEngine = __bind(this.initializePhysicsEngine, this);
    this.initializeGame = __bind(this.initializeGame, this);
    this.create = __bind(this.create, this);
    this.preload = __bind(this.preload, this);
    return PlayState.__super__.constructor.apply(this, arguments);
  }

  PlayState.prototype.preload = function() {
    this.game.load.image('background', 'assets/background.png');
    this.game.load.image('secret', 'assets/secret.png');
    this.game.load.image('tower', 'assets/tower.png');
    this.enemyFactory = new EnemyFactory(this.game);
    this.enemyFactory.preload();
    this.towerFactory = new TowerFactory(this.game);
    this.towerFactory.preload();
    this.game.load.image('lose-overlay', 'assets/lose-overlay.png');
    this.game.load.image('store-overlay', 'assets/store-overlay.png');
    return this.game.load.image('store-slot', 'assets/store-slot.png');
  };

  PlayState.prototype.create = function() {
    this.initializeGame();
    this.initializePhysicsEngine();
    this.initializeGroups();
    this.initializeEvents();
    this.game.physics.p2.updateBoundsCollisionGroup();
    this.store = new Store(this.game);
    this.initializeBackground();
    this.stats = new Stats(this.game);
    this.secret = new Secret(this.game, G.SCREEN_WIDTH - 100, G.SCREEN_HEIGHT / 2);
    this.loseOverlay = new LoseOverlay(this.game);
    this.enemySpawner = new EnemySpawner(this.enemyFactory, 60, this.gameDifficulty);
    return G.events.onGameOver.add(this.handleGameOver);
  };

  PlayState.prototype.initializeGame = function() {
    this.game.world.setBounds(-200, 0, G.SCREEN_WIDTH + 200, G.SCREEN_HEIGHT);
    this.game.camera.x = 0;
    this.game.time.advancedTiming = G.DEBUG;
    window.controller = this;
    return this.gameDifficulty = 3;
  };

  PlayState.prototype.initializePhysicsEngine = function() {
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    return this.game.physics.p2.setImpactEvents(true);
  };

  PlayState.prototype.initializeGroups = function() {
    this.game.groups = {
      background: this.game.add.group(),
      tower: this.game.add.group(),
      enemy: this.game.add.group(),
      overlay: this.game.add.group()
    };
    return this.game.collisionGroups = {
      secret: this.game.physics.p2.createCollisionGroup(),
      tower: this.game.physics.p2.createCollisionGroup(),
      enemy: this.game.physics.p2.createCollisionGroup()
    };
  };

  PlayState.prototype.initializeEvents = function() {
    return G.events = {
      onGameOver: new Phaser.Signal(),
      onEnemyKilled: new Phaser.Signal()
    };
  };

  PlayState.prototype.initializeBackground = function() {
    this.background = this.game.add.image(0, 0, 'background');
    this.background.inputEnabled = true;
    this.background.events.onInputDown.add(this.handlePointerDownOnBackground);
    return this.game.groups.background.add(this.background);
  };

  PlayState.prototype.handlePointerDownOnBackground = function(image, pointer) {
    if (this.loseOverlay.isVisible()) {
      return;
    }
    return this.towerFactory.createAoe(pointer.x, pointer.y);
  };

  PlayState.prototype.handleGameOver = function() {
    return this.loseOverlay.show(this.stats.score);
  };

  PlayState.prototype.update = function() {
    this.enemySpawner.update();
    return this.game.groups.enemy.forEachAlive((function(_this) {
      return function(enemy) {};
    })(this));
  };

  PlayState.prototype.render = function() {
    return this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
  };

  return PlayState;

})(Phaser.State);

window.state = new Phaser.Game(G.SCREEN_WIDTH, G.SCREEN_HEIGHT, Phaser.AUTO, 'game-container', new PlayState());



},{"./constants":1,"./enemy":3,"./enemy-spawner":2,"./lose-overlay":5,"./secret":6,"./stats":7,"./store":8,"./tower":9}],5:[function(require,module,exports){
var LoseOverlay;

module.exports = LoseOverlay = (function() {
  function LoseOverlay(game) {
    this.game = game;
    this.sprite = this.game.add.sprite(0, 0, 'lose-overlay');
    this.game.groups.overlay.add(this.sprite);
    this.text = this.game.add.text(200, 200, '', {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center'
    });
    this.hide();
  }

  LoseOverlay.prototype.show = function(score) {
    this.sprite.visible = true;
    this.text.text = "You are the loseriest of losers.\n\nYour score: " + score;
    return this.text.visible = true;
  };

  LoseOverlay.prototype.hide = function() {
    this.sprite.visible = false;
    return this.text.visible = false;
  };

  LoseOverlay.prototype.isVisible = function() {
    return this.sprite.visible;
  };

  return LoseOverlay;

})();



},{}],6:[function(require,module,exports){
var G, Secret,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

G = require('./constants');

module.exports = Secret = (function(_super) {
  __extends(Secret, _super);

  function Secret(game, x, y) {
    this.onEnemyTouch = __bind(this.onEnemyTouch, this);
    Secret.__super__.constructor.call(this, game, x, y, 'secret');
    game.add.existing(this);
    this.anchor.setTo(0.5, 0.5);
    game.physics.p2.enable(this, G.DEBUG);
    this.body.kinematic = true;
    this.body.clearShapes();
    this.body.addCircle(this.width / 2);
    this.body.setCollisionGroup(this.game.collisionGroups.secret);
    this.body.collides([this.game.collisionGroups.enemy]);
    this.body.createGroupCallback(this.game.collisionGroups.enemy, this.onEnemyTouch);
  }

  Secret.prototype.onEnemyTouch = function() {
    return G.events.onGameOver.dispatch();
  };

  return Secret;

})(Phaser.Sprite);



},{"./constants":1}],7:[function(require,module,exports){
var G, Stats,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

G = require('./constants');

module.exports = Stats = (function() {
  function Stats(game) {
    this.game = game;
    this.updateText = __bind(this.updateText, this);
    this.handleEnemyKilled = __bind(this.handleEnemyKilled, this);
    this.score = 0;
    this.gold = 500;
    this.text = this.game.add.text(20, 20, '', {
      font: '20px Arial',
      fill: 'black',
      align: 'left'
    });
    this.updateText();
    G.events.onEnemyKilled.add(this.handleEnemyKilled);
  }

  Stats.prototype.handleEnemyKilled = function(enemy) {
    switch (enemy.key) {
      case 'enemy-small':
        this.gold += this.game.rnd.between(5, 10);
        this.score += 5;
        break;
      case 'enemy-medium':
        this.gold += this.game.rnd.between(10, 20);
        this.score += 10;
        break;
      case 'enemy-large':
        this.gold += this.game.rnd.between(20, 50);
        this.score += 20;
    }
    return this.updateText();
  };

  Stats.prototype.updateText = function() {
    return this.text.text = "Gold: " + this.gold + " Score: " + this.score;
  };

  return Stats;

})();



},{"./constants":1}],8:[function(require,module,exports){
var Store,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = Store = (function() {
  function Store(game) {
    this.game = game;
    this.toggleStore = __bind(this.toggleStore, this);
    this.overlay = this.game.add.sprite(0, -474, 'store-overlay');
    this.overlay.inputEnabled = true;
    this.game.groups.overlay.add(this.overlay);
    this.slideDownTween = this.game.add.tween(this.overlay).to({
      y: 0
    }, 700, Phaser.Easing.Bounce.Out);
    this.slideUpTween = this.game.add.tween(this.overlay).to({
      y: -474
    }, 700, Phaser.Easing.Bounce.Out);
    this.overlay.events.onInputDown.add(this.toggleStore);
    this.state = 'up';
  }

  Store.prototype.toggleStore = function() {
    if (this.state === 'up') {
      this.slideDownTween.start();
      return this.state = 'down';
    } else if (this.state === 'down') {
      this.slideUpTween.start();
      return this.state = 'up';
    }
  };

  return Store;

})();



},{}],9:[function(require,module,exports){
var G, Tower, TowerFactory,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

G = require('./constants');

Tower = (function(_super) {
  __extends(Tower, _super);

  function Tower(game, x, y, key, cooldown, range, damage) {
    this.cooldown = cooldown;
    this.range = range;
    this.damage = damage;
    this.fire = __bind(this.fire, this);
    this.handleClick = __bind(this.handleClick, this);
    this.decreaseCooldownRemaining = __bind(this.decreaseCooldownRemaining, this);
    this.update = __bind(this.update, this);
    Tower.__super__.constructor.call(this, game, x, y, key);
    this.inputEnabled = true;
    this.events.onInputDown.add(this.handleClick, this);
    this.anchor.setTo(0.5, 0.5);
    game.physics.p2.enable(this, G.DEBUG);
    this.body.clearShapes();
    this.body.addCircle(this.width / 2);
    this.body.kinematic = true;
    this.body.setCollisionGroup(this.game.collisionGroups.tower);
    this.body.collides([this.game.collisionGroups.enemy]);
    game.add.existing(this);
    this.cooldownRemaining = 0;
  }

  Tower.prototype.update = function() {
    return this.decreaseCooldownRemaining();
  };

  Tower.prototype.decreaseCooldownRemaining = function() {
    return this.cooldownRemaining -= 1;
  };

  Tower.prototype.handleClick = function() {
    return this.fire();
  };

  Tower.prototype.fire = function() {
    if (this.cooldownRemaining > 0) {
      return;
    }
    this.game.groups.enemy.forEachAlive((function(_this) {
      return function(enemy) {
        var dist;
        dist = Math.sqrt(Math.pow(enemy.x - _this.x, 2) + Math.pow(enemy.y - _this.y, 2));
        if (dist < _this.range) {
          return enemy.damage(_this.damage);
        }
      };
    })(this));
    return this.cooldownRemaining = this.cooldown;
  };

  return Tower;

})(Phaser.Sprite);

module.exports = TowerFactory = (function() {
  function TowerFactory(game) {
    this.game = game;
    this.createAoe = __bind(this.createAoe, this);
    this.preload = __bind(this.preload, this);
  }

  TowerFactory.prototype.preload = function() {
    return this.game.load.image('tower-aoe', 'assets/tower.png');
  };

  TowerFactory.prototype.createAoe = function(x, y) {
    var tower;
    tower = new Tower(this.game, x, y, 'tower-aoe', 60, 100, 10);
    return tower;
  };

  return TowerFactory;

})();



},{"./constants":1}]},{},[4])