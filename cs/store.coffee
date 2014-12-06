G = require('./constants')
TowerFactory = require('./tower')


forSaleItems =
    towerAoe:
        createFn: 'createAoe'
        imageKey: 'tower-aoe'
        cost: 10


module.exports = class Store
    constructor: (@game, @towerFactory, @stats) ->
        @overlay = @game.add.sprite(0, -474, 'store-overlay')
        @overlay.inputEnabled = true
        @game.groups.overlay.add(@overlay)
        @slideDownTween = @game.add.tween(@overlay).to({y: 0}, 700, Phaser.Easing.Bounce.Out)
        @slideUpTween = @game.add.tween(@overlay).to({y: -474}, 700, Phaser.Easing.Bounce.Out)

        @overlay.events.onInputDown.add(@toggleStore)
        @state = 'up'

        @addForSaleItem(forSaleItems.towerAoe)

    addForSaleItem: (itemData) ->
        slot = @game.add.sprite(200, 100, 'store-slot')
        slot.anchor.setTo(0.5, 0.5)
        item = @game.add.sprite(200, 100, itemData.imageKey)
        item.anchor.setTo(0.5, 0.5)
        @overlay.addChild(slot)
        @overlay.addChild(item)
        item.inputEnabled = true
        item.input.priorityID = 1
        item.events.onInputDown.add(@handleClickOnForSaleItem)
        item.data = itemData

    handleClickOnForSaleItem: (item) =>
        @stats.subtractGold(item.data.cost)
        G.events.onStoreItemPurchased.dispatch(item.data)

        @toggleStore()

    toggleStore: =>
        if @state == 'up'
            @slideDownTween.start()
            @state = 'down'
        else if @state == 'down'
            @slideUpTween.start()
            @state = 'up'
