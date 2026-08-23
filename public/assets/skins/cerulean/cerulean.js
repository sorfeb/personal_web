/*
    ©2000 Microsoft Corporation. All rights reserved.
*/

var noPane = 0;
var audPane = 1;
var plPane = 2;
var vidPane = 3;
var currentPane = audPane;
var openingPane = 0;

var vidIsRunning = false;

function OnLoad()
{
    pl.setColumnResizeMode(0, "Stretches");
    pl.setColumnResizeMode(1, "AutoSizeData");
    OnOpenStateChange();
    OnPlayStateChange();
    SetPane(noPane);
    vidIsRunning ? StartVideo() : EndVideo();
}

function OnOpenStateChange()
{
    vidIsRunning = (player.openState==osMediaOpen) &&
        (player.currentMedia.ImageSourceWidth>0);
    if(player.openState == osMediaOpen)
    {
        status.visible = false;
        metadata.visible = true;
        UpdateMetadata();
    }
    else
    {
        status.visible = true;
        metadata.visible = false;
    }
}

function OnPlayStateChange()
{
    bgPlay.upToolTip = bgPlay.enabled ?
        xPlayPause.toolTip : "";
    bgPause.upToolTip = bgPause.enabled ?
        xPlayPause.value : "";
    bgStop.upToolTip = bgStop.enabled ?
        xStop.toolTip : "";
    bgPrev.upToolTip = bgPrev.enabled ?
        xPrevNext.toolTip : "";
    bgNext.upToolTip = bgNext.enabled ?
        xPrevNext.value : "";
}

var scrUp = 0;
var scrDn = 146;
var scrLOpened = 11;
var scrLClosed = 42;
var scrROpened = 150;
var scrRClosed = 119;

var speedVer = 300;
var speedHor = 150;
var screenOpen = false;

function OpenScreen(pane)
{
    if(screenOpen)
    {
        SetPane(pane);
    }
    else
    {
        screenOpen = true;
        openingPane = pane;
        VerScreenToggle();
    }
}

function CloseScreen()
{
    screenOpen = false;
    SetPane(noPane);
    HorScreenToggle();
}

function VerScreenToggle()
{
    vScrSmall.moveto(vScrSmall.left,
        screenOpen?scrUp:scrDn, speedVer);
}

function SmallScrEndMove()
{
    if(screenOpen)
    {
        vScrLeft.visible =
            vScrMiddle.visible =
            vScrRight.visible = true;
        vScrSmall.visible = false;
        HorScreenToggle();
    }
}

function ScreenEndMove()
{
    if(screenOpen)
    {
        SetPane(openingPane);
    }
    else if(vScrLeft.top==scrUp)
    {
        vScrLeft.visible =
            vScrMiddle.visible =
            vScrRight.visible = false;
        vScrSmall.visible = true;
        VerScreenToggle();
    }
}

function HorScreenToggle()
{
    vScrLeft.moveto(screenOpen?scrLOpened:scrLClosed,
        vScrLeft.top, speedHor);
    vScrRight.moveto(screenOpen?scrROpened:scrRClosed,
        vScrRight.top, speedHor);
}

function StartVideo()
{
    openingPane = vidPane;
    visEffects.visible =
        bVis.enabled = false;
    bVis.upToolTip = "";
    bEye.enabled = true;
    if(currentPane!=audPane)
    {
        OpenScreen(vidPane);
    }
}

function EndVideo()
{
    vidIsRunning =
        bEye.enabled = false;
    visEffects.visible =
        bVis.enabled = true;
    bVis.upToolTip = xVisSep.toolTip;
    if(currentPane==vidPane)
    {
        CloseScreen();
    }
}

function UpdateMetadata()
{
    var temp = player.currentmedia.name;
    metadata.value =
        player.currentmedia.getiteminfo("author");
    if(metadata.value!="" && temp!="")
    {
        metadata.value += xVisSep.value;
    }
    metadata.value += temp;
    metadata.scrolling = (metadata.textWidth>metadata.width);
}

function SetPane(newPane)
{
    switch(newPane)
    {
        case noPane:
            sAud.visible =
                pl.visible =
                vid.visible = false;
            break;
        case audPane:
            sAud.visible = true;
            pl.visible =
                vid.visible = false;
            break;
        case plPane:
            pl.visible = true;
            sAud.visible =
                vid.visible = false;
            break;
        case vidPane:
            vid.visible = true;
            sAud.visible =
                pl.visible = false;
            break;
    }

    currentPane = newPane;
}

function AdjustAudio()
{
    eq.gainLevel1 = bass.value;
    eq.gainLevel2 = (8*bass.value +   treble.value)/9;
    eq.gainLevel3 = (7*bass.value + 2*treble.value)/9;
    eq.gainLevel4 = (6*bass.value + 3*treble.value)/9;
    eq.gainLevel5 = (5*bass.value + 4*treble.value)/9;
    eq.gainLevel6 = (4*bass.value + 5*treble.value)/9;
    eq.gainLevel7 = (3*bass.value + 6*treble.value)/9;
    eq.gainLevel8 = (2*bass.value + 7*treble.value)/9;
    eq.gainLevel9 = (  bass.value + 8*treble.value)/9;
    eq.gainLevel10 = treble.value;
}