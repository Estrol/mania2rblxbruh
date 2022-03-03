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
	for (var timing in beatmap.timingPoints) {
		append(timing)
	}

	append("H")
    for (var note in beatmap.hitObjects) {
		append(note)
	}

    return fileContents
})