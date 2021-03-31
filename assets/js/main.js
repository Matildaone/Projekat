//prijava.

let modal = document.querySelector('.modal');
let noteForm = document.querySelector('.note-form');
let noteTable = document.querySelector('.note-table');
let cancel = document.querySelector('.cancel-btn');

let noteDeleteButtons;
let noteList = JSON.parse(localStorage.getItem('notes')) || [];

function createNote(title, note) {
    this.title = title;
    this.note = note;
}

function addNoteToLibrary(title, note) {
    noteList.push(new createNote(title, note));
}

if (noteList !== null) {
    appendNotes();
}

noteForm.addEventListener('submit', (e) => {
    addNote(e);
});


function addNote(e) {
    e.preventDefault();

    let newNote = {};

    let title = document.querySelector('.title');
    let note = document.querySelector('.note');

    if (title.value == '' || note.value == '') {
        return alert('Popuni sve');
    } else {
        newNote.title = title.value;
        newNote.note = note.value;
    }

    /* title.value = '';
     note.value = ''; */

    //noteList.push(newNote);
    addNoteToLibrary(
        e.target[0].value,
        e.target[1].value
    );
    appendNotes();
    cancel.click();

}

function appendNotes() {

    let notes = Array.from(document.querySelectorAll('.noteItem'));
    if (notes.length > 0) {
        notes.forEach(note => {
            note.remove();
        })
    }

    noteList.map(note => {

        //Create table cell
        let tr = document.createElement('tr');
        tr.classList = 'noteItem';
        let tdTitle = document.createElement('td');
        tdTitle.innerText = note.title;
        let tdNote = document.createElement('td');
        tdNote.innerText = note.note;
        let tdDelete = document.createElement('td');
        tdDelete.innerHTML = '&times';
        tdDelete.classList.add('delete-item');


        //append cells to table row
        tr.appendChild(tdTitle);
        tr.appendChild(tdNote);
        tr.appendChild(tdDelete);

        //append row to table

        noteTable.appendChild(tr);
        getDeleteButtons();
        localStorage.setItem('notes', JSON.stringify(noteList));
    })
}

function getDeleteButtons() {

    noteDeleteButtons = Array.from(document.querySelectorAll('.delete-item'));

    noteDeleteButtons.forEach(button => {
        let noteTitle = button.previousSibling.previousSibling.innerText;
        button.addEventListener('click', () => {
            deleteNote(noteTitle);
        })
    })

}

function deleteNote(noteTitle) {
    for (let i = 0; i < noteList.length; i++) {
        if (noteList[i].title == noteTitle) {
            noteList.splice(i, 1);
        }
    }
    localStorage.setItem('notes', JSON.stringify(noteList));
    appendNotes()
}

function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}


var settings = {

    banner: {

        // Indicators (= the clickable dots at the bottom).
        indicators: true,

        // Transition speed (in ms)
        // For timing purposes only. It *must* match the transition speed of "#banner > article".
        speed: 1500,

        // Transition delay (in ms)
        delay: 5000,

        // Parallax intensity (between 0 and 1; higher = more intense, lower = less intense; 0 = off)
        parallax: 0.25

    }

};

