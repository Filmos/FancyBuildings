onEvent("command.registry", event => {
    const { commands: Commands, arguments: Arguments } = event;
    event.register(
        Commands.literal("setblock_delayed")
            .requires(src => src.hasPermission(2))
            .then(Commands.argument('pos', Arguments.BLOCK_POS_LOADED.create(event))
                .then(Commands.argument('block', Arguments.STRING.create(event))
                    .executes(ctx => {
                        const blockArgs = Arguments.STRING.getResult(ctx, "block").split(";")
                        let i = 0; let weights = blockArgs.filter(el => {i+=1; return i%2==1}).map(el => parseFloat(el))
                        i = 0; let blocks = blockArgs.filter(el => {i+=1; return i%2==0})
                        let block = blocks[weightedRandom(weights)]

                        block = fillInVars(block)

                        const pos = Arguments.BLOCK_POS_LOADED.getResult(ctx, "pos")
                        const command = `execute in ${ctx.source.level.dimension().location()} run setblock ${pos.x} ${pos.y} ${pos.z} ${block}`
                        console.log(command)

                        const level = ctx.source.level.asKJS()
                        level.getServer().schedule(200, {server: level.getServer(), command: command}, function (callback) {
                            callback.data.server.runCommandSilent(callback.data.command)
                        })
                        return 1
                    })
                ))
    )
})

function weightedRandom(weights) {
    let cummulative = weights.map((sum => value => sum += value)(0));
    let rand = Math.random()*cummulative[cummulative.length-1];
    let result = cummulative.findIndex(el => rand <= el);
    return result
}

function fillInVars(block) {
    const colors = ['white', 'orange', 'magenta', 'light_blue', 'yellow', 'lime', 'pink', 'gray', 'light_gray', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black']
    block = block.replace('%color%', colors[Math.floor(Math.random()*colors.length)])
    return block
}