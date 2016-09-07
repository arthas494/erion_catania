var menu = (function() {
    var _menuButton = document.querySelector('.menu__mobile-button');
    var _menuList = document.querySelector('.menu__list');

    //--------------------------------------------------
    _menuButton.addEventListener('click', function() {
        _menuList.classList.toggle('menu__list_hidden');
        _menuButton.innerHTML = _menuList.classList.contains('menu__list_hidden') ? '&#9776;' : '&#9932;';
        console.log(_menuList);
    });

    //--------------------------------------------------
    if (window.matchMedia) {
        var mq = window.matchMedia("(max-width: 640px)");
        mq.addListener(resize);
        resize(mq);
    }

    //--------------------------------------------------
    function resize(mq) {

        if (mq.matches) {
            _menuList.classList.add('menu__list_hidden');
            _menuButton.classList.remove('menu__mobile-button_hidden');
        } else {
            _menuList.classList.remove('menu__list_hidden');
            _menuButton.classList.add('menu__mobile-button_hidden');
        }
    }
    return {
        menuButton: _menuButton,
        menuList: _menuList
    }
}());



/*
(function () {
    var mqEvents = function (mediaChangeHandler) {
        var sheets = document.styleSheets,
                numSheets = sheets.length,
                mqls = {},
                mediaChange = function (mql) {
                        console.log(mql);
                }

        if (mediaChangeHandler) {
            mediaChange = mediaChangeHandler;
        }

        for (var i = 0; i < numSheets; i += 1) {
            var rules = sheets[i].cssRules,
                    numRules = rules.length;

            for (var j = 0; j < numRules; j += 1) {
                if (rules[j].constructor === CSSMediaRule) {
                    mqls['mql' + j] = window.matchMedia(rules[j].media.mediaText);
                    mqls['mql' + j].addListener(mediaChange);
                    mediaChange(mqls['mql' + j]);
                }
            }
        }
    }
    window.mqEvents = mqEvents;
}());
 */