(function($) {

    skel.breakpoints({
        xlarge: '(max-width: 1680px)',
        large: '(max-width: 1280px)',
        medium: '(max-width: 980px)',
        small: '(max-width: 736px)',
        xsmall: '(max-width: 480px)'
    });

    /**
     * Applies parallax scrolling to an element's background image.
     * @return {jQuery} jQuery object.
     */
    $.fn._parallax = (skel.vars.browser == 'ie' || skel.vars.mobile) ? function() { return $(this) } : function(intensity) {

        var $window = $(window),
            $this = $(this);

        if (this.length == 0 || intensity === 0)
            return $this;

        if (this.length > 1) {

            for (var i = 0; i < this.length; i++)
                $(this[i])._parallax(intensity);

            return $this;

        }

        if (!intensity)
            intensity = 0.25;

        $this.each(function() {

            var $t = $(this),
                on, off;

            on = function() {

                $t.css('background-position', 'center 100%, center 100%, center 0px');

                $window
                    .on('scroll._parallax', function() {

                        var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

                        $t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');

                    });

            };

            off = function() {

                $t
                    .css('background-position', '');

                $window
                    .off('scroll._parallax');

            };

            skel.on('change', function() {

                if (skel.breakpoint('medium').active)
                    (off)();
                else
                    (on)();

            });

        });

        $window
            .off('load._parallax resize._parallax')
            .on('load._parallax resize._parallax', function() {
                $window.trigger('scroll');
            });

        return $(this);

    };

    /**
     * Custom banner slider for Slate.
     * @return {jQuery} jQuery object.
     */
    $.fn._slider = function(options) {

        var $window = $(window),
            $this = $(this);

        if (this.length == 0)
            return $this;

        if (this.length > 1) {

            for (var i = 0; i < this.length; i++)
                $(this[i])._slider(options);

            return $this;

        }

        // Vars.
        var current = 0,
            pos = 0,
            lastPos = 0,
            slides = [],
            indicators = [],
            $indicators,
            $slides = $this.children('article'),
            intervalId,
            isLocked = false,
            i = 0;

        // Turn off indicators if we only have one slide.
        if ($slides.length == 1)
            options.indicators = false;

        // Functions.
        $this._switchTo = function(x, stop) {

            if (isLocked || pos == x)
                return;

            isLocked = true;

            if (stop)
                window.clearInterval(intervalId);

            // Update positions.
            lastPos = pos;
            pos = x;

            // Hide last slide.
            slides[lastPos].removeClass('top');

            if (options.indicators)
                indicators[lastPos].removeClass('visible');

            // Show new slide.
            slides[pos].addClass('visible').addClass('top');

            if (options.indicators)
                indicators[pos].addClass('visible');

            // Finish hiding last slide after a short delay.
            window.setTimeout(function() {

                slides[lastPos].addClass('instant').removeClass('visible');

                window.setTimeout(function() {

                    slides[lastPos].removeClass('instant');
                    isLocked = false;

                }, 100);

            }, options.speed);

        };

        // Indicators.
        if (options.indicators)
            $indicators = $('<ul class="indicators"></ul>').appendTo($this);

        // Slides.
        $slides
            .each(function() {

                var $slide = $(this),
                    $img = $slide.find('img');

                // Slide.
                $slide
                    .css('background-image', 'url("' + $img.attr('src') + '")')
                    .css('background-position', ($slide.data('position') ? $slide.data('position') : 'center'));

                // Add to slides.
                slides.push($slide);

                // Indicators.
                if (options.indicators) {

                    var $indicator_li = $('<li>' + i + '</li>').appendTo($indicators);

                    // Indicator.
                    $indicator_li
                        .data('index', i)
                        .on('click', function() {
                            $this._switchTo($(this).data('index'), true);
                        });

                    // Add to indicators.
                    indicators.push($indicator_li);

                }

                i++;

            })
            ._parallax(options.parallax);

        // Initial slide.
        slides[pos].addClass('visible').addClass('top');

        if (options.indicators)
            indicators[pos].addClass('visible');

        // Bail if we only have a single slide.
        if (slides.length == 1)
            return;

        // Main loop.
        intervalId = window.setInterval(function() {

            current++;

            if (current >= slides.length)
                current = 0;

            $this._switchTo(current);

        }, options.delay);

    };

    $(function() {

        var $window = $(window),
            $body = $('body'),
            $header = $('#header'),
            $banner = $('.banner');

        // Disable animations/transitions until the page has loaded.
        $body.addClass('is-loading');

        $window.on('load', function() {
            window.setTimeout(function() {
                $body.removeClass('is-loading');
            }, 100);
        });

        // Prioritize "important" elements on medium.
        skel.on('+medium -medium', function() {
            $.prioritize(
                '.important\\28 medium\\29',
                skel.breakpoint('medium').active
            );
        });

        // Banner.
        $banner._slider(settings.banner);

        // Menu.
        $('#menu')
            .append('<a href="#menu" class="close"></a>')
            .appendTo($body)
            .panel({
                delay: 500,
                hideOnClick: true,
                hideOnSwipe: true,
                resetScroll: true,
                resetForms: true,
                side: 'right'
            });

        // Header.
        if (skel.vars.IEVersion < 9)
            $header.removeClass('alt');

        if ($banner.length > 0 &&
            $header.hasClass('alt')) {

            $window.on('resize', function() { $window.trigger('scroll'); });

            $banner.scrollex({
                bottom: $header.outerHeight(),
                terminate: function() { $header.removeClass('alt'); },
                enter: function() { $header.addClass('alt'); },
                leave: function() {
                    $header.removeClass('alt');
                    $header.addClass('reveal');
                }
            });

        }

    });

})(jQuery);