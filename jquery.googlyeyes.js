/*
 * jQuery Googly Eyes - https://github.com/davesters81/jQueryGooglyEyes
 * A jQuery plugin that adds a pair of Googly eyes to any element on your page.
 *
 * @author David Corona - http://www.lovesmesomecode.com
 * @version 1.1
 *
 * @examples
 * $('element').googlyEyes(options);
 *
 * $.googlyEyes(options);
 *
 The Unlicense:
 This is free and unencumbered software released into the public domain.

 Anyone is free to copy, modify, publish, use, compile, sell, or
 distribute this software, either in source code form or as a compiled
 binary, for any purpose, commercial or non-commercial, and by any
 means.

 In jurisdictions that recognize copyright laws, the author or authors
 of this software dedicate any and all copyright interest in the
 software to the public domain. We make this dedication for the benefit
 of the public at large and to the detriment of our heirs and
 successors. We intend this dedication to be an overt act of
 relinquishment in perpetuity of all present and future rights to this
 software under copyright law.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.

 For more information, please refer to <http://unlicense.org/>
 */

(function($) {
    var animating = false;
    var anim_timer;
    var stop_timer;
    var mouse_pos;
    var settings;
    var defaults = {
        eye_size: 30,
        iris_size: 16,
        spacing: 2
    }

    var methods = {

        init: function(options) {
            settings = $.extend(defaults, options);

            return this.each(function() {
                $(this).css("position", "relative");
                var eyes = $("<div class='googlyeyes_container'><div class='googlyeyes_eye first'><div class='googlyeyes_iris'></div></div><div class='googlyeyes_eye'><div class='googlyeyes_iris'></div></div></div>");
                $(eyes).css({ zIndex: 9999, position: 'absolute', top: 0 - settings.eye_size, left: 0 - settings.eye_size });
                $(eyes).find(".googlyeyes_eye").css({
                    width: settings.eye_size,
                    height: settings.eye_size,
                    borderRadius: settings.eye_size / 2,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: '#000',
                    backgroundColor: '#fff',
                    display: 'block',
                    position: 'relative',
                    overflow: 'hidden',
                    float: 'left'
                });
                $(eyes).find(".googlyeyes_eye.first").css({ marginRight: settings.spacing });
                $(eyes).find(".googlyeyes_iris").css({ width: settings.iris_size,
                    height: settings.iris_size,
                    borderRadius: settings.iris_size / 2,
                    backgroundColor: '#000',
                    position: 'absolute'});

                $(eyes).find(".googlyeyes_iris").each(function() {
                    $(this).css({ top: settings.iris_size / 3, left: settings.iris_size / 2 });
                });
                $(this).append(eyes);
                methods.bind_events();
            });
        },

        bind_events: function() {
            if ($("mouse_event_bound").length > 0) return;

            $(window).bind('mousemove', function(event) {
                mouse_pos = {
                    'x': event.pageX,
                    'y': event.pageY
                }

                $(".googlyeyes_iris").each(function() {
                    var eye_container = $(this).parent();
                    var pos = $(eye_container).offset();
                    var eye_pos = {
                        'x': pos.left + ($(eye_container).width() / 2),
                        'y': pos.top + ($(eye_container).height() / 2)
                    }
                    var toCenterDistance = get_distance(eye_pos, mouse_pos);
                    var targetDistance = toCenterDistance - ($(eye_container).width() / 2) + 7;
                    var slope = getSlope(eye_pos, mouse_pos);

                    if (toCenterDistance > ($(eye_container).width() / 2)) {
                        var x = Math.cos(Math.atan(slope)) * targetDistance;
                        if (eye_pos.x > mouse_pos.x) {
                            x += mouse_pos.x;
                        } else if (eye_pos.x < mouse_pos.x) {
                            x = -x + mouse_pos.x;
                        }
                        var y = Math.sin(Math.atan(slope)) * targetDistance;
                        if (eye_pos.x > mouse_pos.x) {
                            y += mouse_pos.y;
                        } else if (eye_pos.x < mouse_pos.x) {
                            y = -y + mouse_pos.y;
                        }
                        x -= ($(this).height() / 2) + eye_pos.x - ($(eye_container).width() / 2);
                        y -= ($(this).height() / 2) + eye_pos.y - ($(eye_container).height() / 2);
                    } else {
                        x = mouse_pos.x - ($(this).width() / 2) - eye_pos.x + ($(eye_container).width() / 2);
                        y = mouse_pos.y - ($(this).width() / 2) - eye_pos.y + ($(eye_container).height() / 2);
                    }
                    $(this).css({
                        'left' : x + 'px',
                        'top' : y + 'px',
                    });
                });
            });
            $("body").append("<div style='display: none' id='mouse_event_bound'></div>");
        }
    };

    $.fn.googlyEyes = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.googleyEyes');
        }
    };

    /**
     * @private
     */
    function get_distance(loc1, loc2) {
        return Math.sqrt(Math.pow((loc1.x - loc2.x), 2) + Math.pow((loc1.y - loc2.y), 2));
    }

    /**
     * @private
     */
    function getSlope(loc1, loc2) {
        return (loc1.y - loc2.y) / (loc1.x - loc2.x);
    }
})(jQuery);

jQuery.extend({
    googlyEyes: function(options) {
        $(".googlyeyes").each(function() {
            $(this).googlyEyes(options);
        });
    }
});