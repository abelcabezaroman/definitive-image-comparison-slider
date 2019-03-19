"use strict";

/*
 * Dics: Definitive image comparison slider. A multiple image vanilla comparison slider.
 *
 * By Abel Cabeza Román, a Codictados developer
 * Src: https://github.com/abelcabezaroman/definitive-image-comparison-slider
 * Example: http://codictados.com/portfolio/definitive-image-comparison-slider-demo/
 */

/**
 *
 */

/**
 *
 * @type {{container: null, filters: null, hideTexts: null, textPosition: string, linesOrientation: string, rotate: number, arrayBackgroundColorText: null, arrayColorText: null, linesColor: null}}
 */
var defaultOptions = {
    container: null,
    // **REQUIRED**: HTML container | `document.querySelector('.b-dics')` |
    filters: null,
    // Array of CSS string filters  |`['blur(3px)', 'grayscale(1)', 'sepia(1)', 'saturate(3)']` |
    hideTexts: null,
    // Show text only when you hover the image container |`true`,`false`|
    textPosition: 'top',
    // Set the prefer text position  |`'center'`,`'top'`, `'right'`, `'bottom'`, `'left'` |
    linesOrientation: 'horizontal',
    // Change the orientation of lines  |`'horizontal'`,`'vertical'` |
    rotate: 0,
    // Rotate the image container (not too useful but it's a beatiful effect. String of rotate CSS rule)  |`'45deg'`|
    arrayBackgroundColorText: null,
    // Change the bacground-color of sections texts with an array |`['#000000', '#FFFFFF']`|
    arrayColorText: null,
    // Change the color of texts with an array  |`['#FFFFFF', '#000000']`|
    linesColor: null // Change the lines and arrows color  |`'rgb(0,0,0)'`|

};
/**
 *
 * @param options
 * @constructor
 */

var Dics = function Dics(options) {
    this.options = utils.extend({}, [defaultOptions, options], {
        clearEmpty: true
    });
    this.container = this.options.container;

    if (this.container == null) {
        console.error('Container element not found!');
    } else {
        this._setOrientation(this.options.linesOrientation, this.container);

        this.images = this._getImages();
        this.sliders = [];
        this._activeSlider = null;

        this._load(this.images[0]);
    }
};
/**
 *
 * @private
 */


Dics.prototype._load = function (firstImage) {
    var _this = this;

    var maxCounter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100000;

    if (firstImage.naturalWidth) {
        this._buidAfterFirstImageLoad(firstImage);
    } else {
        if (maxCounter > 0) {
            maxCounter--;
            setTimeout(function () {
                _this._load(firstImage, maxCounter);
            }, 100);
        } else {
            console.error('error loading images');
        }
    }
};
/**
 *
 * @private
 */


Dics.prototype._buidAfterFirstImageLoad = function (firstImage) {
    this._setContainerWidth(firstImage);

    this._build();

    this._setEvents();
};
/**
 *
 * @private
 */


Dics.prototype._setContainerWidth = function (firstImage) {
    this.options.container.style.height = "".concat(this._calcContainerHeight(firstImage), "px");
};
/**
 *
 * @private
 */


Dics.prototype._setOpacityContainerForLoading = function (opacity) {
    this.options.container.style.opacity = opacity;
};
/**
 * Build HTML
 * @private
 */


