export const CBRStatSkillPointsCounter = {
    ID: 'cyberpunk-red-statskill-points-counters'
};

Hooks.once('init', () => {
    game.settings.register(CBRStatSkillPointsCounter.ID, "StatOffset", {
        name: "Stat Offset",
        scope: "world",
        default: 0, type: Number,
        config: true,
        
    });
    game.settings.register(CBRStatSkillPointsCounter.ID, "SkillOffset", {
        name: "Skill Offset",
        scope: "world",
        default: 0, type: Number,
        config: true,
        
    });
    game.settings.register(CBRStatSkillPointsCounter.ID, "Subtractive", {
        name: "Subtractive",
        scope: "world",
        default: true, type: Boolean,
        config: true,
        
    });
    game.settings.register(CBRStatSkillPointsCounter.ID, "StatMax_default", {
        name: "Stat Max default",
        scope: "world",
        default: 62, type: Number,
        config: true,
    });
    game.settings.register(CBRStatSkillPointsCounter.ID, "SkillMax_default", {
        name: "Skill Max default",
        scope: "world",
        default: 86, type: Number,
        config: true,
       
    });
});



function getTotalSkillPoints(actor) {
	let total = 0;
	if (actor && actor.itemTypes.skill)
		actor.itemTypes.skill.forEach((skill) => {
			if (skill.system.level) {
				if(skill.system.difficulty === "difficult")
					total += actor.getSkillLevel(skill.name) * 2;
				else
					total += actor.getSkillLevel(skill.name);
			}
		});
 	return total - game.settings.get(CBRStatSkillPointsCounter.ID, "SkillOffset");// 26 is skill points that are already invested in 13 skills (althetics etc.): (13 * 2);
};

function getTotalStatPoints(actor) {
	let total = 0;
	if (actor && actor.system.stats) {
		Object.keys(actor.system.stats).forEach((stat) => {
			if (actor.system.stats[stat].value) {
				if (actor.system.stats[stat].max) total += actor.system.stats[stat].max;
				else total += actor.system.stats[stat].value;
			}
		});
	}
	return total - game.settings.get(CBRStatSkillPointsCounter.ID, "StatOffset");
};

Hooks.on('renderActorSheet', (app, html, data) => {
    if (data.actor.type !== 'character') return;
    
    let counters = '<div class="skill-points-total text-center">';
	
	let maxStat = game.settings.get(CBRStatSkillPointsCounter.ID, "StatMax_default");
	let maxSkill = game.settings.get(CBRStatSkillPointsCounter.ID, "SkillMax_default");

	let totalStat = getTotalStatPoints(data.actor);
	let totalSkill = getTotalSkillPoints(data.actor);
	if(maxStat != null && maxSkill != null)
	{
		if(game.settings.get(CBRStatSkillPointsCounter.ID, "Subtractive"))
		{
			counters += '<span class="text-semi">STAT: ' + (maxStat  - totalStat ) + '</span>';
			counters += '<span class="text-semi">SKILL: ' + (maxSkill - totalSkill) + '</span>';
		}
		else
		{
			counters += '<span class="text-semi">STAT: ' + totalStat + '/' + maxStat + '</span>';
			counters += '<span class="text-semi">SKILL: ' + totalSkill + '/' + maxSkill + '</span>';
		}
	}
	else
	{
		counters += '<span class="text-semi">STAT: ' + totalStat + '</span>';
		counters += '<span class="text-semi">SKILL: ' + totalSkill + '</span>';
	}
	counters += '</div>';

	$(".actor-details-wound-state").empty();
	$(".actor-details-wound-state").append(counters);
});
