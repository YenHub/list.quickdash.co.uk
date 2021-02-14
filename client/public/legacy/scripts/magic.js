// Console Styling
var greenResult = [
    "color:white",
    "font-weight:700",
    "text-shadow:0 0 #000",
    "font-size: 10pt",
    "text-align:center",
    "display:block",
    "margin-left:auto",
    "margin-right:auto",
    "line-height:2em",
    "border-bottom:1px solid #42f442",
    "border-top:1px solid #42f442"
].join(';');

var animations = {
    shake: function (elem, time) {
        $(elem).addClass('shake');
        setTimeout(function () {
            $(elem).removeClass('shake');
        }, time);
    }
};

var pageActions = {
    storeConfig: function () {
        var listConfig = {};
        $('.container button').each(function (i) {
            listConfig[i] = $(this).text();
        });
        let legacyVal = window.localStorage.getItem('legacyMigrated');
        if(legacyVal === null && legacyVal !== '1') {
            window.localStorage.setItem('legacyMigrated', '1');
            const message = 'NOTE\n\n' +
                '⚠ Further changes to this list can not be migrated back ⚠';
            alert(message);
        } else {
            window.localStorage.setItem('legacyMigrated', '0');
        }
        return localStorage.setItem('listConfig', JSON.stringify(listConfig));
    }
};

// HTML5 Drag & Drop Components
// Mobile Support Components via DragDropTouch library | Credit: Bernardo-Castilho
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * drag handler
 * @param  {object}       ev      [Drag Event object]
 * @param  {object prop}  targID  [Event Target ID]
 * @param  {object prop}  dirA    [Mouse Y-Position]
 * @return {jQuery method}        [Patch to prevent shake on mobile device drag]
 */
function drag(ev) {
    ev.dataTransfer.setData("targID", ev.target.id);
    ev.dataTransfer.setData("dirA", ev.clientY);
    return $(ev.target).removeClass('shake');
}

/**
 * Drag Handler
 *
 * @param  {object}       ev              [Drop Event object]
 * @regEx                                 [Test Target ID to filter unwanted drop zones !#noDrop]
 * @param  {object prop}  data            [Source Target ID]
 * @param  {object prop}  dirB            [clientY - dirA = vertical travel direction]
 * @param  {ternary}      elemTarget      [Event Target is Div or inner button]
 * @ternary                               []
 * @return {method}                       [Store Page Config via cust localStorage function]
 */
function drop(ev) {
    ev.preventDefault();
    var evTarg = ev.target;
    if(/noDrop/i.test(evTarg.id)) {
        return false;
    } else {
        var data = ev.dataTransfer.getData("targID");
        var dirB = (ev.dataTransfer.getData("dirA") - (ev.clientY) > 0) ? true : false;
        var elemTarget = evTarg.nodeName !== 'DIV' ? $(evTarg).closest('div') : evTarg;
        var elem = document.getElementById(data);

        (dirB) ? $(elem).insertBefore(elemTarget): $(elem).insertAfter(elemTarget);

        animations.shake(elem, 850);

        return pageActions.storeConfig();

    }
    return true;
}

(function () {
    "use strict";

    var noteId = 0,
        d = document;

    // Submit existing notes found in local storage
    var listConfig = localStorage.getItem('listConfig') > '' ? JSON.parse(localStorage.getItem('listConfig')) : {};
    localStorage.clear();
    $.each(listConfig, function (a, i) {
        entrySubmit(i, false);
    });

    function logMsg(message, group) {
        return (group) ? console.groupCollapsed('%c' + message, greenResult) : console.log(message);
    }

    function entrySubmit(_string, _shake) {
        var $ent = _string.trim() || $('#entryField').val().toString();

        if(!$ent) {
            return false;
        }

        var elem = '<div id="note' + noteId + '" draggable="true" ondragstart="drag(event)" class="row mx-2 mx-1 mb-2"><button type="button" style="white-space:normal;" class="text-left btn btn-outline-primary btn-block"><i class="fas fa-hashtag fa-lg fa-pull-left"></i><i class="far fa-edit fa-lg fa-pull-right"></i><i class="far fa-trash-alt fa-lg fa-pull-right"></i><span class="edit">' + $ent + '</span></button></div>';

        // Has Plus Square
        // var elem = '<div id="note' + noteId + '" draggable="true" ondragstart="drag(event)" class="row mb-2"><button type="button" style="white-space:normal;" class="text-left btn btn-outline-primary btn-block"><i class="fas fa-hashtag fa-lg fa-pull-left"></i><i class="far fa-edit fa-lg fa-pull-right"></i><i class="far fa-trash-alt fa-lg fa-pull-right"></i><i class="far fa-plus-square fa-lg fa-pull-right"></i>' + $ent + '</button></div>';

        $('.container').append(elem);

        if(_shake !== false) {
            animations.shake('#note' + noteId, 850);
        }

        pageActions.storeConfig();

        // Debugging Info & Output
        // logMsg(' :: entrySubmit() Output :: ', 1);
        //
        // logMsg(' :: Local Storage | listConfig {} :: ', 1);
        // logMsg(localStorage.getItem('listConfig'));
        // console.groupEnd();
        //
        // logMsg(' :: Input Data Submitted :: ', 1);
        // if (_string) logMsg(' (i) Recalled from storage');
        // logMsg($ent);
        // console.groupEnd();
        //
        // logMsg(' :: List Config :: ', 1);
        // console.table(listConfig);
        // console.groupEnd();
        //
        // console.groupEnd();

        $('#entryField').val('');

        // Increment Note ID
        noteId++;

    }

    // Script Execution Init
    function scriptInit() {

        logMsg(':: QuickList Successful Launch :: ');

        $('#entrySubmit').on('submit', function () {
            entrySubmit($(this).val());
        });

        // Delete Note
        $('.container').on('click', '.fa-trash-alt', function () {
            $(this).closest('div').fadeOut('slow', function () {
                $(this).remove();
                pageActions.storeConfig();
            });
        });

        // Edit Note
        $('.container').on('click', '.edit, .fa-edit', function () {
            animations.shake('#entryField', 850);
            $("#entryField").focus();
            $('#entryField').val($(this).closest('div').find('button').text());
            $(this).closest('div').slideUp(500, function () {
                $(this).remove();
                pageActions.storeConfig();
            });
        });

        // Animations
        $("#entryField").one('click focus touch', function () {
            // $('').css('visibility', 'hidden').slideUp(750);
            $('.jumbotron p,.jumbotron h1').slideUp(500, function () {
                $('.jumbotron h1').text('QuickList').addClass('lg-font').fadeIn(150);
                $('.jumbotron').attr('style', $('.jumbotron').attr('style') + ';padding:1em 1em !important');
            });
            // $('.jumbotron p').fadeOut(150);

        });

    }

    // jQuery & Document Ready Check Handler
    (function readyCheck() {
        (d.readyState == 'complete') ? scriptInit(): setTimeout(readyCheck, 100);
    }());
}());