var parser = module.require("osuparser")
var format = module.require('format');

module.export("osu_to_lua", function(osu_contents) {
    var fileContents = ""

    function append(str, newline) {
        if (newline == undefined || newline == true) {
            fileContents += (str + "\n")
        } else {
            fileContents += str
        }
    }

    var beatmap = parser.parseContent(osu_contents)
    if (beatmap.general.mode != 3) {
        append("ERROR: only supported mode: 3 (or osu!mania) only")
        return fileContents
    }

    if (beatmap.hitObjects.length == 0) {
        append("ERROR: empty hit objects")
        return fileContents
    }
    
    append(beatmap.difficulty.circleSize.toString())
    
    append("T")
	for (let i = 0; i < beatmap.timingPoints.length; i++) {
		let data = beatmap.timingPoints[i].split(',')
		let time = parseInt(data[0])
		let beatLength = parseInt(data[1])
		let inherrited = 0
		if (beatLength <= 0) {
			inherrited = 1
		}

		append(format("%d,%d,%d", time, inherrited, beatLength))
	}
	
	append("H")
    for (let i = 0; i < beatmap.hitObjects.length; i++) {
		let data = beatmap.hitObjects[i].split(',')
		let pos = parseInt(data[0])
		let lane = Math.floor(pos * beatmap.difficulty.circleSize / 512) + 1
		let time = parseInt(data[2])
		let is_hold = parseInt(data[3]) == 128
		let duration = 0
		if (is_hold) {
			duration = parseInt(data[5])
		}
	
		append(format("%d,%d,%d,%d", time, lane, is_hold ? 1 : 0, duration))
	}

    return fileContents
})