G = require('./constants')
Tower = require('./tower')
SaltAnimation = require('./salt-patch')


module.exports = class SaltTower extends Tower
    @properties =
        cooldown: 120
        range: 50
        damage: 1
        animationCls: SaltAnimation
        framesToDoOccasionalDamage: 60
        maxEnemySpeed: 10
        stunDuration: 60

    fire: () =>
        return if not super()

        @animation.blast()

        # If there are any enemies on top of it, stun them
        @enemyGroup.forEachAlive (enemy) =>
            dist = Phaser.Math.distance(enemy.x, enemy.y, @x, @y)
            if dist < (@width + enemy.radius) / 2 + @range
                enemy.body.setZeroVelocity()
                enemy.stunDuration = SaltTower.properties.stunDuration

    doConstantEffect: () =>
        # If there are any enemies on top of it, slow them down
        @enemyGroup.forEachAlive (enemy) =>
            dist = Phaser.Math.distance(enemy.x, enemy.y, @x, @y)
            if dist < (@width + enemy.radius) / 2

                # Limit the enemy's speed
                vector = new Phaser.Point(enemy.body.velocity.x, enemy.body.velocity.y)
                magnitude = vector.getMagnitude()
                if magnitude > SaltTower.properties.maxEnemySpeed
                    vector.setMagnitude(SaltTower.properties.maxEnemySpeed)
                    enemy.body.velocity.x = vector.x
                    enemy.body.velocity.y = vector.y

                # Do damage to the enemy
                if @game.frame % SaltTower.properties.framesToDoOccasionalDamage == 0
                    enemy.damage @damage
