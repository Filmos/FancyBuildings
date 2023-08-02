onEvent("command.registry", event => {
    const { commands: Commands, arguments: Arguments } = event;
    event.register(
        Commands.literal("setblock_delayed")
            .requires(src => src.hasPermission(2))
            .then(Commands.argument('pos', Arguments.BLOCK_POS_LOADED.create(event))
                .then(Commands.argument('block', Arguments.STRING.create(event))
                    .executes(ctx => {
                        const pos = Arguments.BLOCK_POS_LOADED.getResult(ctx, "pos")
                        const blocks = Arguments.STRING.getResult(ctx, "block").split(";")

                        const colors = ['white', 'orange', 'magenta', 'light_blue', 'yellow', 'lime', 'pink', 'gray', 'light_gray', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black']

                        let block = blocks[Math.floor(Math.random()*blocks.length)]
                        block = block.replace('%color%', colors[Math.floor(Math.random()*colors.length)])

                        let level = ctx.source.level.asKJS()
                        let command = `execute in ${ctx.source.level.dimension().location()} run setblock ${pos.x} ${pos.y} ${pos.z} ${block}`
                        console.log(command)
                        level.getServer().schedule(200, {server: level.getServer(), command: command}, function (callback) {
                            callback.data.server.runCommandSilent(callback.data.command)
                        })
                        return 1
                    })
                ))
    )
})