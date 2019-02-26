/*
 * Dics: Simple multiple image comparison.
 *
 * By Abel Cabeza Román
 * Src:
 * Example
 */

(function (root) {

    const defaultOptions = {
        container: null,
        startPosition: 50,
        data: null
    };


    /**
     * Constructor
     * @param options
     */
    function Dics(options) {
        this.options              = utils.extend({}, [defaultOptions, options], {
            clearEmpty: true
        });
        this.container            = this.options.container;
        this.images               = this._getImages();
        this.sliders              = [];
        // this.labels               = [this.options.data[0].label, this.options.data[1].label];
        this._animateInterval     = null;
        this._comparisonSeparator = null;
        this._items               = [];

        if (this.container == null) {
            console.error('Container element not found!')
        }

        this._build();
        this._setEvents();
    }

    Dics.prototype._getImages = function () {
        return this.container.querySelectorAll('img');
    };

    Dics.prototype._createElement = function (elementClass, className) {
        let newElement = document.createElement(elementClass);

        newElement.classList.add(className);

        return newElement;
    };


    /**
     * Build HTML structure
     * @private
     */
    Dics.prototype._build = function () {
        let dics = this;

        this.options.container.classList.add('b-dics');
        let imagesLength = dics.images.length;

        let initialImagesContainerWidth = dics.container.offsetWidth / imagesLength;

        for (let i = 0; i < imagesLength; i++) {
            let image          = dics.images[i];
            let section        = dics._createElement('div', 'b-dics__section');
            let imageContainer = dics._createElement('div', 'b-dics__image-container');
            let slider         = dics._createElement('div', 'b-dics__slider');
            this.sliders.push(slider);

            image.classList.add('b-dics__image');

            section.appendChild(imageContainer);
            imageContainer.appendChild(image);

            if (i < imagesLength - 1) {
                section.appendChild(slider);
            }

            dics.container.appendChild(section);

            image.style.left = `${ i * -initialImagesContainerWidth }px`;

        }
    };


    /**
     * Set need DOM events
     * @private
     */
    Dics.prototype._setEvents = function () {
        let dics = this;

        dics._disableImageDrag();

        dics.container.addEventListener('click', function (event) {
            dics._calcPosition(event);
        });

        let listener = function () {
            dics._calcPosition(event);
        };

        for (let slider of dics.sliders) {
            utils.setMultiEvents(slider, ['mousedown', 'touchstart'], function () {
                slider.classList.add('b-dics__slider--active');

                utils.setMultiEvents(dics.container, ['mousemove', 'touchmove'], listener);
            });
        }
        console.log('##ABEL## >> Dics >>  _setEvents', dics);


        let listener2 = function () {
            let activeElements = dics.container.querySelectorAll('.b-dics__slider--active');

            for (let activeElement of activeElements) {
                activeElement.classList.remove('b-dics__slider--active');
                utils.removeMultiEvents(dics.container, ['mousemove', 'touchmove'], listener);
            }
        };

        utils.setMultiEvents(document.body, ['mouseup', 'touchend'], listener2);


        utils.setMultiEvents(window, ['resize', 'load'], function () {
            dics._setImageSize();
        });



    };

    Dics.prototype._disableImageDrag = function () {
        for (let i = 0; i < this.images.length; i++) {
            this.sliders[i].addEventListener('dragstart', function (e) {
                e.preventDefault();
            });
            this.images[i].addEventListener('dragstart', function (e) {
                e.preventDefault();
            });
        }
    };

    Dics.prototype._removeActiveElements = function () {
        console.log('##ABEL## >> Dics >>  _setEvents', Dics.prototype);
        let activeElements = Dics.container.querySelectorAll('.b-dics__slider--active');

        for (let activeElement of activeElements) {
            activeElement.classList.remove('b-dics__slider--active');
            utils.removeMultiEvents(Dics.container, ['mousemove', 'touchmove'], Dics.prototype._removeActiveElements);
        }
    };


    /**
     * Calc current position (click, touch or move)
     * @param event
     * @private
     */
    Dics.prototype._calcPosition = function (event) {
        let containerCoords              = this.container.getBoundingClientRect();
        let containerWidth               = containerCoords.width;
        /** @namespace event.touches */
        let horizontalPositionForElement = (event.clientX || event.touches[0].pageX) - containerCoords.left;
        let positionInPercent            = horizontalPositionForElement * 100 / containerWidth;
        if (positionInPercent > 100) {
            positionInPercent = 100;
        }
        else if (positionInPercent < 0) {
            positionInPercent = 0;
        }

        console.log('##ABEL## >> Dics >>  _calcPosition', positionInPercent.toFixed(2), event.type);
        // this._controllerPosition(positionInPercent.toFixed(2), event.type);
    };


    /**
     * Controller position
     * @param positionInPercent
     * @param eventType
     * @private
     */
    Dics.prototype._controllerPosition = function (positionInPercent, eventType) {
        switch (eventType) {
            case 'click':
                this._setPositionWithAnimate(positionInPercent);
                break;
            default :
                this._updatePosition(positionInPercent);
        }
    };


    /**
     * Set position with animate
     * @param newPositionInPercent
     * @returns {boolean}
     * @private
     */
    Dics.prototype._setPositionWithAnimate = function (newPositionInPercent) {
        let comparison               = this;
        let currentPositionInPercent = parseFloat(comparison._items[0].style.width);
        clearInterval(comparison._animateInterval);

        if (newPositionInPercent == currentPositionInPercent) {
            return false;
        }
        else if (currentPositionInPercent > newPositionInPercent) {
            decrementPosition();
        }
        else {
            incrementPosition();
        }


        // Support animate functions
        function incrementPosition() {
            comparison._animateInterval = setInterval(function () {
                currentPositionInPercent++;
                comparison._updatePosition(currentPositionInPercent);
                if (currentPositionInPercent >= newPositionInPercent) {
                    setFinalPositionAndClearInterval();
                }
            }, 10);
        }

        function decrementPosition() {
            comparison._animateInterval = setInterval(function () {
                currentPositionInPercent--;
                comparison._updatePosition(currentPositionInPercent);
                if (currentPositionInPercent <= newPositionInPercent) {
                    setFinalPositionAndClearInterval();
                }
            }, 10);
        }

        function setFinalPositionAndClearInterval() {
            comparison._updatePosition(newPositionInPercent);
            clearInterval(comparison._animateInterval);
        }


    };


    /**
     * Set position item[0]
     * @param percent
     * @private
     */
    Dics.prototype._updatePosition = function (percent) {
        this._items[0].style.width = percent + '%';
    };


    /**
     * Set the width of image that has a position absolute
     * @private
     */
    Dics.prototype._setImageSize = function () {
        this.images[0].style.width = this.container.offsetWidth + 'px';
    };


    /**
     * Utils Methods
     * @type {{extend: Function, getConstructor: Function}}
     */
    let utils = {


        /**
         * Native extend object
         * @param target
         * @param objects
         * @param options
         * @returns {*}
         */
        extend: function (target, objects, options) {

            for (let object in objects) {
                if (objects.hasOwnProperty(object)) {
                    recursiveMerge(target, objects[object]);
                }
            }

            function recursiveMerge(target, object) {
                for (let property in object) {
                    if (object.hasOwnProperty(property)) {
                        let current = object[property];
                        if (utils.getConstructor(current) === 'Object') {
                            if (!target[property]) {
                                target[property] = {};
                            }
                            recursiveMerge(target[property], current);
                        }
                        else {
                            // clearEmpty
                            if (options.clearEmpty) {
                                if (current == null) {
                                    continue;
                                }
                            }
                            target[property] = current;
                        }
                    }
                }
            }

            return target;
        },


        /**
         * Set Multi addEventListener
         * @param element
         * @param events
         * @param func
         */
        setMultiEvents: function (element, events, func) {
            for (let i = 0; i < events.length; i++) {
                element.addEventListener(events[i], func);
            }
        },

        /**
         * Set Multi addEventListener
         * @param element
         * @param events
         * @param func
         */
        removeMultiEvents: function (element, events, func) {
            for (let i = 0; i < events.length; i++) {
                element.removeEventListener(events[i], func, false);
            }
        },


        /**
         * Get object constructor
         * @param object
         * @returns {string}
         */
        getConstructor: function (object) {
            return Object.prototype.toString.call(object).slice(8, -1);
        }
    };


    if (typeof define === 'function' && define.amd) {
        define('Dics', [], function () {
            return Dics;
        });
    }
    else {
        root.Dics = Dics;
    }


}(this));


