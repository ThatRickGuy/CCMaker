//Return the Override Models set 
function CheckForThemeOverrides(AllModels, Faction, ThemeName) {
    for (var i = 0; i < AllModels.Factions.length; i++) {
        if (AllModels.Factions[i].Name == Faction) {
            if (AllModels.Factions[i].ThemeOverrides != null) {
                for (var j = 0; j < AllModels.Factions[i].ThemeOverrides.length; j++) {
                    if (AllModels.Factions[i].ThemeOverrides[j].ThemeName == ThemeName) {
                        return AllModels.Factions[i].ThemeOverrides[j].Models;
                    }
                }
            }
        }
    }
    return null;
}

//Serializes/Deserializes an object to make sure we have a clone, not a pointer to AllModels
function clone(object) {
    return JSON.parse(JSON.stringify(object));
}

function lookUpSingle(AllModels, Faction, ThemeName, TargetName, TargetKey) {
    TargetName = TargetName.replace("í", "i");
    if (AllModels.Factions != null) {
        for (var i = 0; i < AllModels.Factions.length; i++) {
            if (AllModels.Factions[i].Name == Faction) {
                var models = AllModels.Factions[i].Models[TargetKey];
                if (models != null) {
                    for (var j = 0; j < models.length; j++) {
                        if (models[j].CCName == TargetName) {
                            return clone(models[j]);
                        }
                    }
                }
            }
        }
    } else {
        //override list was sent in
        var models = AllModels.Models;
        if (models != null) {
            for (var j = 0; j < models.length; j++) {
                if (models[j].CCName == TargetName) {
                    return clone(models[j]);
                }
            }
        }
    }
}


function lookUp(AllModels, Faction, ThemeName, TargetName, TargetKey, Attached, xOffset) {
    var ModelGroup = [];
    var IndependentModels = [];

    var OverrideModels = CheckForThemeOverrides(AllModels, Faction, ThemeName);

    var model = null;
    //Check theme override models
    if (OverrideModels != null) {
        model = lookUpSingle(OverrideModels, Faction, ThemeName, TargetName, TargetKey);
    }

    //check supplied faction models
    if (model == null) {
        model = lookUpSingle(AllModels, Faction, ThemeName, TargetName, TargetKey);
    }

    //check merc models
    if (model == null) {
        model = lookUpSingle(AllModels, 'Mercenaries', ThemeName, TargetName, TargetKey);
    }

    //check minion models
    if (model == null) {
        model = lookUpSingle(AllModels, 'Minions', ThemeName, TargetName, TargetKey);
    }


    //if we haven't found it yet, it's either some screwy cross-faction thing I haven't accounted for or bad data
    if (model != null) {
        //add the found model the return set
        model.X = xOffset;
        if (Attached == null && model.Include == null) {
            IndependentModels.push(model);
        } else {
            ModelGroup.push(model);
        }

        if (Attached != null) {
            //Attached models. This can be a UA (good!) or a Jack/Beast (bad!)
            //loop through all attached models
            for (var i = 0; i < Attached.length; i++) {
                //if they are not a Jack/Beast, add them to the ModelGroup
                var attachedModel = null;
                var attachedTargetName = Attached[i].desc;
                if (attachedTargetName == null) attachedTargetName = Attached[i].name;


                //Check theme override models
                if (OverrideModels != null) {
                    attachedModel = lookUpSingle(OverrideModels, Faction, ThemeName, attachedTargetName, Attached[i].type);
                    if (Attached[i].type != "Attachment" && attachedModel == null) {
                        attachedModel = lookUpSingle(OverrideModels, Faction, ThemeName, attachedTargetName, "Attachment");
                    }
                }

                //check supplied faction models
                if (attachedModel == null) {
                    attachedModel = lookUpSingle(AllModels, Faction, ThemeName, attachedTargetName, Attached[i].type);
                    if (Attached[i].type != "Attachment" && attachedModel == null) {
                        attachedModel = lookUpSingle(AllModels, Faction, ThemeName, attachedTargetName, "Attachment");
                    }
                }

                //check merc models
                if (attachedModel == null) {
                    attachedModel = lookUpSingle(AllModels, 'Mercenaries', ThemeName, attachedTargetName, Attached[i].type);
                    if (Attached[i].type != "Attachment" && attachedModel == null) {
                        attachedModel = lookUpSingle(AllModels, 'Mercenaries', ThemeName, attachedTargetName, "Attachment");
                    }
                }

                //check minion models
                if (attachedModel == null) {
                    attachedModel = lookUpSingle(AllModels, 'Minions', ThemeName, attachedTargetName, Attached[i].type);
                    if (Attached[i].type != "Attachment" && attachedModel == null) {
                        attachedModel = lookUpSingle(AllModels, 'Minions', ThemeName, attachedTargetName, "Attachment");
                    }
                }

                if (attachedModel != null) {
                    attachedModel.X = xOffset;
                    //add the found attached model the return set
                    if (Attached[i].type != "Warjack" && Attached[i].type != "Warbeast") {
                        ModelGroup.push(attachedModel);
                    } else {
                        IndependentModels.push(attachedModel);
                    }
                }
            }
        }

        //dig down the hole of includes
        while (model != null && model.Include != null) {
            var OldModel = model;
            model = null;
            //Check theme override models
            if (OverrideModels != null) {
                model = lookUpSingle(OverrideModels, Faction, ThemeName, OldModel.Include, OldModel.IncludeType);
            }

            //check supplied faction models
            if (model == null) {
                model = lookUpSingle(AllModels, Faction, ThemeName, OldModel.Include, OldModel.IncludeType);
            }

            //check merc models
            if (model == null) {
                model = lookUpSingle(AllModels, 'Mercenaries', ThemeName, OldModel.Include, OldModel.IncludeType);
            }

            //check minion models
            if (model == null) {
                model = lookUpSingle(AllModels, 'Minions', ThemeName, OldModel.Include, OldModel.IncludeType);
            }

            if (model != null) {
                model.X = xOffset;
                if (OldModel.IncludeType == 'Warbeast' || OldModel.IncludeType == 'Warjack') {
                    IndependentModels.push(model);
                } else {
                    ModelGroup.push(model);
                }
            }
        }
    }

    return {
        ModelGroup: ModelGroup,
        IndependentModels: IndependentModels
    };

}