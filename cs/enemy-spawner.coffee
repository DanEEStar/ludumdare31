module.exports = class EnemySpawner
    constructor: (@enemyFactory, @framerate, @difficulty) ->
        @calculateProbability()

        @secondsUntilSpawnRateDoubled = 60
        @framesUntilSpawnRateDoubled = @framerate * @secondsUntilSpawnRateDoubled

        @stopped = false

    calculateProbability: () =>

        # For efficiency, since it'll be used every update
        @frameProbability = 0.1 / @framerate * @difficulty

    update: (frame) =>
        return if @stopped
        @maybeCreateNewEnemy(frame)

    maybeCreateNewEnemy: (frame) =>
        if Math.random() < @frameProbability * (frame / @framesUntilSpawnRateDoubled + 1)
            @enemyFactory.createEnemy()
            @stop()

    stop: () =>
        @stopped = true
