"use strict";

/*
 * Dics: Definitive image comparison slider. A multiple image vanilla comparison slider.
 *
 * By Abel Cabeza Román
 * Src: https://github.com/abelcabezaroman/definitive-image-comparison-slider
 * Example
 */

/**
 *
 */
(function (root) {
    /**
     *
     * @type {{container: null, filters: null, hideTexts: null, textPosition: string, linesOrientation: string, rotate: number}}
     */
    var defaultOptions = {
        container: null,
        filters: null,
        hideTexts: null,
        textPosition: 'top',
        linesOrientation: 'horizontal',
        rotate: 0
    };
    /**
     *
     * @param options
     * @constructor
     */

    function Dics(options) {
        this.options = utils.extend({}, [defaultOptions, options], {
            clearEmpty: true
        });
        this.container = this.options.container;

        this._setOrientation(this.options.linesOrientation, this.container);

        this.images = this._getImages();
        this.sliders = [];
        this._activeSlider = null;

        if (this.container == null) {
            console.error('Container element not found!');
        }

        this._build();

        this.sections = this._getSections();

        this._setEvents();
    }
    /**
     * Build HTML
     * @private
     */


    Dics.prototype._build = function () {
        var dics = this;

        dics._applyGlobalClass(dics.options);

        var imagesLength = dics.images.length;
        dics.options.container.style.height = "".concat(dics._calcContainerHeight(), "px");
        var initialImagesContainerWidth = dics.container[dics.config.offsetSizeField] / imagesLength;

        for (var i = 0; i < imagesLength; i++) {
            var image = dics.images[i];

            var section = dics._createElement('div', 'b-dics__section');

            var imageContainer = dics._createElement('div', 'b-dics__image-container');

            var slider = dics._createElement('div', 'b-dics__slider');

            dics._applyFilter(image, i, dics.options.filters);

            dics._createAltText(image, imageContainer);

            dics._rotate(image, imageContainer);

            section.setAttribute('data-function', 'b-dics__section');
            section.style[this.config.sizeField] = "".concat(initialImagesContainerWidth, "px");
            slider.style[this.config.positionField] = "".concat(initialImagesContainerWidth * (i + 1), "px");
            this.sliders.push(slider);
            image.classList.add('b-dics__image');
            section.appendChild(imageContainer);
            imageContainer.appendChild(image);

            if (i < imagesLength - 1) {
                section.appendChild(slider);
            }

            dics.container.appendChild(section);
            image.style[this.config.positionField] = "".concat(i * -initialImagesContainerWidth, "px");
        }
    };
    /**
     *
     * @returns {NodeListOf<SVGElementTagNameMap[string]> | NodeListOf<HTMLElementTagNameMap[string]> | NodeListOf<Element>}
     * @private
     */


    Dics.prototype._getImages = function () {
        return this.container.querySelectorAll('img');
    };
    /**
     *
     * @returns {NodeListOf<SVGElementTagNameMap[string]> | NodeListOf<HTMLElementTagNameMap[string]> | NodeListOf<Element>}
     * @private
     */


    Dics.prototype._getSections = function () {
        return this.container.querySelectorAll('[data-function="b-dics__section"]');
    };
    /**
     *
     * @param elementClass
     * @param className
     * @returns {HTMLElement | HTMLSelectElement | HTMLLegendElement | HTMLTableCaptionElement | HTMLTextAreaElement | HTMLModElement | HTMLHRElement | HTMLOutputElement | HTMLPreElement | HTMLEmbedElement | HTMLCanvasElement | HTMLFrameSetElement | HTMLMarqueeElement | HTMLScriptElement | HTMLInputElement | HTMLUnknownElement | HTMLMetaElement | HTMLStyleElement | HTMLObjectElement | HTMLTemplateElement | HTMLBRElement | HTMLAudioElement | HTMLIFrameElement | HTMLMapElement | HTMLTableElement | HTMLAnchorElement | HTMLMenuElement | HTMLPictureElement | HTMLParagraphElement | HTMLTableDataCellElement | HTMLTableSectionElement | HTMLQuoteElement | HTMLTableHeaderCellElement | HTMLProgressElement | HTMLLIElement | HTMLTableRowElement | HTMLFontElement | HTMLSpanElement | HTMLTableColElement | HTMLOptGroupElement | HTMLDataElement | HTMLDListElement | HTMLFieldSetElement | HTMLSourceElement | HTMLBodyElement | HTMLDirectoryElement | HTMLDivElement | HTMLUListElement | HTMLHtmlElement | HTMLAreaElement | HTMLMeterElement | HTMLAppletElement | HTMLFrameElement | HTMLOptionElement | HTMLImageElement | HTMLLinkElement | HTMLHeadingElement | HTMLSlotElement | HTMLVideoElement | HTMLBaseFontElement | HTMLTitleElement | HTMLButtonElement | HTMLHeadElement | HTMLParamElement | HTMLTrackElement | HTMLOListElement | HTMLDataListElement | HTMLLabelElement | HTMLFormElement | HTMLTimeElement | HTMLBaseElement}
     * @private
     */


    Dics.prototype._createElement = function (elementClass, className) {
        var newElement = document.createElement(elementClass);
        newElement.classList.add(className);
        return newElement;
    };
    /**
     * Set need DOM events
     * @private
     */


    Dics.prototype._setEvents = function () {
        var dics = this;

        dics._disableImageDrag();

        var listener = function listener(event) {
            var position = dics._calcPosition(event);

            console.log('##ABEL## >> listener >>  listener', dics.sections[dics._activeSlider + 1][dics.config.offsetPositionField]);
            console.log('##ABEL## >> listener >>  listener', dics.sections[dics._activeSlider + 1][dics.config.offsetSizeField]);
            console.log('##ABEL## >> listener >>  listener', position < dics.sections[dics._activeSlider + 1][dics.config.offsetPositionField] + dics.sections[dics._activeSlider + 1][dics.config.offsetSizeField] && (dics._activeSlider === 0 || position > dics.sections[dics._activeSlider - 1][dics.config.offsetPositionField] + dics.sections[dics._activeSlider - 1][dics.config.offsetSizeField]));
            console.log('##ABEL## >> listener >>  listener', position < dics.sections[dics._activeSlider + 1][dics.config.offsetPositionField] + dics.sections[dics._activeSlider + 1][dics.config.offsetSizeField]);

            if (position < dics.sections[dics._activeSlider + 1][dics.config.offsetPositionField] + dics.sections[dics._activeSlider + 1][dics.config.offsetSizeField] && (dics._activeSlider === 0 || position > dics.sections[dics._activeSlider - 1][dics.config.offsetPositionField] + dics.sections[dics._activeSlider - 1][dics.config.offsetSizeField])) {
                var beforeSectionsWidth = dics._beforeSectionsWidth(dics.sections, dics.images, dics._activeSlider);

                dics.sliders[dics._activeSlider].style[dics.config.positionField] = "".concat(position, "px");
                var calcMovePixels = position - beforeSectionsWidth;
                dics.sections[dics._activeSlider].style[dics.config.sizeField] = "".concat(calcMovePixels, "px");
                dics.sections[dics._activeSlider + 1].style[dics.config.sizeField] = "".concat(dics._beforeNextWidth - (calcMovePixels - dics._beforeActiveWidth), "px");

                dics._setLeftToImages(dics.sections, dics.images);

                dics._slidesFollowSections(dics.sections, dics.sliders);
            }
        };

        dics.container.addEventListener('click', listener);

        var _loop = function _loop(i) {
            var slider = dics.sliders[i];
            utils.setMultiEvents(slider, ['mousedown', 'touchstart'], function () {
                dics._activeSlider = i;
                dics._beforeActiveWidth = dics.sections[i].getBoundingClientRect()[dics.config.sizeField];
                dics._beforeNextWidth = dics.sections[i + 1].getBoundingClientRect()[dics.config.sizeField];
                slider.classList.add('b-dics__slider--active');
                utils.setMultiEvents(dics.container, ['mousemove', 'touchmove'], listener);
            });
        };

        for (var i = 0; i < dics.sliders.length; i++) {
            _loop(i);
        }

        var listener2 = function listener2() {
            var activeElements = dics.container.querySelectorAll('.b-dics__slider--active');
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = activeElements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var activeElement = _step.value;
                    activeElement.classList.remove('b-dics__slider--active');
                    utils.removeMultiEvents(dics.container, ['mousemove', 'touchmove'], listener);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        };

        utils.setMultiEvents(document.body, ['mouseup', 'touchend'], listener2);
        utils.setMultiEvents(window, ['resize', 'load'], function () {
            dics._setImageSize();
        });
    };
    /**
     *
     * @param sections
     * @param images
     * @param activeSlider
     * @returns {number}
     * @private
     */


    Dics.prototype._beforeSectionsWidth = function (sections, images, activeSlider) {
        var width = 0;

        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];

            if (i !== activeSlider) {
                width += section.getBoundingClientRect()[this.config.sizeField];
            } else {
                return width;
            }
        }
    };
    /**
     *
     * @returns {number}
     * @private
     */


    Dics.prototype._calcContainerHeight = function () {
        var imgHeight = this.images[0].clientHeight;
        var imgWidth = this.images[0].clientWidth;
        var containerWidth = this.options.container.getBoundingClientRect().width;
        return containerWidth / imgWidth * imgHeight;
    };
    /**
     *
     * @param sections
     * @param images
     * @private
     */


    Dics.prototype._setLeftToImages = function (sections, images) {
        var width = 0;

        for (var i = 0; i < images.length; i++) {
            var image = images[i];
            image.style[this.config.positionField] = "-".concat(width, "px");
            width += sections[i].getBoundingClientRect()[this.config.sizeField];
        }
    };
    /**
     *
     * @param sections
     * @param sliders
     * @private
     */


    Dics.prototype._slidesFollowSections = function (sections, sliders) {
        var left = 0;

        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            left += section.getBoundingClientRect()[this.config.sizeField];

            if (i === this._activeSlider) {
                sliders[i].style[this.config.positionField] = "".concat(left, "px");
            }
        }
    };
    /**
     *
     * @private
     */


    Dics.prototype._disableImageDrag = function () {
        for (var i = 0; i < this.images.length; i++) {
            this.sliders[i].addEventListener('dragstart', function (e) {
                e.preventDefault();
            });
            this.images[i].addEventListener('dragstart', function (e) {
                e.preventDefault();
            });
        }
    };
    /**
     *
     * @param image
     * @param index
     * @param filters
     * @private
     */


    Dics.prototype._applyFilter = function (image, index, filters) {
        if (filters) {
            image.style.filter = filters[index];
        }
    };
    /**
     *
     * @param options
     * @private
     */


    Dics.prototype._applyGlobalClass = function (options) {
        var container = options.container;
        container.classList.add('b-dics');

        if (options.hideTexts) {
            container.classList.add('b-dics--hide-texts');
        }

        if (options.linesOrientation === 'vertical') {
            container.classList.add('b-dics--vertical');
        }

        if (options.textPosition === 'center') {
            container.classList.add('b-dics--tp-center');
        } else if (options.textPosition === 'bottom') {
            container.classList.add('b-dics--tp-bottom');
        } else if (options.textPosition === 'left') {
            container.classList.add('b-dics--tp-left');
        } else if (options.textPosition === 'right') {
            container.classList.add('b-dics--tp-right');
        }
    };
    /**
     *
     * @param image
     * @param imageContainer
     * @private
     */


    Dics.prototype._createAltText = function (image, imageContainer) {
        var textContent = image.getAttribute('alt');

        if (textContent) {
            var text = this._createElement('p', 'b-dics__text');

            text.appendChild(document.createTextNode(textContent));
            imageContainer.appendChild(text);
        }
    };
    /**
     *
     * @param image
     * @param imageContainer
     * @private
     */


    Dics.prototype._rotate = function (image, imageContainer) {
        image.style.rotate = "-".concat(this.options.rotate);
        imageContainer.style.rotate = this.options.rotate;
    };
    /**
     *
     * @private
     */


    Dics.prototype._removeActiveElements = function () {
        var activeElements = Dics.container.querySelectorAll('.b-dics__slider--active');
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = activeElements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var activeElement = _step2.value;
                activeElement.classList.remove('b-dics__slider--active');
                utils.removeMultiEvents(Dics.container, ['mousemove', 'touchmove'], Dics.prototype._removeActiveElements);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    };
    /**
     *
     * @param linesOrientation
     * @private
     */


    Dics.prototype._setOrientation = function (linesOrientation) {
        this.config = {};

        if (linesOrientation === 'vertical') {
            this.config.offsetSizeField = 'offsetHeight';
            this.config.offsetPositionField = 'offsetTop';
            this.config.sizeField = 'height';
            this.config.positionField = 'top';
            this.config.clientField = 'clientY';
            this.config.pageField = 'pageY';
        } else {
            this.config.offsetSizeField = 'offsetWidth';
            this.config.offsetPositionField = 'offsetLeft';
            this.config.sizeField = 'width';
            this.config.positionField = 'left';
            this.config.clientField = 'clientX';
            this.config.pageField = 'pageX';
        }
    };
    /**
     *
     * @param event
     * @returns {number}
     * @private
     */


    Dics.prototype._calcPosition = function (event) {
        var containerCoords = this.container.getBoundingClientRect();
        var pixel = !isNaN(event[this.config.clientField]) ? event[this.config.clientField] : event.touches[0][this.config.clientField];
        return containerCoords[this.config.positionField] < pixel ? pixel - containerCoords[this.config.positionField] : 0;
    };
    /**
     *
     * @private
     */


    Dics.prototype._setImageSize = function () {
        this.images[0].style[this.config.sizeField] = this.container[this.config.offsetSizeField] + 'px';
    };
    /**
     *
     * @type {{extend: (function(*=, *, *): *), setMultiEvents: setMultiEvents, removeMultiEvents: removeMultiEvents, getConstructor: (function(*=): string)}}
     */


    var utils = {
        /**
         * Native extend object
         * @param target
         * @param objects
         * @param options
         * @returns {*}
         */
        extend: function extend(target, objects, options) {
            for (var object in objects) {
                if (objects.hasOwnProperty(object)) {
                    recursiveMerge(target, objects[object]);
                }
            }

            function recursiveMerge(target, object) {
                for (var property in object) {
                    if (object.hasOwnProperty(property)) {
                        var current = object[property];

                        if (utils.getConstructor(current) === 'Object') {
                            if (!target[property]) {
                                target[property] = {};
                            }

                            recursiveMerge(target[property], current);
                        } else {
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
        setMultiEvents: function setMultiEvents(element, events, func) {
            for (var i = 0; i < events.length; i++) {
                element.addEventListener(events[i], func);
            }
        },

        /**
         *
         * @param element
         * @param events
         * @param func
         */
        removeMultiEvents: function removeMultiEvents(element, events, func) {
            for (var i = 0; i < events.length; i++) {
                element.removeEventListener(events[i], func, false);
            }
        },

        /**
         * Get object constructor
         * @param object
         * @returns {string}
         */
        getConstructor: function getConstructor(object) {
            return Object.prototype.toString.call(object).slice(8, -1);
        }
    };

    if (typeof define === 'function' && define.amd) {
        define('Dics', [], function () {
            return Dics;
        });
    } else {
        root.Dics = Dics;
    }
})(void 0);