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
    const defaultOptions = {
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

        if (this.container == null) {
            console.error('Container element not found!')
        } else {
            this._setOpacityContainerForLoading(0); // next opacity container in build

            this._setOrientation(this.options.linesOrientation, this.container);
            this.images        = this._getImages();
            this.sliders       = [];
            this._activeSlider = null;


            this._setContainerWidth();

            this._build();
            this.sections = this._getSections();
            this._setEvents();

        }
    }


    /**
     *
     * @private
     */
    Dics.prototype._setContainerWidth = function () {
        this.options.container.style.height = `${this._calcContainerHeight()}px`;
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
        let dics = this;

        dics._applyGlobalClass(dics.options);

        let imagesLength = dics.images.length;


        let initialImagesContainerWidth = dics.container[dics.config.offsetSizeField] / imagesLength;

        for (let i = 0; i < imagesLength; i++) {
            let image          = dics.images[i];
            let section        = dics._createElement('div', 'b-dics__section');
            let imageContainer = dics._createElement('div', 'b-dics__image-container');
            let slider         = dics._createElement('div', 'b-dics__slider');

            dics._applyFilter(image, i, dics.options.filters);
            dics._createAltText(image, imageContainer);
            dics._rotate(image, imageContainer);


            section.setAttribute('data-function', 'b-dics__section');
            section.style[this.config.sizeField]    = `${initialImagesContainerWidth}px`;
            slider.style[this.config.positionField] = `${initialImagesContainerWidth * (i + 1)}px`;

            this.sliders.push(slider);

            image.classList.add('b-dics__image');

            section.appendChild(imageContainer);
            imageContainer.appendChild(image);

            if (i < imagesLength - 1) {
                section.appendChild(slider);
            }

            dics.container.appendChild(section);

            image.style[this.config.positionField] = `${ i * -initialImagesContainerWidth }px`;


        }

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
        let newElement = document.createElement(elementClass);

        newElement.classList.add(className);

        return newElement;
    };

    /**
     * Set need DOM events
     * @private
     */
    Dics.prototype._setEvents = function () {
        let dics = this;

        dics._disableImageDrag();

        let listener = function (event) {
            let position = dics._calcPosition(event);
            if (position < (dics.sections[dics._activeSlider + 1][dics.config.offsetPositionField] + dics.sections[dics._activeSlider + 1][dics.config.offsetSizeField]) && (dics._activeSlider === 0 || position > (dics.sections[dics._activeSlider - 1][dics.config.offsetPositionField] + dics.sections[dics._activeSlider - 1][dics.config.offsetSizeField]))) {

                let beforeSectionsWidth = dics._beforeSectionsWidth(dics.sections, dics.images, dics._activeSlider);

                let calcMovePixels = position - beforeSectionsWidth;

                dics.sliders[dics._activeSlider].style[dics.config.positionField] = `${position}px`;

                dics._pushSections(calcMovePixels, position);


            }

        };

        dics.container.addEventListener('click', listener);

        for (let i = 0; i < dics.sliders.length; i++) {
            let slider = dics.sliders[i];
            utils.setMultiEvents(slider, ['mousedown', 'touchstart'], function () {
                dics._activeSlider = i;
                slider.classList.add('b-dics__slider--active');

                utils.setMultiEvents(dics.container, ['mousemove', 'touchmove'], listener);
            });
        }


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

    /**
     *
     * @param sections
     * @param images
     * @param activeSlider
     * @returns {number}
     * @private
     */
    Dics.prototype._beforeSectionsWidth = function (sections, images, activeSlider) {
        let width = 0;
        for (let i = 0; i < sections.length; i++) {
            let section = sections[i];
            if (i !== activeSlider) {
                width += section.getBoundingClientRect()[this.config.sizeField];
            } else {
                return width
            }
        }
    };

    /**
     *
     * @returns {number}
     * @private
     */
    Dics.prototype._calcContainerHeight = function () {
        let imgHeight      = this.images[0].clientHeight;
        let imgWidth       = this.images[0].clientWidth;
        let containerWidth = this.options.container.getBoundingClientRect().width;

        return (containerWidth / imgWidth) * imgHeight;
    };

    /**
     *
     * @param sections
     * @param images
     * @private
     */
    Dics.prototype._setLeftToImages = function (sections, images) {
        let width = 0;
        for (let i = 0; i < images.length; i++) {
            let image = images[i];

            image.style[this.config.positionField] = `-${width}px`;
            width += sections[i].getBoundingClientRect()[this.config.sizeField];
        }
    };

    /**
     *
     * @param sections
     * @param sliders
     * @private
     */
    Dics.prototype._slidesFollowSections = function (slider, calcMovePixels) {
        slider.style[this.config.positionField] = `${calcMovePixels}px`;
    };

    /**
     *
     * @private
     */
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
        let container = options.container;

        container.classList.add('b-dics');

        if (options.hideTexts) {
            container.classList.add('b-dics--hide-texts');
        }

        if (options.linesOrientation === 'vertical') {
            container.classList.add('b-dics--vertical')
        }

        if (options.textPosition === 'center') {
            container.classList.add('b-dics--tp-center')
        } else if (options.textPosition === 'bottom') {
            container.classList.add('b-dics--tp-bottom')
        } else if (options.textPosition === 'left') {
            container.classList.add('b-dics--tp-left')
        } else if (options.textPosition === 'right') {
            container.classList.add('b-dics--tp-right')
        }
    };


    /**
     *
     * @param image
     * @param imageContainer
     * @private
     */
    Dics.prototype._createAltText = function (image, imageContainer) {
        let textContent = image.getAttribute('alt');
        if (textContent) {
            let text = this._createElement('p', 'b-dics__text');

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
        image.style.rotate          = `-${this.options.rotate}`;
        imageContainer.style.rotate = this.options.rotate;

    };


    /**
     *
     * @private
     */
    Dics.prototype._removeActiveElements = function () {
        let activeElements = Dics.container.querySelectorAll('.b-dics__slider--active');

        for (let activeElement of activeElements) {
            activeElement.classList.remove('b-dics__slider--active');
            utils.removeMultiEvents(Dics.container, ['mousemove', 'touchmove'], Dics.prototype._removeActiveElements);
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
            this.config.offsetSizeField     = 'offsetHeight';
            this.config.offsetPositionField = 'offsetTop';
            this.config.sizeField           = 'height';
            this.config.positionField       = 'top';
            this.config.clientField         = 'clientY';
            this.config.pageField           = 'pageY';
        } else {
            this.config.offsetSizeField     = 'offsetWidth';
            this.config.offsetPositionField = 'offsetLeft';
            this.config.sizeField           = 'width';
            this.config.positionField       = 'left';
            this.config.clientField         = 'clientX';
            this.config.pageField           = 'pageX';
        }


    };


    /**
     *
     * @param event
     * @returns {number}
     * @private
     */
    Dics.prototype._calcPosition = function (event) {
        let containerCoords = this.container.getBoundingClientRect();
        let pixel           = !isNaN(event[this.config.clientField]) ? event[this.config.clientField] : event.touches[0][this.config.clientField];

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
     * @private
     */
    Dics.prototype._pushSections = function (calcMovePixels, position) {

        // if (this._rePosUnderActualSections(position)) {


        let section = this.sections[this._activeSlider];
        console.log('##ABEL## >> Dics >>  _pushSections', section.getBoundingClientRect());
        let postActualSection = this.sections[this._activeSlider + 1];

        let sectionWidth = postActualSection[this.config.offsetSizeField] - (calcMovePixels - this.sections[this._activeSlider][this.config.offsetSizeField]);

        section.style[this.config.sizeField]           = `${calcMovePixels}px`;
        postActualSection.style[this.config.sizeField] = `${sectionWidth}px`;

        this._setLeftToImages(this.sections, this.images);

        // }
    };

    //
    // /**
    //  *
    //  * @private
    //  */
    // Dics.prototype._rePosUnderActualSections = function (position) {
    //     let isOk                  = true;
    //     let beforeSumSectionsSize = 0;
    //     for (let i = 0; i < this._activeSlider; i++) {
    //         let section = this.sections[i];
    //
    //         const sectionSize = section[this.config.offsetSizeField];
    //         beforeSumSectionsSize += sectionSize;
    //         const newStats    = beforeSumSectionsSize - position;
    //
    //         if (newStats > 0) {
    //             let postSection = this.sections[i + 2];
    //
    //             section.style[this.config.sizeField]              = `${sectionSize - newStats}px`;
    //             postSection.style[this.config.sizeField]          = `${postSection.getBoundingClientRect()[this.config.sizeField] + newStats}px`;
    //             this.sections[i + 1].style[this.config.sizeField] = 0;
    //             return isOk = false;
    //         }
    //
    //
    //     }
    //     return isOk;
    // };


    /**
     *
     * @type {{extend: (function(*=, *, *): *), setMultiEvents: setMultiEvents, removeMultiEvents: removeMultiEvents, getConstructor: (function(*=): string)}}
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
         *
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


