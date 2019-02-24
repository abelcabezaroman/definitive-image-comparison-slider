/*
 * Dics: Slider to quickly compare two images.
 *
 * By Max Ulyanov
 * Src: https://github.com/M-Ulyanov/Dics/
 * Example https://m-ulyanov.github.io/image-comparison/
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
        this.images               = this._buildImages();
        // this.labels               = [this.options.data[0].label, this.options.data[1].label];
        this._animateInterval     = null;
        this._comparisonSeparator = null;
        this._items               = [];

        if (this.container == null) {
            console.error('Container element not found!')
        }

        this._build();
        // this._setEvents();
    }

    Dics.prototype._buildImages = function () {
        let images       = this.container.querySelectorAll('img');
        let imagesLength = images.length;

        let initialImagesContainerWidth = this.container.offsetWidth / imagesLength;

        for (let i = 0; i < imagesLength; i++) {
            let image      = images[i];
            let newElement = document.createElement('div');

            newElement.classList.add('b-dics__image-container');
            image.classList.add('b-dics__image');


            newElement.appendChild(image);
            this.container.appendChild(newElement);

            image.style.left = `${ i * -initialImagesContainerWidth }px`;

        }
        return images;
    };


    /**
     * Build HTML structure
     * @private
     */
    Dics.prototype._build = function () {
        this.options.container.classList.add('b-dics');

        for (let image of this.images) {
        }
        // for (let i = 0; i < 2; i++) {
        //     let item = document.createElement('div');
        //     item.classList.add('comparison-item');
        //
        //     let content = document.createElement('div');
        //     content.classList.add('comparison-item__content');
        //     if (this.labels[i]) {
        //         content.innerHTML = '<div class="comparison-item__label">' + this.labels[i] + '</div>';
        //     }
        //     this.images[i].classList.add('comparison-item__image');
        //     content.appendChild(this.images[i]);
        //     item.appendChild(content);
        //
        //     if (i === 0) {
        //         item.classList.add('comparison-item--first');
        //         item.style.width          = this.options.startPosition + '%';
        //         this._comparisonSeparator = document.createElement('div');
        //         this._comparisonSeparator.classList.add('comparison-separator');
        //         this._comparisonSeparator.innerHTML = '<div class="comparison-control"><div class="comparison-control__mask"></div></div>';
        //         item.appendChild(this._comparisonSeparator);
        //     }
        //
        //     this._items.push(item);
        //     this.container.appendChild(item);
        // }

    };


    /**
     * Set need DOM events
     * @private
     */
    Dics.prototype._setEvents = function () {
        let comparison = this;

        comparison.container.addEventListener('click', function (event) {
            comparison._calcPosition(event);
        });

        utils.setMultiEvents(comparison._comparisonSeparator, ['mousedown', 'touchstart'], function () {
            comparison._comparisonSeparator.classList.add('actived');
        });

        utils.setMultiEvents(document.body, ['mouseup', 'touchend'], function () {
            comparison._comparisonSeparator.classList.remove('actived');
        });

        utils.setMultiEvents(document.body, ['mousemove', 'touchmove'], function (event) {
            if (comparison._comparisonSeparator.classList.contains('actived')) {
                comparison._calcPosition(event);
                if (document['selection']) {
                    document['selection'].empty();
                }
            }
        });

        utils.setMultiEvents(window, ['resize', 'load'], function () {
            comparison._setImageSize();
        });

        for (let i = 0; i < comparison.images.length; i++) {
            comparison.images[i].addEventListener('dragstart', function (e) {
                e.preventDefault();
            });
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
        this._controllerPosition(positionInPercent.toFixed(2), event.type);
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


