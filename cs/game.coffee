G = require('./constants')
EnemySpawner = require('./enemy-spawner')
EnemyFactory = require('./enemy')
FireTower = require('./fire-tower')
FanTower = require('./fan-tower')
SaltTower = require('./salt-tower')
LoseOverlay = require('./lose-overlay')
Store = require('./store')
Secret = require('./secret')
Stats = require('./stats')
Fire = require('./fire')
Fan = require('./fan')
SaltPatch = require('./salt-patch')


class PlayState extends Phaser.State

    preload: =>
        @game.load.image('background', 'assets/background.png')
        @game.load.image('secret', 'assets/secret.png')
        @game.load.image('tower', 'assets/tower.png')

        @game.load.image('enemy-medium', 'assets/enemy-medium.png')

        @game.load.image('tower-aoe', 'assets/tower.png')

        @game.load.image('lose-overlay', 'assets/lose-overlay.png')
        @game.load.image('store-overlay', 'assets/store-overlay.png')
        @game.load.image('store-slot', 'assets/store-slot.png')

        @game.load.image('firewood', 'assets/firewood.png')
        @game.load.image('fire-particle', 'assets/fire-particle.png')

        @game.load.spritesheet('fan', 'assets/fan.png', 64, 64, 4)
        @game.load.spritesheet('snow-particles', 'assets/snow-particles.png', 4, 4, 4)
        @game.load.spritesheet('snowflake-particles', 'assets/snowflake-particles.png', 16, 16, 5)
        @game.load.image('salt-patch', 'assets/salt-patch.png', 64, 64)
        @game.load.image('salt-particle', 'assets/salt-particle.png')

        @game.load.spritesheet('snowman', 'assets/snowman.png', 94, 101, 8)

        @game.load.audio('play-bgm', 'assets/bgm/happybgm.ogg')
        @game.load.audio('gameover-bgm', 'assets/bgm/gameoverbgm.ogg')

    create: =>
        bgm = @game.add.audio('play-bgm', 0.4)
        bgm.loop = yes
        bgm.play()

        @initializeGame()
        @initializePhysicsEngine()
        @initializeGroups()

        @game.physics.p2.updateBoundsCollisionGroup()

        @stats = new Stats(@game)
        @store = new Store(@game, @stats)
        @initializeBackground()
        @initializeSecret()
        @loseOverlay = new LoseOverlay(@game)
        @initializeEnemySpawner()

        G.events.onGameOver.add(@handleGameOver)
        G.events.onStoreItemPurchased.add(@handleStoreItemPurchased)

        @game.frame = 0

        # TODO: Remove this! Iz for cheats
        key = @game.input.keyboard.addKey(Phaser.Keyboard.ONE)
        key.onDown.add () =>
            new FireTower(@game, @game.input.mousePointer.x, @game.input.mousePointer.y)
        key = @game.input.keyboard.addKey(Phaser.Keyboard.TWO)
        key.onDown.add () =>
            new FanTower(@game, @game.input.mousePointer.x, @game.input.mousePointer.y)
        key = @game.input.keyboard.addKey(Phaser.Keyboard.THREE)
        key.onDown.add () =>
            new SaltTower(@game, @game.input.mousePointer.x, @game.input.mousePointer.y)

    initializeGame: () =>
        @game.world.setBounds(-200, 0, G.SCREEN_WIDTH + 200, G.SCREEN_HEIGHT)
        @game.camera.x = 0
        @game.time.advancedTiming = G.DEBUG
        window.controller = @
        @gameDifficulty = 3
        @boughtItem = null
        @cursorSprite = null

    initializePhysicsEngine: () =>
        @game.physics.startSystem(Phaser.Physics.P2JS)
        @game.physics.p2.setImpactEvents(true)
        @game.physics.p2.setBounds(-200, 64, G.SCREEN_WIDTH + 200, G.SCREEN_HEIGHT - 64)

    initializeGroups: () =>
        @game.groups = {}
        @game.groups.background = @game.add.group()
        @game.groups.tower = @game.add.group()
        @game.groups.enemy = @game.add.group()
        @game.groups.secret = @game.add.group()
        @game.groups.overlay = @game.add.group()

        # Initialize physics collision groups
        @game.collisionGroups =
            secret: @game.physics.p2.createCollisionGroup()
            tower: @game.physics.p2.createCollisionGroup()
            enemy: @game.physics.p2.createCollisionGroup()

    initializeBackground: () =>
        @background = @game.add.image(0, 0, 'background')
        @background.inputEnabled = true
        @background.events.onInputDown.add(@handlePointerDownOnBackground)
        @game.groups.background.add(@background)

    initializeEnemySpawner: () =>
        enemyFactory = new EnemyFactory(@game, @game.groups.tower, @secret)
        @enemySpawner = new EnemySpawner(enemyFactory, 60, @gameDifficulty)

    initializeSecret: () =>
        @secret = new Secret(@game, G.SCREEN_WIDTH - 100, G.SCREEN_HEIGHT/2)
        @game.groups.secret.add(@secret)


    handlePointerDownOnBackground: (image, pointer) =>
        if @boughtItem
            new @boughtItem.class(@game, pointer.x, pointer.y)
            @boughtItem = null
            @cursorSprite.destroy()

    handleGameOver: =>
        @enemySpawner.stop()
        @loseOverlay.show(@stats.score, @stats.enemiesKilled)

    handleStoreItemPurchased: (itemData) =>
        @boughtItem = itemData

        if @boughtItem.placeable
            @cursorSprite = @game.add.sprite(@game.input.x, @game.input.y, itemData.imageKey)
            @game.groups.overlay.add(@cursorSprite)
            @cursorSprite.anchor.setTo(0.5, 0.5)
            @cursorSprite.alpha = 0.5
            @cursorSprite.update = =>
                @cursorSprite.x = @game.input.x
                @cursorSprite.y = @game.input.y
        else
            args = []
            for arg in @boughtItem.requires
                args.push @[arg]
            @boughtItem.createFn.apply @, args
            @boughtItem = null

    update: =>
        @game.frame++
        @enemySpawner.update(@game.frame)
        @game.groups.enemy.sort('y', Phaser.Group.SORT_ASCENDING)

    render: =>
        @game.debug.text(@game.time.fps || '--', 2, 14, "#00ff00")


window.state = new Phaser.Game(G.SCREEN_WIDTH, G.SCREEN_HEIGHT, Phaser.AUTO, 'game-container', new PlayState())