Dics.prototype._build = function () {
    var dics = this;

    dics._applyGlobalClass(dics.options);

    var imagesLength = dics.images.length;
    var initialImagesContainerWidth = dics.container.getBoundingClientRect()[dics.config.sizeField] / imagesLength;

    for (var i = 0; i < imagesLength; i++) {
        var image = dics.images[i];

        var section = dics._createElement('div', 'b-dics__section');

        var imageContainer = dics._createElement('div', 'b-dics__image-container');

        var slider = dics._createSlider(i, initialImagesContainerWidth);

        dics._createAltText(image, i, imageContainer);

        dics._applyFilter(image, i, dics.options.filters);

        dics._rotate(image, imageContainer);

        section.setAttribute('data-function', 'b-dics__section');
        section.style.flex = "0 0 ".concat(initialImagesContainerWidth, "px");
        image.classList.add('b-dics__image');
        section.appendChild(imageContainer);
        imageContainer.appendChild(image);

        if (i < imagesLength - 1) {
            section.appendChild(slider);
        }

        dics.container.appendChild(section);
        image.style[this.config.positionField] = "".concat(i * -initialImagesContainerWidth, "px");
    }

    this.sections = this._getSections();

    this._setOpacityContainerForLoading(1);
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

    dics._isGoingRight = null;
    var oldx = 0;

    var listener = function listener(event) {
        var xPageCoord = event.pageX ? event.pageX : event.touches[0].pageX;

        if (xPageCoord < oldx) {
            dics._isGoingRight = false;
        } else if (xPageCoord > oldx) {
            dics._isGoingRight = true;
        }

        oldx = xPageCoord;

        var position = dics._calcPosition(event);

        var beforeSectionsWidth = dics._beforeSectionsWidth(dics.sections, dics.images, dics._activeSlider);

        var calcMovePixels = position - beforeSectionsWidth;
        dics.sliders[dics._activeSlider].style[dics.config.positionField] = "".concat(position, "px");

        dics._pushSections(calcMovePixels, position);
    };

    dics.container.addEventListener('click', listener);

    var _loop = function _loop(i) {
        var slider = dics.sliders[i];
        utils.setMultiEvents(slider, ['mousedown', 'touchstart'], function (event) {
            dics._activeSlider = i;
            dics._clickPosition = dics._calcPosition(event);
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


Dics.prototype._calcContainerHeight = function (firstImage) {
    var imgHeight = firstImage.naturalHeight;
    var imgWidth = firstImage.naturalWidth;
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
    var size = 0;

    for (var i = 0; i < images.length; i++) {
        var image = images[i];
        image.style[this.config.positionField] = "-".concat(size, "px");
        size += sections[i].getBoundingClientRect()[this.config.sizeField];
        this.sliders[i].style[this.config.positionField] = "".concat(size, "px");
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

Dics.prototype._createSlider = function (i, initialImagesContainerWidth) {
    var slider = this._createElement('div', 'b-dics__slider');

    if (this.options.linesColor) {
        slider.style.color = this.options.linesColor;
    }

    slider.style[this.config.positionField] = "".concat(initialImagesContainerWidth * (i + 1), "px");
    this.sliders.push(slider);
    return slider;
};
/**
 *
 * @param image
 * @param i
 * @param imageContainer
 * @private
 */


Dics.prototype._createAltText = function (image, i, imageContainer) {
    var textContent = image.getAttribute('alt');

    if (textContent) {
        var text = this._createElement('p', 'b-dics__text');

        if (this.options.arrayBackgroundColorText) {
            text.style.backgroundColor = this.options.arrayBackgroundColorText[i];
        }

        if (this.options.arrayColorText) {
            text.style.color = this.options.arrayColorText[i];
        }

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


Dics.prototype._pushSections = function (calcMovePixels, position) {
    // if (this._rePosUnderActualSections(position)) {
    this._setFlex(position, this._isGoingRight);

    var section = this.sections[this._activeSlider];
    var postActualSection = this.sections[this._activeSlider + 1];

    var sectionWidth = postActualSection.getBoundingClientRect()[this.config.sizeField] - (calcMovePixels - this.sections[this._activeSlider].getBoundingClientRect()[this.config.sizeField]);

    section.style.flex = this._isGoingRight === true ? "2 0 ".concat(calcMovePixels, "px") : "1 1 ".concat(calcMovePixels, "px");
    postActualSection.style.flex = this._isGoingRight === true ? " ".concat(sectionWidth, "px") : "2 0 ".concat(sectionWidth, "px");

    this._setLeftToImages(this.sections, this.images); // }

};
/**
 *
 * @private
 */


Dics.prototype._setFlex = function (position, isGoingRight) {
    var beforeSumSectionsSize = 0;

    for (var i = 0; i < this.sections.length; i++) {
        var section = this.sections[i];
        var sectionSize = section.getBoundingClientRect()[this.config.sizeField];
        beforeSumSectionsSize += sectionSize;

        if (isGoingRight && position > beforeSumSectionsSize - sectionSize && i > this._activeSlider || !isGoingRight && position < beforeSumSectionsSize && i < this._activeSlider) {
            section.style.flex = "1 100 ".concat(sectionSize, "px");
        } else {
            section.style.flex = "0 0 ".concat(sectionSize, "px");
        }
    }
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