const { makeSimplePalette, overridePlacementWithFunction, palleteWithRotation } = require("./common")

function makeSafe(block, run) {
    const loottables = ['minecraft:chests/bastion_treasure', 'minecraft:chests/end_city_treasure', 'minecraft:chests/buried_treasure', 'aquaculture:box/neptunes_bounty', 'minecraft:chests/shipwreck_treasure', 'minecraft:chests/bastion_treasure', 'minecraft:chests/end_city_treasure', 'minecraft:chests/buried_treasure', 'aquaculture:box/neptunes_bounty', 'minecraft:chests/shipwreck_treasure', 'minecraft:chests/ruined_portal', 'minecraft:chests/stronghold_corridor', 'minecraft:chests/desert_pyramid', 'minecraft:chests/igloo_chest', 'minecraft:chests/igloo_chest', 'twilightforest:structures/graveyard', 'twilightforest:structures/useless', 'twilightforest:structures/hedge_maze']
    let loottable = loottables[Math.floor(Math.random()*loottables.length)]

    let code = Math.floor(Math.random()*10000).toString().padStart(4, '0')
    const easyCodes = ['1234', '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '2580']
    if(Math.random() < 0.25) code = easyCodes[Math.floor(Math.random()*easyCodes.length)]
 
    const owners = ["Herobrine", "Herobrine", "Herobrine", "Riko", "Reg", "Nanachi", "Mitty", "Ozen", "Marulk", "Lyza", "Bondrewd", "Hakurou", "Jiruo", "Habo", "Vueko", "Kiyui", "Natt", "Shiggy", "Hollow", "Mio", "Maaa", "Torka", "Kane", "Belaf", "Prushka", "Irumyuui", "Faputa", "Nanafushi", "Laffi", "Wazukyan", "DanTDM","PopularMMOs","CaptainSparklez","Ssundee","StampyLongHead","Grian","LDShadowLady","Mumbo Jumbo","iHasCupquake","PrestonPlayz","TheDiamondMinecart","BajanCanadian","EthosLab","JeromeASF","Keralis","AntVenom","SkyDoesMinecraft","Lachlan","Thinknoodles","NoahCraftFTW","JackSucksAtLife","Aphmau","BdoubleO100","Mini Ladd","Logdotzip","Antfrost","Joey Graceffa","Cubfan135","AntVenom","Taurtis","TheSyndicateProject","StacyPlays","Yammy","Jeracraft","SmallishBeans","TBNRfrags","ChimneySwift11","Graser","Xisuma","JerryVsHarry","DanOMG","Skeppy","PhoenixSC","Dangthatsalongname","Eckosoldier","TheAtlanticCraft","Slogoman","SSundee","TommyInnit","CallMeCarson","Dream","GoodTimesWithScar","Grian","iBallisticSquid","Inthelittlewood","JackFrostMiner","Jeb","KSI","LDShadowLady","TheBajanCanadian","MagmaMusen","MrWoofless","Ninja","Notch","OMGcraft","Pat","PewDiePie","PopularMMOs","ReNDoG","SeaPeeKay","Shubble","TheDiamondMinecart","Thinknoodles","Wisp","xNestorio","Yogscast","ZaiLetsPlay","ZedaphPlays","ZephPlayz","ZexyZek","ZombieCleo","Zyphon","Avomance","BeckBroJack","Biffle","Bigbst4tz2","Bionic","Boltz","Boogie2988"]
    let owner = owners[Math.floor(Math.random()*owners.length)]
    run(`setblock ~ ~ ~ ${block}{passcode:"${code}",owner:"${owner}",CustomName:'{"text":"${owner}\\'s Safe"}'}`)
    run(`loot insert ~ ~ ~ loot ${loottable}`)
}

function makeBackpack(block, run) {
    let color1 = Math.floor(Math.random()*256*256*256)
    let color2 = Math.floor(Math.random()*256*256*256)
    let uidBase = 386409942
    let uid1 = Math.floor(Math.random()*uidBase*2-uidBase)
    let uid2 = Math.floor(Math.random()*uidBase*2-uidBase)
    let uid3 = Math.floor(Math.random()*uidBase*2-uidBase)
    let uid4 = Math.floor(Math.random()*uidBase*2-uidBase)

    run(`setblock ~ ~ ~ ${block}{backpackData: {id: "sophisticatedbackpacks:backpack", Count: 1b, tag: {inventorySlots: 27, upgradeSlots: 1, renderInfo: {upgradeItems: [{id: "minecraft:air", Count: 1b, tag: {}}]}, contentsUuid: [I; ${uid1}, ${uid2}, ${uid3}, ${uid4}], borderColor: ${color1}, clothColor: ${color2}}}}`)
}

module.exports = function() {
    makeSimplePalette("safe", overridePlacementWithFunction(palleteWithRotation('⯯⯮⯭⯬', ['securitycraft:keypad_chest']), makeSafe))
    makeSimplePalette("backpack", overridePlacementWithFunction(palleteWithRotation('ᕋᕂᕊᕄ', ['sophisticatedbackpacks:backpack[battery=false]']), makeBackpack))
}
