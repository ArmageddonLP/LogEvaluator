# LogEvaluator
LogEvaluator (version 2)
LogEvaluator

fillOrder(Object order, Object emboldened, Object duration, Object success, Object name, Object cm)
Internal Function: Avoid using this directly unless you know what you're doing.

Arguments:
Name	Type	Description
order	Object	
emboldened	Object	
duration	Object	
success	Object	
name	Object	
cm	Object	
fillOrderWithDpsReportData(Object logUrl, Object order)
Internal Function: Avoid using this directly unless you know what you're doing.

Arguments:
Name	Type	Description
logUrl	Object	
order	Object	
secondsToDuration(Object secs)
Internal Function: Avoid using this directly unless you know what you're doing.

Arguments:
Name	Type	Description
secs	Object	
wingman_Boss_Record(Object bossId)
Returns the current patch record of a boss on wingman by bossId. 1. bossId: CellReference - ex.: 19691 Id of the boss on wingman

Arguments:
Name	Type	Description
bossId	Object	
fillOrderWithWingmanData(Object logUrl, Object order)
Internal Function: Avoid using this directly unless you know what you're doing.

Arguments:
Name	Type	Description
logUrl	Object	
order	Object	
evaluateLog(Object logUrl, Object order)
Returns an evaluation of a given log by url. 1. logUrl: CellReference - ex.: https://dps.report/FWfO-20231021-210842_vg or https://gw2wingman.nevermindcreations.de/log/28195-20231023-213456_sam_kill Accepted domains are *dps.report* and *gw2wingman.nevermindcreations 2. order: CellRange - ex.: [NAME,CM,EMBOLDENED,SUCCESS,DURATION] The properties in order will be directly replaced with the corresponding data. The example includes all possible values you can use. You are free to use less values and in different order.

Arguments:
Name	Type	Description
logUrl	Object	
order	Object	
wingman_Boss_Name(Object bossId)
Returns the name of a boss on wingman by bossId. 1. bossId: CellReference - ex.: 19691 Id of the boss on wingman

Arguments:
Name	Type	Description
bossId	Object
